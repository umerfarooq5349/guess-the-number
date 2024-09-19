import mongoose, { plugin } from "mongoose";

import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "./appErros"; // Ensure correct import of AppError utility
import { signToken } from "./../utils/signinToken"; // Ensure correct import
import Player from "./../model/players_model";

// Define the interface for the playerDocument, used for type safety
interface playerDocument extends mongoose.Document {
  name: string;
  email: string;
  password?: string;

  checkPassword: (
    candidatePassword: string,
    playerPassword: string
  ) => Promise<boolean>;
}

// Function to sign and send the JWT token along with player data
const createSendToken = (
  player: playerDocument,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(player._id as string);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN
          ? parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10)
          : 7) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true, // Ensure cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production", // Set secure in production
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from the response object
  player.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      player,
    },
  });
};

// Signup function to register new players
const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Log request body for debugging
    console.log(req.body);

    // Create the new player
    const newplayer = await Player.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log(createSendToken(newplayer, 201, res));
    createSendToken(newplayer, 201, res);
    // Send the token back to the client
  }
);

// Login function to authenticate existing players
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract email and password from the request body
    const { email, password } = req.body;
    console.log(email, password);
    // Check if email and password are provided
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Find the player in the database and explicitly select the password field
    const player = await Player.findOne({ email }).select("+password");

    // Check if the player exists and the password is correct
    if (!player || !(await player.checkPassword(password, player.password!))) {
      return next(new AppError("Invalid email or password", 401));
    }
    // console.log(player);
    // Send the token back to the client
    createSendToken(player, 200, res);
  }
);

const getPlayer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract email and password from the request body
    const _id = req.params;
    console.log(_id);
    // Check if email and password are provided
    if (!_id) {
      return next(new AppError("Search for valid if not found player", 400));
    }

    // Find the player in the database and explicitly select the password field
    const player = await Player.findById(_id);

    if (!player) {
      return next(new AppError("Search for valid player", 400));
    }
    console.log(player);
    // Send the token back to the client
    createSendToken(player, 200, res);
  }
);

const signinWithProviders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract email and password from the request body
    const { email, name, image } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }
    try {
      // Check if the user exists
      let player = await Player.findOne({ email });

      if (!player) {
        // Create a new player if not found
        player = new Player({
          name,
          email,
          image, // Assuming you want to store the image URL
        });

        await player.save();
      }

      console.log(player);
      createSendToken(player, 200, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
    // Send the token back to the client
  }
);

export { signUp, login, getPlayer, signinWithProviders };

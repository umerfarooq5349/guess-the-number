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
  const token = signToken(player._id);

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

    // Send the token back to the client
    createSendToken(newplayer, 201, res);
  }
);

// Login function to authenticate existing players
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

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

    // Send the token back to the client
    createSendToken(player, 200, res);
  }
);

export { signUp, login };

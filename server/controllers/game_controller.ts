import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "./appErros";
import Player from "../model/players_model";
import { sendResponce } from "../utils/sendResponce";

// Update Player's High Score
export const highScore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Find the player by ID
    const highestScore = await Player.find({}, "name highestScore lastPlayed")
      .sort({ highestScore: -1 })
      .limit(20);

    // If player not found, return an error
    if (!highestScore) {
      return next(new AppError("Error fetching data", 500));
    }

    sendResponce(res, 200, "success", "Our best players", highestScore);
  }
);

// Add a New Score to Player's Scores Array
export const addScore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playerId } = req.params;
    const { score, date } = req.body;

    // Find the player by ID
    const player = await Player.findById(playerId);

    // If player not found, return an error
    if (!player) {
      return next(new AppError("Player not found", 404));
    }

    // Append the new score to the player's scores array
    player.scores.push({
      value: score,
      date: date ? new Date(date) : new Date(), // Default to current date if not provided
    });

    // Check if the new score is higher than the current highest score and update if necessary
    if (score > player.highestScore) {
      player.highestScore = score;
    }

    await player.save();

    sendResponce(res, 200, "success", "Score updated successfully", player);
  }
);

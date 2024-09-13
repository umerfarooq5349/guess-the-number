import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "./appErros";
import Player from "../model/players_model";

// Update Player's High Score
export const updateHighScore = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playerId } = req.params;
    const { highestScore } = req.body;

    // Find the player by ID
    const player = await Player.findById(playerId);

    // If player not found, return an error
    if (!player) {
      return next(new AppError("Player not found", 404));
    }

    console.log(`High`);
    // Update player's highest score if the new score is higher
    if (highestScore > player.highestScore) {
      player.highestScore = highestScore;
    }

    await player.updateOne({ new: true });

    res.status(200).json({
      status: "success",
      message: "Highest score updated successfully",
      data: {
        player,
      },
    });
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

    res.status(200).json({
      status: "success",
      message: "Score added successfully",
      data: {
        player,
      },
    });
  }
);

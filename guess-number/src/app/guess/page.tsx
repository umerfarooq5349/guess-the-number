"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size"; // To get window dimensions for confetti
import { generateRandomNumbers } from "@/utils/generateRandomNumber";

const NumberGuessingGame = () => {
  const [width, height] = useWindowSize(); // Get the window size for full-screen confetti
  const [targetNumber, setTargetNumber] = useState(generateRandomNumbers());
  const [userGuess, setUserGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    console.log("Target number (for debugging):", targetNumber);
  }, [targetNumber, attemptsLeft]);

  // Function to handle guess input
  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess) || gameOver) return;

    // Check if guess is correct
    if (guess === targetNumber) {
      const finalScore = attemptsLeft * 10;
      setFeedback("Congratulations! You guessed it right!");
      setCurrentScore(finalScore);

      // Update high score and trigger confetti if new high score
      if (finalScore > highScore) {
        setHighScore(finalScore);
        setShowConfetti(true);
      }
      setGameOver(true);
    } else {
      // Incorrect guess, decrease attempts
      setAttemptsLeft((prev) => prev - 1);
      setFeedback(guess < targetNumber ? "Too low!" : "Too high!");

      // End game if no attempts left
      if (attemptsLeft - 1 === 0) {
        setFeedback(`Game over! The correct number was ${targetNumber}`);
        setGameOver(true);
      }
    }
  };

  // Reset the game for a new round
  const handlePlayAgain = () => {
    setTargetNumber(generateRandomNumbers());
    setUserGuess("");
    setAttemptsLeft(10);
    setCurrentScore(0);
    setFeedback("");
    setGameOver(false);
    setShowConfetti(false);
  };

  return (
    <div>
      {showConfetti && <Confetti width={width} height={height} />}
      <h1>Number Guessing Game</h1>
      <p>Guess the number between 1 and 100</p>

      <input
        type="number"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        disabled={gameOver}
        placeholder="Enter your guess"
      />
      <button onClick={handleGuess} disabled={gameOver || !userGuess}>
        Guess
      </button>

      <p>Attempts Left: {attemptsLeft}</p>
      <p>Current Score: {currentScore}</p>
      <p>High Score: {highScore}</p>
      <p>{feedback}</p>

      {gameOver && <button onClick={handlePlayAgain}>Play Again</button>}
    </div>
  );
};

export default NumberGuessingGame;

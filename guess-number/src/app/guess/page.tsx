"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { generateRandomNumbers } from "@/utils/generateRandomNumber";
import { useFlashMessage } from "@/context/flashMessageContext";
import { useSearchParams } from "next/navigation";
import styles from "@/utils/sass/guess.module.scss"; // Import modular SCSS
import FlashMessage from "@/components/flashMessages/flashMessage";

const NumberGuessingGame = () => {
  const [width, height] = useWindowSize();
  const [targetNumber, setTargetNumber] = useState(generateRandomNumbers());
  const [userGuess, setUserGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  // const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const { setMessage, setMessageType } = useFlashMessage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setMessage(message);
      setMessageType("default");
    }
  }, []);

  useEffect(() => {
    console.log("Target number (for debugging):", targetNumber);
  }, [targetNumber, attemptsLeft]);

  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess) || gameOver) return;

    if (guess === targetNumber) {
      const finalScore = attemptsLeft * 10;
      // setFeedback("Congratulations! You guessed it right!");
      setMessage("Congratulations! You guessed it right!");
      setMessageType("success");
      setCurrentScore(finalScore);

      if (finalScore > highScore) {
        setHighScore(finalScore);
        setShowConfetti(true);

        // Show the "Play Again" button after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
          setShowPlayAgain(true);
        }, 5000);
      }
      setGameOver(true);
    } else {
      setAttemptsLeft((prev) => prev - 1);
      // setFeedback(guess < targetNumber ? "Too low!" : "Too high!");
      setMessage(guess < targetNumber ? "Too low!" : "Too high!");
      setMessageType("error");
      if (attemptsLeft - 1 === 0) {
        // setFeedback(`Game over! The correct number was ${targetNumber}`);
        setMessage(`Game over! The correct number was ${targetNumber}`);
        setMessageType("error");
        setGameOver(true);
      }
    }
  };

  const handlePlayAgain = () => {
    setTargetNumber(generateRandomNumbers());
    setUserGuess("");
    setAttemptsLeft(10);
    // setFeedback("");
    setGameOver(false);
    setShowConfetti(false);
    setShowPlayAgain(false);
  };

  return (
    <div className={styles.container}>
      {showConfetti && <Confetti width={width} height={height} />}
      <div className={styles["score-board"]}>
        <div className={styles["score-item"]}>
          Attempts Left: {attemptsLeft}
        </div>
        <div className={styles["score-item"]}>
          Current Score: {currentScore}
        </div>
        <div className={styles["score-item"]}>High Score: {highScore}</div>
      </div>
      <h1 className={styles.heading}>Guess the Number</h1>
      <div className={styles["guess-body"]}>
        <p className={styles.description}>Guess the number between 1 and 100</p>
        <input
          type="number"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          disabled={gameOver}
          placeholder="Enter your guess"
          className={styles.input}
        />
        <button
          onClick={handleGuess}
          disabled={gameOver || !userGuess}
          className={styles.button}
        >
          Guess
        </button>

        <FlashMessage />
      </div>
      <div></div>
      {gameOver && showPlayAgain && (
        <button onClick={handlePlayAgain} className={styles.button}>
          Play Again
        </button>
      )}
    </div>
  );
};

export default NumberGuessingGame;

"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import axios, { AxiosError } from "axios";
import { useWindowSize } from "@react-hook/window-size";
import { useFlashMessage } from "@/context/flashMessageContext";
import { generateRandomNumbers } from "@/utils/generateRandomNumber";
import styles from "@/utils/sass/guess.module.scss";
import FlashMessage from "@/components/flashMessages/flashMessage";
import { useSession } from "next-auth/react";

const NumberGuessingGame = () => {
  const [width, height] = useWindowSize();
  const [targetNumber, setTargetNumber] = useState(generateRandomNumbers());
  const [highScore, setHighScore] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [lastGuess, setLastGuess] = useState(""); // To track last guess
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false); // Flag to prevent multiple guesses
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const { setMessage, setMessageType } = useFlashMessage();
  const { data: session } = useSession();
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    console.log("Target number (for debugging):", targetNumber);
  }, [targetNumber]);

  useEffect(() => {
    const fetchHighScore = async () => {
      if (session?.user) {
        const currentPlayerId = session.user.id;
        console.log(`Fetching high score for player: ${currentPlayerId}`);
        setPlayerId(currentPlayerId); // Set playerId from session
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER}/getPlayer/${currentPlayerId}`
          );
          console.log("Response data:", response.data);
          const scores = response.data.data.player.highestScore;
          console.log(`High score fetched: ${scores}`);
          setHighScore(scores);
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error(
              "Error fetching high score:",
              error.response?.data.message
            );
          }
        }
      }
    };

    fetchHighScore();
  }, [session]);

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("message");
    console.log(`Flash message from URL params: ${message}`);
    if (message) {
      setMessage(message);
      setMessageType("default");
    }
  }, [setMessage, setMessageType]);

  const handleGuess = async () => {
    console.log("Handling guess");
    if (isGuessing || userGuess === lastGuess) {
      console.log(
        "Ignoring guess: either guessing in progress or guess is duplicate"
      );
      return; // Prevent multiple guesses or the same guess
    }

    setIsGuessing(true);
    console.log("Is guessing set to true");

    const guess = parseInt(userGuess);
    console.log("User guess:", userGuess);

    if (isNaN(guess) || guess < 1 || guess > 100 || gameOver) {
      console.log("Invalid guess or game over");
      setMessage("Please enter a valid number between 1 and 100.");
      setMessageType("error");
      setIsGuessing(false);
      console.log("Is guessing set to false");
      return;
    }

    setLastGuess(userGuess); // Store the last guess to prevent duplicates
    console.log("Last guess set to:", lastGuess);

    if (guess === targetNumber) {
      console.log("Correct guess!");
      const finalScore = attemptsLeft * 10;
      console.log("Final score:", finalScore);
      setMessage("Congratulations! You guessed it right!");
      setMessageType("success");
      setCurrentScore(finalScore);
      console.log("Current score updated:", currentScore);
      setShowConfetti(true);

      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/score/${playerId}`, {
          score: finalScore,
          date: new Date().toISOString(),
        });
        console.log("High score updated successfully.");
      } catch (error) {
        if (error instanceof AxiosError) {
          setMessage("Failed to update high score. Please try again later.");
          setMessageType("error");
        }
        console.error("Failed to update high score:", error);
      }

      setTimeout(() => {
        setShowConfetti(false);
        console.log("Confetti hidden");
      }, 5000);

      setShowPlayAgain(true);
      setGameOver(true);
      console.log("Game over set to true");
    } else {
      console.log("Incorrect guess");
      setAttemptsLeft((prev) => {
        console.log("Attempts left before update:", prev);
        const newAttempts = prev - 1;
        console.log("Attempts left after update:", newAttempts);
        return newAttempts;
      });
      setMessage(guess < targetNumber ? "Too low!" : "Too high!");
      setMessageType("error");

      if (attemptsLeft - 1 === 0) {
        console.log("Game over");
        setMessage(`Game over! The correct number was ${targetNumber}`);
        setMessageType("error");
        setGameOver(true);
        setShowPlayAgain(true);
      }
    }

    setIsGuessing(false);
    console.log("Is guessing set to false");
  };

  const handlePlayAgain = () => {
    console.log("Playing again");
    setTargetNumber(generateRandomNumbers());
    console.log("New target number:", targetNumber);

    setUserGuess("");
    console.log("User guess reset:", userGuess);

    setLastGuess(""); // Reset the last guess
    console.log("Last guess reset:", lastGuess);

    setAttemptsLeft(10);
    console.log("Attempts left reset:", attemptsLeft);

    setCurrentScore(0);
    console.log("Current score reset:", currentScore);

    setGameOver(false);
    console.log("Game over set to false");

    setShowConfetti(false);
    console.log("Confetti hidden");

    setShowPlayAgain(false);
    console.log("Play Again button hidden");
  };

  return (
    <div className={styles.container}>
      <FlashMessage />
      {showConfetti && <Confetti width={width} height={height} />}
      <div className={styles["score-board"]}>
        <h1 className={styles["heading"]}>Guess the Number</h1>
        <div className={styles["score-item"]}>
          Attempts Left: {attemptsLeft}
        </div>
        <div className={styles["score-item"]}>
          Current Score: {currentScore}
        </div>
        <div className={styles["score-item"]}>High Score: {highScore}</div>
      </div>

      <div className={styles["guess-body"]}>
        <p className={styles.description}>Guess the number between 1 and 100</p>
        <input
          type="number"
          value={userGuess}
          onChange={(e) => {
            console.log("User guess input changed:", e.target.value);
            setUserGuess(e.target.value);
          }}
          disabled={gameOver}
          placeholder="Enter your guess"
          className={styles.input}
        />
        <button
          onClick={handleGuess}
          disabled={
            gameOver || !userGuess || isGuessing || userGuess === lastGuess
          }
          className={styles.button}
        >
          Guess
        </button>

        {gameOver && showPlayAgain && (
          <button onClick={handlePlayAgain} className={styles.button}>
            Play Again
          </button>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default NumberGuessingGame;

"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import axios, { AxiosError } from "axios";
import { useWindowSize } from "@react-hook/window-size";
import { generateRandomNumbers } from "@/utils/generateRandomNumber";
import styles from "@/utils/sass/guess.module.scss";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Circularloader from "@/components/loaders/circularloader";

const NumberGuessingGame = () => {
  const [width, height] = useWindowSize();
  const [targetNumber, setTargetNumber] = useState(generateRandomNumbers());
  const [highScore, setHighScore] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [lastGuess, setLastGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const { data: session } = useSession();
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    console.log(session);
    const fetchHighScore = async () => {
      if (session?.user) {
        const currentPlayerId = session.user.id;
        setPlayerId(currentPlayerId);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER}/getPlayer/${currentPlayerId}`
          );
          setHighScore(response.data.data.player.highestScore);
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.message ||
              "Failed to fetch high score. Please try again later.";
            toast.error(errorMessage, { position: "top-right", icon: "😑" });
          }
        }
      }
    };

    fetchHighScore();
  }, [session]);

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("message");
    if (message) {
      toast.error(message, { position: "top-right", icon: "😑" });
    }
  }, []);

  const handleGuess = async () => {
    setIsGuessing(true);
    if (isGuessing || userGuess === lastGuess) {
      setIsGuessing(false);
      return;
    }

    const guess = parseInt(userGuess);

    if (isNaN(guess) || guess < 1 || guess > 10 || gameOver) {
      toast.error("Please enter a valid number between 1 and 10", {
        position: "top-right",
        icon: "😐",
      });
      setIsGuessing(false);
      return;
    }

    setLastGuess(userGuess);

    if (guess === targetNumber) {
      const finalScore = attemptsLeft * 10;
      toast.success("Congratulations! You guessed it right!", {
        position: "top-right",
        icon: "🎉",
      });
      setCurrentScore(finalScore);
      setShowConfetti(true);

      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/score/${playerId}`, {
          score: finalScore,
          date: new Date().toISOString(),
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.message ||
            "Failed to update high score. Please try again later.";
          toast.error(errorMessage, { position: "top-right", icon: "😞" });
        }
      }

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      setShowPlayAgain(true);
      setGameOver(true);
    } else {
      setAttemptsLeft((prev) => prev - 1);
      toast.error(guess < targetNumber ? "Too low!" : "Too high!", {
        position: "top-right",
        icon: "🤔",
      });

      if (attemptsLeft - 1 === 0) {
        toast.error(`Game over! The correct number was ${targetNumber}`, {
          position: "top-right",
          icon: "😔",
        });
        setGameOver(true);
        setShowPlayAgain(true);
      }
    }

    setIsGuessing(false);
  };

  const handlePlayAgain = () => {
    setTargetNumber(generateRandomNumbers());
    setUserGuess("");
    setLastGuess("");
    setAttemptsLeft(5);
    setCurrentScore(0);
    setGameOver(false);
    setShowConfetti(false);
    setShowPlayAgain(false);
  };

  return (
    <div className={styles.container}>
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
        <p className={styles.description}>Guess the number between 1 and 10</p>
        <input
          type="number"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          disabled={gameOver || isGuessing}
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
          {isGuessing ? <Circularloader /> : "Guess"}
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

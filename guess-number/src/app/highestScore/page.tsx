"use client";
import BikeAnimiation from "@/components/loaders/bikeAnimiation";
import styles from "@/utils/sass/highestScore.module.scss";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define a type for score data
interface Score {
  _id: string;
  name: string;
  highestScore: number;
  lastPlayed: string;
}

const HighestScorePage = () => {
  // State to hold the highest scores
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHighestScores = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/highestScore`
        );
        // Assuming response.data.data contains the array of scores
        console.log(response.data.data);
        setScores(response.data.data);
      } catch (err) {
        setError("Failed to fetch scores.");
      } finally {
        setLoading(false);
      }
    };

    getHighestScores();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerHeading}>
        <div className={styles.subHead}>Guess the Number</div>
        <div className={styles.subHead}>Score Board</div>

        <div className={`${styles.subHead} ${styles.playAgainBtn}`}>
          <Link href="/">Play Again</Link>
        </div>
      </div>

      {/* Centering the table */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          {loading ? (
            <BikeAnimiation />
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className={styles.scoreTable}>
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Name</th>
                  <th>Highest Score</th>
                  <th>Last Played At</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={score._id}>
                    <td>{index + 1}</td>
                    <td>{score.name}</td>
                    <td>{score.highestScore}</td>
                    <td>{new Date(score.lastPlayed).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HighestScorePage;

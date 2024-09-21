"use client";
import Image from "next/image";
import styles from "@/utils/sass/profile.module.scss";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
// import { playersProfile } from "@/utils/lib/profile";
import { PlayerModel } from "@/utils/model/playerModel";
import axios from "axios";

// Dummy Data (to be removed once real data is fetched)
const dummyPlayer = {
  name: "John Doe",
  email: "john.doe@example.com",
  photo: "/assets/avatar.png", // Use a placeholder image if needed
  highestScore: 500,
  scores: [
    { value: 200, date: new Date().toLocaleDateString() },
    { value: 150, date: new Date().toLocaleDateString() },
    { value: 100, date: new Date().toLocaleDateString() },
  ],
};

const ProfilePage = () => {
  const [playerProfileData, setPlayerProfileData] =
    useState<PlayerModel | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (session?.user) {
        const playerProfile = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/getPlayer/${session.user.id}`
        );
        if (playerProfile) {
          setPlayerProfileData(playerProfile.data.data.player); // Set real playerProfile data
        }
      }
    };
    fetchProfileData();
  }, [session]);

  const {
    name,
    email,
    photo = dummyPlayer.photo,
    highestScore = dummyPlayer.highestScore,
    scores = dummyPlayer.scores,
  } = playerProfileData || dummyPlayer;

  return (
    <div className={styles.container}>
      <div className={styles["profile-header"]}>
        <Image
          src={photo}
          alt={`${name}'s profile picture`}
          width={120}
          height={120}
        />
        <div className={styles["name-email"]}>
          <div className={styles.name}>{name}</div>
          <div className={styles.email}>{email}</div>
        </div>
        <div className={styles.highscore}>Highest Score: {highestScore}</div>
      </div>

      <div className={styles["scores-section"]}>
        <h2>Score History</h2>
        <table className={styles["score-table"]}>
          <thead>
            <tr>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.value}</td>
                <td>{new Date(score.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;

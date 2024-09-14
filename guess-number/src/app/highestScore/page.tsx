import styles from "@/utils/sass/highestScore.module.scss";
import Link from "next/link";

const HeighestScorePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerHeading}>
        <div className={styles.subHead}>Score Bord</div>
        <div className={styles.subHead}>Guess the Number</div>

        <div className={`${styles.subHead} ${styles.playAgainBtn}`}>
          <Link href={"/"}>Play</Link>
        </div>
      </div>
      <div className={styles.guessBody}>
        <p className={styles.description}>Guess the number between 1 and 100</p>

        <button className={styles.button}>Guess</button>
      </div>
      <div></div>
    </div>
  );
};

export default HeighestScorePage;

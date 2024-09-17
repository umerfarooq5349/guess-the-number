import styles from "@/utils/sass/rules.module.scss";
import Link from "next/link";

const RulesPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerHeading}>
        <div className={styles.subHead}>Guess the Number</div>
        <div className={styles.subHead}>Game Rules</div>
        <div className={`${styles.subHead} ${styles.playAgainBtn}`}>
          <Link href="/">Play Game</Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.rulesContainer}>
          <h2 className={styles.rulesHeading}>Game Rules</h2>
          <ul className={styles.rulesList}>
            <li className={styles.ruleItem}>
              You have 10 chances to guess the number.
            </li>
            <li className={styles.ruleItem}>
              The number is between 1 and 100.
            </li>
            <li className={styles.ruleItem}>
              Hints will be provided after each guess.
            </li>
            <li className={styles.ruleItem}>
              Try to guess the number with the least attempts.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;

// import Image from "next/image";
import GuessPage from "./guess/page";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <GuessPage />
    </div>
  );
}

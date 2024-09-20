"use client";
import React from "react";
import styles from "@/utils/sass/notFound.module.scss";
import Link from "next/link";
// import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
      </div>
      <div className={styles.parallax}>
        <div className={styles.title}>404</div>
        <p className={styles.subtitle}>Page Not Found</p>
        <button className={styles.backButton}>
          <Link href="/">Go Back Home</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;

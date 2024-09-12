"use client";
import { useFlashMessage } from "@/context/flashMessageContext";
import { useEffect } from "react";
import styles from "@/utils/sass/flashMessages.module.scss";

const FlashMessage = () => {
  const { message, clearMessage } = useFlashMessage();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000); // Clear message after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message) return null;

  return <div className={styles.flash_message}>{message}</div>;
};

export default FlashMessage;

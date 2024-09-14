"use client";
import { useFlashMessage } from "@/context/flashMessageContext";
import { useEffect } from "react";
import styles from "@/utils/sass/flashMessages.module.scss";

const FlashMessage = () => {
  const { message, clearMessage, messageType } = useFlashMessage();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message) return null;
  const messageClass = messageType ? styles[`${messageType}_message`] : "";
  return <div className={messageClass}>{message}</div>;
};

export default FlashMessage;

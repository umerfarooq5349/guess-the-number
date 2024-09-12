"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type FlashMessageContextType = {
  message: string | null;
  setMessage: (message: string) => void;
  clearMessage: () => void;
};

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(
  undefined
);

export const FlashMessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const clearMessage = () => setMessage(null);

  return (
    <FlashMessageContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error(
      "useFlashMessage must be used within a FlashMessageProvider"
    );
  }
  return context;
};

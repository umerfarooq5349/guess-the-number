"use client";
import { useSearchParams } from "next/navigation";
import FlashMessage from "@/components/flashMessages/flashMessage";
import { useFlashMessage } from "@/context/flashMessageContext";
import { useEffect } from "react";
const SigninPage = () => {
  const { setMessage } = useFlashMessage(); // Access flash message setter
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    searchParams.get("");
    if (message) {
      setMessage(message);
    }
  }, []);

  return (
    <div>
      <FlashMessage />
      This will Contain Signin Form
    </div>
  );
};

export default SigninPage;

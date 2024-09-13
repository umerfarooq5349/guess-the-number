"use client";
import { useSearchParams } from "next/navigation";
import FlashMessage from "@/components/flashMessages/flashMessage";
import { useFlashMessage } from "@/context/flashMessageContext";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
const SigninPage = () => {
  const { setMessage } = useFlashMessage(); // Access flash message setter
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");

    if (message) {
      setMessage(message);
    }
  }, []);
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await signIn();
  };
  return (
    <div>
      <FlashMessage />
      <button onClick={handleClick}>signin</button>
      This will Contain Signin Form
    </div>
  );
};

export default SigninPage;

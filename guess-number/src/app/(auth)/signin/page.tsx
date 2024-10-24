"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import styles from "@/utils/sass/auth.module.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react"; // Corrected import
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Circularloader from "@/components/loaders/circularloader";

interface LoginPageFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPageFormValues>();
  const searchParams = useSearchParams();
  const [isLoading, setIsloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (searchParams.get("message")) {
      toast.success(searchParams.get("message"), {
        position: "top-right",
        style: {
          transition: "all 0.5s ease-in-out",
        },
        icon: "⚠",
      });
    }
  });
  const onSubmit: SubmitHandler<LoginPageFormValues> = async (data) => {
    setIsloading(true);
    setErrorMessage(""); // Reset error message before trying

    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.error) {
      setErrorMessage("Invalid credentials");
    } else {
      router.push("/"); // Redirect if successful
    }

    setIsloading(false);
  };

  // Function for signing in with Google
  // const handleGoogleSignIn = async () => {
  //   try {
  //     await signIn("google", { callbackUrl: "/signin" });
  //   } catch (error) {
  //     console.error("Google Sign-in error:", error);
  //   }
  // };

  // // Function for signing in with Facebook
  // const handleFacebookSignIn = async () => {
  //   try {
  //     await signIn("facebook");
  //   } catch (error) {
  //     console.error("Facebook Sign-in error:", error);
  //   }
  // };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/assets/liz-gross-signup.gif"
          alt="Sign In"
          fill
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2 className={styles.title}>Sign In</h2>
        <label className={styles.label}>
          Email
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className={styles.input}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must contain 8 characters",
              },
            })}
            className={styles.input}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>
        <button type="submit" className={styles.submitBtn}>
          {isLoading ? (
            <div>
              <Circularloader />
            </div>
          ) : (
            "Sign In"
          )}
        </button>
        <div className={styles.footerText}>
          {errorMessage && <span>{errorMessage}</span>}
        </div>

        <div className={styles.footerText}>
          Not a member yet?{" "}
          <Link href="/signup" className={styles.pageChange}>
            Sign Up
          </Link>
        </div>

        {/*<div className={styles.socialLogin}>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={handleGoogleSignIn}
          >
            <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
          </button>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={handleFacebookSignIn}
          >
            <FontAwesomeIcon icon={faFacebook} /> Sign in with Facebook
          </button>
        </div>*/}
      </form>
    </div>
  );
};

export default LoginPage;

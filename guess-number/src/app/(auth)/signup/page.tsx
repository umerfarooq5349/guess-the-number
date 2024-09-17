"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import styles from "@/utils/sass/auth.module.scss";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  // State for managing form submission status
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Function to handle sign-up logic
  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setLoading(true);
    try {
      // Example API call to a backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/signup`,
        data,
        { withCredentials: true }
      );
      // const result = await response.json();

      if (response.status) {
        console.log(response.data);
        setFormMessage(
          "Sign up successful! Please check your email to confirm."
        );
        router.replace("/signin");
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      setFormMessage("An error occurred during sign-up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src="/assets/background.jpg"
          alt="Sign Up"
          fill
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2 className={styles.title}>Sign Up</h2>

        <label className={styles.label}>
          Name
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={styles.input}
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </label>

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
            {...register("password", { required: "Password is required" })}
            className={styles.input}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Display form submission message */}
        {formMessage && <div className={styles.formMessage}>{formMessage}</div>}
      </form>
    </div>
  );
};

export default SignUp;

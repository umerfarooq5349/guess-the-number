"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import styles from "@/utils/sass/auth.module.scss";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Circularloader from "@/components/loaders/circularloader";

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
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("message")) {
      toast.error(searchParams.get("message"), {
        position: "top-right",
        style: {
          transition: "all 0.5s ease-in-out",
        },
        icon: "⚠",
      });
    }
  });
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
        setFormMessage("Sign up successful!");
        router.replace("/signin");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        // setFormMessage(error.response?.data.message);
        setFormMessage("Sign up failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <div>
              <Circularloader />
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className={styles.footerText}>
          Already a member?{" "}
          <Link href="/signin" className={styles.pageChange}>
            Sign In
          </Link>
        </div>
        {/* Display form submission message */}

        {formMessage && <div className={styles.formMessage}>{formMessage}</div>}
      </form>
      <div className={styles.imageContainer}>
        <Image
          src="/assets/liz-gross-signup.gif"
          alt="Sign Up"
          fill
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default SignUp;

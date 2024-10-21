import axios from "axios";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure credentials has email and password
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER}/signin`,
            {
              email,
              password,
            }
          );

          const user = response.data.data.player;

          if (response.status === 200 && user) {
            return user;
          }

          // If no user found, return null
          return null;
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // JWT callback to store user id in the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;
      }
      return token;
    },
    // Session callback to check if the user exists in the DB
    async session({ session, token }) {
      try {
        // Fetch the user from your server/database
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/getPlayer/${token.id}`
        );

        const userExists = response.data;

        // If the user does not exist, invalidate the session
        if (!userExists) {
          return session.user.undefined;
        }

        // Set the session user ID if the user exists
        session.user.id = token.id!.toString();
        return session;
      } catch (error) {
        return undefined;
      }
    },
  },
});

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import client from "./lib/mongodb";
import axios from "axios";
// import { connectToDb } from "./utils/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(client),
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          let user = null;
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER}/signin`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          user = response.data.data.player;

          if (response.status === 200 && response.data.data.player) {
            return user;
          } else {
            return null;
          }
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Call your server to handle Google user
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER}/signinWithProviders`,
            {
              email: profile?.email,
              name: profile?.name,
              image: profile?.picture,
            }
          );
          console.log(response);
          if (response.status === 200) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          console.error("Error handling Google sign-in:", err);
          return false;
        }
      }
      return true;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id!.toString();

      return session;
    },
  },
});

// export const config = {
//   runtime: "nodejs", // Explicitly set Node.js runtime to avoid Edge runtime issues
// };
// export const runtime = "nodejs";

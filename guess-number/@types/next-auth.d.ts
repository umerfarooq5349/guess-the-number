/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      undefined: undefined;
    } & DefaultSession["user"];
  }
  interface User {
    name: string;
    email: string;
    password?: string;

    photo?: string;
    _id?: string;
  }
}

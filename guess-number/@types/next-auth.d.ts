import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
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

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      name: string;
      email: string;
      password: string;
      passwordConfirm?: string;
      active?: boolean;
      photo?: string;
      _id?: string;
    } & DefaultSession["user"];
  }
  interface User {
    name: string;
    email: string;
    password: string;
    role: string | undefined;
    passwordConfirm?: string;
    active?: boolean;
    photo?: string;
    _id?: string;
  }
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "@/components/navbar/navbar";
import { FlashMessageProvider } from "@/context/flashMessageContext";
import AuthProvider from "../context/authProviderContext";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Guess the Number",
  description: "Created by Umer Farooq",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="container">
          <div className="smallcontainer">
            <AuthProvider>
              <FlashMessageProvider>
                <Toaster />
                <NavBar></NavBar>
                {children}
                <div></div>
              </FlashMessageProvider>
            </AuthProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

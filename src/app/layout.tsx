import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Typography, Stack } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "COE | Scavenger Hunt",
  description: "อย่าชี้คับไม่ได้คิด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}

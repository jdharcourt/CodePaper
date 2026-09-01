import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodePaper — Leaving Cert Computer Science",
  description: "A focused Python practice IDE for Leaving Certificate Computer Science Section C.",
};

export function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;

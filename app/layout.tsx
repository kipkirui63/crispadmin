import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crisp AI Website Directory",
  description: "Internal directory for Crisp AI websites and related details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

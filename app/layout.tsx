import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEURONBRIGHT — AI Governance Infrastructure",
  description:
    "NEURONBRIGHT gives organisations visibility, governance and evidence across their AI estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

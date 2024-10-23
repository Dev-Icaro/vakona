import type { Metadata } from "next";
import "@/common/ui/styles/globals.css";
import Navigation from "@/common/ui/components/navigation";
import { roboto } from "@/common/ui/assets/fonts";

export const metadata: Metadata = {
  title: "Vakona",
  description: "Donation campaign app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

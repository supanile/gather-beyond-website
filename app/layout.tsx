import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // เลือกน้ำหนักฟอนต์ที่ต้องการ
  style: ["normal", "italic"], // รองรับสไตล์ปกติและตัวเอียง
  subsets: ["latin", "thai"], // รองรับภาษาไทยและละติน
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Gather Beyond",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${prompt.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
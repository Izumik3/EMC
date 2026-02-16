import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Электронный мастер-консультант",
  description: "Электронный мастер-консультант",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`font-sans ${roboto.className} flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1 flex flex-col items-center w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
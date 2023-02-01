// pages/_app.js
import { Ubuntu } from "@next/font/google";
import { AppProps } from "next/app";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${ubuntu.variable} bg-background`}>
      <Component {...pageProps} />
    </main>
  );
}

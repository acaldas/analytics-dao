import "./globals.css";

import Provider from "./provider";
import Main from "components/main";
import Logo from "components/logo";
const Profile = dynamic(() => import("../components/profile"), { ssr: false });

import { comfortaa } from "./fonts";
import dynamic from "next/dynamic";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`${comfortaa.className} bg-background`}>
        <Main>
          <Provider>
            <div className="flex flex-col h-full">
              <div className="mb-4 flex justify-between items-center">
                <Link href="/">
                  <Logo size={100} title />
                </Link>
                <div>
                  <Profile />
                </div>
              </div>
              {children}
            </div>
          </Provider>
        </Main>
      </body>
    </html>
  );
}

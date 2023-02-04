import "./globals.css";

import Provider from "./provider";
import Main from "components/main";

import { comfortaa } from "./fonts";

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
          <Provider>{children}</Provider>
        </Main>
      </body>
    </html>
  );
}

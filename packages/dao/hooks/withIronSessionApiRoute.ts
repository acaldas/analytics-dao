import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

export const ironSessionOptions = {
  cookieName: "lytDao_auth",
  password: process.env.IRON_SESSION_PASSWORD || "",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export default (handler: NextApiHandler) =>
  withIronSessionApiRoute(handler, ironSessionOptions);

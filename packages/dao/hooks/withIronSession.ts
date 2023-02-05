import { unsealData } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { ironSessionOptions } from "./withIronSessionApiRoute";

export async function getAddress() {
  const nextCookies = cookies();
  const cookie = nextCookies.get("lytDao_auth");
  if (!cookie) {
    return undefined;
  }

  const session: { siwe: SiweMessage } = await unsealData(cookie.value, {
    password: ironSessionOptions.password,
  });
  if (!session.siwe) {
    return undefined;
  }
  return session.siwe.address;
}

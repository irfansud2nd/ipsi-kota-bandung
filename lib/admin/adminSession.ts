import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { SpecialUserRole } from "./adminConstants";

export type SessionPayload = {
  name: string;
  roles: SpecialUserRole[];
  expiresAt: Date;
  image?: string;
};

export const adminCookieName = "admin-session";

export const createAdminSession = async (
  name: string,
  roles: SpecialUserRole[],
  image?: string
) => {
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); //1 HOUR
  const session = await encrypt({ name, roles, image, expiresAt });

  cookies().set(adminCookieName, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
};

export const getAdminServerSession = async () => {
  const cookie = cookies().get(adminCookieName)?.value;
  if (!cookie) return undefined;
  const session = await decrypt(cookie);

  return session as SessionPayload | undefined;
};

export const encrypt = async (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

export const decrypt = async (session: string | undefined = "") => {
  try {
    const result = jwt.decode(session);
    return result;
  } catch (error) {
    console.error("Failed to verify admin session", error);
  }
};

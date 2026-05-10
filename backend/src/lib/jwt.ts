import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  email: string;
  roleId: string;
};

export function signToken(payload: JwtPayload): string {
  const e = env();
  const secret: Secret = e.JWT_SECRET;
  const options: SignOptions = { expiresIn: e.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): JwtPayload {
  const e = env();
  const decoded = jwt.verify(token, e.JWT_SECRET);
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token");
  }
  const sub = (decoded as jwt.JwtPayload).sub;
  const email = (decoded as { email?: string }).email;
  const roleId = (decoded as { roleId?: string }).roleId;
  if (!sub || !email || !roleId) throw new Error("Invalid token payload");
  return { sub, email, roleId };
}

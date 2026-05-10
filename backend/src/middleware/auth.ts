import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../lib/jwt";
import { HttpError } from "../lib/httpError";
import { parsePermissions } from "../lib/permissions";

export type AuthedRequest = Request & {
  admin?: {
    id: string;
    email: string;
    name: string | null;
    roleId: string;
    permissions: string[];
  };
};

export async function requireAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing bearer token");
    }
    const token = header.slice("Bearer ".length).trim();
    const payload = verifyToken(token);
    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    if (!admin || !admin.isActive) {
      throw new HttpError(401, "Invalid or inactive admin");
    }
    req.admin = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      roleId: admin.roleId,
      permissions: parsePermissions(admin.role.permissions),
    };
    next();
  } catch (e) {
    next(e instanceof HttpError ? e : new HttpError(401, "Unauthorized"));
  }
}

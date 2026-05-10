import type { NextFunction, Response } from "express";
import { hasPermission } from "../lib/permissions";
import { HttpError } from "../lib/httpError";
import type { AuthedRequest } from "./auth";

export function requirePermission(...required: string[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction): void => {
    const admin = req.admin;
    if (!admin) {
      next(new HttpError(401, "Unauthorized"));
      return;
    }
    if (!hasPermission(admin.permissions, required)) {
      next(new HttpError(403, "Insufficient permissions"));
      return;
    }
    next();
  };
}

import { NextFunction, Request, Response } from "express";

import { HttpStatusCodes } from "../utils/httpStatusCodes";
import * as jwt from "../utils/jwt";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
  }
  try {
    const user = await jwt.verify(token);
    req.body.user = user;
    next();
  } catch (error) {
    return res.sendStatus(HttpStatusCodes.FORBIDDEN);
  }
};

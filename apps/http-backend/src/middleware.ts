import { NextFunction, Request, Response } from "express";
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { NewRequest } from "./index";

export const middleware = (
  req: NewRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, JWT_SCRET);

  if (typeof decoded != "string" && decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};

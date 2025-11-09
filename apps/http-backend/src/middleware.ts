import { NextFunction, Request, Response } from "express";
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, JWT_SCRET);

  if (decoded) {
    // @ts-ignore
    req.userId = decoded.userId;
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
};

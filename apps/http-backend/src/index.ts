import express from "express";
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import { CreateUserSchema } from "@repo/common/types";

import { prismaClient } from "@repo/db/client";

const app = express();

app.post("/signup", (req, res) => {});

app.post("/signin", (req, res) => {
  const userId = "1234";

  const token = jwt.sign({ userId }, JWT_SCRET);

  res.json({ token });
});

app.post("/create-room", middleware, (req, res) => {});

app.listen(8000);

import express from "express";
import type { Request } from "express";
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {
  createUserSchema,
  loginUserSchema,
  createRoomSchema,
} from "@repo/common/types";
import bcrypt from "bcrypt";

import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

export interface NewRequest extends Request {
  userId?: string;
}

app.post("/signup", async (req, res) => {
  try {
    const parsedData = createUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(422).json({
        statusCode: 422,
        message: "Invalid Credentials",
      });
      return;
    }

    const userExist = await prismaClient.user.findUnique({
      where: {
        email: parsedData.data.email,
      },
    });

    if (userExist && userExist?.id) {
      res.status(422).json({
        statusCode: 422,
        message: "User Already Exists",
      });
      return;
    }

    const hashedPass = await bcrypt.hash(parsedData.data.password, 10);

    const user = await prismaClient.user.create({
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email,
        password: hashedPass,
      },
    });
    if (user) {
      res.status(200).json({
        statusCode: 200,
        message: "User Created Successfully",
      });
    }
  } catch (err) {
    console.log(err, "hello494593459843904");
    res.status(500).json({
      statusCode: 500,
      messeage: "Internal Server Error",
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const parsedData = loginUserSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(422).json({
        statusCode: 422,
        message: "Invalid Input",
      });
      return;
    }
    const user = await prismaClient.user.findUnique({
      where: {
        email: parsedData.data.email,
      },
    });
    const password = await bcrypt.compare(
      parsedData.data.password,
      user?.password as string
    );
    if (!password || !user) {
      res.status(403).json({
        statusCode: 403,
        message: "Invalid Credentials",
      });
      return;
    }
    const userId = user?.id;

    const token = jwt.sign({ userId }, JWT_SCRET);

    res.status(200).json({ statusCode: 200, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

app.post("/create-room", middleware, async (req: NewRequest, res) => {
  try {
    const parsedData = createRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(422).json({
        statusCode: 422,
        message: "Invalid Input",
      });
      return;
    }

    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        statusCode: 401,
        message: "Unauthorized - User ID required",
      });
      return;
    }
    const slugExist = await prismaClient.room.findUnique({
      where: {
        slug: parsedData.data.slug,
      },
    });
    if (slugExist) {
      res.status(403).json({
        statusCode: 403,
        message: "Slug already Exist",
      });
      return;
    }
    const createRoom = await prismaClient.room.create({
      data: {
        slug: parsedData.data.slug,
        adminId: userId,
      },
    });

    if (createRoom) {
      res.status(200).json({
        statusCode: 200,
        message: "Room Created Successfully",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000);

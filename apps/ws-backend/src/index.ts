import { WebSocketServer, WebSocket } from "ws";
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  userId: string;
  rooms: number[];
  ws: WebSocket;
}

interface ParseData {
  type: "join_room" | "leave_room" | "chat";
  roomId?: number;
  message?: string;
}
const users: Users[] = [];

const getUserId = (url: string) => {
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  const decoded = jwt.verify(token, JWT_SCRET);

  if (!decoded || typeof decoded === "string" || !decoded.userId) {
    return null;
  }

  return decoded.userId;
};

// payload for join room
// {
//   type:"join_room",
//   roomId:8,
// }
const joinRoomHandler = async (parsedData: ParseData, ws: WebSocket) => {
  const roomExist = await prismaClient.room.findUnique({
    where: {
      id: parsedData.roomId,
    },
  });
  if (!roomExist) {
    ws.send(JSON.stringify({ type: "error", message: "Room Not Found" }));
    return;
  }
  const user = users.find((x) => x.ws == ws);
  if (!user) {
    ws.send(JSON.stringify({ type: "error", message: "User Not Found" }));
    return;
  }
  if (typeof parsedData.roomId == "number") {
    user.rooms = [...user?.rooms, parsedData.roomId];
  }
};

// payload to leave room
// {
//   type:"leave_room",
//   roomId:5
// }
const leaveRoomHandler = async (parsedData: ParseData, ws: WebSocket) => {
  const user = users.find((x) => x.ws == ws);
  if (!user) {
    ws.send(JSON.stringify({ type: "error", message: "User Not Found" }));
    return;
  }
  user.rooms = user?.rooms.filter((k) => k != parsedData.roomId);
};

const chatHandler = async (parsedData: ParseData, ws: WebSocket) => {
  users.forEach((user) => {
    if (parsedData.roomId && user.rooms.includes(parsedData?.roomId)) {
      user.ws.send(
        JSON.stringify({
          type: "chat",
          message: parsedData.message,
          userId: user.userId,
        })
      );
    }
  });
};

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return;

  const userId = getUserId(url);

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    ws,
    rooms: [],
  });

  ws.on("message", async (data) => {
    const parsedData: ParseData = JSON.parse(data as unknown as string);

    switch (parsedData.type) {
      case "join_room":
        await joinRoomHandler(parsedData, ws);
        break;
      case "leave_room":
        await leaveRoomHandler(parsedData, ws);
        break;
      case "chat":
        await chatHandler(parsedData, ws);
        break;
    }
  });
});

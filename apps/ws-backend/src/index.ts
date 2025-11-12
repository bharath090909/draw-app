import { WebSocketServer, WebSocket } from "ws";
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });

interface Users {
  userId: string;
  rooms: string[];
  ws: WebSocket;
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
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type == "join_room") {
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
      user.rooms = [...user?.rooms, parsedData.roomId];
    }
  });
});

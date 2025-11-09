import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
import { JWT_SCRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";

  const decoded = jwt.verify(token, JWT_SCRET);

  if (!decoded || typeof decoded === "string" || !decoded.userId) {
    ws.close();
    return;
  }

  ws.on("message", (data) => {
    ws.send("pong");
  });
});

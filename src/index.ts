import { WebSocket } from "ws";
import dotenv from "dotenv";
import { getLatestMessage, saveMessage } from "./redisClient";
dotenv.config();

const ws = new WebSocket(process.env.WS_URL || "");

ws.on("open", function () {
  console.log("websocket 连接成功");
});

ws.on("message", function (message) {
  try {
    const str = message.toString();
    const row = JSON.parse(str);
    saveMessage(row);
  } catch (e) {
    console.log("收到文本数据：", message.toString());
  }
});

ws.on("error", function (error) {
  console.log(error);
});



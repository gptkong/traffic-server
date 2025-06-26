import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

// 示例接口：获取服务状态
app.get("/status", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API服务运行中" });
});

// 启动服务
app.listen(port, () => {
  console.log(`API服务已启动，端口: ${port}`);
});

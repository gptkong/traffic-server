import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { getServerTrafficSummary } from "./prismaClient";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3000;

app.get("/status", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API服务运行中" });
});

// 查询各服务器流量统计
app.get("/api/traffic-summary", async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.query;
    const summary = await getServerTrafficSummary(
      startTime ? Number(startTime) : undefined,
      endTime ? Number(endTime) : undefined
    );
    // BigInt 转字符串，避免 JSON 序列化报错
    const formatted = summary.map(
      (item: {
        serverId: number;
        netInTransfer: number;
        netOutTransfer: number;
      }) => ({
        ...item,
        netInTransfer: item.netInTransfer.toString(),
        netOutTransfer: item.netOutTransfer.toString(),
      })
    );
    res.json({ code: 0, data: formatted });
  } catch (error) {
    res
      .status(500)
      .json({ code: 1, message: "查询失败", error: String(error) });
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`[API 服务] 端口: ${port}`);
});

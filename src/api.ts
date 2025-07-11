import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { 
  getServerTrafficSummary, 
  getServerList, 
  get24HourTrafficSummary,
  get7DayTrafficSummary,
  get30DayTrafficSummary
} from "./prismaClient";

dotenv.config();

const app = express();
// app.use(safeJsonMiddleware);
const port = process.env.API_PORT || 3000;

app.get("/status", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "API服务运行中" });
});

// 查询各服务器流量统计
app.get("/api/traffic-summary", async (req: Request, res: Response) => {
  const apiStartTime = Date.now();
  console.log("[API] 开始处理 /api/traffic-summary 请求");
  
  try {
    const { startTime, endTime } = req.query;
    const summary = await getServerTrafficSummary(
      startTime ? Number(startTime) : undefined,
      endTime ? Number(endTime) : undefined
    );
    
    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log(`[API] /api/traffic-summary 接口总耗时: ${apiDuration}ms`);
    
    res.json({ code: 0, data: summary });
  } catch (error) {
    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log(`[API] /api/traffic-summary 接口失败，耗时: ${apiDuration}ms`);
    
    res
      .status(500)
      .json({ code: 1, message: "查询失败", error: String(error) });
  }
});

// 获取服务器列表
app.get("/api/server-list", async (req: Request, res: Response) => {
  const apiStartTime = Date.now();
  console.log("[API] 开始处理 /api/server-list 请求");
  
  try {
    const list = await getServerList();
    const formatted = list.map((item: any) => {
      const obj: any = { ...item };
      for (const key in obj) {
        if (typeof obj[key] === "bigint") {
          obj[key] = obj[key].toString();
        }
      }
      return obj;
    });
    
    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log(`[API] /api/server-list 接口总耗时: ${apiDuration}ms`);
    
    res.json({ code: 0, data: formatted });
  } catch (error) {
    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log(`[API] /api/server-list 接口失败，耗时: ${apiDuration}ms`);
    
    res
      .status(500)
      .json({ code: 1, message: "查询失败", error: String(error) });
  }
});

// 查询流量统计（24小时、7天、30天）
app.get("/api/traffic-stats", async (req: Request, res: Response) => {
  const apiStartTime = Date.now();
  console.log("[API] 开始处理 /api/traffic-stats 请求");
  
  try {
    const [traffic24h, traffic7d, traffic30d] = await Promise.all([
      get24HourTrafficSummary(),
      get7DayTrafficSummary(),
      get30DayTrafficSummary()
    ]);

    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log(`[API] /api/traffic-stats 接口总耗时: ${apiDuration}ms`);

    res.json({ 
      code: 0, 
      data: {
        "24h": traffic24h,
        "7d": traffic7d,
        "30d": traffic30d
      }
    });
  } catch (error) {
    const apiEndTime = Date.now();
    const apiDuration = apiEndTime - apiStartTime;
    console.log(`[API] /api/traffic-stats 接口失败，耗时: ${apiDuration}ms`);
    
    res
      .status(500)
      .json({ code: 1, message: "查询失败", error: String(error) });
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`[API 服务] 端口: ${port}`);
});

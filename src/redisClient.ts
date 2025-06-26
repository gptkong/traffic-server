import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

const REDIS_KEY = process.env.REDIS_KEY || "nezha";
const MAX_COUNT = Number(process.env.REDIS_MAX_COUNT) || 300;

export async function saveMessage(row: any) {
  if (!row || !row.now) {
    console.warn("row.now 字段不存在，未存入 Redis");
    return;
  }
  try {
    await redis.zadd(REDIS_KEY, row.now, JSON.stringify(row));
    await redis.zremrangebyrank(REDIS_KEY, 0, -MAX_COUNT - 1);
    console.log(`消息已存入 Redis ZSET，并只保留最近${MAX_COUNT}条`);
  } catch (err) {
    console.error("存入 Redis ZSET 失败：", err);
  }
}

export async function getLatestMessage() {
  const result = await redis.zrevrange(REDIS_KEY, 0, 0);
  return result[0] ? JSON.parse(result[0]) : null;
}

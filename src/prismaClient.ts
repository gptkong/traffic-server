import { PrismaClient } from "@prisma/client";
import { Server, State } from "../types/ServerData";

const prisma = new PrismaClient();

export default prisma;

export async function upsertServer(serverData: Server) {
  try {
    const { id, name, host, country_code } = serverData;

    return await prisma.server.upsert({
      where: { serverId: id },
      update: {
        name,
        countryCode: country_code,
        platform: host.platform,
        cpu: host.cpu ? host.cpu.join(", ") : null,
        memTotal: host.mem_total ? BigInt(host.mem_total) : null,
        diskTotal: host.disk_total ? BigInt(host.disk_total) : null,
        arch: host.arch,
        virtualization: host.virtualization,
        bootTime: host.boot_time ? BigInt(host.boot_time) : null,
      },
      create: {
        serverId: id,
        name,
        countryCode: country_code,
        platform: host.platform,
        cpu: host.cpu ? host.cpu.join(", ") : null,
        memTotal: host.mem_total ? BigInt(host.mem_total) : null,
        diskTotal: host.disk_total ? BigInt(host.disk_total) : null,
        arch: host.arch,
        virtualization: host.virtualization,
        bootTime: host.boot_time ? BigInt(host.boot_time) : null,
      },
    });
  } catch (error) {
    console.error("❌ Error upserting server:", error);
    throw error;
  }
}

export async function createServerState(
  serverId: number,
  stateData: State,
  timestamp: number
) {
  try {
    return await prisma.serverState.create({
      data: {
        serverId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        cpu: stateData.cpu,
        memUsed: stateData.mem_used ? BigInt(stateData.mem_used) : null,
        swapUsed: stateData.swap_used ? BigInt(stateData.swap_used) : null,
        diskUsed: stateData.disk_used ? BigInt(stateData.disk_used) : null,
        netInTransfer: stateData.net_in_transfer
          ? BigInt(stateData.net_in_transfer)
          : null,
        netOutTransfer: stateData.net_out_transfer
          ? BigInt(stateData.net_out_transfer)
          : null,
        netInSpeed: stateData.net_in_speed,
        netOutSpeed: stateData.net_out_speed,
        uptime: stateData.uptime ? BigInt(stateData.uptime) : null,
        load1: stateData.load_1,
        load5: stateData.load_5,
        load15: stateData.load_15,
        tcpConnCount: stateData.tcp_conn_count,
        udpConnCount: stateData.udp_conn_count,
        processCount: stateData.process_count,
      },
    });
  } catch (error) {
    console.error("❌ Error creating server state:", error);
    throw error;
  }
}

/**
 * 查询指定时间段内各个服务器的上传/下载流量变化量，默认查询24小时内
 * @param startTime 开始时间（Date 或时间戳，默认24小时前）
 * @param endTime 结束时间（Date 或时间戳，默认现在）
 * @returns [{ serverId, netInTransfer, netOutTransfer }]
 */
export async function getServerTrafficSummary(startTime?: Date | number, endTime?: Date | number) {
  const end = endTime ? new Date(endTime) : new Date();
  const start = startTime ? new Date(startTime) : new Date(end.getTime() - 24 * 60 * 60 * 1000);

  // 查询时间段内所有 serverId 的最早和最晚采样点
  const states = await prisma.serverState.findMany({
    where: {
      timestamp: {
        gte: start,
        lte: end,
      },
    },
    orderBy: [
      { serverId: 'asc' },
      { timestamp: 'asc' },
    ],
    select: {
      serverId: true,
      timestamp: true,
      netInTransfer: true,
      netOutTransfer: true,
    },
  });

  // 按 serverId 分组，取每组的第一个和最后一个
  const map = new Map<number, { first: any; last: any }>();
  for (const s of states) {
    if (!map.has(s.serverId)) {
      map.set(s.serverId, { first: s, last: s });
    } else {
      map.get(s.serverId)!.last = s;
    }
  }

  // 计算每台服务器的流量变化量
  const result = Array.from(map.entries()).map(([serverId, { first, last }]) => ({
    serverId,
    netInTransfer: (last.netInTransfer ?? 0) - (first.netInTransfer ?? 0),
    netOutTransfer: (last.netOutTransfer ?? 0) - (first.netOutTransfer ?? 0),
  }));

  return result;
}



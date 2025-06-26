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

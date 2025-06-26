export interface ServerDatas {
  now: number;
  servers: Server[];
}

export interface Server {
  id: number;
  name: string;
  host: Host;
  state: State;
  country_code: string;
  last_active: string;
}

export interface Host {
  platform: string;
  cpu: string[];
  mem_total: number;
  disk_total: number;
  swap_total?: number;
  arch: string;
  virtualization?: string;
  boot_time: number;
}

export interface State {
  cpu?: number;
  mem_used: number;
  disk_used: number;
  swap_used?: number;
  net_in_transfer: number;
  net_out_transfer: number;
  net_in_speed: number;
  net_out_speed: number;
  uptime: number;
  load_1?: number;
  load_5?: number;
  load_15?: number;
  tcp_conn_count: number;
  udp_conn_count?: number;
  process_count: number;
}

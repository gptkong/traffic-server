# API 接口文档

## 基本信息

- 服务端口：`API_PORT`（默认 3000）
- 所有接口均返回 JSON 格式数据

---

## 1. 服务状态检查

- **接口地址**：`GET /status`
- **描述**：检查 API 服务是否运行中
- **请求参数**：无
- **响应示例**：

```
{
  "status": "ok",
  "message": "API服务运行中"
}
```

---

## 2. 查询各服务器流量统计

- **接口地址**：`GET /api/traffic-summary`
- **描述**：查询指定时间段内各服务器的上传/下载流量变化量，默认查询24小时内
- **请求参数**：
  - `startTime`（可选，时间戳，毫秒）：起始时间
  - `endTime`（可选，时间戳，毫秒）：结束时间
- **响应示例**：
```
{
  "code": 0,
  "data": [
    {
      "serverId": 1,
      "netInTransfer": "123456789",
      "netOutTransfer": "987654321"
    }
  ]
}
```
- **失败响应**：
```
{
  "code": 1,
  "message": "查询失败",
  "error": "错误信息"
}
```

---

## 3. 获取服务器列表

- **接口地址**：`GET /api/server-list`
- **描述**：获取所有服务器的基本信息
- **请求参数**：无
- **响应示例**：
```
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "serverId": 1,
      "name": "服务器A",
      "countryCode": "CN",
      "platform": "linux",
      "cpu": "Intel Xeon",
      "memTotal": "16777216",
      "diskTotal": "107374182400",
      "arch": "x86_64",
      "virtualization": "kvm",
      "bootTime": "1719400000000",
      "createdAt": "2025-06-26T08:00:00.000Z",
      "updatedAt": "2025-06-26T08:00:00.000Z"
    }
  ]
}
```
- **失败响应**：
```
{
  "code": 1,
  "message": "查询失败",
  "error": "错误信息"
}
```

---

## 4. 查询流量统计（24小时、7天、30天）

- **接口地址**：`GET /api/traffic-stats`
- **描述**：查询最近24小时、7天、30天内各服务器的上传/下载流量变化量
- **请求参数**：无
- **响应示例**：
```
{
  "code": 0,
  "data": {
    "24h": [
      {
        "serverId": 1,
        "netInTransfer": "123456789",
        "netOutTransfer": "987654321"
      }
    ],
    "7d": [
      {
        "serverId": 1,
        "netInTransfer": "1234567890",
        "netOutTransfer": "9876543210"
      }
    ],
    "30d": [
      {
        "serverId": 1,
        "netInTransfer": "12345678900",
        "netOutTransfer": "98765432100"
      }
    ]
  }
}
```
- **失败响应**：
```
{
  "code": 1,
  "message": "查询失败",
  "error": "错误信息"
}
```

---

## 5. 数据模型说明

### 服务器（Server）
- `id`：主键，自增
- `serverId`：原始服务器ID
- `name`：服务器名称
- `countryCode`：国家/地区代码
- `platform`：操作系统平台
- `cpu`：CPU信息
- `memTotal`：总内存（字节）
- `diskTotal`：总磁盘（字节）
- `arch`：架构
- `virtualization`：虚拟化类型
- `bootTime`：开机时间（时间戳，毫秒）
- `createdAt`：创建时间
- `updatedAt`：更新时间

### 服务器流量统计（Traffic Summary）
- `serverId`：服务器ID
- `netInTransfer`：上传流量变化量（字节）
- `netOutTransfer`：下载流量变化量（字节）

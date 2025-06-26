# 使用官方Node镜像
FROM node:20

# 拉取最新代码
WORKDIR /app
RUN git clone https://github.com/gptkong/traffic-server .

# 安装依赖
RUN npm install

# 生成 Prisma Client
RUN npx prisma generate

# 暴露端口（如有需要，可根据实际情况调整）
EXPOSE 3000

# 并行运行 npm start 和 npm run api
CMD ["sh", "-c", "npm start & npm run api"] 
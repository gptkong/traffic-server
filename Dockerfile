# 使用官方Node镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 复制本地项目内容到容器
COPY . .

# 安装依赖（包括 devDependencies）
RUN npm install --include=dev
# 全局安装 pm2 和 ts-node
RUN npm install -g pm2 ts-node

# 生成 Prisma Client
RUN npx prisma generate

# 暴露端口（如有需要，可根据实际情况调整）
EXPOSE 3000

# 默认命令留空，由docker-compose指定
CMD ["sh", "-c", "npm start & npm run api"] 
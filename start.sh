#!/bin/bash
# 设置环境变量
export NODE_ENV=production
export PORT=8099

# 启动服务，日志输出到 out.log
nohup node server.js > out.log 2>&1 &

echo "✅ DogUp 已在后台启动"
echo "端口: 8099"
echo "日志: $(pwd)/out.log"
echo "PID: $!"

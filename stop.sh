#!/bin/bash
PORT=8099
# 使用 fuser 或 netstat 找到端口对应的 PID
PID=$(netstat -nlp | grep :$PORT | awk '{print $7}' | cut -d/ -f1)

if [ -z "$PID" ]; then
    echo "⚠️  未发现运行在 $PORT 端口的进程"
else
    kill -9 $PID
    echo "🛑 已停止端口 $PORT 上的进程 (PID: $PID)"
fi

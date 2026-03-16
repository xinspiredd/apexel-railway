#!/bin/sh
echo "🚀 Starting APEXEL server + bot..."

# Start server in background
node server.js &
SERVER_PID=$!
echo "✅ Server started (PID $SERVER_PID)"

# Wait for server to be ready
sleep 3

# Start bot in background
node bot.js &
BOT_PID=$!
echo "✅ Bot started (PID $BOT_PID)"

# If either process dies, kill the other and exit
wait $SERVER_PID
echo "⚠️ Server exited"
kill $BOT_PID 2>/dev/null

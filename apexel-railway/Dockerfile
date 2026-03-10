FROM node:22-slim

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Чистая установка без кэша
RUN npm cache clean --force && npm install

# Копируем остальные файлы
COPY . .

# Запускаем
CMD ["node", "server.js"]

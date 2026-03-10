# APEXEL — NFS World Community Platform

## Railway Deploy

### Структура файлов
```
apexel/
├── server.js          # Основной сервер
├── bot.js             # Telegram бот
├── package.json
├── railway.toml
├── public/            # Фронтенд (статика)
│   ├── index.html
│   ├── admin.html
│   ├── cars.js        # ← добавь сам (из локальной папки)
│   ├── parts.js       # ← добавь сам (из локальной папки)
│   └── api.js
└── .env.example
```

### Environment Variables (Railway Dashboard)
| Переменная | Описание |
|---|---|
| `JWT_SECRET` | Случайная строка для JWT токенов |
| `BOT_TOKEN` | Токен Telegram бота |
| `API_SECRET` | Секрет для связи сервер↔бот |
| `BOT_USERNAME` | Username бота без @ |
| `PORT` | Автоматически задаётся Railway |

### Persistent Volume
Подключи volume в Railway и смонтируй в `/data`.
База данных будет храниться в `/data/apexel.db`.

### Видео фон (ss.mp4)
Файл слишком большой для Git. После деплоя загрузи через Railway CLI:
```bash
railway run -- cp /local/path/ss.mp4 /data/ss.mp4
```
Или положи в public/ и задеплой один раз через Git LFS.

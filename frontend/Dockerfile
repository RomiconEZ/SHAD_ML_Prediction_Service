# Стадия сборки
FROM node:14 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./src /app/src
COPY ./public /app/public

# Запускаем сборку проекта
RUN npm run build

# Стадия продакшена
FROM nginx:alpine

# Создаем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем собранные файлы из /app/build в стандартную папку nginx для статических файлов
COPY --from=builder /app/build /usr/share/nginx/html

# Открываем 3000 порт для HTTP трафика
EXPOSE 3000

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]

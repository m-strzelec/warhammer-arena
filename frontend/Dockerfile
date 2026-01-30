FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

RUN apk add --no-cache curl

EXPOSE 80

CMD ["/bin/sh", "-c", "sed -i \"s|GATEWAY_URL_PLACEHOLDER|${GATEWAY_URL:-http://gateway-service:8080}|g\" /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]

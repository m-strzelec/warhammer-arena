FROM node:23-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env .
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

RUN apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

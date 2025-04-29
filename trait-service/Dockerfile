FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apk add --no-cache curl

COPY . .

EXPOSE ${PORT}

CMD ["npm", "start"]

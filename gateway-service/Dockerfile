FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${GATEWAY_PORT}

CMD ["npm", "start"]

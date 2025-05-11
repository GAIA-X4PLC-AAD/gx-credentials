FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

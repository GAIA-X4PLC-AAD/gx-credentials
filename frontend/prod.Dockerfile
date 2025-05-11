FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm ci

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve","-s", "dist"]

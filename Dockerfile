FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN NODE_ENV=development npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

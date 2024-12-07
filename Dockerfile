FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npx", "http-server", ".", "-p", "8080"]

FROM node:12

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

COPY app/ ./

EXPOSE 8080

CMD [ "node", "src/index.js" ]

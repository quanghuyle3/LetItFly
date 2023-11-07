FROM node:18-alpine

WORKDIR /letItFly

COPY public public

COPY src src

COPY .env.local .

COPY package.json .

RUN npm install

CMD ["npm", "start"]
FROM node:14.19.0 AS base
FROM base AS build

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY .npmrc .

ARG CI

RUN npm --quiet ci

COPY . .

RUN npm run install-client
RUN npm run lint
RUN npx browserslist@latest --update-db
RUN npm run build-client
RUN npm run build-server

CMD ["node", "."]
ENV NODE_ENV=production
RUN apt update
RUN apt install ca-certificates

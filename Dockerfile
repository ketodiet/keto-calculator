FROM node:latest

RUN mkdir -p /var/www
RUN npm install -g webpack-dev-server webpack --legacy-peer-deps

WORKDIR /var/www

COPY package.json .
RUN npm install

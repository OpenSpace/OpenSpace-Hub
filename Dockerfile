# generate docker image for the project where front end is built using react and backend is built using express js

FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

WORKDIR /usr/src/app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build

WORKDIR /usr/src/app/
ENTRYPOINT [ "npm", "start" ]
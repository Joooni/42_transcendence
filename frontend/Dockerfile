FROM node:18-alpine

#sets working directory of image to /app
WORKDIR /app

RUN npm install

#copy everthing from CWD to /app
COPY . /app

RUN npm run build
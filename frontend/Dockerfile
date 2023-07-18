FROM node:18-alpine

#sets working directory of image to /app
WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install
RUN npm install -g @angular/cli

ENV DOMAIN: ${DOMAIN}
ENV TEST_DF 'works, yo from dockerfile'
#copy everthing from CWD to /app
COPY . /app

RUN npm run build
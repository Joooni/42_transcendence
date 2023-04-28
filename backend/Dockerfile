FROM node:18-alpine

#sets working directory of image to /app
WORKDIR /app

#copy everthing from CWD to /app
COPY . ./
RUN npm install --silent

CMD ["npm", "run", "start:dev"]

EXPOSE 3000
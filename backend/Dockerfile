FROM node:18-alpine

#sets working directory of image to /app
WORKDIR /app

#copy everthing from CWD to /app
COPY . ./

RUN npm install -g nodemon
RUN npm install --silent

EXPOSE 3000
ENTRYPOINT [ "nodemon", "--config /app/backend/nodemon.json"]
CMD ["npm", "run", "start:nodemon"]

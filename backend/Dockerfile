FROM node:18-alpine

#sets working directory of image to /app
WORKDIR /app

COPY package.json /app
COPY  package-lock.json /app
RUN npm install
#copy everthing from CWD to /app
COPY . /app


EXPOSE 3000
VOLUME /app/uploads/profile_pictures/
# ENTRYPOINT [ "nodemon", "--config /app/backend/nodemon.json"]
CMD ["npm", "run", "start:nodemon"]

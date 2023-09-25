###################
# STAGE 1 - BUILD #
###################

FROM node:18-alpine AS builder

#sets working directory of image to /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build

####################
# STAGE 2 - DEPLOY #
####################

FROM node:18-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install --omit=dev

COPY --from=builder /app/dist /app/dist

EXPOSE 3000
VOLUME /app/uploads/profile_pictures/

CMD ["npm", "run", "start:prod"]

# nodemon for development
# CMD ["npm", "run", "start:nodemon"]
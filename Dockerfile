FROM node:16.15-alpine3.14

# Create app directory
RUN mkdir /app
WORKDIR /app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN apk update && apk add bash

RUN cd app

ENV TZ America/Sao_Paulo
EXPOSE 8080


CMD [ "npm", "start" ]
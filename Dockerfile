FROM node:16.15-alpine3.14

# Create app directory
WORKDIR /usr/src/app

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

# Python 3 and packages
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN pip install -r requirements.txt

ENV TZ America/Sao_Paulo
EXPOSE 8080

# CMD [ "npm", "start" ]
CMD ["bash"]
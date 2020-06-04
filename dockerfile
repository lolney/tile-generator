FROM node:12-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

RUN npm i lerna -g --loglevel notice

COPY packages/server ./packages/server
COPY packages/common ./packages/common

COPY package*.json ./
COPY lerna.json .

RUN lerna bootstrap
RUN npm install
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "--prefix", "packages/server", "start" ]
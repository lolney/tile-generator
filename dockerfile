FROM node:22-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

COPY packages/server ./packages/server
COPY packages/common ./packages/common
COPY packages/app-engine ./packages/app-engine

COPY package*.json ./
COPY lerna.json .

RUN npm install
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "--prefix", "packages/server", "start" ]

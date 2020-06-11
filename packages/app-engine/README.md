# Tile Generator Rate Limiter

This is the proxy server for Tile Generator, used primarily for rate limiting.
It's meant to be deployed on GCP App Engine.

The `gcp-build` NPM script is used to trigger the TypeScript compilation
process. This step happens automatically when deploying to App Engine, but must
be performed manually when developing locally.

This can be run as a separate server, but is now included in @tile-generator/server.

## Setup

Install dependencies:

npm install

## Running locally

1. Perform the build step:

   npm run gcp-build

1. Run the completed program

   npm start

## Deploying to App Engine

Deploy your app:

    npm run deploy

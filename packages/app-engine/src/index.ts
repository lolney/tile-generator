import createServer from "./server";

const PORT = Number(process.env.PORT) || 8888;
const PROXY_HOST = process.env.PROXY_HOST || "http://localhost:8080";

createServer({
  port: PORT,
  proxyHost: PROXY_HOST,
  settings: ["trust proxy"],
});

import express = require("express");

const PORT = Number(process.env.PORT) || 8888;
const app = express();

app.get("/", (req, res) => {
  res.send("🎉 Hello TypeScript! 🎉");
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;

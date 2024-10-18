const express = require("express");
const logger = require("./util/logger");
const systemRouter = require("./Controller/SystemRouter");
const app = express();
const port = 4000;

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} : ${req.url}`);
  next();
});

app.use("/", systemRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});

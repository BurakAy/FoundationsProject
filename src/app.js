const express = require("express");
const logger = require("./util/logger");
const systemRouter = require("./Controller/SystemRouter");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} : ${req.url}`);
  next();
});

app.use("/", systemRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/* TEST DATA
{"amount": 120.77, "description": "business meeting - dinner", "userName": "burak"}
*/

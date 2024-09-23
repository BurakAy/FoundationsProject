const express = require("express");
const logger = require("./util/logger");
const systemRouter = require("./Controller/SystemRouter");
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
{ "userName": "burak", "password": "abc123" }
{ "amount": 120.77, "description": "business meeting - dinner", "userName": "burak" }
{ "ticketId": "1a6d7879-cf4e-47ca-a569-ec4190d3ea05", "status": "approved"  }
*/

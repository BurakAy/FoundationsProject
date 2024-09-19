const express = require("express");
const systemRouter = require("./Controller/SystemRouter");
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.use("/", systemRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/* TEST DATA
{"amount": 120.77, "description": "business meeting - dinner", "userName": "burak"}
*/

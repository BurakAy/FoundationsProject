const express = require("express");
const app = express();
const port = 3000;

app.get("/user/:userName", (req, res) => {
  res.send(req.params);
});

app.get("/submissions/:userName", (req, res) => {
  res.send(req.params);
});

app.get("/pending", (req, res) => {
  res.send("pending");
});

app.post("/login", (req, res) => {
  res.send("login");
});

app.post("/register", (req, res) => {
  res.send("register");
});

app.post("/submit-ticket", (req, res) => {
  res.send("submit ticket");
});

app.put("/process-ticket", (req, res) => {
  res.send("process ticket");
});

app.delete("/remove-ticket", (req, res) => {});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

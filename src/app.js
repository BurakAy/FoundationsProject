const express = require("express");
const { login, register } = require("./Service/UserService");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/login", async (req, res) => {
  const loggedIn = await login(req.body);
  if (loggedIn) {
    res.status(200);
    res.send("Login successful");
  } else {
    res.status(401);
    res.send("Login failed, check user credentials");
  }
});

app.post("/register", async (req, res) => {
  const registered = await register(req.body);
  if (registered) {
    res.status(200);
    res.send("Registration successful");
  } else {
    res.status(409);
    res.send("Username already exists");
  }
});

app.get("/employee-tickets/:userName", (req, res) => {
  res.send(req.params);
});

app.get("/pending-tickets", (req, res) => {
  res.send("pending");
});

app.post("/submit-ticket", (req, res) => {
  res.send("submit ticket");
});

app.put("/process-ticket/:ticketId", (req, res) => {
  res.send("process ticket");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

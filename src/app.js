const express = require("express");
const { login, register } = require("./Service/UserService");
const { submitTicket, processTicket } = require("./Service/TicketService");

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

app.post("/submit-ticket", async (req, res) => {
  const ticket = await submitTicket(req.body);
  res.status(ticket.status);
  res.send(ticket.message);
});

app.put("/process-ticket", async (req, res) => {
  const ticket = await processTicket(req.body);
  console.log(ticket);
  res.status(ticket.status);
  res.send({ message: ticket.message, updatedTicket: ticket.updatedTicket });
});

app.get("/employee-tickets/:userName", (req, res) => {
  res.send(req.params);
});

app.get("/pending-tickets", (req, res) => {
  res.send("pending");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/* TEST DATA
{"amount": 120.77, "description": "business meeting - dinner", "userName": "burak"}
*/

const express = require("express");
const router = express.Router();

const { login, register } = require("../Service/UserService");
const {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets
} = require("../Service/TicketService");

router.post("/register", async (req, res) => {
  const registered = await register(req.body);
  res.status(registered.status);
  res.send(registered.message);
});

router.post("/login", async (req, res) => {
  const loggedIn = await login(req.body);
  res.status(loggedIn.status);
  res.send(loggedIn.message);
});

router.get("/tickets", async (req, res) => {
  const tickets = await previousTickets();
  res.status(tickets.status);
  if (tickets.submitted) {
    res.send({ message: tickets.message, submissions: tickets.submitted });
  } else {
    res.send(tickets.message);
  }
});

router.post("/tickets/submit", async (req, res) => {
  const ticket = await submitTicket(req.body);
  res.status(ticket.status);
  res.send(ticket.message);
});

router.get("/tickets/pending", async (req, res) => {
  const tickets = await ticketsPending();
  res.status(tickets.status);
  if (tickets.pending) {
    res.send({ message: tickets.message, pending: tickets.pending });
  } else {
    res.send(tickets.message);
  }
});

router.put("/tickets/process", async (req, res) => {
  const ticket = await processTicket(req.body);
  res.status(ticket.status);
  if (ticket.updatedTicket) {
    res.send({ message: ticket.message, updatedTicket: ticket.updatedTicket });
  } else {
    res.send(ticket.message);
  }
});

module.exports = router;

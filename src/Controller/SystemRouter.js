const express = require("express");
const router = express.Router();

// const bcrypt = require("bcrypt");

const { login, register } = require("../Service/UserService");
const {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets
} = require("../Service/TicketService");

router.post("/login", async (req, res) => {
  const loggedIn = await login(req.body);
  res.status(loggedIn.status);
  res.send(loggedIn.message);
});

router.post("/register", async (req, res) => {
  const registered = await register(req.body);
  res.status(registered.status);
  res.send(registered.message);
});

router.post("/submit-tickets", async (req, res) => {
  const ticket = await submitTicket(req.body);
  res.status(ticket.status);
  res.send(ticket.message);
});

router.put("/process-tickets", async (req, res) => {
  const ticket = await processTicket(req.body);
  res.status(ticket.status);
  if (ticket.updatedTicket) {
    res.send({ message: ticket.message, updatedTicket: ticket.updatedTicket });
  } else {
    res.send(ticket.message);
  }
});

router.get("/pending-tickets", async (req, res) => {
  const tickets = await ticketsPending();
  res.status(tickets.status);
  if (tickets.pending) {
    res.send({ message: tickets.message, pending: tickets.pending });
  } else {
    res.send(tickets.message);
  }
});

router.get("/employee-tickets/:userName", async (req, res) => {
  const tickets = await previousTickets(req.params.userName);
  res.status(tickets.status);
  if (tickets.submitted) {
    res.send({ message: tickets.message, submissions: tickets.submitted });
  } else {
    res.send(tickets.message);
  }
});

module.exports = router;

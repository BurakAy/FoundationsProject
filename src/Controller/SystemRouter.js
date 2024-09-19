const express = require("express");
const router = express.Router();

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
  res.send({ message: ticket.message, updatedTicket: ticket.updatedTicket });
});

router.get("/pending-tickets", async (req, res) => {
  const tickets = await ticketsPending();
  res.status(200);
  res.send(tickets);
});

router.get("/employee-tickets/:userName", async (req, res) => {
  const tickets = await previousTickets(req.params.userName);
  res.status(200);
  res.send(tickets);
});

module.exports = router;

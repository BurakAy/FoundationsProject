const {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
} = require("../DAO/TicketDAO");

function submitTicket(ticket) {}

function processTicket(ticketId) {}

function ticketsPending(status) {}

function previousTickets(userName) {}

module.exports = {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets
};

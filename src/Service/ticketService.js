const {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
} = require("../DAO/TicketDAO");

async function submitTicket(ticket) {
  const response = { status: null, message: "" };
  if (ticket.amount && ticket.description && ticket.userName) {
    const newTicket = await createTicket(ticket);
    if (newTicket == 200) {
      response.status = 200;
      response.message = "Ticket successfully submitted";
    } else {
      response.status = 400;
      response.message = "Failed to submit ticket";
    }

    return response;
  }

  response.status = 400;
  response.message = "Tickets must have an amount, description, and username";
  return response;
}

function processTicket(ticketId) {}

function ticketsPending(status) {}

function previousTickets(userName) {}

module.exports = {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets
};

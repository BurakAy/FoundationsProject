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

async function processTicket(ticket) {
  const response = { status: null, message: "", updatedTicket: null };
  if (ticket.ticketId) {
    const processedTicket = await updateTicket(ticket);
    if (processedTicket) {
      response.status = processedTicket.$metadata.httpStatusCode;
      response.message = "Ticket successfully processed";
      response.updatedTicket = processedTicket.Attributes;
    } else {
      response.status = 409;
      response.message =
        "Cannot process tickets that have already been approved/denied";
    }
    return response;
  }

  response.status = 400;
  response.message = "ticketId needed to process ticket";
  return response;
}

function ticketsPending(status) {}

function previousTickets(userName) {}

module.exports = {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets
};

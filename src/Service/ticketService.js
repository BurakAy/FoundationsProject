const logger = require("../util/logger");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: "./.env" });

const {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
} = require("../DAO/TicketDAO");

const secretKey = process.env.SECRET_KEY;

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
  const authorized = await userAuthentication("manager");
  const response = { status: null, message: "" };
  if (authorized) {
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
  response.status = 401;
  response.message = "Unauthorized access";
  return response;
}

async function ticketsPending() {
  const authorized = await userAuthentication("manager");
  const response = {};
  if (authorized) {
    const tickets = await pendingTickets();
    response.message = `${tickets.Count} pending`;
    if (tickets.Count > 0) {
      const pendingTickets = [];
      for (const item of tickets.Items) {
        const ticket = {};
        for (const [key, value] of Object.entries(item)) {
          if (value.S != undefined) {
            ticket[key] = value.S;
          }
          if (value.N != undefined) {
            ticket[key] = value.N;
          }
        }
        pendingTickets.push(ticket);
      }
      response.pending = pendingTickets;
    }
    response.status = 200;
    return response;
  }
  response.status = 401;
  response.message = "Unauthorized access";
  return response;
}

async function previousTickets(userName) {
  const authorized = await userAuthentication(userName);
  const response = {};
  if (authorized) {
    const tickets = await employeeTickets(userName);
    response.message = `${tickets.Count} tickets`;
    if (tickets.Count > 0) {
      const submissions = [];
      for (const item of tickets.Items) {
        const ticket = {};
        for (const [key, value] of Object.entries(item)) {
          if (value.S != undefined) {
            ticket[key] = value.S;
          }
          if (value.N != undefined) {
            ticket[key] = value.N;
          }
        }
        submissions.push(ticket);
      }
      response.submitted = submissions;
    }
    response.status = 200;
    return response;
  }
  response.status = 401;
  response.message = "Unauthorized access";
  return response;
}

async function userAuthentication(authType) {
  logger.info("Authenticating user");

  const token = fs.readFileSync("src/Controller/token.txt", "utf-8");
  const userRole = await decodeJWT(token);
  let authorized = false;

  if (authType === "manager") {
    userRole.role === authType ? (authorized = true) : null;
  } else if (authType === userRole.userName) {
    authorized = true;
  }

  return authorized;
}

async function decodeJWT(token) {
  try {
    const user = jwt.verify(token, secretKey);
    return user;
  } catch (err) {
    logger.error(err);
  }
}

module.exports = {
  submitTicket,
  processTicket,
  ticketsPending,
  previousTickets,
  userAuthentication
};

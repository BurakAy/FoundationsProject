const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TableName = "Ticket";

async function createTicket(ticket) {}

async function updateTicket(ticketId) {}

async function removeTicket(ticketId) {}

async function pendingTickets(status) {}

async function employeeTickets(userName) {}

module.exports = {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
};

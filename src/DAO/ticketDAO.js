const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid");

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TableName = "Ticket";
let ticketId = uuid.v4();

async function createTicket(ticket) {
  const command = new PutCommand({
    TableName,
    Item: { ...ticket, ticketId: ticketId, status: "pending" }
  });
  try {
    const response = await docClient.send(command);
    return response.$metadata.httpStatusCode;
  } catch (err) {
    console.error(err);
  }
}

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

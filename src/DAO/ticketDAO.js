const {
  DynamoDBClient,
  ScanCommand,
  ConditionalCheckFailedException
} = require("@aws-sdk/client-dynamodb");
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

async function updateTicket(ticket) {
  const command = new UpdateCommand({
    TableName,
    Key: { ticketId: ticket.ticketId },
    UpdateExpression: "SET #attrName=:attrValue",
    ConditionExpression:
      "#attrName <> :statusValue1 AND #attrName <> :statusValue2",
    ExpressionAttributeNames: { "#attrName": "status" },
    ExpressionAttributeValues: {
      ":attrValue": ticket.status,
      ":statusValue1": "approved",
      ":statusValue2": "denied"
    },
    ReturnValues: "ALL_NEW"
  });
  try {
    const response = await docClient.send(command);
    return response;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      return false;
    } else {
      console.log(err);
    }
  }
}

async function pendingTickets() {
  const command = new ScanCommand({
    TableName,
    FilterExpression: "#status = :status",
    ExpressionAttributeNames: {
      "#status": "status"
    },
    ExpressionAttributeValues: {
      ":status": { S: "pending" }
    }
  });
  try {
    const response = await docClient.send(command);
    return response;
  } catch (err) {
    console.error(err);
  }
}

async function employeeTickets(userName) {
  const command = new ScanCommand({
    TableName,
    FilterExpression: "#userName = :userName",
    ExpressionAttributeNames: { "#userName": "userName" },
    ExpressionAttributeValues: { ":userName": { S: userName } }
  });
  try {
    const response = await docClient.send(command);
    console.log(response);
    return response.Items;
  } catch (err) {
    console.error(err);
  }
}

async function removeTicket(ticketId) {}

module.exports = {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
};

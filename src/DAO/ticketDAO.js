const {
  DynamoDBClient,
  ScanCommand,
  ConditionalCheckFailedException
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid");
const logger = require("../util/logger");

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TableName = "Ticket";
let ticketId = uuid.v4();

async function createTicket(ticket, userName) {
  const command = new PutCommand({
    TableName,
    Item: {
      ...ticket,
      ticketId: ticketId,
      status: "pending",
      userName: userName
    }
  });
  try {
    const response = await docClient.send(command);
    logger.info(`Created ticket: ${response}`);
    return response.$metadata.httpStatusCode;
  } catch (err) {
    logger.error(err);
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
    logger.info(`Updated ticket: ${response}`);
    return response;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      return false;
    } else {
      logger.error(err);
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
    logger.info(`Scanned pending tickets`);
    return response;
  } catch (err) {
    logger.error(err);
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
    logger.info(`Scanned employee tickets`);
    return response;
  } catch (err) {
    logger.error(err);
  }
}

module.exports = {
  createTicket,
  updateTicket,
  pendingTickets,
  employeeTickets
};

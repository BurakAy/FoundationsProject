const {
  DynamoDBClient,
  QueryCommand,
  ConditionalCheckFailedException
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid");
const logger = require("../util/logger");

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TableName = "User";
let userId = uuid.v4();

async function userLogin(userName, pass) {
  const command = new QueryCommand({
    TableName,
    KeyConditionExpression: "userName = :userName",
    FilterExpression: "password = :password",
    ExpressionAttributeValues: {
      ":userName": { S: userName },
      ":password": { S: pass }
    }
  });
  try {
    const response = await docClient.send(command);
    logger.info(`Login query: ${response}`);
    return response.Count;
  } catch (err) {
    logger.error(err);
  }
}

async function createAccount(username, pass) {
  const command = new PutCommand({
    TableName,
    Item: {
      userName: username,
      password: pass,
      role: "employee",
      userId: userId
    },
    ConditionExpression: "attribute_not_exists(userName)"
  });
  try {
    const response = await docClient.send(command);
    logger.info(`Created a new account: ${response}`);
    return response;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      logger.info(`Account not created, userName already exists`);
      return false;
    } else {
      logger.log(err);
    }
  }
}

module.exports = { userLogin, createAccount };

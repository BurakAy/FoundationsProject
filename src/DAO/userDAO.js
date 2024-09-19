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

const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TableName = "User";
let userId = uuid.v4();

async function userInfo(userName) {}

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
    return response.Count;
  } catch (err) {
    console.error(err);
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
    return response;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      return false;
    } else {
      console.log(err);
    }
  }
}

module.exports = { userLogin, createAccount };

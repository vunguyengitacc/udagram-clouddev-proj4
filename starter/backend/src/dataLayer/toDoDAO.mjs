
import * as uuid from 'uuid'
import { createLogger } from "../utils/logger.mjs";
import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const logger = createLogger('todoAccess');

const bucketName = process.env.S3_BUCKET_NAME;
const todoTable = "ToDoUdagram"
const todoTableGsi = "user-id"

export async function getTodosDB(userId) {
  const result = await docClient.query({
    TableName: todoTable,
    IndexName: todoTableGsi,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();
  const items = result.Items

  return items
}

export async function getTodoByIdDB(userId, todoId) {
  logger.info('Fetching todo with todoId', { userId: userId })

  const result = await docClient.query({
    TableName: todoTable,
    KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':todoId': todoId
    }
  }).promise();

  const items = result.Items

  logger.info("Fetching complete.", items)
  
  return items
}

export async function createTodoDB(newTodo) {  
  await docClient.put({
    TableName: todoTable,
    Item: newTodo
  }).promise();
  return newTodo.todoId;
}

export async function deleteTodoDB(userId, todoId) {
  await docClient.delete({
    TableName: todoTable,
    Key: {
      "todoId": todoId,
      "userId": userId
    }
  }).promise();
}

export async function updateTodoDB(userId, todoId, updatedTodo) {
  await docClient.update({
    TableName: todoTable,
    Key: {
      "todoId": todoId,
      "userId": userId
    },
    UpdateExpression: "set #todoName = :name, done = :done, dueDate = :dueDate",
    ExpressionAttributeNames: {
      "#todoName": "name"
    },
    ExpressionAttributeValues: {
      ":name": updatedTodo.name,
      ":done": updatedTodo.done,
      ":dueDate": updatedTodo.dueDate
    }
  }).promise()
}

export async function updateTodoAttachmentUrlDB(userId, todoId, attachmentUrl) {
  await docClient.update({
    TableName: todoTable,
    Key: {
      "todoId": todoId,
      "userId": userId
    },
    UpdateExpression: "set attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues: {
      ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentUrl}`
    }
  }).promise();
}


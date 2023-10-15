
import * as uuid from 'uuid'
import { createLogger } from "../utils/logger.mjs";
import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const logger = createLogger('todoAccess');

const bucketName = process.env.S3_BUCKET_NAME;
const todoTable = "ToDoUdagram"
const todoTableGsi = "user-id"

export async function getTodos(userId) {
  logger.info('Fetching all todos for userId', { userId: userId })

  const result = await docClient.query({
    TableName: todoTable,
    IndexName: todoTableGsi,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise();

  const items = result.Items

  logger.info("Fetching complete.", items)

  return items
}

export async function getTodoById(userId, todoId) {
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

  return items[0]
}

export async function createTodo(userId, newTodo) {
  const todoId = uuid.v4();

  const newTodoWithAdditionalInfo = {
    userId: userId,
    todoId: todoId,
    ...newTodo
  }

  logger.info("Creating new todo object:", newTodoWithAdditionalInfo);

  await docClient.put({
    TableName: todoTable,
    Item: newTodoWithAdditionalInfo
  }).promise();

  logger.info("Create complete.")

  return todoId;

}

export async function deleteTodo(userId, todoId) {
  logger.info("Deleting todo:", { todoId: todoId });
  await docClient.delete({
    TableName: todoTable,
    Key: {
      "todoId": todoId,
      "userId": userId
    }
  }).promise();
  logger.info("Delete complete.", { todoId: todoId });
}

export async function updateTodo(userId, todoId, updatedTodo) {

  logger.info("Updating todo:", {
    todoId: todoId,
    updatedTodo: updatedTodo
  });
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

  logger.info("Update complete.")

}

export async function updateTodoAttachmentUrl(userId, todoId, attachmentUrl) {

  logger.info(`Updating todoId ${todoId} with attachmentUrl ${attachmentUrl}`)

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


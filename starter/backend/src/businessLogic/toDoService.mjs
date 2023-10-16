
import * as uuid from 'uuid'
import { createLogger } from "../utils/logger.mjs";
import { createTodoDB, deleteTodoDB, getTodoByIdDB, getTodosDB, updateTodoAttachmentUrlDB, updateTodoDB } from '../dataLayer/toDoDAO.mjs';
import { uploadFile } from '../dataLayer/fileUploader.mjs';

const logger = createLogger('todoAccess');

export async function getList(userId) {
  logger.info('Fetching all todos for userId', { userId: userId })

  const items = await getTodosDB(userId)
  
  logger.info("Fetching complete.", items)

  return items
}

export async function getById(userId, todoId) {
  logger.info('Fetching todo with todoId', { todoId: todoId })

  const data = await getTodoByIdDB(userId, todoId)

  logger.info("Fetching complete.", data)

  return data[0]
}

export async function createTodo(userId, newTodo) {
  const todoId = uuid.v4();

  const newTodoWithAdditionalInfo = {
    userId: userId,
    todoId: todoId,
    ...newTodo
  }
  logger.info("Creating new todo object:", newTodoWithAdditionalInfo);

  const id = await createTodoDB(newTodoWithAdditionalInfo)

  logger.info("Create complete.")

  return id;

}

export async function deleteTodo(userId, todoId) {
  logger.info("Deleting todo:", { todoId: todoId });
  await deleteTodoDB(userId, todoId)
  logger.info("Delete complete.", { todoId: todoId });
}

export async function updateTodo(userId, todoId, updatedTodo) {
  logger.info("Updating todo:", {
    todoId: todoId,
    updatedTodo: updatedTodo
  });
  await updateTodoDB(userId, todoId, updatedTodo)
  logger.info("Update completed.")
}

export async function updateTodoAttachmentUrl(userId, todoId) {
  const {attachmentId, uploadUrl} = await uploadFile()  
  logger.info(`Updating todoId ${todoId} with attachmentUrl ${uploadUrl}`)
  await updateTodoAttachmentUrlDB(userId, todoId, attachmentId)
  logger.info("Update completed.")
  return uploadUrl
}


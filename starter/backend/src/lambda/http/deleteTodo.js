import { deleteTodo } from "../../businessLogic/toDoService.mjs";
import { getUserId } from "../auth/authUtils.mjs";

export async function handler(event) {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId
  await deleteTodo(userId, todoId)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}


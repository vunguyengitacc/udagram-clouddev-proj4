import { getTodoById } from "../../dataAccess/toDoDAO.mjs";
import { getUserId } from "../auth/authUtils.mjs";

export async function handler(event) {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId

  const todo = await getTodoById(userId,todoId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      ...todo
    })
  }
}

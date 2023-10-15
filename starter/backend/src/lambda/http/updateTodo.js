import { updateTodo } from "../../dataAccess/toDoDAO.mjs";
import { getUserId } from "../auth/authUtils.mjs";

export async function handler(event) {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  await updateTodo(userId, todoId, updatedTodo);

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}

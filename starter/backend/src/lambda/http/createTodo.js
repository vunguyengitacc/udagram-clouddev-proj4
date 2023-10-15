import { createTodo } from "../../dataAccess/toDoDAO.mjs";
import { getUserId } from "../auth/authUtils.mjs"

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  const userId = getUserId(event);

  const todoId = await createTodo(userId, newTodo);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item:
      {
        todoId: todoId,
        ...newTodo
      }
    })
  }
}


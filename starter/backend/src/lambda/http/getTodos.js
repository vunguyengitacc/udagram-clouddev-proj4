import { getTodos } from "../../dataAccess/toDoDAO.mjs";
import { getUserId } from "../auth/authUtils.mjs";

export async function handler(event) {
  const userId = getUserId(event);

  const todos = await getTodos(userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todos
    })
  }
}

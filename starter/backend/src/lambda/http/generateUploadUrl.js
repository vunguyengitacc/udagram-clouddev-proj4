import { getUserId } from '../auth/authUtils.mjs';
import { updateTodoAttachmentUrl } from '../../businessLogic/toDoService.mjs';

export async function handler(event) {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId
  const uploadUrl = await updateTodoAttachmentUrl(userId, todoId);
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}


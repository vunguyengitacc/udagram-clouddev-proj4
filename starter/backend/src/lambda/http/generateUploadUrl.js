import * as uuid from 'uuid';
import AWS from 'aws-sdk';
import { updateTodoAttachmentUrl } from '../../dataAccess/toDoDAO.mjs';
import { getUserId } from '../auth/authUtils.mjs';

const bucketName = process.env.S3_BUCKET_NAME;
const urlExpiration = Number.parseInt(process.env.S3_ASSETS_URL_EXPIRATION);
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function handler(event) {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId

  const attachmentId = uuid.v4();

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: urlExpiration
  });

  await updateTodoAttachmentUrl(userId, todoId, attachmentId);
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


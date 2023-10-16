import * as uuid from 'uuid';
import AWS from 'aws-sdk';

const bucketName = process.env.S3_BUCKET_NAME;
const urlExpiration = Number.parseInt(process.env.S3_ASSETS_URL_EXPIRATION);
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export async function uploadFile() {
  const attachmentId = uuid.v4()
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: urlExpiration
  })
  
  return {uploadUrl, attachmentId}
}
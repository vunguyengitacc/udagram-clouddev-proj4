import Axios from 'axios'
import { createLogger } from '../../utils/logger.mjs'
import jsonwebtoken from 'jsonwebtoken';
import request from 'request-promise';

const {verify} = jsonwebtoken

const logger = createLogger('auth')

const jwksUrl = 'https://dev-zktn4mhjqom1l0wq.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

export async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  
  const jwksRequest = await request({
    uri: jwksUrl,
    strictSsl: true,
    json: true
  }).promise();
  const jwks = jwksRequest.keys;
  const signingKeys = jwks.map(key => {
    return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
  });
  const signingKey = signingKeys[0].publicKey;
  console.log(signingKey);

  return verify(token, signingKey, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}

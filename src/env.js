/**
 * @fileoverview This file contains env variables.
 * @dependencies None
 */

export const restUrl = process.env.NODE_ENV === 'development'
  // ? 'http://localhost:8888/marketing' // DEVELOPMENT
  ? 'https://stagingapi.ruoff.com/marketing' // DEVELOPMENT
  // ? 'https://ruoff.ngrok.io/marketing' // DEVELOPMENT
  : 'https://api.ruoff.com/marketing'; // PRODUCTION

export const apiKey = 'ruoff.5de67e9b449268.55910690';

export const gqlUrl = process.env.NODE_ENV === 'development'
  // ? 'http://localhost:8888' // DEVELOPMENT
  ? 'https://stagingapi.ruoff.com' // DEVELOPMENT
  // ? 'https://ruoff.ngrok.io' // DEVELOPMENT
  : 'https://api.ruoff.com'; // PRODUCTION;

export const marketingS3bucket = process.env.NODE_ENV === 'development'
  ? 'ruoff-marketing-v2-dev' // DEVELOPMENT
  : 'ruoff-marketing-v2'; // PRODUCTION

export const socketServer = process.env.NODE_ENV === 'development'
  // ? 'http://127.0.0.1:3000/marketing' // DEVELOPMENT
  ? 'https://stagingsockets.ruoff.com/marketing' // DEVELOPMENT
  : 'https://sockets.ruoff.com/marketing'; // PRODUCTION

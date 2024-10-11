import { readFileSync } from 'fs';

const DB_PASSWORD = readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
const REDIS_PASSWORD = readFileSync(process.env.REDIS_PASSWORD_FILE, 'utf8').trim();
const ACCESS_TOKEN_SECRET = readFileSync(process.env.APP_ACCESS_TOKEN_FILE, 'utf8').trim();
const REFRESH_TOKEN_SECRET = readFileSync(process.env.APP_REFRESH_TOKEN_FILE, 'utf8').trim();

export { DB_PASSWORD, REDIS_PASSWORD, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };

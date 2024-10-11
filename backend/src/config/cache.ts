import { REDIS_PASSWORD } from './secrets';

export default {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: REDIS_PASSWORD || undefined,
};

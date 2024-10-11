import { Pool } from 'pg';
import settings from '@config/settings.json';
import { DB_PASSWORD } from '@config/secrets';

export default new Pool({
  max: settings.DATABASE_MAX_CLIENTS,
  idleTimeoutMillis: settings.DATABASE_IDLE_TIMEOUT_MILLIS,
  connectionTimeoutMillis: settings.DATABASE_CONNECTION_TIMEOUT_MILLIS,
  password: DB_PASSWORD,
});

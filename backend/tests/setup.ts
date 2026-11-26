import { randomBytes } from 'node:crypto';
import { config } from 'dotenv';
import { configureTestDatabaseUrl } from './helpers/test-db.helper.js';

process.env['NODE_ENV'] = 'test';
process.env['LOG_LEVEL'] = 'silent';
process.env['FRONTEND_URL'] ??= 'http://localhost:5173';
config({ path: '.env.test', quiet: true });
configureTestDatabaseUrl();
process.env['JWT_ACCESS_SECRET'] = randomBytes(32).toString('hex');

import { spawnSync } from 'node:child_process';
import { config } from 'dotenv';
import { confirmTestDatabase } from './test-db.helper.ts';

process.env['NODE_ENV'] = 'test';
process.env['REQUIRE_TEST_DATABASE'] = '1';
config({ path: '.env.test', quiet: true });
await confirmTestDatabase();

for (const action of ['deploy', 'status']) {
  const result = spawnSync(
    process.execPath,
    ['node_modules/prisma/build/index.js', 'migrate', action],
    {
      stdio: 'inherit',
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

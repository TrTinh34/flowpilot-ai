import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  ['node_modules/vitest/vitest.mjs', 'run', '--no-file-parallelism', 'tests/integration'],
  { stdio: 'inherit', env: { ...process.env, REQUIRE_TEST_DATABASE: '1' } },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

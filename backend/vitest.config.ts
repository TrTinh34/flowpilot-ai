import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.test.ts',
      'tests/architecture/**/*.test.ts',
      'tests/integration/**/*.test.ts',
    ],
    // Exclude future sprint placeholder test files until their features are implemented
    exclude: [
      'tests/unit/board.service.test.ts',
      'tests/unit/ai-output.validator.test.ts',
      'tests/unit/file-signature.util.test.ts',
      'tests/integration/workspace-isolation.integration.test.ts',
      'tests/integration/project-task.integration.test.ts',
      'tests/integration/board-concurrency.integration.test.ts',
      'tests/integration/collaboration.integration.test.ts',
      'tests/integration/notification-socket.integration.test.ts',
      'tests/integration/ai-planning.integration.test.ts',
    ],
  },
});

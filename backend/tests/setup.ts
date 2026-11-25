process.env['NODE_ENV'] = 'test';
process.env['LOG_LEVEL'] = 'silent';
process.env['FRONTEND_URL'] ??= 'http://localhost:5173';
process.env['DATABASE_URL'] ??= 'postgresql://localhost:5434/flowpilot_ai';

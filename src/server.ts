// BE-80: server.ts — HTTP server entry point

import { app } from './app';

const PORT = process.env['PORT'] ?? 3000;

app.listen(PORT, () => {
  // Startup message — only used in development/production boot
  process.stdout.write(`🚀 Stencil API running on http://localhost:${PORT}\n`);
  process.stdout.write(`   Health: http://localhost:${PORT}/health\n`);
});

import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { compareGeneratedTrees, scanGeneratedOutput } from './api-client-lib.mjs';

const committedRoot = path.resolve('src/api/generated');
const checkRoot = path.resolve('src/api/generated-check');

await rm(checkRoot, { recursive: true, force: true });
try {
  const result = spawnSync(process.execPath, ['node_modules/orval/dist/bin/orval.mjs', '--config', 'orval.config.ts'], {
    cwd: process.cwd(),
    env: { ...process.env, API_GENERATED_ROOT: 'src/api/generated-check' },
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Orval generation failed');
  await compareGeneratedTrees(committedRoot, checkRoot);
  await scanGeneratedOutput(committedRoot);
  console.log('Generated API client is deterministic, current, and passed the security scan.');
} finally {
  await rm(checkRoot, { recursive: true, force: true });
}

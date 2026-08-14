import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { compareGeneratedTrees, scanGeneratedOutput } from './api-client-lib.mjs';

const roots = [];
afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'api-client-lib-'));
  roots.push(root);
  const committed = path.join(root, 'committed');
  const generated = path.join(root, 'generated');
  await Promise.all([mkdir(committed), mkdir(generated)]);
  const content = '/** AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */\nexport type Value = string;\n';
  await Promise.all([writeFile(path.join(committed, 'model.ts'), content), writeFile(path.join(generated, 'model.ts'), content)]);
  return { committed, generated };
}

describe('generated API drift and security checks', () => {
  it('accepts identical deterministic output and rejects deliberate drift', async () => {
    const { committed, generated } = await fixture();
    await expect(compareGeneratedTrees(committed, generated)).resolves.toBeUndefined();
    await writeFile(path.join(generated, 'model.ts'), '/** manually changed */');
    await expect(compareGeneratedTrees(committed, generated)).rejects.toThrow('drift detected');
  });

  it('rejects embedded URLs and accepts generated notices', async () => {
    const { committed } = await fixture();
    await expect(scanGeneratedOutput(committed)).resolves.toBeUndefined();
    await writeFile(path.join(committed, 'model.ts'), '/** AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */\nexport const url = "https://production.invalid";');
    await expect(scanGeneratedOutput(committed)).rejects.toThrow('leakage');
  });
});

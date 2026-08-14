import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export async function listFiles(root, current = root) {
  const result = [];
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(root, absolute));
    else result.push(path.relative(root, absolute).replaceAll('\\', '/'));
  }
  return result.sort();
}

export async function compareGeneratedTrees(committedRoot, checkRoot) {
  const [committedFiles, checkFiles] = await Promise.all([listFiles(committedRoot), listFiles(checkRoot)]);
  if (JSON.stringify(committedFiles) !== JSON.stringify(checkFiles)) {
    throw new Error('Generated API file list is stale. Run npm run api:client:generate.');
  }
  for (const file of committedFiles) {
    const [committed, regenerated] = await Promise.all([
      readFile(path.join(committedRoot, file)),
      readFile(path.join(checkRoot, file)),
    ]);
    if (!committed.equals(regenerated)) throw new Error(`Generated API drift detected: ${file}`);
  }
}

export async function scanGeneratedOutput(root) {
  const forbiddenValues = [
    /https?:\/\//i,
    /Bearer\s+[A-Za-z0-9._-]+/,
    /DATABASE_URL\s*=/i,
    /(?:password|secret|apiKey)\s*[:=]\s*['"][^'"]+['"]/i,
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
  ];
  for (const file of await listFiles(root)) {
    const content = await readFile(path.join(root, file), 'utf8');
    if (!content.includes('AUTO-GENERATED FILE.') || !content.includes('DO NOT EDIT MANUALLY.')) {
      throw new Error(`Generated notice missing: ${file}`);
    }
    for (const pattern of forbiddenValues) {
      if (pattern.test(content)) throw new Error(`Potential environment or secret leakage in ${file}: ${pattern}`);
    }
  }
}

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { validateParity } from './api-parity-lib.mjs';

const contractPath = path.resolve('contracts/backend/openapi.json');
const manifestRoot = path.resolve('contracts/frontend-capabilities');
const command = process.argv[2] ?? 'check';

const contract = await readFile(contractPath, 'utf8').then(JSON.parse);
const manifestFiles = (await readdir(manifestRoot)).filter((file) => file.endsWith('.json')).sort();
const manifestOperations = (await Promise.all(manifestFiles.map((file) => readFile(path.join(manifestRoot, file), 'utf8').then(JSON.parse)))).flatMap((manifest) => manifest.operations ?? []);

const { inventory, classified, errors, counts } = validateParity(contract, manifestOperations);
for (const [key, entry] of classified) {
  for (const binding of entry.bindings ?? []) {
    try { await readFile(path.resolve(binding)); } catch { errors.push(`Missing frontend binding for ${key}: ${binding}`); }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ total: inventory.size, counts }, null, 2));
  if (command === 'report') {
    for (const entry of classified.values()) {
      console.log(`${entry.status}\t${entry.method}\t${entry.path}\t${entry.operationId}`);
    }
  } else if (command !== 'check') {
    throw new Error(`Unknown parity command: ${command}`);
  }
}

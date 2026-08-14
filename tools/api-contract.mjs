import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateContractDocument } from './api-contract-lib.mjs';

const contractPath = path.resolve('contracts/backend/openapi.json');

async function readContract(file = contractPath) {
  let raw;
  try {
    raw = await readFile(file);
  } catch {
    throw new Error(`OPENAPI_CONTRACT_REQUIRED: ${file}`);
  }
  let document;
  try {
    document = JSON.parse(raw.toString('utf8'));
  } catch {
    throw new Error(`OPENAPI_CONTRACT_INVALID: ${file} is not valid JSON`);
  }
  return { raw, document };
}

const command = process.argv[2];
if (command === 'sync') {
  const sourceArg = process.argv.find((argument) => argument.startsWith('--source='));
  const source = sourceArg?.slice('--source='.length) || process.env.BACKEND_OPENAPI_PATH;
  if (!source) throw new Error('OPENAPI_CONTRACT_REQUIRED: pass --source=<path> or BACKEND_OPENAPI_PATH');
  const sourcePath = path.resolve(source);
  const { document } = await readContract(sourcePath);
  validateContractDocument(document);
  await mkdir(path.dirname(contractPath), { recursive: true });
  await copyFile(sourcePath, contractPath);
  console.log(`Synced validated contract from ${sourcePath}`);
} else {
  const { raw, document } = await readContract();
  if (command === 'validate') validateContractDocument(document);
  if (command !== 'sha' && command !== 'validate') throw new Error('Usage: api-contract.mjs <sync|sha|validate>');
  console.log(JSON.stringify({
    openapi: document.openapi,
    title: document.info?.title,
    version: document.info?.version,
    sha256: createHash('sha256').update(raw.toString('utf8').replaceAll('\r\n', '\n')).digest('hex'),
  }, null, 2));
}

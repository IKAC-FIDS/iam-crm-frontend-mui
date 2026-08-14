import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const contract = JSON.parse(await readFile('contracts/backend/openapi.json', 'utf8'));
const requestedTag = process.argv[2];
const requestedChunk = Number(process.argv[3] ?? 0);
const chunkSize = 12;
const methods = new Set(['get', 'post', 'put', 'patch', 'delete']);
const fullTags = new Set(['Activities', 'Attachments', 'Companies', 'Dashboard', 'Industries', 'Lead-sources', 'Lookups', 'Meetings', 'Notifications', 'Opportunities', 'Pain-points', 'People', 'Permissions', 'Persona-library', 'Pipeline', 'Products', 'Reports', 'Roles', 'Tasks', 'Teams', 'Universities', 'Use-cases']);

function isPlatformPath(value) {
  return /^\/api\/admin\/(organizations(?:\/|$)|plans(?:\/|$)|subscriptions(?:\/|$)|platform-audit-logs(?:\/|$))/.test(value);
}
function isTyped(operation) {
  const success = Object.entries(operation.responses ?? {}).find(([status]) => /^2/.test(status));
  const schema = success?.[1]?.content?.['application/json']?.schema;
  let data = schema;
  for (const part of schema?.allOf ?? []) if (part?.properties?.data) data = part.properties.data;
  if (schema?.properties?.data) data = schema.properties.data;
  return Boolean(data) && data.additionalProperties !== true && !(data.type === 'object' && !data.$ref && !data.properties && !data.items);
}
function classify(operationPath, tag) {
  if (operationPath === '/api/companies/{id}/stage') return 'DEPRECATED_BACKEND_ENDPOINT';
  if (['Health', 'Ready', 'Version'].includes(tag)) return 'NOT_USER_FACING';
  if (isPlatformPath(operationPath)) return 'PLATFORM_CONTRACT_REQUIRED';
  if (/^\/api\/admin\/(audit-logs|exchange-rates|pipeline)(?:\/|$)/.test(operationPath)) return 'FULL_UI_SUPPORT';
  if (operationPath.startsWith('/api/admin/sso-providers')) return 'SERVICE_ONLY_NO_UI';
  if (operationPath.startsWith('/api/admin/permissions/')) return 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE';
  if (operationPath.startsWith('/api/organization/') || operationPath === '/api/entitlements/current' || operationPath === '/api/import/sam' || operationPath.startsWith('/api/tenant/')) return 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE';
  if (tag === 'Auth') return ['/api/auth/login', '/api/auth/logout', '/api/auth/refresh'].includes(operationPath) ? 'FULL_UI_SUPPORT' : 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE';
  if (tag === 'Passkeys') return operationPath.startsWith('/api/admin/') ? 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE' : 'FULL_UI_SUPPORT';
  if (tag === 'SSO') return ['/api/auth/sso/exchange', '/api/auth/sso/providers'].includes(operationPath) ? 'FULL_UI_SUPPORT' : 'INTENTIONALLY_NO_UI';
  if (tag === 'Quotas' || tag === 'Organizations') return 'FULL_UI_SUPPORT';
  if (tag === 'Users') return operationPath.endsWith('/v2') ? 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE' : 'FULL_UI_SUPPORT';
  if (fullTags.has(tag)) return 'FULL_UI_SUPPORT';
  return 'BLOCKED_BY_GENERIC_OPENAPI_RESPONSE';
}
async function serviceBinding(tag, operationPath, status) {
  if (status !== 'FULL_UI_SUPPORT') return [];
  const direct = { Quotas: 'quota', Auth: 'auth', SSO: 'sso', Passkeys: operationPath.startsWith('/api/auth/') ? 'auth' : 'accountSecurity', Activities: 'activities', Attachments: 'attachments', Companies: 'companies', Dashboard: 'reports', Industries: 'catalogs', 'Lead-sources': 'catalogs', Lookups: 'catalogs', Meetings: 'meetings', Notifications: 'notifications', Opportunities: 'opportunities', 'Pain-points': 'catalogs', People: 'people', Permissions: 'admin/permissions', 'Persona-library': 'catalogs', Pipeline: 'pipelineConfig', Products: 'productCatalog', Reports: 'reports', Roles: 'admin/permissions', Tasks: 'tasks', Teams: 'teams', Universities: 'catalogs', 'Use-cases': 'catalogs', Users: 'admin/users', Organizations: 'organizations' }[tag];
  const feature = direct ?? (operationPath.startsWith('/api/admin/audit-logs') ? 'auditLogs' : operationPath.startsWith('/api/admin/exchange-rates') ? 'exchangeRates' : operationPath.startsWith('/api/admin/pipeline') ? 'pipelineConfig' : null);
  if (!feature) return [];
  const root = path.join('src/features', feature, 'services');
  const file = (await readdir(root)).find((entry) => entry.endsWith('.service.ts'));
  return file ? [path.join(root, file).replaceAll('\\', '/')] : [];
}
function authorization(operationPath, tag) {
  if (isPlatformPath(operationPath)) return 'PLATFORM_ADMIN';
  if (['Health', 'Ready', 'Version'].includes(tag)) return 'PUBLIC_INFRASTRUCTURE';
  if (operationPath.startsWith('/api/admin/sso-providers')) return 'PERMISSION:sso-provider:view/manage + FEATURE:SSO';
  if (operationPath.startsWith('/api/organization/')) return 'PERMISSION:organization:view/manage';
  if (operationPath.startsWith('/api/tenant/')) return 'PERMISSION:role:view/manage';
  if (operationPath === '/api/import/sam') return 'PERMISSION:import:sam';
  if (operationPath.startsWith('/api/auth/') || operationPath.startsWith('/api/me/')) return 'PUBLIC_OR_AUTHENTICATED_AUTH_FLOW';
  if (operationPath === '/api/quota/current' || operationPath === '/api/entitlements/current') return 'AUTHENTICATED_TENANT';
  return 'BACKEND_CONTROLLER_PERMISSION_POLICY';
}

const operations = [];
for (const [operationPath, pathItem] of Object.entries(contract.paths ?? {})) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!methods.has(method) || operation.tags?.[0] !== requestedTag) continue;
    const status = classify(operationPath, requestedTag);
    operations.push({ method: method.toUpperCase(), path: operationPath, operationId: operation.operationId, tag: requestedTag, status, responseTyped: isTyped(operation), authorization: authorization(operationPath, requestedTag), bindings: await serviceBinding(requestedTag, operationPath, status) });
  }
}
process.stdout.write(JSON.stringify({ schemaVersion: 1, operations: operations.slice(requestedChunk * chunkSize, (requestedChunk + 1) * chunkSize) }, null, 2));

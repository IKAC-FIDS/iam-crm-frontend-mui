# Generated API Client — fix 000108

## Purpose and dependency

This fix establishes a deterministic generated transport-contract layer without replacing the repository-owned feature hooks or application policy. Its backend dependency floor is backend fix 000094. The committed baseline was obtained from the local approved backend repository after fix 000095-B added the typed company/task response contracts required for the bounded migration.

Contract provenance:

- Source repository path used for this baseline: `E:\nodejs\iam-crm-backend\openapi\openapi.json`
- Committed frontend input: `contracts/backend/openapi.json`
- Backend baseline commit: `d02b29f8e50a9d3922caefd13e51ddc86aa011a5`
- OpenAPI: `3.0.0`
- API title/version: `IAM CRM API` / `0.1.0`
- SHA-256: `b84ca61d0e7aff8d69cc1ff61590f6fa50fd67621873b40fcd34d742a8ac8055`

The frontend never fetches Production Swagger. Contract updates are explicit review events.

## Generator decision

Orval `8.24.0` is pinned in `package-lock.json`. It was selected because it generates reviewable Axios endpoint functions and TypeScript models, supports a custom mutator, injects a generated-file header, runs on the repository's Node baseline without Java, and supports deterministic operation/tag filtering. Generated React Query hooks are intentionally disabled; existing TanStack Query keys, caching, retries, invalidation, and error UX remain application-owned.

Alternatives considered:

- `openapi-typescript`: excellent contract types, but executable Axios endpoints would require maintaining an additional handwritten operation layer.
- OpenAPI Generator `typescript-axios`: capable, but adds a heavier template/runtime workflow and typically creates its own client configuration; Java would also increase CI and operator complexity.
- Generated React Query hooks from Orval: rejected for phase 1 because they would duplicate repository query policy and broaden the migration.

## Architecture

`contracts/backend/openapi.json` is validated by Redocly and repository-specific contract gates. Orval writes disposable sources to `src/api/generated`. Every generated TypeScript file carries an `AUTO-GENERATED` / `DO NOT EDIT MANUALLY` header. `src/api/generatedApiMutator.ts` is the only runtime bridge and calls the existing `src/lib/axios.ts` instance.

Consequently:

- `VITE_API_URL`, timeout, `withCredentials`, and JSON/FormData behavior remain centralized.
- Bearer-token attachment and single-flight refresh remain in existing interceptors.
- Tenant identity continues to come from the authenticated backend/JWT context; no tenant header is invented.
- Request correlation remains response/server-generated because the existing frontend does not create `x-request-id` values.
- Axios failures still flow to existing `getApiErrorMessage`, `getApiErrorCode`, and request-ID helpers.
- Abort signals supplied by React Query are preserved through Axios options.

The adapter removes the contract's `/api` prefix before passing URLs to the existing Axios base URL, preventing `/api/api/...` duplication.

## Generated contracts

Generation is limited to the backend `Companies` and `Tasks` tags. It includes endpoint functions and all schemas transitively referenced by those operations, including:

- `SuccessEnvelope`, `ErrorEnvelope`, and `PaginationMeta`
- company/task response and list-item contracts
- request DTOs used by the selected tags
- enum constants and union types
- nullable/optional property semantics

Transport contracts remain distinct from frontend view models. The generated models are not exposed through a new global application barrel.

## Phase-1 migrated endpoints

- `GET /api/companies`: generated `companiesGet`; the company service maps the rich transport item to its existing compact grid view model and retains existing query keys and server pagination.
- `GET /api/tasks`: generated `tasksGet`; its typed pagination envelope feeds the existing task service and React Query hooks.
- `DELETE /api/tasks/{id}`: generated `tasksDelete`; existing mutation invalidation remains unchanged.

These endpoints prove read, pagination, mutation, auth transport, tenant behavior, correlation behavior, cancellation, and response-envelope typing with limited blast radius. Company/task create/update and all other feature groups remain manual because their migration requires separate request-model and behavioral review. No handwritten domain/view-model contract was globally removed.

The current OpenAPI query schemas do not yet expose the existing company `priority` or task `status`/`priority` compatibility filters. The feature services continue forwarding those already-supported parameters through Axios options so user-visible filtering is not silently removed; the generated contract is used for all documented parameters and typed responses. Backend OpenAPI should document these compatibility parameters before the manual forwarding shim is removed.

## Commands

From the frontend repository:

```bash
npm run api:contract:sync -- --source=<approved-backend-repository>/openapi/openapi.json
npm run api:contract:sha
npm run api:contract:validate
npm run api:client:generate
npm run api:client:clean-check
npm run api:client:check
```

`api:contract:sync` requires an explicit `--source` or `BACKEND_OPENAPI_PATH`; it has no network or Production default. `api:client:clean-check` regenerates into the dedicated ignored sibling directory `src/api/generated-check`, compares file names and bytes, scans committed output, and deletes only that temporary directory. It never resets or cleans Git work.

`api:client:check` validates the contract, performs deterministic drift/security checks, typechecks, and builds the application. CI runs contract/drift gates after `npm ci` and retains the existing typecheck, coverage, lint, build, and local Playwright stages.

## Security and reproducibility

The output scan rejects embedded absolute HTTP(S) URLs, bearer values, database URLs, assigned secret-like values, and concrete UUID/tenant identifiers. Legitimate contract property names such as token fields are not rejected without an embedded value. Generated output uses a relative server contract and the shared runtime base URL.

The same committed contract, Orval version/configuration, Node/npm environment, and lockfile must reproduce byte-equivalent generated files. Unit tests prove that deliberate output drift and embedded URLs are rejected. No timestamps, usernames, absolute source paths, credentials, or environment values are emitted into generated files.

## Backend update workflow

1. Validate and review the backend OpenAPI change and backend breaking-contract checks.
2. Sync from an explicitly approved backend artifact.
3. Review the contract SHA and contract diff.
4. Validate and regenerate.
5. Run the clean drift check, tests, lint, typecheck, build, and E2E suite.
6. Review generated changes and any affected feature adapter separately.

Never automatically consume the latest backend branch or a runtime Swagger endpoint.

## Troubleshooting

- `OPENAPI_CONTRACT_REQUIRED`: provide an explicit readable source path.
- `OPENAPI_CONTRACT_INVALID`: correct the backend artifact; do not patch generated output.
- `CONTRACT_MISMATCH_REQUIRES_BACKEND_FIX`: required typed operations/schemas are absent.
- Generated drift: run generation, inspect the diff, and commit it only with the reviewed contract/config change.
- URL duplication: generated routes must continue through `generatedApiMutator`; do not instantiate another Axios client.

## Phased migration

- Phase 1 (this fix): generator, committed contract, adapter, validation/drift/security gates, and representative company/task endpoints.
- Phase 2: common read-only APIs and additional shared pagination/error contracts.
- Phase 3: write-heavy services after request DTO parity review.
- Phase 4: auth/security-sensitive APIs only in a dedicated security review.
- Phase 5: remove obsolete handwritten transport contracts only after every consumer is migrated.

## Rollback

Rollback is frontend-only: restore the prior frontend commit/image. No backend deployment, schema operation, Prisma action, or database rollback belongs to this fix.

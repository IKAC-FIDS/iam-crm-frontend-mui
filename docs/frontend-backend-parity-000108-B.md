# Fix 000108-B — Frontend/Backend Capability and Authorization Parity

## 1. Audited baselines

- Frontend starting SHA: `d11dd0f79a889f0583b4c90226be011ab8b653d4` (`fix 000108 — Add Generated API Client`)
- Backend inspected SHA: `d02b29f8e50a9d3922caefd13e51ddc86aa011a5` (`fix 000095-B — Add Typed OpenAPI Response Contracts`)
- Canonical OpenAPI: `contracts/backend/openapi.json`
- Canonical LF-normalized SHA-256: `b84ca61d0e7aff8d69cc1ff61590f6fa50fd67621873b40fcd34d742a8ac8055`
- OpenAPI operations: **323**
- OpenAPI success payloads sufficiently typed for generation: **10**; generic/insufficient: **313**

## 2. Classification totals after this fix

| Classification | Count |
|---|---:|
| `FULL_UI_SUPPORT` | 240 |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | 38 |
| `PLATFORM_CONTRACT_REQUIRED` | 29 |
| `SERVICE_ONLY_NO_UI` | 7 |
| `INTENTIONALLY_NO_UI` | 5 |
| `DEPRECATED_BACKEND_ENDPOINT` | 1 |
| `NOT_USER_FACING` | 3 |

The checked-in, human-reviewable manifest is split by OpenAPI tag under `contracts/frontend-capabilities/`. `npm run api:parity:check` requires an exact classification for every method/path and rejects missing operations, stale operation IDs, duplicates, invalid statuses, and missing declared frontend bindings. The split files collectively are the authoritative complete matrix.

## 3. Confirmed P0 authorization findings

| Finding | Backend evidence | Frontend result | Remediation |
|---|---|---|---|
| ADMIN shortcut | `PermissionsGuard` resolves the effective role/tenant permissions and applies any/all; it has no ADMIN bypass. | `can()` returned true for every permission when `user.role === 'ADMIN'`. | Removed the shortcut. Role fallback arguments remain source-compatible but have no authorization effect. |
| Platform Admin confusion | Platform lifecycle, plan, subscription, platform quota and platform audit controllers use `PlatformAdminGuard`, which verifies persisted `PlatformAuthority.role === PLATFORM_ADMIN`. | `/admin/organizations` was exposed by tenant `organization:manage` or ADMIN role. | Route/menu removed. Platform services remain unbound until a reliable public authority signal exists. `PLATFORM_AUTHORITY_CONTRACT_REQUIRED`. |
| Feature entitlement missing | `SsoAdminController` uses `PermissionsGuard`, `FeatureGuard`, and `@RequireFeature(FeatureKey.SSO)`. | SSO administration was exposed by permission/role only. | SSO admin route/menu fail closed. `GET /entitlements/current` is generic, so no fabricated entitlement decoder was added. `ENTITLEMENT_CONTRACT_INSUFFICIENT`. |
| Auth response drift | `AuthUserResponse` returns teamId/teamCode/teamName/roleId/roleCode/roleName in addition to existing fields. | Login/refresh/passkey/SSO types discarded these fields. | AuthUser aligned to backend source; persisted old users migrate to null/fallback metadata and an empty permission set. |
| Tenant-cache safety | Tenant switch rotates access/refresh context and changes effective permissions. | Login paths cleared cache, but session application was duplicated. | One `applyAuthenticatedSession` path now clears the query cache whenever user or effective organization changes and preserves it for same-tenant refresh. |

Frontend checks improve UX and reduce false exposure; backend guards remain the security boundary.

## 4. Legacy role fallback compatibility audit

The baseline contained 77 `can/canAny/canAll` call sites with fallback role arrays (77 ADMIN, 54 MANAGER, 42 REP and 13 BOARDS mentions). Current backend login/refresh responses always provide effective permissions. There is no backend evidence that role names are an alternative permission policy. The optional arguments are retained temporarily to avoid a broad unrelated source rewrite, but `can()` deliberately ignores them. Old persisted users missing `permissions` migrate to `permissions: []`, never to role-derived grants.

## 5. Route-policy corrections

| Route/capability | Before | After / rationale |
|---|---|---|
| `/companies`, details | authenticated only | `company:view`, matching company reads |
| `/pipeline` | authenticated only | `opportunity:view`, matching runtime pipeline reads |
| `/follow-ups` | authenticated only | any of `follow-up:view` or `activity:view` |
| `/admin/users` | nonexistent broad `user:manage` | `user:view`; mutations separately use create/activate/deactivate/change-role |
| `/admin/exchange-rates` | view/manage plus role fallback | `exchange-rate:view` |
| `/admin/permissions` | read or mutation permissions plus ADMIN | read permissions only (`permission:view`/`role:view`) |
| `/admin/pipeline` | mutation permissions only | view or manage permissions; read-only rendering hides mutations |
| `/admin/organizations` | tenant organization permission/role | removed: platform authority cannot be proven from public AuthUser |
| `/admin/sso-providers` | permission/role only | removed: SSO entitlement response contract is insufficient |

Dashboard remains authenticated because its independent widgets already gate each report/entity query; it is not an authorization wrapper for report data.

## 6. Action-level corrections

- User list requires `user:view`; create, role change, activate, and deactivate controls require their exact backend permissions.
- Company branch reads use `company:view`; all branch mutations use `branch:manage`.
- Company social-channel reads use `company:view`; create/update/delete use `social-channel:manage`.
- Pipeline configuration and transition pages support view-only permissions and hide all mutation controls without the corresponding manage permission.
- Removing the global role shortcut corrects every existing action that already names the proper backend permission without rewriting unrelated component behavior.

## 7. Entitlements and Platform authority

Only SSO is decorated with `@RequireFeature` in the inspected backend. `GET /api/entitlements/current` returns a generic `additionalProperties: true` success payload in the canonical OpenAPI. A typed entitlement store/query would therefore require an invented wire contract, which this fix forbids. SSO tenant-admin navigation is fail-closed until the endpoint has a typed schema. Permission denial and feature-unavailable cannot safely be differentiated client-side until that contract exists.

The public `AuthUserResponse` intentionally contains no `platformAdmin`, `platformRole`, or equivalent reliable authority. Tenant ADMIN, `organization:manage`, role names, email and organization absence are not used as substitutes. All platform lifecycle, plan, subscription, entitlement override, quota administration and platform audit UI is deferred.

## 8. Auth and tenant isolation

Login, refresh, passkey authentication and SSO exchange now share the expanded `AuthUser`. A persisted-state migration supplies safe nullable metadata and empty permissions to old records. `applyAuthenticatedSession` compares `userId + organizationId`, clears all TanStack Query state on a change, stores the new access token and user, and does not clear same-tenant cache on refresh. Logout, failed refresh and explicit auth clearing continue to remove the access token and clear the query cache; refresh tokens remain HttpOnly cookie-owned.

`POST /api/auth/switch-tenant` is generic and no public endpoint returns authorized tenant candidates. No switcher is implemented: `TENANT_SWITCH_CANDIDATES_CONTRACT_REQUIRED` and `BACKEND_OPENAPI_RESPONSE_CONTRACT_REQUIRED` both apply.

## 9. Safely implemented capability: current tenant quota

`GET /api/quota/current` is one of the ten typed operations. The Orval filter now includes tag `Quotas`; the new account route `/account/usage` uses the generated endpoint and schema. It displays server-provided metric/current/hardLimit/softLimit/state values, handles unlimited/unconfigured/inactive states, formats decimal integer strings with BigInt, keeps errors distinct from empty data, and includes loading/retry/malformed-response behavior. No quota policy is calculated in the frontend.

## 10. Deferred capability status

- Organization settings, branding and domains: nine generic operations; `BACKEND_OPENAPI_RESPONSE_CONTRACT_REQUIRED`.
- Tenant RBAC and membership role assignment: seven generic operations; legacy `/permissions` and `/roles` remain separate; `TENANT_RBAC_CONTRACT_INSUFFICIENT`.
- Sessions, account security summary, password change, logout-other-sessions and tenant switching: generic Auth responses; no UI wire types fabricated.
- SAM import: generic result payload; no result summary can be typed safely.
- Entitlements current: generic; blocks SSO entitlement-aware administration.
- Platform lifecycle/plans/subscriptions/overrides/quota/platform audit: public platform-authority signal absent and all success payloads generic.
- Platform organization services/page files are retained for rollback/history but are no longer route- or menu-bound.
- SSO administration service/page files are retained but no longer route- or menu-bound until entitlement typing is available.

## 11. Generated-client phase 2

Fix 000108 generated Companies and Tasks and consumed company list, task list and task delete. This fix adds only the typed Quotas tag and consumes `quotaCurrentGet`. All generic response operations remain manual or unconsumed. Domain/view models are not replaced by wire types where semantics differ. Generated files are never edited manually.

The Windows baseline exposed line-ending-only drift. The drift comparison now treats CRLF/LF as the same text while retaining exact file lists and semantic text comparison. Contract SHA reporting is LF-canonical across operating systems, without forcing a repository-wide generated-file line-ending rewrite.

## 12. API errors

Generated quota traffic uses the shared Axios mutator and existing interceptors. Components use `getApiErrorMessage`; raw Axios responses, headers, tokens, stack traces and internal URLs are not rendered. Existing manual services continue through the same Axios/error envelope boundary.

## 13. Deprecated and non-user-facing operations

`PATCH /api/companies/{id}/stage` is deprecated in backend source and always throws Gone with replacement `/api/opportunities/:id/stage`; application code does not consume it. OpenAPI should mark it deprecated. Health, ready and version endpoints are infrastructure. OIDC/SAML login/callback/ACS/metadata operations are server/browser auth-flow endpoints and intentionally have no application page.

## 14. Backend typed-contract follow-up

Every matrix row marked `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` requires an explicit success response schema before new UI is added. The highest-priority exact operations are:

- `GET /api/entitlements/current`
- `GET/PATCH /api/organization/settings`
- `GET/PATCH /api/organization/branding`
- `GET/POST /api/organization/domains`
- `GET/PATCH /api/organization/domains/{id}`
- `POST /api/organization/domains/{id}/verify`
- `GET /api/auth/sessions`
- `DELETE /api/auth/sessions/{sessionId}`
- `POST /api/auth/switch-tenant`
- `POST /api/import/sam`
- all seven `/api/tenant/roles` and `/api/tenant/memberships/*/role` operations
- all platform lifecycle, plans, subscriptions, entitlement override, quota-administration and platform-audit operations, plus a reliable public platform-authority signal
- typed public auth responses for login, refresh, passkey verification and SSO exchange

## 15. Full operation matrix

`Typed` means the success `data` schema is specific enough for generated consumption; it does not mean existing manual UI is invalid. `Authorization` records the strongest discoverable policy class; exact action permissions for corrected routes/actions are detailed above.

| Status | Method | Path | Operation ID | Tag | Typed | Authorization |
|---|---|---|---|---|---:|---|
| `FULL_UI_SUPPORT` | GET | `/api/activities` | `activitiesGet` | Activities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/activities` | `activitiesPost` | Activities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/activities/{activityId}` | `activitiesPatch` | Activities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/activities/{activityId}/complete` | `activitiesCompletePatch` | Activities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/activities/{activityId}/reschedule` | `activitiesReschedulePatch` | Activities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/activities/follow-ups/due` | `activitiesFollowUpsDueGet` | Activities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/attachments` | `attachmentsGet` | Attachments | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/attachments` | `attachmentsPost` | Attachments | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/attachments/{id}` | `attachmentsDelete` | Attachments | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/attachments/{id}` | `attachmentsGet1` | Attachments | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/attachments/{id}/download` | `attachmentsDownloadGet` | Attachments | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/auth/account/change-password` | `authAccountChangePasswordPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/auth/account/logout-other-sessions` | `authAccountLogoutOtherSessionsPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/auth/account/security` | `authAccountSecurityGet` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/auth/login` | `authLoginPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/auth/logout` | `authLogoutPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/auth/logout-all` | `authLogoutAllPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/auth/refresh` | `authRefreshPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/auth/sessions` | `authSessionsGet` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | DELETE | `/api/auth/sessions/{sessionId}` | `authSessionsDelete` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/auth/switch-tenant` | `authSwitchTenantPost` | Auth | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | GET | `/api/companies` | `companiesGet` | Companies | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/companies` | `companiesPost` | Companies | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/branches` | `companiesBranchesGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/companies/{companyId}/branches` | `companiesBranchesPost` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/companies/{companyId}/branches/{id}` | `companiesBranchesDelete` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/branches/{id}` | `companiesBranchesGet2` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{companyId}/branches/{id}` | `companiesBranchesPatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/call-card` | `companiesCallCardGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PUT | `/api/companies/{companyId}/call-card` | `companiesCallCardPut` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/call-card/suggest` | `companiesCallCardSuggestGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/legal-documents` | `companiesLegalDocumentsGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/companies/{companyId}/legal-documents/{documentId}` | `companiesLegalDocumentsDelete` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{companyId}/legal-documents/{documentId}` | `companiesLegalDocumentsPatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/companies/{companyId}/legal-documents/upload` | `companiesLegalDocumentsUploadPost` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/opportunities` | `companiesOpportunitiesGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/companies/{companyId}/opportunities` | `companiesOpportunitiesPost` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/social-channels` | `companiesSocialChannelsGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/companies/{companyId}/social-channels` | `companiesSocialChannelsPost` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/companies/{companyId}/social-channels/{id}` | `companiesSocialChannelsDelete` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{companyId}/social-channels/{id}` | `companiesSocialChannelsGet2` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{companyId}/social-channels/{id}` | `companiesSocialChannelsPatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/{id}` | `companiesGet1` | Companies | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{id}` | `companiesPatch` | Companies | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{id}/archive` | `companiesArchivePatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{id}/owner` | `companiesOwnerPatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/{id}/restore` | `companiesRestorePatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `DEPRECATED_BACKEND_ENDPOINT` | PATCH | `/api/companies/{id}/stage` | `companiesStagePatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/companies/bulk/owner` | `companiesBulkOwnerPatch` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/options` | `companiesOptionsGet` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/companies/options/{id}` | `companiesOptionsGet2` | Companies | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/dashboard/latest-activities` | `dashboardLatestActivitiesGet` | Dashboard | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/dashboard/summary` | `dashboardSummaryGet` | Dashboard | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/entitlements/current` | `entitlementsCurrentGet` | Entitlements | no | AUTHENTICATED_TENANT |
| `NOT_USER_FACING` | GET | `/api/health` | `healthGet` | Health | no | PUBLIC_INFRASTRUCTURE |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/import/sam` | `importSamPost` | Import | no | PERMISSION:import:sam |
| `FULL_UI_SUPPORT` | GET | `/api/industries` | `industriesGet` | Industries | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/industries` | `industriesPost` | Industries | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/industries/{id}` | `industriesDelete` | Industries | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/industries/{id}` | `industriesGet1` | Industries | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/industries/{id}` | `industriesPatch` | Industries | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/lead-sources` | `leadSourcesGet` | Lead-sources | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/lead-sources` | `leadSourcesPost` | Lead-sources | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/lead-sources/{id}` | `leadSourcesDelete` | Lead-sources | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/lead-sources/{id}` | `leadSourcesPatch` | Lead-sources | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/lookups/{group}` | `lookupsGet` | Lookups | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/lookups/{group}` | `lookupsPost` | Lookups | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/lookups/{group}/{id}` | `lookupsDelete` | Lookups | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/lookups/{group}/{id}` | `lookupsPatch` | Lookups | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/meetings` | `meetingsGet` | Meetings | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/meetings` | `meetingsPost` | Meetings | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/meetings/{id}` | `meetingsGet1` | Meetings | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/meetings/{id}` | `meetingsPatch` | Meetings | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/meetings/{id}/cancel` | `meetingsCancelPatch` | Meetings | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/meetings/{id}/complete` | `meetingsCompletePatch` | Meetings | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/notifications` | `notificationsGet` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/notifications` | `notificationsPost` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/notifications/{id}` | `notificationsDelete` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/notifications/{id}` | `notificationsGet1` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/notifications/{id}/archive` | `notificationsArchivePatch` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/notifications/{id}/read` | `notificationsReadPatch` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/notifications/{id}/unarchive` | `notificationsUnarchivePatch` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/notifications/{id}/unread` | `notificationsUnreadPatch` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/notifications/read-all` | `notificationsReadAllPatch` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/notifications/unread-count` | `notificationsUnreadCountGet` | Notifications | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities` | `opportunitiesGet` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/opportunities` | `opportunitiesPost` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{id}` | `opportunitiesGet1` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{id}` | `opportunitiesPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{id}/archive` | `opportunitiesArchivePatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{id}/owner` | `opportunitiesOwnerPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{id}/restore` | `opportunitiesRestorePatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{id}/stage` | `opportunitiesStagePatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{opportunityId}/commercial-documents` | `opportunitiesCommercialDocumentsGet` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/opportunities/{opportunityId}/commercial-documents` | `opportunitiesCommercialDocumentsPost` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/opportunities/{opportunityId}/commercial-documents/{documentId}` | `opportunitiesCommercialDocumentsDelete` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{opportunityId}/commercial-documents/{documentId}` | `opportunitiesCommercialDocumentsGet2` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{opportunityId}/commercial-documents/{documentId}` | `opportunitiesCommercialDocumentsPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{opportunityId}/commercial-documents/{documentId}/status` | `opportunitiesCommercialDocumentsStatusPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/opportunities/{opportunityId}/commercial-documents/upload` | `opportunitiesCommercialDocumentsUploadPost` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{opportunityId}/line-items` | `opportunitiesLineItemsGet` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/opportunities/{opportunityId}/line-items` | `opportunitiesLineItemsPost` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/opportunities/{opportunityId}/line-items/{lineItemId}` | `opportunitiesLineItemsDelete` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{opportunityId}/line-items/{lineItemId}` | `opportunitiesLineItemsGet2` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{opportunityId}/line-items/{lineItemId}` | `opportunitiesLineItemsPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{opportunityId}/payments` | `opportunitiesPaymentsGet` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/opportunities/{opportunityId}/payments` | `opportunitiesPaymentsPost` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/opportunities/{opportunityId}/payments/{paymentId}` | `opportunitiesPaymentsDelete` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/opportunities/{opportunityId}/payments/{paymentId}` | `opportunitiesPaymentsGet2` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{opportunityId}/payments/{paymentId}` | `opportunitiesPaymentsPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{opportunityId}/payments/{paymentId}/cancel` | `opportunitiesPaymentsCancelPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/opportunities/{opportunityId}/payments/{paymentId}/mark-paid` | `opportunitiesPaymentsMarkPaidPatch` | Opportunities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/organization/branding` | `organizationBrandingGet` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | PATCH | `/api/organization/branding` | `organizationBrandingPatch` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/organization/domains` | `organizationDomainsGet` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/organization/domains` | `organizationDomainsPost` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/organization/domains/{id}` | `organizationDomainsGet2` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | PATCH | `/api/organization/domains/{id}` | `organizationDomainsPatch` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/organization/domains/{id}/verify` | `organizationDomainsVerifyPost` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/organization/settings` | `organizationSettingsGet` | Organization | no | PERMISSION:organization:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | PATCH | `/api/organization/settings` | `organizationSettingsPatch` | Organization | no | PERMISSION:organization:view/manage |
| `FULL_UI_SUPPORT` | GET | `/api/organizations/current` | `organizationsCurrentGet` | Organizations | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/pain-points` | `painPointsGet` | Pain-points | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/pain-points` | `painPointsPost` | Pain-points | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/pain-points/{id}` | `painPointsDelete` | Pain-points | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/pain-points/{id}` | `painPointsGet1` | Pain-points | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/pain-points/{id}` | `painPointsPatch` | Pain-points | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/admin/users/{id}/passkeys` | `adminUsersPasskeysGet` | Passkeys | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | DELETE | `/api/admin/users/{id}/passkeys/{passkeyId}` | `adminUsersPasskeysDelete` | Passkeys | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/auth/passkeys/authentication/options` | `authPasskeysAuthenticationOptionsPost` | Passkeys | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/auth/passkeys/authentication/verify` | `authPasskeysAuthenticationVerifyPost` | Passkeys | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | GET | `/api/me/passkeys` | `mePasskeysGet` | Passkeys | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | DELETE | `/api/me/passkeys/{id}` | `mePasskeysDelete` | Passkeys | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/me/passkeys/registration/options` | `mePasskeysRegistrationOptionsPost` | Passkeys | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/me/passkeys/registration/verify` | `mePasskeysRegistrationVerifyPost` | Passkeys | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | GET | `/api/people` | `peopleGet` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/people` | `peoplePost` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/people/{id}` | `peopleDelete` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{id}` | `peopleGet1` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/people/{id}` | `peoplePatch` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{personId}/contacts` | `peopleContactsGet` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/people/{personId}/contacts` | `peopleContactsPost` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/people/{personId}/contacts/{id}` | `peopleContactsDelete` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{personId}/contacts/{id}` | `peopleContactsGet2` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/people/{personId}/contacts/{id}` | `peopleContactsPatch` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{personId}/education-history` | `peopleEducationHistoryGet` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/people/{personId}/education-history` | `peopleEducationHistoryPost` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/people/{personId}/education-history/{educationId}` | `peopleEducationHistoryDelete` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/people/{personId}/education-history/{educationId}` | `peopleEducationHistoryPatch` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{personId}/employment-history` | `peopleEmploymentHistoryGet` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/people/{personId}/employment-history` | `peopleEmploymentHistoryPost` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/people/{personId}/employment-history/{employmentId}` | `peopleEmploymentHistoryDelete` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/people/{personId}/employment-history/{employmentId}` | `peopleEmploymentHistoryPatch` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/people/{personId}/employment-history/{employmentId}/positions` | `peopleEmploymentHistoryPositionsPost` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/people/{personId}/employment-history/{employmentId}/positions/{positionId}` | `peopleEmploymentHistoryPositionsDelete` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/people/{personId}/employment-history/{employmentId}/positions/{positionId}` | `peopleEmploymentHistoryPositionsPatch` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{personId}/socials` | `peopleSocialsGet` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/people/{personId}/socials` | `peopleSocialsPost` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/people/{personId}/socials/{id}` | `peopleSocialsDelete` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/{personId}/socials/{id}` | `peopleSocialsGet2` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/people/{personId}/socials/{id}` | `peopleSocialsPatch` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/people/directory` | `peopleDirectoryGet` | People | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/permissions` | `permissionsGet` | Permissions | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/permissions` | `permissionsPost` | Permissions | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/permissions/{id}` | `permissionsDelete` | Permissions | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/permissions/{id}` | `permissionsGet1` | Permissions | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/permissions/{id}` | `permissionsPatch` | Permissions | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/persona-library` | `personaLibraryGet` | Persona-library | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/persona-library` | `personaLibraryPost` | Persona-library | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/persona-library/{id}` | `personaLibraryDelete` | Persona-library | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/persona-library/{id}` | `personaLibraryPatch` | Persona-library | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/pipeline/stages` | `pipelineStagesGet` | Pipeline | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/pipeline/transitions` | `pipelineTransitionsGet` | Pipeline | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/audit-logs` | `adminAuditLogsGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/audit-logs/{id}` | `adminAuditLogsGet2` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/audit-logs/export` | `adminAuditLogsExportGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/audit-logs/filter-options` | `adminAuditLogsFilterOptionsGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/audit-logs/summary` | `adminAuditLogsSummaryGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/exchange-rates` | `adminExchangeRatesGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/admin/exchange-rates` | `adminExchangeRatesPost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/exchange-rates/current` | `adminExchangeRatesCurrentGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/organizations` | `adminOrganizationsGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | POST | `/api/admin/organizations` | `adminOrganizationsPost` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/organizations/{id}` | `adminOrganizationsGet2` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/organizations/{id}` | `adminOrganizationsPatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/organizations/{id}/activate` | `adminOrganizationsActivatePatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/organizations/{id}/archive` | `adminOrganizationsArchivePatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/organizations/{id}/onboarding` | `adminOrganizationsOnboardingGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | POST | `/api/admin/organizations/{id}/provision` | `adminOrganizationsProvisionPost` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/organizations/{id}/resume` | `adminOrganizationsResumePatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/organizations/{id}/suspend` | `adminOrganizationsSuspendPatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/organizations/{organizationId}/entitlements` | `adminOrganizationsEntitlementsGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | DELETE | `/api/admin/organizations/{organizationId}/entitlements/{feature}` | `adminOrganizationsEntitlementsDelete` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PUT | `/api/admin/organizations/{organizationId}/entitlements/{feature}` | `adminOrganizationsEntitlementsPut` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/organizations/{organizationId}/quotas` | `adminOrganizationsQuotasGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | DELETE | `/api/admin/organizations/{organizationId}/quotas/{metric}` | `adminOrganizationsQuotasDelete` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PUT | `/api/admin/organizations/{organizationId}/quotas/{metric}` | `adminOrganizationsQuotasPut` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/organizations/{organizationId}/subscription` | `adminOrganizationsSubscriptionGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | POST | `/api/admin/organizations/{organizationId}/subscriptions` | `adminOrganizationsSubscriptionsPost` | Platform Admin | no | PLATFORM_ADMIN |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/admin/permissions` | `adminPermissionsGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | DELETE | `/api/admin/permissions/{action}` | `adminPermissionsDelete` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/admin/permissions/assign` | `adminPermissionsAssignPost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/admin/permissions/bulk-assign` | `adminPermissionsBulkAssignPost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/admin/permissions/bulk-revoke` | `adminPermissionsBulkRevokePost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/admin/permissions/create` | `adminPermissionsCreatePost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/admin/permissions/matrix` | `adminPermissionsMatrixGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | DELETE | `/api/admin/permissions/revoke` | `adminPermissionsRevokeDelete` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/admin/permissions/roles/{role}` | `adminPermissionsRolesGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/admin/permissions/roles/{role}/with-details` | `adminPermissionsRolesWithDetailsGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/pipeline/stages` | `adminPipelineStagesGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/admin/pipeline/stages` | `adminPipelineStagesPost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/admin/pipeline/stages/{id}` | `adminPipelineStagesDelete` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/pipeline/stages/{id}` | `adminPipelineStagesGet3` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/admin/pipeline/stages/{id}` | `adminPipelineStagesPatch` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/admin/pipeline/stages/reorder` | `adminPipelineStagesReorderPatch` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/admin/pipeline/transitions` | `adminPipelineTransitionsGet` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/admin/pipeline/transitions` | `adminPipelineTransitionsPost` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/admin/pipeline/transitions/{id}` | `adminPipelineTransitionsDelete` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/admin/pipeline/transitions/{id}` | `adminPipelineTransitionsPatch` | Platform Admin | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/plans` | `adminPlansGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | POST | `/api/admin/plans` | `adminPlansPost` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/plans/{id}` | `adminPlansPatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PUT | `/api/admin/plans/{id}/features/{feature}` | `adminPlansFeaturesPut` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/plans/{planId}/quotas` | `adminPlansQuotasGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PUT | `/api/admin/plans/{planId}/quotas/{metric}` | `adminPlansQuotasPut` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/platform-audit-logs` | `adminPlatformAuditLogsGet` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/platform-audit-logs/{id}` | `adminPlatformAuditLogsGet2` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | GET | `/api/admin/platform-audit-logs/export` | `adminPlatformAuditLogsExportGet` | Platform Admin | no | PLATFORM_ADMIN |
| `SERVICE_ONLY_NO_UI` | GET | `/api/admin/sso-providers` | `adminSsoProvidersGet` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `SERVICE_ONLY_NO_UI` | POST | `/api/admin/sso-providers` | `adminSsoProvidersPost` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `SERVICE_ONLY_NO_UI` | DELETE | `/api/admin/sso-providers/{id}` | `adminSsoProvidersDelete` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `SERVICE_ONLY_NO_UI` | GET | `/api/admin/sso-providers/{id}` | `adminSsoProvidersGet2` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `SERVICE_ONLY_NO_UI` | PATCH | `/api/admin/sso-providers/{id}` | `adminSsoProvidersPatch` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `SERVICE_ONLY_NO_UI` | PATCH | `/api/admin/sso-providers/{id}/disable` | `adminSsoProvidersDisablePatch` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `SERVICE_ONLY_NO_UI` | POST | `/api/admin/sso-providers/{id}/test-connection` | `adminSsoProvidersTestConnectionPost` | Platform Admin | no | PERMISSION:sso-provider:view/manage + FEATURE:SSO |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/subscriptions/{id}` | `adminSubscriptionsPatch` | Platform Admin | no | PLATFORM_ADMIN |
| `PLATFORM_CONTRACT_REQUIRED` | PATCH | `/api/admin/subscriptions/{id}/status` | `adminSubscriptionsStatusPatch` | Platform Admin | no | PLATFORM_ADMIN |
| `FULL_UI_SUPPORT` | GET | `/api/product-catalog` | `productCatalogGet` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/product-catalog` | `productCatalogPost` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/product-catalog/{id}` | `productCatalogGet1` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/product-catalog/{id}` | `productCatalogPatch` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/product-catalog/{id}/activate` | `productCatalogActivatePatch` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/product-catalog/{id}/deactivate` | `productCatalogDeactivatePatch` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/product-catalog/{id}/price-history` | `productCatalogPriceHistoryGet` | Products | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/quota/current` | `quotaCurrentGet` | Quotas | yes | AUTHENTICATED_TENANT |
| `NOT_USER_FACING` | GET | `/api/ready` | `readyGet` | Ready | no | PUBLIC_INFRASTRUCTURE |
| `FULL_UI_SUPPORT` | GET | `/api/reports/activities` | `reportsActivitiesGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/activities/by-user` | `reportsActivitiesByUserGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/conversion-rates` | `reportsConversionRatesGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/data-quality` | `reportsDataQualityGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/data-quality/issues` | `reportsDataQualityIssuesGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/exchange-rates/impact` | `reportsExchangeRatesImpactGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/exports/{reportKey}` | `reportsExportsGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/filter-options` | `reportsFilterOptionsGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/financial/collections` | `reportsFinancialCollectionsGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/meetings/performance` | `reportsMeetingsPerformanceGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/opportunities/aging` | `reportsOpportunitiesAgingGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/opportunities/forecast` | `reportsOpportunitiesForecastGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/period-comparison` | `reportsPeriodComparisonGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/pipeline-summary` | `reportsPipelineSummaryGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/pipeline/by-owner` | `reportsPipelineByOwnerGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/products/performance` | `reportsProductsPerformanceGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/stage-durations` | `reportsStageDurationsGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/reports/tasks/performance` | `reportsTasksPerformanceGet` | Reports | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/roles` | `rolesGet` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/roles` | `rolesPost` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/roles/{id}` | `rolesDelete` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/roles/{id}` | `rolesGet1` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/roles/{id}` | `rolesPatch` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/roles/{id}/permissions` | `rolesPermissionsGet` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PUT | `/api/roles/{id}/permissions` | `rolesPermissionsPut` | Roles | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `INTENTIONALLY_NO_UI` | GET | `/api/auth/oidc/{providerId}/callback` | `authOidcCallbackGet` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `INTENTIONALLY_NO_UI` | GET | `/api/auth/oidc/{providerId}/login` | `authOidcLoginGet` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `INTENTIONALLY_NO_UI` | POST | `/api/auth/saml/{providerId}/acs` | `authSamlAcsPost` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `INTENTIONALLY_NO_UI` | GET | `/api/auth/saml/{providerId}/login` | `authSamlLoginGet` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `INTENTIONALLY_NO_UI` | GET | `/api/auth/saml/{providerId}/metadata` | `authSamlMetadataGet` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | POST | `/api/auth/sso/exchange` | `authSsoExchangePost` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | GET | `/api/auth/sso/providers` | `authSsoProvidersGet` | SSO | no | PUBLIC_OR_AUTHENTICATED_AUTH_FLOW |
| `FULL_UI_SUPPORT` | GET | `/api/tasks` | `tasksGet` | Tasks | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/tasks` | `tasksPost` | Tasks | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/tasks/{id}` | `tasksDelete` | Tasks | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/tasks/{id}` | `tasksGet1` | Tasks | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/tasks/{id}` | `tasksPatch` | Tasks | yes | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/tasks/{id}/assign` | `tasksAssignPatch` | Tasks | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/tasks/{id}/complete` | `tasksCompletePatch` | Tasks | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/tasks/{id}/reschedule` | `tasksReschedulePatch` | Tasks | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/tasks/{id}/status` | `tasksStatusPatch` | Tasks | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/teams` | `teamsGet` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/teams` | `teamsPost` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/teams/{id}` | `teamsGet1` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/teams/{id}` | `teamsPatch` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/teams/{id}/activate` | `teamsActivatePatch` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/teams/{id}/deactivate` | `teamsDeactivatePatch` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/teams/{id}/members` | `teamsMembersGet` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/teams/{id}/members` | `teamsMembersPost` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/teams/{id}/members/{userId}` | `teamsMembersDelete` | Teams | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | DELETE | `/api/tenant/memberships/{id}/role` | `tenantMembershipsRoleDelete` | Tenant | no | PERMISSION:role:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | PUT | `/api/tenant/memberships/{id}/role` | `tenantMembershipsRolePut` | Tenant | no | PERMISSION:role:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/tenant/roles` | `tenantRolesGet` | Tenant | no | PERMISSION:role:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | POST | `/api/tenant/roles` | `tenantRolesPost` | Tenant | no | PERMISSION:role:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/tenant/roles/{id}` | `tenantRolesGet2` | Tenant | no | PERMISSION:role:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | PATCH | `/api/tenant/roles/{id}` | `tenantRolesPatch` | Tenant | no | PERMISSION:role:view/manage |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | PUT | `/api/tenant/roles/{id}/permissions` | `tenantRolesPermissionsPut` | Tenant | no | PERMISSION:role:view/manage |
| `FULL_UI_SUPPORT` | GET | `/api/universities` | `universitiesGet` | Universities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/universities` | `universitiesPost` | Universities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/universities/{id}` | `universitiesDelete` | Universities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/universities/{id}` | `universitiesGet1` | Universities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/universities/{id}` | `universitiesPatch` | Universities | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/use-cases` | `useCasesGet` | Use-cases | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/use-cases` | `useCasesPost` | Use-cases | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | DELETE | `/api/use-cases/{id}` | `useCasesDelete` | Use-cases | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/use-cases/{id}` | `useCasesGet1` | Use-cases | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/use-cases/{id}` | `useCasesPatch` | Use-cases | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/users` | `usersGet` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | POST | `/api/users` | `usersPost` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/users/{id}` | `usersGet1` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/users/{id}/activate` | `usersActivatePatch` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/users/{id}/deactivate` | `usersDeactivatePatch` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | PATCH | `/api/users/{id}/role` | `usersRolePatch` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/users/assignee-options` | `usersAssigneeOptionsGet` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `FULL_UI_SUPPORT` | GET | `/api/users/owner-options` | `usersOwnerOptionsGet` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `BLOCKED_BY_GENERIC_OPENAPI_RESPONSE` | GET | `/api/users/owner-options/v2` | `usersOwnerOptionsV2Get` | Users | no | BACKEND_CONTROLLER_PERMISSION_POLICY |
| `NOT_USER_FACING` | GET | `/api/version` | `versionGet` | Version | no | PUBLIC_INFRASTRUCTURE |

## 16. Tests and CI

Focused tests cover permission any/all semantics, ADMIN denial, ignored legacy fallback roles, route/menu visibility, platform/SSO route absence, old persisted AuthUser migration, cross-tenant cache clearing, same-tenant refresh preservation, typed quota transport/malformed response, and parity detection for new/stale operations. CI runs contract validation, generated drift, parity check, typecheck, tests/coverage, lint, build and E2E without Production network access.

## 17. Rollback

Revert the single fix 000108-B commit. This restores old role shortcuts/routes and removes quota/parity additions. No backend or database rollback is required. Do not manually edit generated files; regenerate from the canonical contract if only generated output must be reconstructed.

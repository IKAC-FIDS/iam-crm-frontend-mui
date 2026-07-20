# 🚀 IAM CRM Frontend MUI

Frontend application for the **IAM CRM / Sales Process Management System**.

This application provides a Persian, RTL, role-aware user interface for B2B sales operations, including company management, people/contact management, activities, follow-ups, sales pipeline, call cards, reports, admin users, permissions, libraries, and pipeline configuration.

The project is built with **React**, **TypeScript**, **Vite**, **MUI**, **TanStack React Query**, **Zustand**, **Axios**, **React Hook Form**, and **Zod**.

---

## 🔗 Related Repositories

| Repository   | URL                                               |
| ------------ | ------------------------------------------------- |
| **Backend**  | https://github.com/IKAC-FIDS/iam-crm-backend      |
| **Frontend** | https://github.com/IKAC-FIDS/iam-crm-frontend-mui |

The backend must be running before testing the main frontend flows.
The frontend communicates with the backend through the `/api` routes.

---

## 🐳 Frontend Docker Deployment

This project is prepared for production deployment with Docker and Nginx. In production, `VITE_API_URL` is set to `/api`, so browser requests are sent to the same frontend host and the Nginx container proxies `/api/` requests to the backend service in Docker Compose.

Production request flow:

```text
Browser -> http://SERVER_IP:8080/api/... -> Nginx frontend -> http://api:3000/api/...
```

Start the frontend:

```bash
docker compose up -d --build
```

View logs:

```bash
docker logs -f iam-crm-frontend
```

The default frontend port is `8080`. It can be changed through an environment variable:

```bash
FRONTEND_PORT=8081 docker compose up -d --build
```

Important notes:

* `VITE_API_URL=/api` is configured at build time.
* Nginx proxies `/api/` to `api:3000` through Docker's internal resolver at `127.0.0.11`. This prevents Nginx from retaining a stale backend upstream IP after the backend container is recreated.
* The backend service name in Docker Compose must be `api`.
* This Compose configuration connects to the external `iam-crm-backend_default` network. If the backend project name differs on the server, update the network name in `docker-compose.yml` to match the actual backend network.
* Docker builds use `NODE_OPTIONS=--max-old-space-size=4096` to reduce JavaScript heap out-of-memory failures during Vite/TypeScript builds. Adding swap is an operational requirement on servers with limited RAM.
* Passwords, tokens, and secrets must never be committed in the Dockerfile, Nginx configuration, README, or environment files.

---

## 🎯 Project Goal

The goal of this frontend is to provide a production-ready CRM interface for the sales team.

Users can:

* Manage companies and leads
* Manage people, contacts, phone numbers, emails, and social profiles
* Record and manage activities
* Track due follow-ups
* View and operate the sales pipeline
* Create and maintain company Call Cards
* Manage company branches and social channels
* View dashboards and reports
* Manage users and permissions
* Manage libraries and base data
* Configure pipeline stages and transition rules

---

## ✨ Key Features

* **JWT authentication**

  * Persian login page
  * Token persistence
  * Automatic token injection into API requests
  * Automatic logout on unauthorized responses
  * Auth state managed with Zustand
  * Optional usernameless Passkey/WebAuthn login

* **Persian RTL interface**

  * `lang="fa"` and `dir="rtl"`
  * RTL layouts
  * Right-side navigation drawer
  * Persian labels, badges, statuses, and messages
  * Shared Iran province selector

* **Dashboard**

  * Real backend-driven metrics
  * Pipeline, company, conversion, and recent activity metrics
  * Role-aware visibility

* **Companies**

  * Company list with search, filters, and server-side pagination
  * Create, view, and edit company
  * Change stage
  * Change priority
  * Assign owner
  * Archive/restore support when available in backend
  * Loading, empty, and error states

* **Company details**

  * Overview tab
  * People tab
  * Activities tab
  * Call Card tab
  * Branches tab
  * Social Channels tab

* **People and contacts**

  * Create, edit, and delete people
  * Person detail drawer
  * Manage contact methods
  * Manage person social profiles
  * Zod validation
  * Real API integration without fake local data

* **Global People Directory**

  * Protected `/people` route
  * Server-side pagination
  * Search and filters
  * Company, owner, team, department, persona, primary contact, email, and phone filters

* **Activities and follow-ups**

  * Create company activities
  * Timeline view
  * Edit activity
  * Complete follow-up
  * Reschedule follow-up
  * Due follow-up page
  * Automatic query invalidation after mutations

* **Follow-ups**

  * Protected `/follow-ups` route
  * Due follow-up list
  * Summary cards
  * Current-page client-side tabs for all, overdue, today, and future follow-ups
  * Complete and reschedule actions when backend endpoints are available

* **Call Cards**

  * View, create, and edit company Call Cards
  * Select real company people as primary/secondary contacts
  * Manage strategy, opener text, discovery questions, objections, responses, qualification, and follow-up content
  * Backend suggestions preview
  * Apply confirmed suggestions without auto-saving
  * Copy email and LinkedIn message text

* **Company branches**

  * Branch list
  * Create, edit, and delete branch
  * Shared Iran province selector for location
  * Form validation and safe payload cleanup

* **Company social channels**

  * Social channel list
  * Create, edit, and delete company social channels
  * Safe display of valid external links
  * Platform enum support based on backend contract

* **Sales pipeline**

  * Protected `/pipeline` route
  * Horizontal pipeline board
  * Companies grouped by stage
  * Search and priority filter
  * Stage change dialog
  * Backend-driven stage config and transition rules when available

* **Reports**

  * Protected `/reports` route
  * Pipeline summary
  * Conversion rates
  * Stage duration report
  * Activity report
  * Activity report by user
  * Pipeline report by owner
  * Advanced filter panel

* **Admin users**

  * Protected `/admin/users` route
  * User list
  * Create user
  * Change role/team
  * Activate/deactivate user
  * Prevent deactivating the current user

* **Admin permissions**

  * Protected `/admin/permissions` route
  * Create permission
  * Assign/revoke permission
  * Bulk assign/bulk revoke
  * Permission matrix support when backend provides it
  * No fake permission state when backend does not provide current role state

* **Admin libraries**

  * Protected `/admin/libraries` route
  * Industries
  * Lead sources
  * Pain points
  * Use cases
  * Personas
  * Lookup options
  * Uses active catalog options in company and person forms

* **Admin pipeline settings**

  * Protected `/admin/pipeline` route
  * Pipeline stage configuration
  * Transition rule management
  * Stage order, label, color, active status, and terminal status support
  * Allowed transition filtering in stage-change dialogs

---

## 🧱 Tech Stack

| Tool                                        | Purpose                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| **React**                                   | UI framework                                                  |
| **TypeScript**                              | Type safety                                                   |
| **Vite**                                    | Dev server and production build                               |
| **MUI**                                     | UI component library                                          |
| **MUI X Data Grid / Date Pickers / Charts** | Tables, date inputs, and data display                         |
| **React Router**                            | Routing and protected routes                                  |
| **TanStack React Query**                    | Server-state management, caching, mutations, and invalidation |
| **Axios**                                   | API client                                                    |
| **Zustand**                                 | Auth state management                                         |
| **React Hook Form**                         | Form state management                                         |
| **Zod**                                     | Form validation                                               |
| **Sonner**                                  | Toast notifications                                           |
| **Day.js**                                  | Date handling                                                 |

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://localhost:3000/api
```

The shared Axios instance reads `VITE_API_URL`.

If it is not set, the default API base URL is:

```text
http://localhost:3000/api
```

### 3. Start development server

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

### 4. Production build

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### 6. Lint

```bash
npm run lint
```

---

## 🔌 Backend Integration

This frontend is designed to work with the IAM CRM backend:

```text
https://github.com/IKAC-FIDS/iam-crm-backend
```

For local development, the backend should be available at:

```text
http://localhost:3000/api
```

Recommended frontend `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

The shared Axios instance is located at:

```text
src/lib/axios.ts
```

Axios behavior:

* Uses `VITE_API_URL` as `baseURL`
* Automatically adds `Authorization: Bearer <token>`
* Redirects to `/login` on `401`
* Removes invalid token on unauthorized response
* Uses a 30-second timeout

---

## 🔐 Roles and Access Control

The frontend consumes backend roles and permissions.

Main roles:

| Role      | Description                                                                                   |
| --------- | --------------------------------------------------------------------------------------------- |
| `ADMIN`   | Full access to users, permissions, libraries, settings, reports, and operational CRM features |
| `MANAGER` | Team-scoped sales management, reports, owner assignment, and CRM workflows                    |
| `REP`     | Own-company sales operations, people, activities, follow-ups, and Call Cards                  |
| `BOARDS`  | Mostly read/reporting access based on backend permissions                                     |

Permission helper location:

```text
src/features/auth/utils/permissions.ts
```

Access-control behavior:

* Role checks
* Permission checks
* Fallback role-based access
* Conditional route visibility
* Conditional sidebar items
* Conditional action buttons

Frontend visibility is not a replacement for backend authorization. Backend permissions remain the source of truth.

---

## 🧭 Main Routes

| Route                   | Description                                  |
| ----------------------- | -------------------------------------------- |
| `/login`                | Login page                                   |
| `/`                     | Default dashboard route                      |
| `/dashboard`            | Dashboard                                    |
| `/companies`            | Companies list                               |
| `/companies/:companyId` | Company details                              |
| `/people`               | Global people directory                      |
| `/pipeline`             | Sales pipeline board                         |
| `/follow-ups`           | Due follow-ups                               |
| `/reports`              | Reports                                      |
| `/admin/users`          | Admin user management                        |
| `/admin/permissions`    | Admin permission management                  |
| `/admin/libraries`      | Admin libraries and catalogs                 |
| `/admin/audit-logs`     | Admin audit log viewer                        |
| `/admin/pipeline`       | Admin pipeline settings and transition rules |

All operational routes are protected.

---

## 📂 Project Structure

```text
src/
├── app/                         App-level setup
├── assets/                      Static assets
├── components/
│   └── dashboard/               AppNavbar, SideMenu, Header, dashboard widgets
├── features/
│   ├── auth/                    Login, auth service, hooks, permissions
│   ├── dashboard/               Dashboard page
│   ├── companies/               Company list, detail, forms, dialogs, services
│   ├── people/                  People tab, person drawer, directory, contacts, socials
│   ├── activities/              Activities tab, activity form, lifecycle services
│   ├── followUps/               Due follow-ups page and components
│   ├── callCards/               Call Card view, form, suggestions
│   ├── companyBranches/         Company branches CRUD
│   ├── companySocialChannels/   Company social channels CRUD
│   ├── pipeline/                Sales pipeline board
│   ├── pipelineConfig/          Admin pipeline stages and transition rules
│   ├── reports/                 Reports page, filters, report sections
│   ├── catalogs/                Admin libraries and lookup options
│   └── admin/
│       ├── users/               Admin users page
│       └── permissions/         Admin permissions page
├── layouts/                     AuthLayout, MainLayout, DashboardLayout
├── lib/                         Axios instance and query client
├── providers/                   React Query provider
├── routes/                      Router and ProtectedRoute
├── shared/                      Shared components and constants
├── store/                       Zustand stores
├── styles/                      Global styles
├── theme/                       MUI theme and customizations
├── main.tsx
└── index.css
```

---

## 🌐 Frontend API Contract

All paths below are called relative to `VITE_API_URL`.

For example, if:

```env
VITE_API_URL=http://localhost:3000/api
```

then `/companies` becomes:

```text
http://localhost:3000/api/companies
```

---

### Auth

```http
POST /auth/login
POST /auth/passkeys/authentication/options
POST /auth/passkeys/authentication/verify
```

---

### Account Passkeys

```http
GET /me/passkeys
POST /me/passkeys/registration/options
POST /me/passkeys/registration/verify
DELETE /me/passkeys/:id
```

---

### Companies

```http
GET /companies
POST /companies
GET /companies/:id
PATCH /companies/:id
PATCH /companies/:id/stage
PATCH /companies/:id/owner
PATCH /companies/bulk/owner
PATCH /companies/:id/archive
PATCH /companies/:id/restore
```

---

### People

```http
GET /people?companyId=:companyId
GET /people/directory
POST /people
GET /people/:id
PATCH /people/:id
DELETE /people/:id
```

---

### Person Contacts

```http
GET /people/:id/contacts
GET /people/:id/contacts/:contactId
POST /people/:id/contacts
PATCH /people/:id/contacts/:contactId
DELETE /people/:id/contacts/:contactId
```

---

### Person Socials

```http
GET /people/:id/socials
GET /people/:id/socials/:socialId
POST /people/:id/socials
PATCH /people/:id/socials/:socialId
DELETE /people/:id/socials/:socialId
```

---

### Activities and Follow-ups

```http
GET /activities
POST /activities
PATCH /activities/:id
PATCH /activities/:id/complete
PATCH /activities/:id/reschedule
GET /activities/follow-ups/due
```

---

### Call Cards

```http
GET /companies/:id/call-card
PUT /companies/:id/call-card
GET /companies/:id/call-card/suggest
```

---

### Branches

```http
GET /companies/:id/branches
POST /companies/:id/branches
PATCH /companies/:id/branches/:branchId
DELETE /companies/:id/branches/:branchId
```

---

### Company Social Channels

```http
GET /companies/:id/social-channels
POST /companies/:id/social-channels
PATCH /companies/:id/social-channels/:channelId
DELETE /companies/:id/social-channels/:channelId
```

---

### Reports

```http
GET /reports/filter-options
GET /reports/pipeline-summary
GET /reports/conversion-rates
GET /reports/stage-durations
GET /reports/activities
GET /reports/activities/by-user
GET /reports/pipeline/by-owner
```

Report filters are sent as query parameters, including:

```text
startDate
endDate
userIds
teams
ownerIds
stages
priorities
industries
sources
activityTypes
```

---

### Users

```http
GET /users
POST /users
GET /users/:id
PATCH /users/:id/role
PATCH /users/:id/activate
PATCH /users/:id/deactivate
GET /users/owner-options
```

---

### Admin Permissions

```http
GET /admin/permissions
GET /admin/permissions/matrix
GET /admin/permissions/roles/:role
GET /admin/permissions/roles/:role/with-details
POST /admin/permissions/create
POST /admin/permissions/assign
DELETE /admin/permissions/revoke
POST /admin/permissions/bulk-assign
POST /admin/permissions/bulk-revoke
```

---

### Audit Logs

```http
GET /admin/audit-logs
```

---

### Libraries and Catalogs

```http
GET /industries
POST /industries
PATCH /industries/:id
DELETE /industries/:id

GET /lead-sources
POST /lead-sources
PATCH /lead-sources/:id
DELETE /lead-sources/:id

GET /pain-points
POST /pain-points
PATCH /pain-points/:id
DELETE /pain-points/:id

GET /use-cases
POST /use-cases
PATCH /use-cases/:id
DELETE /use-cases/:id

GET /persona-library
POST /persona-library
PATCH /persona-library/:id
DELETE /persona-library/:id

GET /lookups/:group
POST /lookups/:group
PATCH /lookups/:group/:id
DELETE /lookups/:group/:id
```

---

### Pipeline Settings

```http
GET /admin/pipeline/stages
PATCH /admin/pipeline/stages/:stage

GET /admin/pipeline/transitions
POST /admin/pipeline/transitions
PATCH /admin/pipeline/transitions/:id
DELETE /admin/pipeline/transitions/:id
```

---

## 🧪 QA and Verification Status

Based on the recorded fix history:

* Recent fixes passed `npm run lint`.
* Recent fixes passed production build.
* Remaining build warning is related to bundle size and does not block production build.
* Manual QA was performed for ADMIN and REP roles in fix `000021`.
* Some live API tests for newer features require the backend to be running.

---

## ⚠️ Development Notes

* Do not use raw `fetch` inside components.
* Feature API calls should be centralized in feature service files.
* Use the shared Axios instance from `src/lib/axios.ts`.
* Avoid duplicate `/api/api` paths.
* `VITE_API_URL` should already include `/api`.
* Mutations must invalidate related React Query keys.
* Do not add fake data as a substitute for real backend responses.
* If an endpoint is missing, show disabled, empty, or backend-dependency UI instead of fake success state.
* Use React Hook Form and Zod for forms.
* Convert dates to ISO before sending them to the backend.
* Trim and clean optional string fields before submitting payloads.
* Use `null` only when the backend contract expects it for clearing optional values.
* UI permission checks improve UX but do not replace backend authorization.

---

## 📦 Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start Vite development server                  |
| `npm run build`   | Run TypeScript build and Vite production build |
| `npm run lint`    | Run ESLint                                     |
| `npm run preview` | Preview production build                       |

---

## ✅ Current Status

This README documents the frontend status through:

```text
fix 000001 → fix 000093
```

The fix history below documents what changed in each numbered fix.

---

# Fix History

## fix 000001 — Build error fixes and initial dashboard cleanup

**Implemented items:**

* Fixed MUI type imports.
* Aligned Date Picker customization types.
* Removed unused imports.
* Made login error handling type-safe.
* Used `mutateAsync` in the login flow.
* Controlled DataGrid pagination state.
* Enabled the companies route.
* Removed menu items that did not have actual pages.

**Important files:**

* `src/features/auth/hooks/useAuth.ts`
* `src/features/auth/pages/LoginPage.tsx`
* `src/components/dashboard/MainGrid.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `src/theme/customizations/*`
* TypeScript config files

**Assumptions and dependencies:**

* Details were inferred from commit `2bd29cc`.
* No new backend dependency was identifiable in this commit.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000002 — RTL layout and Persian document setup

**Implemented items:**

* Set `lang="fa"` and `dir="rtl"`.
* Applied RTL direction and alignment at document and layout level.
* Moved sidebar navigation to the right side.
* Replaced direction-dependent spacing and borders with logical CSS properties.

**Important files:**

* `index.html`
* `src/main.tsx`
* `src/index.css`
* `src/layouts/DashboardLayout.tsx`
* `src/layouts/MainLayout.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/features/auth/pages/LoginPage.tsx`

**Assumptions and dependencies:**

* Summary is based on commit `95ea7b1`.
* No new backend dependency was identified.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000003 — Responsive dashboard and navigation

**Implemented items:**

* Added temporary mobile drawer and open button.
* Kept permanent drawer on large screens.
* Fixed content spacing below AppBar.
* Made page padding responsive.
* Improved responsive behavior for dashboard cards, activity table, and login form.

**Important files:**

* `src/components/dashboard/AppNavbar.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/components/dashboard/MainGrid.tsx`
* `src/layouts/DashboardLayout.tsx`
* `src/features/auth/pages/LoginPage.tsx`

**Assumptions and dependencies:**

* Summary is based on commit `dbd4298`.
* No new backend dependency was identifiable.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000004 — Company list, detail page, and create flow

**Implemented items:**

* Built companies list with debounced search.
* Added stage, priority, and owner filters.
* Added server-side pagination.
* Added loading/error states.
* Added create company form with Zod validation.
* Built company detail page.
* Defined types, service, and React Query hooks.
* Added company detail route.
* Added cache invalidation after create.

**Important files:**

* `src/features/companies/components/CreateCompanyDialog.tsx`
* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/services/companies.service.ts`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/hooks/useDebouncedValue.ts`
* `src/features/companies/types/company.types.ts`
* `src/routes/index.tsx`

**Assumptions and dependencies:**

* Depends on company list, detail, and create APIs.
* Owner filter options and delete action were disabled in this version.
* Details were extracted from commit `ccc44f2`.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000005 — Company owner from auth and Iran province selector

**Implemented items:**

* Removed manual owner input from company create form.
* Sent the logged-in user ID as `ownerId`.
* Prevented company creation when user info is missing.
* Added `team` to the user model in frontend auth state.
* Added shared Iran province selector.

**Important files:**

* `src/features/companies/components/CreateCompanyDialog.tsx`
* `src/features/auth/services/auth.service.ts`
* `src/store/authStore.ts`
* `src/shared/components/IranProvinceSelect.tsx`
* `src/shared/constants/iranProvinces.ts`

**Assumptions and dependencies:**

* Login response must provide user `id` and `team`.
* Company create API must accept `ownerId`.
* Summary is based on commit `7a0ad88`.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000006 — Company ownership type and province selector

**Implemented items:**

* Defined company ownership enum and Persian labels.
* Added ownership to company type and create payload.
* Displayed ownership in company details.
* Used province selector for company head office location.

**Important files:**

* `src/features/companies/types/company.types.ts`
* `src/features/companies/components/CreateCompanyDialog.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`

**Assumptions and dependencies:**

* Backend must accept ownership values:

  * `PRIVATE`
  * `STATE`
  * `SEMI_STATE`
  * `PUBLIC_LISTED`
  * `BANK`
  * `HOLDING`
* Summary is based on commit `6a0597b`.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000007 — Overview tab and company update actions

**Implemented items:**

* Added company detail tabs.
* Completed overview tab.
* Added company edit form.
* Added change stage dialog.
* Added priority change.
* Added owner assignment to current user.
* Added edit and stage-change mutations.
* Added company data invalidation.

**Important files:**

* `src/features/companies/components/EditCompanyDialog.tsx`
* `src/features/companies/components/ChangeCompanyStageDialog.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/services/companies.service.ts`
* `src/features/companies/types/company.types.ts`

**Assumptions and dependencies:**

* Depends on `PATCH /companies/:id` and `PATCH /companies/:id/stage`.
* Owner assignment was implemented through the generic update route using the current user ID in this version.
* Details were extracted from commit `1b6efd6`.

**Verification status:**

* Lint/build result was not recorded in Git history.

---

## fix 000008 — API, types, permissions, and company owner assignment cleanup

**Implemented items:**

* Completed company module requirements 7–14.
* Changed priority through `PATCH /api/companies/:id`.
* Connected owner assignment to `PATCH /api/companies/:id/owner`.
* Standardized `PaginatedResult<T>`.
* Standardized company types.
* Used `unknown` for relations not yet implemented.
* Added permission helper with role fallbacks.
* Applied permissions for create, edit, stage change, priority change, and owner assignment.
* Added accurate empty and loading-error messages.
* Added list and detail invalidation after mutations.

**Important files:**

* `src/features/auth/utils/permissions.ts`
* `src/features/companies/types/company.types.ts`
* `src/store/authStore.ts`
* Related company service, hook, and UI files

**Assumptions and dependencies:**

* Since users API was not available, no fake users or static owners were added.
* Owner assignment remained disabled.

**Verification status:**

* Lint and build passed.

---

## fix 000009 — Company forms, enums, validation, and mutation flows

**Implemented items:**

* Unified create/edit form in `CompanyForm`.
* Added Zod validation and URL validation.
* Trimmed strings and removed empty values before sending payload.
* Added shared options, labels, and date display helpers.
* Added standalone priority-change dialog.
* Improved stage-change dialog and messages.
* Added Persian badges.
* Cleaned query params.
* Standardized API function names.
* Preserved list/detail invalidation.

**Important files:**

* `src/features/companies/components/CompanyForm.tsx`
* `src/features/companies/components/ChangeCompanyPriorityDialog.tsx`
* `src/features/companies/utils/companyDisplay.ts`
* `src/features/companies/types/company.types.ts`
* Related company page, dialog, service, and hook files

**Assumptions and dependencies:**

* Owner assignment remained disabled because users API was not available.
* Company owner on create is taken from logged-in user.
* Head office location uses province selector.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000010 — Company people tab, contacts, and socials

**Implemented items:**

* Completed company People tab.
* Added list pagination with page sizes 5, 10, and 20.
* Added create, edit, and delete flows with confirmation.
* Added complete person detail drawer.
* Added CRUD for contact methods and social profiles.
* Added shared forms and Zod validation.
* Added Persian options.
* Added role/permission-based access control.
* Added cache invalidation for people, company, contacts, and socials.
* Centralized APIs in dedicated services with no Axios calls inside components.

**Important files:**

* `src/features/people/types/person.types.ts`
* `src/features/people/services/people.service.ts`
* `src/features/people/hooks/usePeople.ts`
* `src/features/people/components/PersonForm.tsx`
* `src/features/people/components/PersonFormDialog.tsx`
* `src/features/people/components/PeopleTab.tsx`
* `src/features/people/components/PersonDetailDrawer.tsx`
* `src/features/people/components/PersonContactForm.tsx`
* `src/features/people/components/PersonSocialForm.tsx`

**Assumptions and dependencies:**

* Backend must support `OTHER` enum value for contact type and social platform.
* Live API testing requires backend to be running.

**Verification status:**

* Lint and production build passed.

---

## fix 000011 — Company activity timeline and activity creation flow

**Implemented items:**

* Completed Activities tab in company details.
* Displayed activities in a responsive timeline.
* Added pagination with page sizes 5, 10, and 20.
* Displayed activity type, related person, creator, notes, outcome, occurred time, next follow-up, and creation date.
* Marked overdue, today, and future follow-ups.
* Added activity creation form with Zod validation.
* Selected real people from the company.
* Converted dates to ISO.
* Displayed `STAGE_CHANGE` without allowing manual creation.
* Added access control.
* Added invalidation for activities and company detail after create.

**Important files:**

* `src/features/activities/types/activity.types.ts`
* `src/features/activities/services/activities.service.ts`
* `src/features/activities/hooks/useActivities.ts`
* `src/features/activities/components/ActivitiesTab.tsx`
* `src/features/activities/components/ActivityForm.tsx`
* `src/features/activities/components/ActivityFormDialog.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`

**Assumptions and dependencies:**

* Depends on `GET /api/activities`, `POST /api/activities`, and company people API.
* Backend must support activity pagination and defined `ActivityType` values.
* No fake data was added.
* Live API testing requires backend to be running.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000012 — Company Call Card tab

**Implemented items:**

* Completed Call Card tab.
* Added loading, empty, and error states.
* Added create/edit Call Card flow.
* Selected primary and secondary contacts from real company people.
* Displayed contacts, strategy, opener texts, discovery questions, objections/responses, qualification, and follow-up sections.
* Managed dynamic questions and objections with Zod.
* Removed empty values.
* Fetched and previewed backend suggestions.
* Applied confirmed suggestions into the form without auto-saving.
* Conservatively merged suggestions with existing data.
* Added copy actions for email and LinkedIn message text.
* Treated `404` or empty response as missing Call Card.
* Added access control.
* Added invalidation for Call Card and company details after save.

**Important files:**

* `src/features/callCards/types/callCard.types.ts`
* `src/features/callCards/services/callCards.service.ts`
* `src/features/callCards/hooks/useCallCards.ts`
* `src/features/callCards/components/CallCardTab.tsx`
* `src/features/callCards/components/CallCardView.tsx`
* `src/features/callCards/components/CallCardForm.tsx`
* `src/features/callCards/components/CallCardFormDialog.tsx`
* `src/features/callCards/components/CallCardSuggestionDialog.tsx`
* `src/features/callCards/utils/callCardDisplay.ts`
* `src/features/companies/pages/CompanyDetailsPage.tsx`

**Assumptions and dependencies:**

* Depends on:

  * `GET /api/companies/:companyId/call-card`
  * `GET /api/companies/:companyId/call-card/suggest`
  * `PUT /api/companies/:companyId/call-card`
  * company people API
* Unknown suggestion fields are kept as `unknown`.
* Suggestions are not generated or auto-saved by frontend.
* Live API testing requires backend to be running.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000013 — Company branch management

**Implemented items:**

* Completed Branches tab in company details.
* Displayed branches in table with name, city, address, phone, and last update.
* Added create, edit, and delete flows with confirmation dialog.
* Added shared create/edit form with Zod.
* Required at least one non-empty field.
* Trimmed strings and removed empty values before sending.
* Added loading, empty, error, success, and pending states.
* Applied view/manage/delete permissions.
* Added invalidation for branches and company details after mutations.

**Important files:**

* `src/features/companyBranches/types/companyBranch.types.ts`
* `src/features/companyBranches/services/companyBranches.service.ts`
* `src/features/companyBranches/hooks/useCompanyBranches.ts`
* `src/features/companyBranches/components/CompanyBranchesTab.tsx`
* `src/features/companyBranches/components/CompanyBranchForm.tsx`
* `src/features/companyBranches/components/CompanyBranchFormDialog.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`

**Assumptions and dependencies:**

* Depends on:

  * `GET /api/companies/:companyId/branches`
  * `POST /api/companies/:companyId/branches`
  * `PATCH /api/companies/:companyId/branches/:branchId`
  * `DELETE /api/companies/:companyId/branches/:branchId`
* Partial but non-empty branch data is allowed.
* No fake data was added.
* Live API testing requires backend to be running.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000014 — Branch location selector aligned with company form

**Implemented items:**

* Replaced free-text branch city input with shared Iran province selector.
* Displayed predefined Iran province list.
* Preserved selected value during edit.
* Disabled selector while submitting.

**Important files:**

* `src/features/companyBranches/components/CompanyBranchForm.tsx`
* `src/shared/components/IranProvinceSelect.tsx`

**Assumptions and dependencies:**

* Payload field name remains `city` for backend compatibility.
* Value is selected from Iran province list.
* No new API or fake data was added.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000015 — Company social channels

**Implemented items:**

* Completed independent Company Social Channels tab.
* Displayed platform, URL/handle, and last update.
* Added create, edit, and delete with confirmation.
* Added shared create/edit form.
* Added platform enum selection.
* Required handle validation with Zod.
* Trimmed values before sending.
* Safely displayed valid links for website, LinkedIn, Instagram, YouTube, and Aparat.
* Added loading, empty, error, success, and pending states.
* Added permission control.
* Added invalidation for channels and company details.

**Important files:**

* `src/features/companySocialChannels/types/companySocialChannel.types.ts`
* `src/features/companySocialChannels/services/companySocialChannels.service.ts`
* `src/features/companySocialChannels/hooks/useCompanySocialChannels.ts`
* `src/features/companySocialChannels/components/CompanySocialChannelsTab.tsx`
* `src/features/companySocialChannels/components/CompanySocialChannelForm.tsx`
* `src/features/companySocialChannels/components/CompanySocialChannelFormDialog.tsx`
* `src/features/companySocialChannels/utils/companySocialChannelDisplay.ts`
* `src/features/companies/pages/CompanyDetailsPage.tsx`

**Assumptions and dependencies:**

* This module is separate from person socials.
* Depends on:

  * `GET /api/companies/:companyId/social-channels`
  * `POST /api/companies/:companyId/social-channels`
  * `PATCH /api/companies/:companyId/social-channels/:channelId`
  * `DELETE /api/companies/:companyId/social-channels/:channelId`
* `OTHER` was not added.
* Handles are not forcibly converted to URLs.
* Live update/delete testing requires backend to be running.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000016 — Sales pipeline page

**Implemented items:**

* Added protected `/pipeline` route.
* Added Pipeline menu item.
* Displayed horizontal board with all sales stages.
* Loaded first 20 companies per stage using cached queries and real company API.
* Added debounced search and priority filter.
* Displayed total count per column.
* Warned about 20-item column limit.
* Added compact company card with details, company link, and stage change action.
* Reused stage-change dialog with success callback.
* Added refresh and invalidation for pipeline, company list, and company detail.
* Added independent loading, empty, and error states per column.

**Important files:**

* `src/features/pipeline/hooks/usePipeline.ts`
* `src/features/pipeline/pages/PipelinePage.tsx`
* `src/features/pipeline/components/PipelineColumn.tsx`
* `src/features/pipeline/components/PipelineCompanyCard.tsx`
* `src/features/companies/components/ChangeCompanyStageDialog.tsx`
* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`

**Assumptions and dependencies:**

* Uses existing `GET /api/companies` and `PATCH /api/companies/:companyId/stage`.
* No new endpoint was added.
* Each stage displays up to 20 companies.
* Search may be ignored until backend supports it.
* Drag-and-drop and per-column pagination were not implemented.

**Verification status:**

* Lint and production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000017 — Due follow-ups page

**Implemented items:**

* Added protected `/follow-ups` route.
* Added Follow-ups menu item.
* Loaded real due follow-ups with pagination.
* Supported page sizes 5, 10, 20, and 50.
* Added summary cards for current page count, overdue items, and today’s items.
* Added current-page client-side filters for all, overdue, today, and future.
* Displayed status, activity type, company, person, creator, notes, outcome, occurred time, and next follow-up time.
* Added links to company detail and person.
* Added refresh while preserving previous data.
* Added loading, empty, error, and permission states.

**Important files:**

* `src/features/followUps/types/followUp.types.ts`
* `src/features/followUps/services/followUps.service.ts`
* `src/features/followUps/hooks/useFollowUps.ts`
* `src/features/followUps/utils/followUpDisplay.ts`
* `src/features/followUps/components/FollowUpsSummaryCards.tsx`
* `src/features/followUps/components/FollowUpCard.tsx`
* `src/features/followUps/pages/FollowUpsPage.tsx`
* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`

**Assumptions and dependencies:**

* Uses only `GET /api/activities/follow-ups/due`.
* Array and paginated responses are normalized.
* Status filters only filter current page data.
* Complete, edit, and delete actions were not implemented due to missing confirmed endpoints at that time.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000018 — Reports and real dashboard metrics

**Implemented items:**

* Added protected `/reports` route.
* Added conditional Reports menu item for allowed roles/permissions.
* Added pipeline summary cards and progress bars.
* Added conversion-rate table.
* Added stage-duration report.
* Added activity report with default 30-day range and date controls.
* Safely normalized numeric and percentage values.
* Added independent error handling per report section and for `403`.
* Replaced sample dashboard data with seven real metrics from companies, conversion, and recent 30-day activities.
* Kept dashboard usable for roles without report access.
* Added refresh for all reports.
* Added shared query caching.

**Important files:**

* `src/features/reports/types/report.types.ts`
* `src/features/reports/services/reports.service.ts`
* `src/features/reports/hooks/useReports.ts`
* `src/features/reports/utils/reportDisplay.ts`
* Reports components and page
* `src/components/dashboard/MainGrid.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`

**Assumptions and dependencies:**

* Depends on:

  * `/api/reports/pipeline-summary`
  * `/api/reports/conversion-rates`
  * `/api/reports/stage-durations`
  * `/api/reports/activities`
* Default activity range is calculated from browser local date.
* Export, drill-down, and new chart dependencies were not added.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000019 — Safe preparation for activity edit and follow-up reschedule

**Implemented items:**

* Audited Activities and Follow-ups services, hooks, and components for update, reschedule, and complete endpoints.
* Added disabled edit action to activity items for permitted users.
* Added disabled reschedule action next to the existing follow-up action.
* Corrected the follow-up completion action label to the Persian equivalent of “Completed”.
* Explicitly avoided local mutation or guessed endpoints.

**Important files:**

* `src/features/activities/components/ActivitiesTab.tsx`
* `src/features/followUps/components/FollowUpCard.tsx`
* Existing activity and follow-up services/hooks were reviewed.

**Assumptions and dependencies:**

* At that time, no confirmed endpoint existed for:

  * `PATCH /api/activities/:activityId`
  * reschedule
  * complete
* Because the repository was frontend-only, edit/reschedule/complete remained intentionally disabled.
* After real endpoints were added, mutations and invalidation should be implemented.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000020 — Admin users, permissions, and owner assignment

**Implemented items:**

* Added `/admin/users` and `/admin/permissions` routes.
* Added conditional Admin menu.
* Implemented real users list, create, role/team change, activate, and deactivate flows.
* Prevented deactivating the current user.
* Supported `isActive` and `active`.
* Implemented permission assign, revoke, bulk assign, bulk revoke, and create actions.
* Used correct DELETE request body handling.
* Clearly showed missing role-permission state endpoint instead of faking a matrix.
* Hardened permission helper with ADMIN access.
* Added `canAny` and `canAll`.
* Enabled company owner assignment using real active REP/MANAGER users.

**Important files:**

* `src/features/admin/users`
* `src/features/admin/permissions`
* `src/features/auth/utils/permissions.ts`
* `src/features/companies/components/ChangeCompanyOwnerDialog.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`

**Assumptions and dependencies:**

* Depends on `/api/users` and `/api/admin/permissions/*`.
* Backend did not provide role permission state listing, so current role state was not faked.
* `team` is required for MANAGER and REP in frontend.
* Owner assignment only shows active REP/MANAGER users.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000021 — Stabilization, QA, and API contract cleanup

**Implemented items:**

* Audited protected routes, services, query keys, permissions, and response normalizers.
* Added pipeline and report invalidation after company mutations.
* Refreshed follow-ups and reports after activity creation.
* Invalidated owner options after user mutations.
* Hardened report response handling for missing arrays or summaries.
* Verified no raw `fetch`, duplicated base URL, or `/api/api` path.
* Ran manual QA with ADMIN and REP roles.
* Checked direct route access, conditional menu, company details, and owner assignment.

**Important files:**

* `src/features/companies/hooks/useCompanies.ts`
* `src/features/activities/hooks/useActivities.ts`
* `src/features/admin/users/hooks/useAdminUsers.ts`
* `src/features/reports/services/reports.service.ts`
* `README.md`

**Assumptions and limitations:**

* Activity update, complete, and reschedule endpoints were not yet confirmed as executable in frontend.
* Related actions remained disabled without fake success.
* Role permission-state endpoint and final bulk-owner payload contract were not available.
* Permission state or bulk-owner contract was not guessed.

**Verification status:**

* ADMIN and REP login succeeded in local QA.
* Dashboard, companies, company detail, pipeline, follow-ups, reports, and Admin rendered according to roles.
* No console error was observed.
* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## Frontend API Contract Checklist

All paths below are called relative to the shared Axios `baseURL`, which includes `/api`.

**Companies:**

* `GET /companies`
* `POST /companies`
* `GET /companies/:id`
* `PATCH /companies/:id`
* `PATCH /companies/:id/stage`
* `PATCH /companies/:id/owner`

**People:**

* `GET /people`
* `POST /people`
* `GET /people/:id`
* `PATCH /people/:id`
* `DELETE /people/:id`
* CRUD under `/people/:id/contacts`
* CRUD under `/people/:id/socials`
* Global people list accepts filters and pagination through query parameters.

**Activities:**

* `GET /activities`
* `POST /activities`
* `PATCH /activities/:id`
* `PATCH /activities/:id/complete`
* `PATCH /activities/:id/reschedule`
* `GET /activities/follow-ups/due`

**Call Card:**

* `GET /companies/:id/call-card`
* `PUT /companies/:id/call-card`
* `GET /companies/:id/call-card/suggest`

**Branches and social channels:**

* CRUD under `/companies/:id/branches`
* CRUD under `/companies/:id/social-channels`

**Reports:**

* `GET /reports/filter-options`
* `GET /reports/pipeline-summary`
* `GET /reports/conversion-rates`
* `GET /reports/stage-durations`
* `GET /reports/activities`
* `GET /reports/activities/by-user`
* `GET /reports/pipeline/by-owner`
* Report filters are sent as query parameters.

**Users:**

* `GET /users`
* `POST /users`
* `GET /users/:id`
* role, activate, and deactivate PATCH routes

**Permissions:**

* assign, bulk-assign, and create use POST routes.
* revoke and bulk-revoke use DELETE routes with body as `{ data: payload }` where required by Axios/client behavior.

**Libraries:**

* Standard CRUD with:

  * `/industries`
  * `/lead-sources`
  * `/pain-points`
  * `/use-cases`
  * `/persona-library`
  * `/lookups/:group`

**Pipeline settings:**

* `GET /admin/pipeline/stages`
* `PATCH /admin/pipeline/stages/:stage`
* CRUD for transition rules under `/admin/pipeline/transitions`

---

## fix 000022 — Connect activity and follow-up lifecycle to backend

**Implemented items:**

* Enabled activity editing for permitted roles/users.
* Reused shared create/edit activity form.
* Initialized person, type, dates, notes, and outcome.
* Locked `STAGE_CHANGE` activity type.
* Connected `PATCH /api/activities/:id`.
* Enabled follow-up completion with outcome/note dialog.
* Enabled rescheduling with future-date validation.
* Connected complete and reschedule endpoints.
* Added automatic invalidation for Activities, Follow-ups, Company Detail, Reports, and Dashboard after mutations.

**Important files:**

* Activity and Follow-up types/services/hooks
* `ActivityForm.tsx`
* `EditActivityDialog.tsx`
* `ActivitiesTab.tsx`
* `CompleteFollowUpDialog.tsx`
* `RescheduleFollowUpDialog.tsx`
* `FollowUpCard.tsx`

**Assumptions and dependencies:**

* Backend supports:

  * `PATCH /api/activities/:activityId`
  * `PATCH /api/activities/:activityId/complete`
  * `PATCH /api/activities/:activityId/reschedule`
* Optional edit fields are cleared with `null`.
* Dates are converted to ISO.
* No fake local completion or reschedule state is used.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000023 — Advanced filters and detailed reports

**Implemented items:**

* Added unified report filter panel.
* Added date range filter.
* Added multi-select filters for users, teams, owners, pipeline stages, priorities, industries, lead sources, and activity types.
* Loaded filter options from backend.
* Applied filters to pipeline summary, conversion rates, stage durations, and activities.
* Dashboard uses the shared filter contract with default 30-day range.
* Added activity-by-user table.
* Added pipeline-by-owner table with stage breakdown.
* Added loading, empty, error, refresh, clear-filter, and date-range validation states.

**Important files:**

* `src/features/reports/types/report.types.ts`
* `src/features/reports/services/reports.service.ts`
* `src/features/reports/hooks/useReports.ts`
* `src/features/reports/components/ReportFilterPanel.tsx`
* `src/features/reports/components/ActivityReportSection.tsx`
* `src/features/reports/components/ActivityByUserSection.tsx`
* `src/features/reports/components/PipelineByOwnerSection.tsx`
* `src/features/reports/pages/ReportsPage.tsx`
* `src/components/dashboard/MainGrid.tsx`
* `README.md`

**Assumptions and dependencies:**

* Depends on:

  * `GET /api/reports/filter-options`
  * existing four report endpoints
  * `GET /api/reports/activities/by-user`
  * `GET /api/reports/pipeline/by-owner`
* Query keys include:

  * `startDate`
  * `endDate`
  * `userIds`
  * `teams`
  * `ownerIds`
  * `stages`
  * `priorities`
  * `industries`
  * `sources` (mapped from frontend `leadSources`)
  * `activityTypes`
* Backend options are normalized from simple values or objects containing `value`, `id`, `code`, or `name`.
* Live API testing requires backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000024 — Libraries and base data management

**Implemented items:**

* Added protected `/admin/libraries` route.
* Added Libraries menu item under Admin.
* Created six tabs:

  * Industries
  * Lead Sources
  * Pain Points
  * Use Cases
  * Personas
  * Lookup Options
* Implemented list, create, edit, activate/deactivate through edit, and delete flows with real APIs.
* Added loading, empty, and error states.
* Replaced company industry and lead source text inputs with dropdowns containing active items only.
* Replaced person department and persona fields with active lookup options.
* Added no default or fake catalog data.

**Important files:**

* New `src/features/catalogs` feature:

  * types
  * service
  * hooks
  * dialogs
  * tabs
  * admin page
* `src/features/companies/components/CompanyForm.tsx`
* `src/features/people/components/PersonForm.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `README.md`

**Assumptions and dependencies:**

* Frontend contract uses:

  * `GET/POST /api/industries`
  * `GET/POST /api/lead-sources`
  * `GET/POST /api/pain-points`
  * `GET/POST /api/use-cases`
  * `GET/POST /api/persona-library`
  * `GET/POST /api/lookups/:group`
  * `PATCH/DELETE /api/:resource/:id`
* Generic library payload includes:

  * `name`
  * `description`
  * `isActive`
* Lookup option payload includes:

  * `label`
  * `value`
  * `category`
  * `description`
  * `isActive`
* `department` and `personaTag` use lookup options.
* `seniorityLevel` was not added because it is not currently present in the Person type/payload.
* Live CRUD testing requires backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000025 — Pipeline stages and transition rules settings

**Implemented items:**

* Added protected `/admin/pipeline` route.
* Added Pipeline Settings menu item under Admin.
* Created Stages and Transition Rules tabs.
* Displayed and edited:

  * label
  * description
  * display order
  * color
  * active status
  * terminal-stage status
* Listed, created, edited, and deleted transition rules.
* Transition rules include:

  * from stage
  * to stage
  * role
  * allowed/blocked status
* Pipeline board now uses backend-provided stage order, labels, active stages, and colors.
* Stage-change dialog limits destination stages based on allowed backend rules for current stage and user role.
* Real backend error is shown for invalid transitions.

**Important files:**

* New `src/features/pipelineConfig` feature:

  * types
  * service
  * hooks
  * dialogs
  * tabs
  * admin page
* `src/features/pipeline/hooks/usePipeline.ts`
* `src/features/pipeline/pages/PipelinePage.tsx`
* `src/features/pipeline/components/PipelineColumn.tsx`
* `src/features/companies/components/ChangeCompanyStageDialog.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `README.md`

**Assumptions and dependencies:**

* Frontend contract depends on:

  * `GET/PATCH /api/admin/pipeline/stages`
  * `GET/POST/PATCH/DELETE /api/admin/pipeline/transitions`
* Stage code must match the current company stage enum.
* Unknown or inactive stages are not displayed on the board.
* Destination stages are extracted only from `allowed=true` rules matching `fromStage` and user role.
* No local/fake permission is created when rule fetching fails.
* Live settings and transition testing requires backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000026 — Global People Directory

**Implemented items:**

* Added protected `/people` route.
* Added People menu item for allowed roles/permissions.
* Created global people table with:

  * name
  * title
  * department
  * persona
  * primary contact
  * company
  * owner
  * contact summary
  * actions
* Added server-side pagination with page sizes 5, 10, 20, and 50.
* Added debounced search.
* Added company filter with live company search.
* Added owner and team filters from backend report options.
* Added department and persona filters from lookup options.
* Added filters for primary contact, has email, and has phone.
* Added view company action.
* Reused existing person drawer.
* Displayed `—` for missing values.
* Added loading, empty, and error states.

**Important files:**

* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `src/features/people/types/person.types.ts`
* `src/features/people/services/people.service.ts`
* `src/features/people/hooks/usePeople.ts`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `README.md`

**Assumptions and dependencies:**

* Directory uses real `GET /api/people` with query params:

  * `page`
  * `limit`
  * `search`
  * `companyId`
  * `ownerId`
  * `team`
  * `department`
  * `personaTag`
  * `isPrimaryContact`
  * `hasEmail`
  * `hasPhone`
* Person response may include company and owner relations.
* Person response may include `emailSummary` and `phoneSummary`.
* If summaries are missing, frontend falls back to `email`, `phone`, and `contacts`.
* Company options come from `GET /api/companies`.
* Owner/team options come from `/api/reports/filter-options`.
* Lookup options come from `/api/lookups/departments` and `/api/lookups/persona-tags`.
* Live filter and scope testing requires backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000027 — Owner assignment and users polish

**Implemented items:**

* Replaced the generic users request in company owner assignment with `GET /api/users/owner-options`.
* Added an independent owner-options service method, React Query hook, and cache invalidation.
* Restricted assignable owners to active `REP` and `MANAGER` users.
* Excluded `ADMIN`, `BOARDS`, and inactive users even if they are returned unexpectedly.
* Preserved manager owner assignment when the backend includes the manager in owner options.
* Added Admin Users filters for search, role, team, and active/inactive status.
* Search matches user name, email, and team.
* Team options are derived from the real users response without fake values.
* Added a filtered empty state to the users table.

**Important files:**

* `src/features/admin/users/services/adminUsers.service.ts`
* `src/features/admin/users/hooks/useAdminUsers.ts`
* `src/features/admin/users/components/AdminUsersPage.tsx`
* `src/features/companies/components/ChangeCompanyOwnerDialog.tsx`
* `README.md`

**Assumptions and dependencies:**

* Owner assignment depends on `GET /api/users/owner-options` returning eligible user records with role and active-status fields.
* The frontend applies a defensive active `REP`/`MANAGER` filter and does not add fallback or fake owners.
* Admin user filters operate client-side over the existing real, non-paginated `GET /api/users` response.
* Live owner assignment and backend authorization testing requires the backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000028 — Permission matrix cleanup

**Implemented items:**

* Replaced the unavailable-state notice and hardcoded permission action controls with the real permission matrix.
* Added `GET /api/admin/permissions/matrix` service and React Query integration.
* Rendered permission actions as rows and `ADMIN`, `MANAGER`, `REP`, and `BOARDS` as columns.
* Displayed assigned and unassigned state with interactive checkboxes derived only from backend data.
* Connected unassigned cell toggles to `POST /api/admin/permissions/assign`.
* Connected assigned cell toggles to `POST /api/admin/permissions/bulk-revoke` with one selected action.
* Preserved bulk assign and bulk revoke for actions selected directly from the real matrix.
* Preserved permission creation and refreshes the matrix after every successful mutation.
* Added loading, empty, and error states without synthesizing permission assignments.

**Important files:**

* `src/features/admin/permissions/types/adminPermission.types.ts`
* `src/features/admin/permissions/services/adminPermissions.service.ts`
* `src/features/admin/permissions/hooks/useAdminPermissions.ts`
* `src/features/admin/permissions/components/AdminPermissionsPage.tsx`
* `README.md`

**Assumptions and dependencies:**

* Matrix state depends on `GET /api/admin/permissions/matrix` and accepts row arrays, a `matrix` envelope, a `permissions` envelope, or role-keyed permission arrays.
* Matrix rows may expose assignments as role arrays, `assignedRoles`, `assignments`, or direct role boolean fields; all are normalized without adding known actions locally.
* Bulk revoke uses `POST /api/admin/permissions/bulk-revoke` with `{ role, actions }`, matching the current documented backend route.
* Live assign, revoke, and matrix refresh testing requires the backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000029 — Company archive and restore

**Implemented items:**

* Removed the disabled company delete action from the companies list.
* Added archive actions to the companies list and company detail page.
* Added an archive confirmation dialog with a required archive reason.
* Connected archive to `PATCH /api/companies/:id/archive`.
* Added active, archived, and all filters to the companies list.
* Defaulted every company list query, including pipeline consumers, to active companies.
* Added restore actions for archived companies in list and detail views.
* Added restore confirmation and connected it to `PATCH /api/companies/:id/restore`.
* Added archived status, archive date, and archive reason display where available.
* Disabled normal edit, owner, priority, and stage actions while a company is archived.
* Invalidated company, pipeline, and report caches after archive and restore.

**Important files:**

* `src/features/companies/types/company.types.ts`
* `src/features/companies/services/companies.service.ts`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/components/ArchiveCompanyDialog.tsx`
* `src/features/companies/components/RestoreCompanyDialog.tsx`
* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `README.md`

**Assumptions and dependencies:**

* Archive uses `{ reason }` with `PATCH /api/companies/:companyId/archive`.
* Restore uses `PATCH /api/companies/:companyId/restore` without a request body.
* UI state `archiveStatus` is frontend-only; `ACTIVE` sends no archive query, `ALL` sends `includeArchived=true`, and `ARCHIVED` sends `archivedOnly=true`.
* Company responses identify archive state through `isArchived`, `archived`, or `archivedAt`, and may return `archiveReason`.
* Live archive, restore, and archived-filter testing requires the backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000030 — Audit log

**Implemented items:**

* Added the protected `/admin/audit-logs` route and a Persian-language Audit Logs navigation item.
* Added a dedicated audit-log type, service, React Query hook, and page.
* Loaded audit events from real `GET /api/admin/audit-logs` with server-side pagination.
* Added actor, entity type, entity ID, action, and date-range filters.
* Populated the actor filter from the real users endpoint without fake users.
* Added date, actor, action, entity type, entity ID, and metadata columns.
* Added loading, empty, error, and invalid-date-range states.
* Safely displayed metadata as escaped preformatted text, with JSON parsing used only for readable formatting.
* Supported direct and paginated `data` or `items` response envelopes.

**Important files:**

* `src/features/auditLogs/types/auditLog.types.ts`
* `src/features/auditLogs/services/auditLogs.service.ts`
* `src/features/auditLogs/hooks/useAuditLogs.ts`
* `src/features/auditLogs/pages/AuditLogsPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `README.md`

**Assumptions and dependencies:**

* Audit logs use `GET /api/admin/audit-logs` with `page`, `limit`, `actorId`, `entityType`, `entityId`, `action`, `startDate`, and `endDate` query parameters.
* Audit records may use `createdAt` or `timestamp`, nested `actor`, `actorName`, or `actorId`, and arbitrary JSON-compatible metadata.
* Access uses `audit-log:view` with ADMIN fallback.
* Live filters, pagination, access scope, and response-shape testing requires the backend to be running and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000031 — Navigation return-state support

**Implemented items:**

* Added React Router navigation state when opening Company Detail from the Companies list.
* Added `backTo: '/companies'` and a Persian-language “Back to Companies” label for Companies navigation.
* Added return state to both company and person actions in Follow-up cards.
* Added `backTo: '/follow-ups'` and a Persian-language “Back to Follow-ups” label for Follow-ups navigation.
* Added return state when opening Company Detail from Pipeline cards.
* Added `backTo: '/pipeline'` and a Persian-language “Back to Pipeline” label for Pipeline navigation.
* Updated Company Detail to read typed location state for its back destination and label.
* Preserved `/companies` and a Persian-language “Back to Companies” label as the fallback for direct URL access or missing state.
* Applied the same fallback behavior to the Company Detail error-state back button.

**Important files:**

* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/followUps/components/FollowUpCard.tsx`
* `src/features/pipeline/components/PipelineCompanyCard.tsx`
* `README.md`

**Assumptions and dependencies:**

* Return destinations are internal React Router paths passed through location state.
* This fix has no backend or API dependency.
* Browser-level live navigation testing was not performed; behavior was verified through typed route usage, lint, and production build.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000032 — Restore shared lib files and verify API infrastructure

**Implemented items:**

* Inspected the current repository, Git history, and clean working tree before verification.
* Confirmed `src/lib/axios.ts` already exists and is the single shared Axios instance.
* Confirmed Axios uses `import.meta.env.VITE_API_URL` with `http://localhost:3000/api` fallback.
* Confirmed the 30-second timeout, JSON content type, bearer token request interceptor, and 401 token cleanup/login redirect.
* Confirmed `src/lib/queryClient.ts` already exists with five-minute stale time, one query retry, disabled window-focus refetch, and zero mutation retries.
* Confirmed the shared QueryClient is mounted through `QueryProvider` at the application root.
* Verified all `@/lib/axios` and `@/lib/queryClient` imports resolve successfully.
* Verified matching `@/*` aliases in TypeScript and Vite configuration.
* Confirmed no duplicate Axios instance or raw feature-component API replacement was introduced.

**Important files verified:**

* `src/lib/axios.ts`
* `src/lib/queryClient.ts`
* `src/providers/QueryProvider.tsx`
* `src/app/App.tsx`
* `tsconfig.app.json`
* `tsconfig.json`
* `vite.config.ts`
* `README.md`

**Assumptions and dependencies:**

* Both requested shared library files were already present and matched the requested behavior, so they were not rewritten or duplicated.
* No API paths or feature services were changed because lint and build exposed no infrastructure errors.
* This was a local infrastructure verification; no live backend request was required or performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed and confirmed alias resolution.
* Only a non-blocking bundle-size warning remained.

---

## fix 000033 — Pipeline config API contract cleanup

**Implemented items:**

* Updated stage configuration reads to `GET /api/admin/pipeline/stages`.
* Updated stage writes to `PATCH /api/admin/pipeline/stages/:stage`.
* Changed stage updates to use the normalized stage enum in the URL instead of the database ID.
* Updated transition reads to `GET /api/admin/pipeline/transitions`.
* Updated transition create, update, and delete calls to `/api/admin/pipeline/transitions` and `/:id`.
* Added stage response normalization from backend `stage` to frontend `code`, with normalized labels, descriptions, ordering, colors, active state, and terminal state.
* Added transition response normalization from backend `isAllowed` to frontend `allowed`.
* Mapped frontend transition writes from `allowed` to backend `isAllowed`.
* Preserved existing Pipeline board filtering so only active, recognized company-stage enums render.
* Preserved the stage-change dialog behavior without local fallback configuration.
* Updated the README API reference and earlier pipeline contract notes to the corrected backend routes.

**Important files:**

* `src/features/pipelineConfig/services/pipelineConfig.service.ts`
* `src/features/pipelineConfig/hooks/usePipelineConfig.ts`
* `src/features/pipelineConfig/components/StageConfigDialog.tsx`
* Pipeline and stage-change consumers were inspected and required no direct contract changes.
* `README.md`

**Assumptions and dependencies:**

* The backend stage response uses `stage`; `code` remains accepted only as the explicitly requested safe response fallback.
* The backend transition response uses `isAllowed`, and transition write payloads send `isAllowed`.
* No local pipeline configuration is created when backend requests fail.
* Live `/admin/pipeline`, `/pipeline`, and company stage-change dialog testing requires a running backend and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000034 — Reports, follow-up and permission contract cleanup

**Implemented items:**

* Mapped the frontend Reports `leadSources` filter to the backend `sources` query parameter.
* Removed `leadSources` from all outgoing report request parameters.
* Normalized Pipeline by Owner backend `stages` into frontend `stageBreakdown` in the report service.
* Preserved an existing `stageBreakdown` response when already present.
* Mapped follow-up completion UI `note` to backend `completionNote` while preserving `outcome`.
* Replaced `catalog:manage` with the supported granular library and lookup permission keys.
* Restricted each Libraries tab to its corresponding permission while preserving ADMIN access.
* Replaced `pipeline:manage` with `pipeline:config:manage` and `pipeline:transition:manage`.
* Restricted Pipeline Settings tabs to their corresponding permissions while preserving ADMIN access.
* Updated People Directory access to prefer `people:directory:view` alongside the existing `person:view` and role fallbacks.
* Updated side-menu visibility to use the same supported permission checks.

**Important files:**

* `src/features/reports/services/reports.service.ts`
* `src/features/followUps/services/followUps.service.ts`
* `src/components/dashboard/SideMenu.tsx`
* `src/features/catalogs/pages/AdminLibrariesPage.tsx`
* `src/features/pipelineConfig/pages/AdminPipelinePage.tsx`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `README.md`

**Assumptions and dependencies:**

* Reports APIs accept `sources`, not `leadSources`.
* Pipeline by Owner returns stage data under `stages` when `stageBreakdown` is absent.
* Follow-up completion accepts `{ outcome, completionNote }`.
* Permission checks use only the backend-supported keys supplied for libraries, pipeline settings, and the people directory.
* ADMIN fallback remains active through the existing permission helper.
* Live menu/route testing for ADMIN, MANAGER, REP, and BOARDS requires a running backend and authenticated role sessions and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---

## fix 000035 — Catalogs and libraries API alignment

**Implemented items:**

* Verified catalog controllers, DTOs, services, Prisma models, and lookup groups directly from the local backend repository.
* Kept Industries on `/api/industries` and mapped writes to `name` and optional `description` only.
* Kept Lead Sources on `/api/lead-sources` and mapped writes to `code`, `name`, optional `description`, `isActive`, and `sortOrder`.
* Kept Pain Points on `/api/pain-points` and mapped writes to `title`, optional `description`, and optional `category`.
* Kept Use Cases on `/api/use-cases` with the same verified title/description/category DTO mapping.
* Changed Persona Library from `/api/personas` to `/api/persona-library` and mapped `titlePattern`, `defaultPainPoint`, `defaultUseCase`, and `notes`.
* Replaced `/api/lookup-options` with group-based `/api/lookups/:group` CRUD routes.
* Added all backend-accepted lookup groups: `teams`, `departments`, `seniority-levels`, `persona-tags`, `contact-types`, `person-social-platforms`, and `company-sources`.
* Added a lookup-group selector to the Admin Libraries lookup tab.
* Replaced the generic catalog write payload with explicit resource-specific DTO mappers.
* Normalized heterogeneous backend responses into frontend `id`, `label`, `value`, `description`, and `isActive` option fields after receipt.
* Loaded both active and inactive Lead Source/Lookup records in Admin by issuing the backend-supported active-state queries separately.
* Kept Company Industry and Lead Source dropdowns limited to active backend records; Lead Source submits its backend code.
* Changed Person department and persona-tag fields to `/api/lookups/departments` and `/api/lookups/persona-tags`.
* Updated People Directory filters to the same verified group routes.
* Added no fallback or fake catalog values.

**Important files:**

* `src/features/catalogs/types/catalog.types.ts`
* `src/features/catalogs/services/catalogs.service.ts`
* `src/features/catalogs/hooks/useCatalogs.ts`
* `src/features/catalogs/components/CatalogItemDialog.tsx`
* `src/features/catalogs/components/CatalogTab.tsx`
* `src/features/companies/components/CompanyForm.tsx`
* `src/features/people/components/PersonForm.tsx`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `README.md`

**Assumptions and dependencies:**

* Backend contracts were verified from `E:/nodejs/iam-crm-backend`; no DTO fields or lookup groups were inferred.
* Backend Lead Source and Lookup list endpoints filter by a boolean `active` query, so Admin combines `active=true` and `active=false` results to manage both states.
* Industry relationship fields (`painPointIds`, `useCaseIds`) are valid backend fields but are not exposed by the current frontend form and are therefore not sent.
* Live Admin Libraries and company/person form testing requires a running backend and was not performed.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* Only a non-blocking bundle-size warning remained.

---
## fix 000036 — Connect Global People Directory to backend contract

**Implemented items:**

* Connected the global `/people` page to `GET /api/people/directory` instead of calling `GET /api/people` without `companyId`.
* Sent `page`, `limit`, `search`, `companyId`, `ownerId`, `team`, `department`, `personaTag`, `isPrimaryContact`, `hasEmail`, and `hasPhone` filters to the directory endpoint.
* Normalized the paginated `{ data, meta }` response into the existing directory table model, including company, owner, contacts, socials, and backend-provided email/phone summaries.
* Restricted page access and the People side-menu item to `people:directory:view`, while preserving the internal `ADMIN` role fallback in the permission helper.
* Kept the company-scoped `GET /api/people?companyId=...` endpoint and the People tab in Company Details unchanged.
* Filter options are still loaded from the real Companies, Reports, and Department/Persona lookup endpoints. No fake data was added.

**Important files:**

* `src/features/people/services/people.service.ts`
* `src/features/people/types/person.types.ts`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and dependencies:**

* This change depends on backend fix `000011`; the route, DTO, filters, role scope, and response shape were checked from backend repository commit `ad74325c`.
* The directory endpoint requires the `people:directory:view` permission and returns `{ data, meta }`.
* Live API testing requires the backend to be running with an authenticated session.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* The non-blocking bundle-size warning remains.
* The local directory endpoint was reachable and returned `401` without a token; authenticated live testing for the page, filters, drawer, and company link was not performed.

---

## fix 000037 — Move sales pipeline from companies to opportunities

**Implemented items:**

* Created an independent `opportunities` feature, including types, service, React Query hooks, create/edit form, stage-change dialog, owner-change flow, opportunity card, and company opportunities tab.
* Moved the `/pipeline` board from stage-based company queries to `GET /api/opportunities?stageId=...` using backend dynamic stage IDs.
* Displayed opportunity title, related company, owner, priority, expected close date, and estimated value on pipeline cards.
* Replaced company stage changes on the board with `PATCH /api/opportunities/:id/stage` using a `stageId`-based payload.
* Added an “Opportunities” tab to Company Details without removing or changing the People, Activities, Call Card, Branches, or Social Channels tabs.
* Added company-scoped opportunity creation with `POST /api/companies/:companyId/opportunities`, company-scoped listing, edit, owner change, archive, and restore flows.
* Added optional opportunity selection when creating an activity; company-level activities can still be created without `opportunityId`.
* Updated dashboard and report labels from “company” to “opportunity” for pipeline and conversion metrics without changing legacy backend response keys.
* Used `opportunity:view`, `opportunity:create`, `opportunity:update`, `opportunity:change-stage`, `opportunity:change-owner`, `opportunity:archive`, and `opportunity:restore` permissions with internal `ADMIN` fallback.
* Invalidated opportunity, pipeline, company-opportunity, company-detail, and report caches after mutations.
* No duplicate board or fake opportunity data was added; legacy company-stage controls remain only in company metadata for compatibility, and the new board does not use the company API for stage changes.

**Important files:**

* `src/features/opportunities/`
* `src/features/pipeline/`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/activities/components/ActivityForm.tsx`
* `src/features/activities/components/ActivityFormDialog.tsx`
* `src/features/activities/types/activity.types.ts`
* `src/components/dashboard/MainGrid.tsx`
* `src/features/reports/components/PipelineSummarySection.tsx`
* `src/features/reports/components/ConversionRatesSection.tsx`
* `README.md`

**Assumptions and dependencies:**

* Contracts were checked directly from backend fix `000012` in commit `ab501e44` and the dynamic stage migration in backend fix `000013` in commit `3297cfec`; therefore, the frontend uses `stageId` for stage filtering and stage mutations.
* Backend reports are now calculated from Opportunities, but some response keys are still named `totalCompanies` for backward compatibility, so the frontend did not change those wire keys.
* Used endpoints include `/opportunities`, `/opportunities/:id`, the `stage`, `owner`, `archive`, and `restore` actions, and `/companies/:companyId/opportunities`.
* Full live testing requires an authenticated session, seeded permissions, and opportunity data in the backend.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* The non-blocking bundle-size warning remains.
* The local backend returned `404` for `GET /api/opportunities` during verification; therefore, live testing for the board, CRUD, stage/owner changes, archive/restore, and activity integration was not performed. A new backend build must be run.

---

## fix 000038 — Full dynamic pipeline stage support

**Implemented items:**

* Removed dependency on the fixed `PipelineStage` enum from pipeline settings and report types, and replaced it with `code: string` and real stage IDs.
* Completed the stage model with `terminalType`, `isDefault`, creation/update timestamps, and independent create, update, and reorder payloads.
* Connected stage creation, detail loading, update, deactivation with replacement stage, and reorder to the final `/admin/pipeline/stages` routes.
* Added a create-stage form with validation for code, label, color, order, active status, terminal status, terminal type, and default-stage status; the code is locked in edit mode.
* Added a deactivation confirmation and replacement-stage selector; backend conflict or validation errors are displayed to the user.
* Added reorder support without a new drag-and-drop dependency, using up/down controls and sending an array of `{ id, sortOrder }` to the backend.
* Fixed transition-rule normalization from nested backend responses and replaced enum-based stage codes with `fromStageId` and `toStageId`.
* Completed create, edit, and delete flows for transition rules, including global rules with an empty role and real stage labels.
* Updated the opportunity stage-change dialog to use active stages and real transition rules matching the current stage and user role; when rule loading fails, no fake destination stage is shown.
* Kept the opportunity-based board using active stages sorted by `sortOrder`, backend labels/colors, and `stageId` opportunity filtering.
* Report filters still load stage options from `/reports/filter-options`, and report types no longer require the fixed stage enum.
* Cache invalidation after mutations now includes stages, transition rules, pipeline, opportunities, and reports.

**Important files:**

* `src/features/pipelineConfig/types/pipelineConfig.types.ts`
* `src/features/pipelineConfig/services/pipelineConfig.service.ts`
* `src/features/pipelineConfig/hooks/usePipelineConfig.ts`
* `src/features/pipelineConfig/components/StageConfigDialog.tsx`
* `src/features/pipelineConfig/components/StagesConfigTab.tsx`
* `src/features/pipelineConfig/components/TransitionRuleDialog.tsx`
* `src/features/pipelineConfig/components/TransitionRulesTab.tsx`
* `src/features/opportunities/components/ChangeOpportunityStageDialog.tsx`
* `src/features/companies/components/ChangeCompanyStageDialog.tsx`
* `src/features/reports/types/report.types.ts`
* `README.md`

**Assumptions and dependencies:**

* The final contract was checked directly from backend fix `000013` in commit `3297cfec`.
* The backend uses `pipeline:config:view`, `pipeline:config:manage`, `pipeline:transition:view`, and `pipeline:transition:manage`; no fake `pipeline:manage` permission was added.
* Deleting a stage is a deactivation operation and accepts `replacementStageId` as a query parameter when the stage is already in use.
* Backend transitions are stage-ID based, and role-specific rules take priority over global rules.
* The old stage enum remains only in the compatibility flow for company metadata and is not required for admin stages, the opportunity pipeline, opportunity stage changes, or report types.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* The non-blocking bundle-size warning remains.
* The local `GET /api/admin/pipeline/stages` route was reachable and returned `401` without a token; authenticated live testing for stage CRUD, reorder, transition rules, and the stage-change dialog was not performed.

---

## fix 000039 — Align company archive filter with API contract

**Implemented items:**

* Preserved the UI `archiveStatus` state with `ACTIVE`, `ALL`, and `ARCHIVED` values without sending it directly to the backend.
* Mapped `ACTIVE` to a request with no archive parameter, `ALL` to `includeArchived=true`, and `ARCHIVED` to `archivedOnly=true`.
* Removed the forced default `archiveStatus=ACTIVE` parameter from `GET /api/companies` requests.
* Avoided sending `includeArchived=false` or any unnecessary extra parameter.
* Updated the archive contract explanation in fix `000029` according to the current backend DTO.

**Important files:**

* `src/features/companies/services/companies.service.ts`
* `README.md`

**Assumptions and dependencies:**

* The contract was checked directly from the current backend repository’s `FindCompaniesDto` and controller; the DTO only accepts `includeArchived` and `archivedOnly`.
* The UI filter was not removed or visually changed; the mapping only happens at the service boundary.
* Live filter behavior testing requires an authenticated session and active/archived company data.

**Verification status:**

* Lint passed without errors or warnings.
* Production build passed.
* The non-blocking bundle-size warning remains.
* All three URL variants reached the local backend and returned `401` without a token: no archive parameter, `includeArchived=true`, and `archivedOnly=true`; live result/data verification was not performed.

---

## fix 000040 — Add usernameless Passkey login and account Passkey management

**Implemented items:**

* Added the `@simplewebauthn/browser` dependency and used `startRegistration` and `startAuthentication` with backend-provided JSON options.
* Preserved the existing email/password login without removing or changing its contract.
* Added a separate “Login with Passkey” button to the login page; this button does not validate the email/password form and sends an empty `{}` body to start authentication.
* Successful Passkey login uses the same success flow as normal login: storing `accessToken`, setting the user in the auth store, and redirecting to the dashboard.
* Added user-friendly errors for unsupported browsers/devices, user-cancelled operations, expired challenges, and failed login.
* Added the protected `/account/security` page for account security and Passkey management.
* The Passkey list displays device name or “Unnamed key”, registration date, last used date or “Never used”, transports, `backedUp`, and `credentialDeviceType`.
* Added new Passkey registration with a device name and Passkey deletion from the Account Security page.
* Added Passkey routes to the README API contract documentation.

**Important files:**

* `package.json`
* `package-lock.json`
* `src/features/auth/pages/LoginPage.tsx`
* `src/features/auth/services/auth.service.ts`
* `src/features/auth/hooks/usePasskeyLogin.ts`
* `src/features/auth/utils/passkeyErrors.ts`
* `src/features/accountSecurity/`
* `src/components/dashboard/AppNavbar.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `README.md`

**Assumptions and dependencies:**

* The Axios `baseURL` already includes `/api`, and Passkey endpoints are called without an extra prefix.
* `POST /me/passkeys/registration/options` directly returns `PublicKeyCredentialCreationOptionsJSON`.
* `POST /auth/passkeys/authentication/options` returns `{ challengeId, options }`.
* A successful `POST /auth/passkeys/authentication/verify` response has the same shape as password login.
* The requested `@simplewebauthn/browser@^13.3.2` version was not available in the npm registry; the nearest available compatible version, `^13.3.0`, was installed.
* Live registration, deletion, and Passkey login testing requires an active backend, HTTPS or localhost compatible with WebAuthn, an authenticated session, and a real authenticator.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking bundle-size warning remains.
* Live API testing and real Passkey testing were not performed.
* Existing uncommitted changes in People, Opportunities, Pipeline, Pipeline Config, and Reports files were preserved and not reverted.

---

## fix 000041 — Separate Passkey cache between users

**Implemented items:**

* Changed the React Query key for the Passkey list from the generic `['passkeys']` key to the user-scoped `['passkeys', 'list', userId]` key.
* The Passkey list query now only runs when the user is authenticated and `user.id` exists.
* To prevent showing the previous user’s data, the Passkey list query now uses `staleTime: 0`, `gcTime: 0`, `refetchOnMount: 'always'`, and `refetchOnWindowFocus: true`.
* Passkey registration and deletion mutations only invalidate the Passkey list query for the current user.
* On logout through the central `clearUser` path, the token is removed, the user is cleared from the auth store, and the global React Query cache is cleared with `queryClient.clear()`.
* On successful email/password login and successful Passkey login, the previous user’s cache is cleared before storing the new token and user.
* The Axios `401` flow is also connected to auth store cleanup and React Query cache cleanup so forced logout does not retain previous-user data.

**Important files:**

* `src/features/accountSecurity/hooks/usePasskeys.ts`
* `src/features/auth/hooks/useAuth.ts`
* `src/features/auth/hooks/usePasskeyLogin.ts`
* `src/lib/axios.ts`
* `src/store/authStore.ts`
* `README.md`

**Assumptions and dependencies:**

* The backend contract did not change, and `/me/passkeys` plus `/auth/passkeys/...` endpoints keep the same contract as fix `000040`.
* The Axios `baseURL` still includes `/api`, and Passkey service paths remain without an extra prefix.
* Live testing for the admin-to-BOARDS user-switching scenario requires real sessions, an active backend, and registered Passkeys.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking bundle-size warning remains.
* Live API testing and real user-switch Passkey testing were not performed.

---

## fix 000042 — Sync frontend API client with standardized backend response contract

**Implemented items:**

* Added centralized API response/error contract helpers in `src/lib/apiResponse.ts`.
* Added support for both raw legacy responses and standardized `{ success, data, meta }` responses.
* Added centralized paginated unwrapping that preserves the frontend `{ data, meta }` shape.
* Updated auth login and Passkey authentication verify to unwrap both direct and standardized response shapes.
* Updated auth error handling to read standardized `error.message` before legacy `message`.
* Added optional `organizationId` to the authenticated frontend user type.
* Updated selected high-impact services to use centralized response helpers, including auth, companies, opportunities, activities, people, reports, passkeys, admin users, admin permissions, catalogs, pipeline config, follow-ups, audit logs, call cards, branches, and social channels.
* Preserved existing React Query cache clearing on login/logout and Axios 401 handling.
* Kept API endpoint paths unchanged; Axios baseURL still owns the `/api` prefix.

**Important files:**

* `src/lib/apiResponse.ts`
* `src/features/auth/services/auth.service.ts`
* `src/features/auth/hooks/useAuth.ts`
* `src/features/auth/pages/LoginPage.tsx`
* `src/features/auth/utils/passkeyErrors.ts`
* `src/store/authStore.ts`
* `src/features/companies/services/companies.service.ts`
* `src/features/opportunities/services/opportunities.service.ts`
* `src/features/activities/services/activities.service.ts`
* `src/features/people/services/people.service.ts`
* `src/features/reports/services/reports.service.ts`
* `src/features/accountSecurity/services/passkeys.service.ts`
* `src/features/admin/users/services/adminUsers.service.ts`
* `src/features/admin/permissions/services/adminPermissions.service.ts`
* `src/features/catalogs/services/catalogs.service.ts`
* `src/features/pipelineConfig/services/pipelineConfig.service.ts`
* `src/features/followUps/services/followUps.service.ts`
* `src/features/auditLogs/services/auditLogs.service.ts`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on the standardized backend response/error contract from backend fix 000030.
* Depends on `organizationId` being present in the authenticated user payload from backend fix 000038 when available.
* Frontend still accepts legacy raw responses for compatibility during rollout.
* No live API testing was performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---

## fix 000043 — Add dedicated opportunity detail page and opportunity navigation

**Implemented items:**

* Added protected `/opportunities` and `/opportunities/:opportunityId` routes.
* Added a global opportunities list page with server-side pagination, search, priority filter, backend-driven stage filter, archive filter, loading/error/empty states, and row actions.
* Added a dedicated opportunity detail page with loading/error states, back navigation state, summary fields, company link, edit/stage/owner/archive actions, and an overview tab.
* Added placeholder tabs for line items, commercial documents, payments, tasks, attachments, and activities without fake data or CRUD.
* Extended opportunity types for optional backend-expanded `lineItems`, `commercialDocuments`, `payments`, `tasks`, and `_count`.
* Added `useOpportunity` detail query and improved opportunity mutation invalidation to include list, detail, company opportunity list, pipeline, company detail, and reports caches.
* Added an Opportunities entry to the sidebar.
* Added “View Details” navigation from the company opportunities tab.
* Added opportunity detail navigation from pipeline opportunity cards while preserving company navigation and stage-change behavior.

**Important files:**

* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/features/opportunities/pages/OpportunitiesPage.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/opportunities/hooks/useOpportunities.ts`
* `src/features/opportunities/types/opportunity.types.ts`
* `src/features/opportunities/components/CompanyOpportunitiesTab.tsx`
* `src/features/opportunities/components/OpportunityCard.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on existing backend opportunity APIs for list, detail, create/update, stage change, owner change, archive, and restore.
* Uses the standardized backend response contract from backend fix 000030 through the existing frontend API helpers.
* `lineItems`, `commercialDocuments`, `payments`, and `tasks` may be expanded by the backend, but full UI and CRUD for those relations are deferred to later fixes.
* Live API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---

## fix 000044 — Add product catalog and opportunity line items UI

**Implemented items:**

* Added a `productCatalog` feature module with typed API service, React Query hooks, server-side paginated product table, search/category/status filters, create/edit dialog, and activate/deactivate actions.
* Added Product Catalog as the Products tab inside Admin Libraries and extended sidebar visibility so users with `product:view` can reach the catalog UI.
* Added an `opportunityLineItems` feature module with typed API service, React Query hooks, decimal-safe money utilities, line-item table, create/edit dialog, delete confirmation, product selector, product default-price prefill, and calculated frontend preview.
* Replaced the Opportunity Details Line Items placeholder with the real line-items tab while keeping later tabs for commercial documents, payments, tasks, attachments, and activities unchanged.
* Added permission gates for `product:view`, `product:manage`, `opportunity-line-item:view`, and `opportunity-line-item:manage`.
* Invalidated line-item list, opportunity detail/list caches, pipeline, company opportunity/detail caches, and reports after line-item create/update/delete mutations.
* Preserved decimal payload values as strings where entered and used backend-calculated `lineTotal` as the source of truth after saves.

**Important files:**

* `src/features/productCatalog/`
* `src/features/opportunityLineItems/`
* `src/features/catalogs/pages/AdminLibrariesPage.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/opportunities/types/opportunity.types.ts`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000033` for `/product-catalog` and `/opportunities/:opportunityId/line-items` APIs.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Depends on frontend fix `000043` for the dedicated Opportunity Details page and Line Items tab location.
* The backend remains the source of truth for authorization, line total calculation, and `Opportunity.estimatedValue` recalculation.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated API testing was not performed in this fix.

---

## fix 000045 — Add commercial documents and payment tracking UI

**Implemented items:**

* Added a `commercialDocuments` feature module with typed API service, React Query hooks, display helpers, server-side paginated table, search/type/status filters, create/edit dialog, status-change dialog, delete confirmation, and safe external `fileUrl` links.
* Added a `payments` feature module with typed API service, React Query hooks, display helpers, server-side paginated table, status filter, create/edit dialog, mark-paid dialog, cancel dialog, and delete confirmation.
* Replaced the Opportunity Details Commercial Documents and Payments placeholders with real tabs while preserving the line-items tab from fix `000044` and the later task, attachment, and activity placeholders.
* Added permission gates for `commercial-document:view`, `commercial-document:manage`, `payment:view`, and `payment:manage`.
* Payment forms can select a real related commercial document from the same opportunity when the user has document view access; no fake document options were added.
* Status-change flows use backend endpoints as the source of truth and surface standardized backend error messages when a transition/action is rejected.
* Invalidation now refreshes commercial documents, payments, opportunity detail/list caches, pipeline, company opportunity/detail caches, and related summaries after document/payment mutations.
* No secure file upload/download, attachment management, tasks, or notification UI was added in this fix.

**Important files:**

* `src/features/commercialDocuments/`
* `src/features/payments/`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/opportunities/types/opportunity.types.ts`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000034` for commercial document and opportunity payment APIs.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Depends on frontend fix `000043` for the dedicated Opportunity Details page.
* References frontend fix `000044` by preserving the existing line-items tab and shared money formatting utility.
* Backend DTOs were checked from the local backend repository: commercial document status change accepts `{ status, notes }`; payment cancel accepts no request body.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated API testing was not performed in this fix.

---

## fix 000046 — Add secure attachment UI

**Implemented items:**

* Added an `attachments` feature module with typed attachment models, API service, React Query hooks, display utilities, upload dialog, delete confirmation dialog, and reusable `AttachmentsTab`.
* Connected attachment listing, upload, protected download, and delete flows to `/attachments` APIs using the shared authenticated Axios client.
* Upload uses `multipart/form-data` through `FormData` and explicitly avoids forcing a JSON content type so the browser can set the multipart boundary.
* Download always uses the protected backend `/attachments/:id/download` endpoint with `responseType: 'blob'`; no MinIO/local storage paths or public URLs are exposed.
* Replaced the Opportunity Details Attachments placeholder with real opportunity attachments for `entityType="OPPORTUNITY"`.
* Added attachment row actions for commercial documents and payments, opening dialog-scoped attachment lists for `COMMERCIAL_DOCUMENT` and `PAYMENT`.
* Added permission gates for `attachment:view` and `attachment:manage`; users without manage access can view/download but cannot upload/delete.
* Added file-size, MIME label, safe filename, and content-disposition filename helpers. Client-side size/MIME messaging is only a hint; backend validation remains authoritative.
* No task management UI or notification center was added in this fix.

**Important files:**

* `src/features/attachments/`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/commercialDocuments/components/CommercialDocumentsTab.tsx`
* `src/features/payments/components/PaymentsTab.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000035` for secure attachment list, upload, protected download, and delete APIs.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Depends on frontend fix `000043` for the dedicated Opportunity Details page.
* Integrates with frontend fix `000045` commercial document and payment UI.
* Backend DTOs were checked from the local backend repository: upload fields are `file`, `entityType`, `entityId`, and optional `description`; list requires `entityType` and `entityId`.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated file upload/download testing was not performed in this fix.

---

## fix 000047 - Add dedicated task management UI

**Implemented items:**

* Added a `tasks` feature module with typed task models, API service, React Query hooks, Persian display helpers, global page, reusable task table, and focused dialogs for create/edit, status change, assignment, completion, rescheduling, and deletion.
* Added protected `/tasks` route and sidebar task item gated by `task:view`.
* Added server-side paginated task listing with search, status, priority, assignee, and due-date filters.
* Added summary cards for total tasks, TODO tasks, overdue tasks, and DONE tasks on the global task page.
* Replaced the Opportunity Details task placeholder with a real opportunity-scoped task tab using `GET /tasks?opportunityId=...`.
* Reused real `/users/owner-options` data for task assignment; no fake assignees or fake linked-entity selectors were added.
* Implemented permission gates for `task:view`, `task:create`, `task:update`, `task:assign`, `task:complete`, and `task:delete`.
* Task mutations invalidate task lists/details, opportunity detail/list caches, company detail cache when relevant, and pipeline queries where counts may be affected.
* Existing `/follow-ups` page and activity follow-up complete/reschedule flows remain available and were not removed or changed.
* No notification center UI was added in this fix.

**Important files:**

* `src/features/tasks/`
* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000036` for dedicated task management APIs.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Depends on frontend fix `000043` for the dedicated Opportunity Details page.
* Backend DTOs were checked from the local backend repository: status changes accept `{ status, note }`, assignment accepts `{ assignedToId }`, completion accepts `{ completionNote }`, and reschedule accepts `{ dueAt, reminderAt }`.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated task API testing was not performed in this fix.

---
## fix 000048 — Add notification center UI

**Implemented items:**

* Added a `notifications` feature module with typed notification models, API service, React Query hooks, Persian display helpers, safe action URL navigation, notification bell, recent menu, full notification center page, table, send dialog, and delete confirmation.
* Connected notification listing, unread count, detail, create, mark read/unread, read-all, archive/unarchive, and delete flows to `/notifications` APIs using the shared Axios client and standardized response helpers.
* Added unread-count polling every 60 seconds and mutation invalidation for notification lists, unread count, and affected notification details. No WebSocket, SSE, service worker push, or browser push was added.
* Added protected `/notifications` route, sidebar item gated by `notification:view`, and app header bell/menu gated by `notification:view`.
* Added server-side paginated notification listing with search, status, type, priority, entity type, and archive filters.
* Added permission gates for `notification:view`, `notification:manage`, and `notification:send`; view-only users can open notifications but cannot mark, archive, unarchive, delete, or send.
* Manual notification sending uses the existing real `/users/owner-options` user source through existing hooks. No fake recipients were added.
* Safe action URL handling only routes internal app paths or same-origin URLs that resolve to known frontend route prefixes; unsafe external URLs are not opened automatically.

**Important files:**

* `src/features/notifications/`
* `src/routes/index.tsx`
* `src/components/dashboard/AppNavbar.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/components/dashboard/Header.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000037` for notification center APIs.
* Depends on backend fix `000036` because task management can generate task notifications.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Links to frontend fix `000047` task management UI when notification `actionUrl` points at task routes.
* Backend remains the source of truth for recipient scoping, authorization, notification creation rules, and archive/read state.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated notification API testing was not performed in this fix.

---
## fix 000049 — Add organization context and current organization UI

**Implemented items:**

* Added an `organizations` feature module with typed organization models, current-organization API service, React Query hook, Persian display helpers, compact current organization badge, and suspended/archived status alert.
* Connected `GET /organizations/current` through the shared Axios client and standardized API response helpers while supporting raw and wrapped organization response shapes.
* Added an organization-aware current query key using `user.organizationId`, a 5-minute stale time, no polling, and no global cache clearing from the organization hook.
* Gated current organization fetching behind authenticated `organization:view` access so users without access do not call `/organizations/current`.
* Added the current organization badge to the dashboard app navbar near the notification/account area without removing notification bell, profile, logout, sidebar, or layout behavior.
* Added a non-blocking authenticated-layout warning banner for `SUSPENDED` and `ARCHIVED` organizations; frontend routing is not blocked and users are not logged out due to organization status.
* Reviewed auth compatibility: `AuthUser` and login/passkey login response typing already include optional `organizationId`, and login/passkey login still clear React Query cache before storing the new user.
* Admin organization management and organization switching are not implemented in this fix.

**Important files:**

* `src/features/organizations/`
* `src/components/dashboard/AppNavbar.tsx`
* `src/layouts/DashboardLayout.tsx`
* `src/store/authStore.ts`
* `src/features/auth/services/auth.service.ts`
* `src/features/auth/hooks/useAuth.ts`
* `src/features/auth/hooks/usePasskeyLogin.ts`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000038` for tenant/organization foundation and `GET /organizations/current`.
* Depends on backend fix `000030` standardized response contract.
* Depends on frontend fix `000042` auth/user payload compatibility and shared API response helpers.
* Backend remains the source of truth for organization authorization, status enforcement, and tenant scoping.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated organization API testing was not performed in this fix.

---
## fix 000050 — Add admin organizations management UI

**Implemented items:**

* Extended the `organizations` feature module with admin organization types, API service methods, React Query hooks, Persian display helpers, admin page, server-side paginated table, create/edit form dialog, and activate/suspend confirmation dialog.
* Connected admin organization list, detail, create, update, activate, and suspend flows to `/admin/organizations` APIs through the shared Axios client and standardized API response helpers.
* Added stable organization query keys for current organization, lists, list params, and details.
* Organization create/update/activate/suspend mutations invalidate organization lists/details and refresh the current organization query when the changed organization matches the logged-in user's `organizationId`.
* Added protected `/admin/organizations` route and sidebar item gated by `organization:manage`.
* Added server-side filters for search and status, status chips, Persian date formatting, and empty/error/loading states.
* Organization form validates technical organization code format, defaults create values to `Asia/Tehran`, `fa-IR`, and `ACTIVE`, and accepts optional settings as validated JSON object text.
* Reused the current organization context from fix `000049` without adding organization switching or changing auth token behavior.
* Organization switching, user-to-organization assignment, delete/archive organization, and tenant-scoped library/settings management are not implemented in this fix.

**Important files:**

* `src/features/organizations/`
* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000038` for tenant/organization foundation and admin organization APIs.
* Depends on backend fix `000030` standardized response contract.
* Depends on frontend fix `000049` current organization context.
* Backend remains the source of truth for organization authorization, code uniqueness, lifecycle rules, and tenant scoping.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated admin organization API testing was not performed in this fix.

---
## fix 000051 — Add SSO login and admin SSO provider management UI

**Implemented items:**

* Added a `sso` feature module with typed SSO provider models, public/admin API service methods, React Query hooks, display helpers, safe backend redirect URL builder, login buttons, SSO callback page, admin provider page, provider form dialog, provider status/delete dialog, and sensitive-secret warning.
* Verified backend SSO routes from the sibling backend source and used the actual paths: `/auth/sso/providers`, `/auth/oidc/:providerId/login`, `/auth/saml/:providerId/login`, `/auth/sso/exchange`, and `/admin/sso-providers`.
* Added SSO provider buttons to the login page without changing password login or Passkey login.
* Added `/auth/sso/callback` to exchange backend-issued SSO tickets for the normal CRM login response, clear React Query cache, store the access token, and set the same auth user state used by password/passkey login.
* Added `/admin/sso-providers` route and sidebar item gated by `sso-provider:view` or `sso-provider:manage`.
* Added admin provider listing with search, type, and active-state filters, plus create/edit, activate, disable, delete, and test-login actions.
* Provider forms use backend field names including `entityId`, `ssoUrl`, `x509Certificate`, `scopes`, `defaultRole`, `allowedDomains`, and SAML signature flags.
* Existing client secrets and certificates are never displayed; new secret/certificate values are sent only when entered.
* The frontend does not implement OIDC/SAML protocol internals. It redirects to backend login endpoints and exchanges backend-issued tickets only.

**Important files:**

* `src/features/sso/`
* `src/features/auth/pages/LoginPage.tsx`
* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000021` for SSO relying-party foundation.
* Depends on backend fix `000022` for OIDC relying-party login.
* Depends on backend fix `000023` for SAML service-provider login.
* Depends on backend fix `000030` standardized response contract.
* Depends on frontend fix `000042` auth/API response compatibility.
* Backend remains the source of truth for provider configuration validation, callback handling, state/nonce/ticket validation, user resolution, and session cookie handling.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated SSO provider management and external IdP login testing were not performed in this fix.

---
## fix 000052 — Update dashboard, sidebar, and reports for new backend modules

**Implemented items:**

* Reorganized the sidebar into Sales Operations, Management, and Account groups while preserving mobile drawer behavior, RTL layout, route highlighting, and permission-based visibility.
* Audited sidebar links against implemented routes through frontend fixes `000043` to `000051`, including opportunities, tasks, notifications, organizations, SSO providers, reports, and existing admin pages.
* Expanded the dashboard with real backend-backed cards for companies, opportunities, pipeline reports, conversion rate, open/overdue tasks, unread notifications, recent activities, and current organization status.
* Added permission-aware dashboard quick links for opportunities, tasks, notifications, reports, product catalog via Admin Libraries, admin organizations, and SSO providers.
* Kept dashboard failures isolated: each metric card can show unavailable/loading state without breaking the rest of the dashboard.
* Updated Reports copy to emphasize the opportunity-first pipeline model and added an operational links section for real existing routes.
* Confirmed existing reports still use standardized response helpers and preserve legacy backend field names while displaying opportunity-oriented labels.
* Did not add new backend reporting endpoints and did not fabricate unavailable payment/document/global metrics.

**Important files:**

* `src/components/dashboard/MainGrid.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/features/reports/pages/ReportsPage.tsx`
* `README.md`

**Assumptions and backend/frontend dependencies:**

* Depends on backend fix `000030` standardized response contract.
* Depends on backend fixes `000033`, `000034`, `000035`, `000036`, `000037`, and `000038` for product/line items, documents/payments, attachments, tasks, notifications, and organizations.
* Includes navigation for SSO from backend fixes `000021` to `000023`.
* Depends on frontend fixes `000043` to `000051` for the implemented opportunity, catalog, document/payment, attachment, task, notification, organization, and SSO pages.
* Payment and commercial-document global report cards remain a future backend reporting dependency because current frontend APIs are opportunity-scoped.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated dashboard/report API testing was not performed in this fix.

---
## fix 000053 — Remove sales stage from company views

**Implemented items:**

* Removed company sales-stage display from Company Details header chips and overview fields.
* Removed company stage change action and the deprecated company stage dialog from Company Details.
* Removed company stage column and stage filter from the Companies list.
* Stopped sending company `stage` as a list filter and removed the deprecated `/companies/:id/stage` frontend service/hook path.
* Kept the legacy optional `Company.stage?: string | null` field only for backend response compatibility, with a note that sales pipeline stage belongs to Opportunity.
* Added a small Company Overview helper message that sales stage is managed through the company's sales opportunities, with a button to open the Opportunities tab.
* Preserved Opportunity stage display/change flows in Opportunities, Opportunity Detail, Company Opportunities tab, and Pipeline.

**Important files:**

* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/companies/services/companies.service.ts`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/types/company.types.ts`
* `src/features/companies/utils/companyDisplay.ts`
* `src/features/companies/components/ChangeCompanyStageDialog.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend fix `000026` deprecating company pipeline mutation and enforcing opportunity pipeline.
* Depends on frontend fix `000043` for the dedicated Opportunity detail page.
* Company no longer displays sales stage in overview; sales stage is managed through Opportunity pages and Pipeline.
* Existing Company Opportunities tab remains available.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000054 — Separate department, job title, and sales role in person forms

**Implemented items:**

* Decoupled the person create/edit form from the free-text job-title field and the legacy Persona Library source, and connected it to managed lookup options.
* Department is loaded from `departments`, job title from `job-titles`, sales-process role from `persona-roles`, and seniority level from `seniority-levels`.
* Form submissions use the new backend aliases `jobTitle` and `personaRole`, while legacy records using `title` and `personaTag` remain displayable.
* Updated the company people list, global people directory, directory filters, person details, activity form, and Call Card contact selector to use the clarified labels.
* Aligned Admin Libraries lookup groups with `job-titles` and `persona-roles`, replacing the ambiguous Persona terminology with Job Titles and Sales Roles labels.
* Extended frontend person and Call Card contact models with `jobTitle`, `personaRole`, and `seniorityLevel`.

**Important files:**

* `src/features/people/components/PersonForm.tsx`
* `src/features/people/components/PeopleTab.tsx`
* `src/features/people/components/PersonDetailDrawer.tsx`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `src/features/people/types/person.types.ts`
* `src/features/catalogs/types/catalog.types.ts`
* `src/features/activities/components/ActivityForm.tsx`
* `src/features/callCards/components/CallCardForm.tsx`
* `src/features/callCards/types/callCard.types.ts`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend lookup groups `departments`, `job-titles`, `persona-roles`, and `seniority-levels`.
* Depends on backend person DTO aliases `jobTitle` and `personaRole`, which map to legacy persisted fields `title` and `personaTag`.
* Existing records with only `title` or `personaTag` remain displayable through frontend fallbacks.
* Live authenticated API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000055 — Clarify opportunity definition fields and opportunity source

**Implemented items:**

* Clarified opportunity form labels so the opportunity `source` is not confused with the company acquisition source.
* Renamed the Source field to Opportunity Source and connected it to the `opportunity-sources` lookup group.
* Added the `opportunity-sources` group to Admin Libraries lookup management under the Opportunity Sources label.
* Clarified fields for opportunity owner, sales stage, estimated value, expected close date, primary contact, win probability, potential competitor, and requirements/opportunity description.
* Limited primary-contact options to people belonging to the opportunity company.
* Extended opportunity types with `sourceOptionId`, `opportunitySource`, `sourceOption`, `primaryContactId`, `primaryContact`, `probability`, and `competitor`.
* Updated the global opportunities list, company opportunities tab, opportunity details, and owner-change dialog to use the clarified labels.
* Added an Opportunity Source filter to the global opportunities list.

**Important files:**

* `src/features/opportunities/components/OpportunityForm.tsx`
* `src/features/opportunities/components/OpportunityFormDialog.tsx`
* `src/features/opportunities/components/CompanyOpportunitiesTab.tsx`
* `src/features/opportunities/components/ChangeOpportunityOwnerDialog.tsx`
* `src/features/opportunities/pages/OpportunitiesPage.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/opportunities/types/opportunity.types.ts`
* `src/features/catalogs/types/catalog.types.ts`
* `README.md`

**Assumptions and backend dependencies:**

* Depends on backend lookup group `opportunity-sources` and opportunity DTO fields `sourceOptionId`, `opportunitySource`, `primaryContactId`, `probability`, and `competitor`.
* Product / service is managed through Opportunity Line Items and was not duplicated in the opportunity definition form.
* No `useCase` field exists on the inspected opportunity DTO, so no non-working use-case field was added.
* Live authenticated API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000056 — Add Jalali date input and display across the UI

**Implemented items:**

* Added the lightweight `jalaali-js` dependency for Jalali/Gregorian date conversion.
* Added the shared `jalaliDate` utility for converting backend ISO values to Jalali display values, converting Jalali input to ISO, normalizing Persian/Arabic digits, and creating end-of-day ranges.
* Added the shared `JalaliDateField` component so forms can accept Jalali values such as `1403/05/20` and `1403/05/20 14:30` while sending ISO values to the API.
* Migrated date/time inputs in activities, Call Cards, opportunities, tasks, task rescheduling, follow-up rescheduling, commercial documents, payments, task filters, report filters, and Audit Log filters from native Gregorian inputs to the shared Jalali input.
* Migrated general date displays for companies, tasks, activities, notifications, organizations, SSO, opportunities, documents, payments, attachments, and logs to the shared Jalali `YYYY/MM/DD - HH:mm` formatters.
* Range filters send start-of-day and end-of-day ISO values to the backend so the backend contract remains unchanged.

**Important files:**

* `src/shared/utils/jalaliDate.ts`
* `src/shared/components/JalaliDateField.tsx`
* `src/types/jalaali-js.d.ts`
* `src/features/companies/utils/companyDisplay.ts`
* `src/features/tasks/`
* `src/features/activities/components/`
* `src/features/followUps/components/RescheduleFollowUpDialog.tsx`
* `src/features/opportunities/components/OpportunityForm.tsx`
* `src/features/payments/components/`
* `src/features/commercialDocuments/components/CommercialDocumentFormDialog.tsx`
* `src/features/reports/components/ReportFilterPanel.tsx`
* `src/features/auditLogs/pages/AuditLogsPage.tsx`
* `package.json`
* `package-lock.json`
* `README.md`

**Assumptions and backend dependencies:**

* The backend continues to receive and store dates in Gregorian/ISO format; this fix changes only the UI date layer to Jalali.
* The shared input initially remained a controlled Jalali text field; no visual calendar picker was added in this fix to keep the change focused and low risk.
* Date-only fields are converted to local ISO values, and range-filter `to` values are sent as end-of-day timestamps.
* Live authenticated API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000057 — Add Jalali calendar pickers for date and time fields

**Implemented items:**

* Added the `react-multi-date-picker` dependency so users can select Jalali dates from a calendar instead of entering them manually.
* Added shared `JalaliDatePicker`, `JalaliDateTimePicker`, and `JalaliDateRangePicker` components with a Persian calendar, Persian locale, RTL-friendly layout, clear action, and MUI-based input.
* Preserved the compatible `JalaliDateField` API while replacing its plain text input with the Jalali calendar picker.
* Migrated task, report, and Audit Log range filters to `JalaliDateRangePicker`.
* Date-time pickers for activities, follow-ups, tasks, reminders, and Call Cards use the time plugin and convert selected hours/minutes to backend ISO values.
* The backend contract remains unchanged, and all picker outputs remain ISO/Gregorian-compatible.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `src/shared/utils/jalaliDate.ts`
* `src/features/tasks/components/TasksTable.tsx`
* `src/features/reports/components/ReportFilterPanel.tsx`
* `src/features/auditLogs/pages/AuditLogsPage.tsx`
* `package.json`
* `package-lock.json`
* `README.md`

**Assumptions and backend dependencies:**

* The backend continues to receive and store dates in ISO/Gregorian format.
* This fix reuses the centralized conversion utilities from fix `000056` rather than duplicating date-conversion logic across forms.
* Live authenticated API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000058 — Fix Jalali date picker runtime error

**Implemented items:**

* Defensively unwrapped the `react-multi-date-picker` and time-plugin imports in `JalaliDateField` so the React component itself is rendered instead of a module object at runtime.
* Preserved the correct `DateObject`, Persian calendar, and Persian locale imports, and standardized the locale name to `persian_fa`.
* Added a small development guard that provides a clearer error if the dependencies fail to resolve to valid components again.
* Kept the backend date payload contract unchanged.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change any backend API contract or dependency.
* Forms using `JalaliDatePicker`, `JalaliDateTimePicker`, and `JalaliDateRangePicker` continue to use the same shared component.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000059 — Fix Jalali date field runtime error

**Implemented items:**

* Removed the `JalaliDateField` development guard that incorrectly rejected valid React components using `typeof Component === 'function'`.
* Restored the documented default imports for `DatePicker` and `TimePicker` from `react-multi-date-picker` and its time plugin.
* Preserved the correct `DateObject`, Persian calendar, and `persian_fa` locale imports.
* `JalaliDatePicker`, `JalaliDateTimePicker`, and `JalaliDateRangePicker` continue to produce ISO/Gregorian-compatible values without changing the backend contract.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change any backend API contract or dependency.
* The runtime error was caused by the local guard, not by the forms or endpoints.

**Verification status:**

* Vite cache cleared.
* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000060 — Fix Jalali date picker rendering error

**Implemented items:**

* Investigated the reported JSX failure in `JalaliDatePicker` and resolved the problematic `DatePicker` tag to the dependency’s actual default export.
* Added an interop resolver for `DatePicker` and `TimePicker`, without guards or logging, so a module namespace object is never passed directly to React.
* The resolver preserves valid object-shaped React components such as `forwardRef` components.
* Preserved the correct imports for `react-multi-date-picker`, `react-date-object`, the Persian calendar, the `persian_fa` locale, and MUI icons.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change any backend API contract or dependency.
* Opportunity forms and other forms continue to use the shared `JalaliDateField` component.

**Verification status:**

* Vite cache cleared.
* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000061 — Make task creation context-aware for company and opportunity

**Implemented items:**

* Removed raw `companyId` and `opportunityId` text fields from the task create/edit form.
* Updated the shared `TaskFormDialog` to display readable company/opportunity context and submit identifiers from that context.
* When creating a task from an opportunity, the company and opportunity are locked and displayed as read-only context.
* When creating a task from a company, the company is locked and displayed as read-only context.
* On the global Tasks page, company, opportunity, and person are selected through API-backed autocomplete/selectors.
* Opportunity options are filtered by the selected company, and choosing an opportunity consistently sets its related company.
* Person options are loaded only for the selected or current company.
* Added a Tasks tab to Company Details so tasks can be created in company context.

**Important files:**

* `src/features/tasks/components/TaskFormDialog.tsx`
* `src/features/tasks/components/TasksTable.tsx`
* `src/features/tasks/components/OpportunityTasksTab.tsx`
* `src/features/tasks/components/CompanyTasksTab.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change any backend API contract.
* Task payloads continue to use the existing `CreateTaskPayload` and `UpdateTaskPayload` DTO contracts.
* For compatibility, when company context is available, the form submits that context as `companyId`; users cannot edit a raw identifier.
* Live authenticated API testing was not performed.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000062 — Establish a unified design system and RTL foundation

**Implemented items:**

* Extended the central MUI theme while fully preserving the approved palette; project colors were not changed.
* Added shared layout, sizing, radius, and shadow tokens in `src/theme/tokens.ts`.
* Connected the existing MUI X customizations for Data Grid, Charts, Date Pickers, and Tree View to the primary theme.
* Added shared defaults and style overrides for Button, IconButton, TextField, FormControl, Autocomplete, Paper, Card, Dialog, Table, Tabs, Chip, Alert, Menu, and Tooltip.
* Removed leftover Vite-template CSS and added RTL/LTR helpers plus horizontal-overflow protection.
* Added shared `PageContainer`, `PageHeader`, `PageSection`, `FilterPanel`, `ResponsiveActionGroup`, and `StateBlock` components.
* Moved the main dashboard layout to a centered container with a maximum width and responsive padding.
* Migrated the dashboard Header from inline styles to standardized MUI `sx` and typography.
* Improved logical RTL spacing in AppNavbar and SideMenu.
* Migrated the Tasks management page to the new PageContainer/PageHeader pattern.

**Important files:**

* `src/theme.ts`
* `src/theme/tokens.ts`
* `src/shared/components/ui.tsx`
* `src/index.css`
* `src/layouts/DashboardLayout.tsx`
* `src/components/dashboard/AppNavbar.tsx`
* `src/components/dashboard/Header.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/features/tasks/pages/TasksPage.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This fix establishes frontend/UI foundations only and does not change API contracts, route behavior, permissions, validation, or business workflows.
* Existing project colors remain the source of truth; this fix focuses on spacing, density, RTL behavior, responsive shell structure, and component defaults.
* This fix did not migrate every page to the shared components. Remaining pages are more consistent through the central theme and can move to `PageHeader`, `FilterPanel`, and `PageSection` in later fixes.
* Visual browser inspection and live API testing were not performed.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000063 — Complete component RTL support and standardize grid row actions

**Implemented items:**

* Added complete MUI/Emotion RTL infrastructure: in addition to root `dir="rtl"` and `theme.direction = 'rtl'`, an Emotion cache using `stylis-plugin-rtl` and `prefixer` is mounted at the application root.
* Updated central theme behavior for `TextField`, `InputBase`, `OutlinedInput`, `InputLabel`, `Select`, `Autocomplete`, `InputAdornment`, `Menu`, `TablePagination`, and `Pagination` so Persian text, placeholders, labels, notches, menu items, and pagination render correctly in RTL.
* Preserved and expanded LTR helpers for technical values such as dates, email addresses, identifiers, URLs, and codes so global RTL changes do not break technical fields.
* Fixed Jalali date-field icon/text overlap through the shared picker path; the input remains LTR and the output contract remains ISO/Gregorian-compatible.
* Added shared `RowActions` and `RowActionButton` components for accessible row actions using `IconButton`, Persian tooltips, Persian `aria-label` values, and an overflow menu.
* Replaced wide text-action columns with compact icon actions across company, opportunity, task, people, attachment, commercial-document, payment, product, organization, notification, SSO, library, branch, social-channel, opportunity-line-item, and pipeline-settings grids.
* Kept high-frequency actions directly visible and moved secondary actions such as status changes, assignment, archive, delete, and suspension into the `MoreVert` menu.
* Controlled action-column widths and reduced most grids to approximately 104–136 pixels.
* Standardized manual pagination labels in Activities and Follow-ups with a consistent Persian “Rows per page” label and “{from}–{to} of {count}” pattern.
* Improved button and action-container wrapping/flex-shrink behavior in the theme so labels such as Refresh do not overflow their buttons.

**Root cause found:**

* The application was RTL only at the document/theme level and lacked an Emotion cache to transform MUI-generated CSS for RTL.
* Many input, select, and autocomplete components retained default internal LTR behavior or mismatched padding/adornment positioning.
* Action columns used long text buttons, consuming excessive width and causing overflow and poor behavior in smaller viewports.

**Important files:**

* `src/lib/rtlCache.ts`
* `src/app/App.tsx`
* `src/theme.ts`
* `src/theme/customizations/dataGrid.ts`
* `src/index.css`
* `src/shared/components/RowActions.tsx`
* `src/shared/components/JalaliDateField.tsx`
* `src/features/**/**Table.tsx`
* `src/features/**/**Tab.tsx`
* `src/features/**/**Page.tsx`
* `package.json`
* `package-lock.json`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change backend API contracts, routes, permissions, payloads, validation, or workflows.
* Approved project colors were not changed; the work focused on RTL behavior, alignment, responsiveness, accessibility, and action-column width.
* Added explicit lightweight frontend dependencies for the RTL cache: `@emotion/cache`, `stylis`, `stylis-plugin-rtl`, and `@types/stylis`.
* Visual browser inspection was not performed in this fix.
* Live API testing was not performed because the backend was not run or tested during this work.

**Verification status:**

* Lint passed without errors: `npm run lint`.
* TypeScript check passed as part of `npm run build`.
* Production build passed: `npm run build`.
* The non-blocking Vite bundle-size warning remains.

**Remaining known limitations:**

* Text buttons inside cards and timelines that are not Data Grid/Table row actions remain textual to preserve readability and the existing workflow.
* Multi-viewport visual review and live role/API testing still need to be performed in an environment with a browser and running backend.

---
## fix 000064 — Fix RTL runtime failure and align Stylis with Emotion

**Implemented items:**

* Fixed the Emotion/Stylis runtime error that occurred while rendering MUI TextField components.
* Removed the generic `stylis-plugin-rtl` dependency and replaced it with the official `@mui/stylis-plugin-rtl` plugin.
* Pinned the app-level `stylis` version from `^4.4.0` to exact version `4.2.0` to match the version used by `@emotion/cache@11.14.0`.
* Updated the RTL plugin import in `src/lib/rtlCache.ts` to `@mui/stylis-plugin-rtl` while preserving the `prefixer`-before-`rtlPlugin` order.
* Preserved the existing provider order for `CacheProvider`, `ThemeProvider`, `CssBaseline`, `RouterProvider`, and `QueryProvider`.
* Preserved root RTL settings (`dir="rtl"` and `lang="fa"`) and `theme.direction = 'rtl'`.
* Cleared the Vite optimization cache under `node_modules/.vite` so RTL dependencies were rebundled.
* Retained `@types/stylis` after a removal test because TypeScript requires its declarations for the direct `prefixer` import.
* Did not change colors, routes, API contracts, authentication flow, permissions, or validation.

**Root cause:**

* Dependency-tree inspection showed that `@emotion/cache@11.14.0` used `stylis@4.2.0`, while the direct `prefixer` import and generic `stylis-plugin-rtl@2.1.1` resolved through `stylis@4.4.0`.
* This combination executed Stylis plugins against incompatible internals during Emotion serialization and caused `Cannot read properties of undefined (reading 'push')` failures in `append/lift/prefixer` while inserting MUI styles.
* After the fix, `npm ls stylis` reports only `stylis@4.2.0` for Emotion, `prefixer`, and `@mui/stylis-plugin-rtl`.

**Important files:**

* `src/lib/rtlCache.ts`
* `package.json`
* `package-lock.json`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix.
* No backend API contract, route, authentication behavior, permission, payload, or validation changed.
* Ran `npm dedupe` as requested and aligned the lockfile with the new dependency tree; the lockfile also normalized a non-functional transitive patch for the internal `ignore` dependency used by TypeScript ESLint.
* Live API testing was not performed; a running backend was not part of this fix’s verification scope.

**Verification status:**

* `npm ls stylis`: all paths were deduplicated to `stylis@4.2.0`.
* `npm ls @emotion/cache`: `@emotion/cache@11.14.0` is valid and deduplicated.
* `npm ls @mui/stylis-plugin-rtl`: `@mui/stylis-plugin-rtl@9.1.1` is installed.
* `npm ls stylis-plugin-rtl`: empty; the generic package was removed.
* Development server: `npm run dev -- --host 127.0.0.1 --port 5173` started successfully, Vite dependency optimization ran, and `/login` returned HTTP 200.
* Browser verification: rendered `/login` in local Chrome through Playwright; two inputs were visible, `dir="rtl"` and `lang="fa"` were active, no page error occurred, the default React Router ErrorBoundary was not shown, and no `Emotion Insertion`, `append`, `lift`, `prefixer`, or `Cannot read properties of undefined (reading 'push')` errors appeared.
* The browser console showed only a CORS failure for `http://localhost:3000/api/auth/sso/providers` because the backend/live API was unavailable during the test; this was unrelated to the RTL fix.
* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: the Vite warning for chunks larger than 500 kB remains.

**Remaining known limitations:**

* Authenticated navigation and live API testing were not performed because a running backend and valid session were not tested in this fix.
* Playwright-managed Chromium could not be installed because the CDN returned 403 in the current environment; browser verification used the locally installed Chrome instead.

---
## fix 000065 — Fix apparent LTR regression after enabling the RTL cache

**Implemented items:**

* Investigated the apparent LTR regression after `fix 000064` and isolated it to double mirroring in styles generated through the Emotion RTL cache.
* Preserved the core RTL configuration unchanged: document `dir="rtl"`, `theme.direction = 'rtl'`, and the Emotion cache based on `@mui/stylis-plugin-rtl`.
* Removed manual `direction: 'rtl'` and `textAlign: 'right'` declarations that Stylis mirrored again inside `sx`/theme overrides, or replaced them with `textAlign: 'start'`.
* Preserved LTR direction for technical content such as email addresses, passwords, and Jalali date fields through input-level `dir="ltr"` and the `.ltr` class rather than Emotion-generated rules.
* Corrected the main drawer position after inspecting computed styles; because the RTL cache mirrors the Drawer’s physical CSS, the physical anchor in `SideMenu` was set so the drawer renders on the right side of the viewport.
* Cleaned Data Grid alignment and direction overrides so the grid inherits direction from the document/theme and columns do not revert to LTR under RTL.
* Corrected login, SSO callback, dashboard layout, Jalali date field, and grid pages without changing API contracts, routes, permissions, validation, or workflows.
* Cleared the Vite optimization cache in `node_modules/.vite` after the RTL changes.

**Root cause:**

* After `fix 000064`, the RTL infrastructure was active and stable, but parts of the theme and layout still emitted `direction: 'rtl'`, `textAlign: 'right'`, or `direction: 'ltr'` through Emotion.
* `@mui/stylis-plugin-rtl` mirrors these physical CSS declarations, so manual rules such as `direction: rtl` and `text-align: right` became `direction: ltr` and `text-align: left` in browser output.
* Chrome inspection before the correction showed that `html[dir="rtl"]` was active while some containers and the login form had computed `direction: ltr` and `text-align: left`.

**Important files:**

* `src/theme.ts`
* `src/theme/customizations/dataGrid.ts`
* `src/layouts/DashboardLayout.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/shared/components/JalaliDateField.tsx`
* `src/features/auth/pages/LoginPage.tsx`
* `src/features/sso/pages/SsoCallbackPage.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix.
* No backend API contract, route behavior, authentication flow, permission, payload, validation, or business workflow changed.
* Approved project colors were not changed.
* Authenticated pages were tested with a localStorage test user using the `ADMIN` role; no valid live backend/API session was tested in this fix.

**Verification status:**

* `Remove-Item -Recurse -Force .\node_modules\.vite`: executed to refresh the Vite dependency cache after the RTL changes.
* `npm ls stylis @mui/stylis-plugin-rtl stylis-plugin-rtl`: all Emotion/MUI paths were deduplicated to `stylis@4.2.0`, `@mui/stylis-plugin-rtl@9.1.1` is installed, and the generic `stylis-plugin-rtl` package is absent from the tree.
* `rg` for `direction: 'rtl'`, `direction: 'ltr'`, `textAlign: 'right'`, and `textAlign: 'left'` under `src`: only `theme.direction = 'rtl'` remains.
* Development server: `npm run dev -- --host 127.0.0.1 --port 5173` started successfully and `/login` returned HTTP 200.
* Browser verification was performed in local Chrome through Playwright/Node REPL:
  * `/login` at 375px and 1280px: `html` and the form were RTL, text used `text-align: start`, email/password fields used `dir="ltr"`, and there were no router errors or horizontal overflow.
  * `/dashboard` at 375px, 1280px, and 1920px: `html`, main content, AppBar, and title were RTL; there was no horizontal overflow; the desktop drawer rendered on the right and the mobile drawer opened from the right.
  * `/tasks` at 1280px: Data Grid and page content were RTL, the date field was LTR, and there were no router errors or horizontal overflow.
* The browser console showed no Emotion/Stylis/RTL-related errors, `Element type is invalid` errors, or React Router ErrorBoundary output.
* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: the Vite warning for chunks larger than 500 kB remains.

**Remaining known limitations:**

* Live API testing against a running backend was not performed.
* Browser testing covered representative pages rather than every authenticated route.

---
## fix 000066 — Add team management and replace free-text team fields with managed team selection

**Implemented items:**

* Added the team management page at `/admin/teams`.
* Added a Teams navigation item under Management, gated by `team:manage`.
* Added a dedicated `teams` feature containing types, service, hooks, list page, create/edit form, and member management.
* The team list displays name, code, manager, member count, status, creation/update dates, and actions.
* Implemented create, edit, activate/deactivate, and member-management operations through the Teams API.
* The team form includes team name, code, manager, description, and status.
* Team managers are selected from active `ADMIN` or `MANAGER` users through the existing users/owner-options flow; raw user IDs are not shown in the UI.
* The team-members dialog displays current members, adds users through a selector, prevents duplicate selection, and removes members through the member API.
* Removed the free-text Team field from `AdminUserFormDialog` and replaced it with an active-team selector.
* Removed the free-text Team field from `EditUserRoleDialog` and replaced it with an active-team selector.
* Preserved existing validation: team selection is required for `MANAGER` and `REP`, and may remain empty for `ADMIN` and `BOARDS`.
* `AdminUsersPage` no longer derives team filter options from `user.team`; it loads teams from the Teams API.
* The users table displays the team name and avoids showing raw `teamId` values in normal UI.
* Extended the admin-user type with `teamId`, `teamName`, and `teamCode` while preserving compatibility with the legacy `team` field.
* Preserved the existing `teams` lookup group; user assignment in this fix uses the Teams API as its source of truth.

**Important files:**

* `src/features/teams/types/team.types.ts`
* `src/features/teams/services/teams.service.ts`
* `src/features/teams/hooks/useTeams.ts`
* `src/features/teams/pages/AdminTeamsPage.tsx`
* `src/features/teams/components/TeamFormDialog.tsx`
* `src/features/teams/components/TeamMembersDialog.tsx`
* `src/features/admin/users/components/AdminUserFormDialog.tsx`
* `src/features/admin/users/components/EditUserRoleDialog.tsx`
* `src/features/admin/users/components/AdminUsersPage.tsx`
* `src/features/admin/users/types/adminUser.types.ts`
* `src/routes/index.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change existing user API contracts, routes, permissions, or unrelated workflows.
* The Teams implementation depends on the following real backend endpoints:
  * `GET /teams`
  * `POST /teams`
  * `PATCH /teams/:id`
  * `PATCH /teams/:id/activate`
  * `PATCH /teams/:id/deactivate`
  * `GET /teams/:id/members`
  * `POST /teams/:id/members`
  * `DELETE /teams/:id/members/:userId`
* User forms submit the new `teamId` contract and no longer send typed/free-text team values.
* Preserved legacy `team` display and filter compatibility so users without `teamId` continue to show a team name during migration.
* If the backend supports assigning a team on User but does not provide member-management endpoints, the members dialog shows the backend error and does not simulate member management.
* Live API testing was not performed because a running backend was not tested during this work.

**Verification status:**

* `rg`: no free-text `TextField label="Team"` remains in the admin user/team code.
* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: the Vite warning for chunks larger than 500 kB remains.

**Remaining known limitations:**

* Runtime behavior of the Teams endpoints must be verified in an environment connected to the new backend.
* The member-management page depends on backend support for the member-management endpoints.

---
## fix 000067 — Improve team-management access control and 403 handling

**Implemented items:**

* Reviewed the `/admin/teams` route and Teams navigation item. The API path in `teams.service.ts` remains `/teams` because `axiosInstance` already uses `VITE_API_URL`, or the default `http://localhost:3000/api`, as its base URL.
* The Teams navigation item is shown when the user has backend-aligned `team:view` or `team:manage` permission.
* The team management page accepts `team:view` or `team:manage` for page access and shows create, edit, member-management, and status-change operations only with `team:manage`.
* When `GET /teams?includeInactive=true` returns 403, the page shows a clear access warning instead of rendering a broken grid or form.
* Teams queries do not retry on 403 errors, preventing repeated noisy permission failures.
* For 403 errors during team creation or editing, the form shows a clear permission message in both the toast and inline alert.
* Added the shared `isForbiddenError` helper to `src/lib/apiResponse.ts` so 403 detection is not duplicated inside the feature.

**Important files:**

* `src/lib/apiResponse.ts`
* `src/features/teams/hooks/useTeams.ts`
* `src/features/teams/pages/AdminTeamsPage.tsx`
* `src/features/teams/components/TeamFormDialog.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* This fix does not bypass backend security; it only improves the frontend UX for permission failures.
* The backend remains the source of truth for `team:view` and `team:manage` authorization.
* The reported 403 responses from `GET /api/teams?includeInactive=true` and `POST /api/teams` depend on backend permissions.
* Live API testing was not performed; the 403 handling was implemented from the reported runtime behavior.

**Verification status:**

* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: the Vite warning for chunks larger than 500 kB remains.

**Remaining known limitations:**

* Resolving the underlying 403 requires aligning backend permissions and the user token with `team:view` and `team:manage`.

---
## fix 000068 — Add file upload to the commercial document form

**Implemented items:**

* Reviewed the commercial-document create/edit form and replaced the primary File Link UX with a file-upload control.
* Added a Select File button, selected-file name and size display, and a Remove Selected File action.
* Preserved the external file-link field as a secondary optional option labeled External File Link (Optional).
* For a new document, the user must select a document file or enter a valid external link; selecting a file removes the requirement for a raw URL.
* Added lightweight frontend validation for `.pdf`, `.png`, `.jpg`, `.jpeg`, `.doc`, `.docx`, `.xls`, and `.xlsx` extensions and the backend-aligned 25 MB size limit.
* New documents with files are created through `POST /opportunities/:opportunityId/commercial-documents/upload` using `multipart/form-data`.
* Updating an existing document with a new file first updates the document metadata and then attaches the file to that commercial document through the existing `/attachments` endpoint.
* The frontend has no direct MinIO integration and only sends files to the backend.
* Improved the file column in the commercial-documents list: when the backend returns `fileAttachment`, the file name is shown and downloads use the secure backend endpoint `/attachments/:id/download`.
* Legacy external links are displayed only when they use a safe `http` or `https` URL.
* Added Persian-language error messages for invalid files, oversized files, document upload failures, and document download failures.
* Added commercial-document attachment cache invalidation after upload/update to the existing document invalidation flow.

**Important files:**

* `src/features/commercialDocuments/components/CommercialDocumentFormDialog.tsx`
* `src/features/commercialDocuments/components/CommercialDocumentsTab.tsx`
* `src/features/commercialDocuments/services/commercialDocuments.service.ts`
* `src/features/commercialDocuments/hooks/useCommercialDocuments.ts`
* `src/features/commercialDocuments/types/commercialDocument.types.ts`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change the backend or MinIO.
* The backend contract was verified from the local backend repository: document upload uses `POST /api/opportunities/:opportunityId/commercial-documents/upload` with multipart field `file` and metadata matching `CreateCommercialDocumentDto`.
* Actual file storage in MinIO/Local is handled by the backend and existing attachment infrastructure; the frontend does not create or expose buckets, object keys, credentials, or internal MinIO URLs.
* Because the backend has no multipart update endpoint for an existing document, a replacement file is attached through the secure `/attachments` route using entity type `COMMERCIAL_DOCUMENT` and the document `entityId`.
* Uploaded files are downloaded only through the backend `/attachments/:id/download` endpoint.
* Live upload/download testing was not performed because no running backend or real file was tested in this phase.

**Verification status:**

* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: the Vite warning for chunks larger than 500 kB remains.

**Remaining known limitations:**

* Displaying an uploaded file name in the documents list depends on the backend returning the `fileAttachment` summary in the document response; otherwise, files remain visible and downloadable from the Attachments dialog.

---
## fix 000070 — Improve attachment download and error handling

**Implemented items:**

* Reviewed the attachment download path. The frontend continues to call the correct `GET /attachments/:id/download` endpoint through `axiosInstance`, which resolves to `/api/attachments/:id/download` in the browser.
* Preserved `responseType: 'blob'` for download requests.
* Preserved and hardened secure browser downloads using `Blob`, `URL.createObjectURL`, a temporary link with `download`, and `revokeObjectURL`.
* Corrected file-name priority: `Content-Disposition` first, then the human-readable row file name, and finally `attachment-{id}` as the fallback.
* Mapped attachment download failures by HTTP status to clear Persian-language messages:
  * `403`: the user does not have permission to download the file.
  * `404`: the attachment was not found.
  * `400`: the attachment does not contain an uploaded file.
  * `500`: the storage repository could not return the file.
* The download action in `AttachmentsTab` now catches failures instead of leaving a rejected promise unhandled.
* The download action is shown only for rows backed by a stored file; external-only rows receive an Open Link action.
* Attachment table file names are resolved from `originalFileName`, `originalName`, or `fileName`, with a fallback only when no human-readable name is available.
* The uploader display still prioritizes `uploadedBy.fullName`, then email, and finally `uploadedById`.
* Added optional `originalName`, `fileName`, `externalUrl`, and `fileUrl` fields to the attachment type for compatibility with legacy or mixed backend responses.

**Important files:**

* `src/features/attachments/services/attachments.service.ts`
* `src/features/attachments/components/AttachmentsTab.tsx`
* `src/features/attachments/types/attachment.types.ts`
* `src/features/attachments/utils/attachmentDisplay.ts`
* `README.md`

**Assumptions and backend dependencies:**

* This is a frontend-only fix and does not change the backend.
* The current 500 download failure originates from the backend/storage layer; the frontend presents an appropriate message but does not bypass the backend cause.
* The frontend does not create or expose MinIO URLs, buckets, object keys, or credentials.
* When the backend provides only `externalUrl` or `fileUrl` for a record, the frontend opens the external link instead of calling the backend download endpoint.
* Live download testing against a running backend was not performed.

**Verification status:**

* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: the Vite warning for chunks larger than 500 kB remains.

**Remaining known limitations:**

* Resolving the underlying 500 download failure requires backend/storage investigation and confirmation that the file exists in the storage repository.

---

## fix 000071 — Align commercial document file-upload contract

**Implemented items:**

* Aligned the frontend contract for `POST /opportunities/:opportunityId/commercial-documents/upload` with the backend contract.
* Commercial document files are sent in `FormData` under the `file` field.
* Removed manual `Content-Type` configuration for multipart requests so the browser and Axios can generate the correct boundary.
* Restricted metadata sent to the backend to supported commercial-document fields. Frontend-only fields such as `file`, `attachmentId`, and `fileAttachmentId` are no longer included in the textual payload.
* Preserved the optional external-link field in the form, while sending it through `fileUrl` in the commercial-document persistence contract.
* Improved HTTP 400 handling in the commercial-document form. Backend validation messages are displayed when available; otherwise, a Persian-language fallback indicates that the document information or selected file is invalid.

**Important changed files:**

* `src/features/commercialDocuments/services/commercialDocuments.service.ts`
* `src/features/commercialDocuments/components/CommercialDocumentFormDialog.tsx`
* `README.md`

**Backend assumptions and dependencies:**

* This was a frontend-only fix; the backend was not changed.
* The backend commercial-document upload contract uses `FileInterceptor('file')`.
* The frontend does not connect directly to MinIO. Files are sent only through the backend API.
* Commercial-document enums continue to use backend codes such as `PROPOSAL`, `PROFORMA`, and `CONTRACT`.
* Live upload testing against a running backend was not performed.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining limitations:**

* Final verification of file persistence in MinIO requires a manual upload scenario with the backend and storage infrastructure running.

---

## fix 000072 — Correct multipart handling for commercial document uploads

**Implemented items:**

* Aligned the commercial-document upload request in `commercialDocuments.service.ts` with the established attachment-service pattern.
* When sending `FormData` to `POST /opportunities/:opportunityId/commercial-documents/upload`, set the request-level `Content-Type` value to `undefined` so the browser generates the correct multipart boundary.
* Updated the shared Axios interceptor to remove `Content-Type` when `config.data` is a `FormData` instance, preventing the default `application/json` value from leaking into multipart requests.
* Kept the file field name as `file` and did not change the backend endpoint path.

**Important changed files:**

* `src/lib/axios.ts`
* `src/features/commercialDocuments/services/commercialDocuments.service.ts`
* `README.md`

**Backend assumptions and dependencies:**

* This was a frontend-only fix; the backend was not changed.
* The backend continues to expect `FileInterceptor('file')` for commercial-document uploads.
* If HTTP 400 errors continue after the header correction, the next investigation should cover backend validation details, the `amount` value, date formats, and the `type` and `status` enums.
* Live upload testing against a running backend was not performed.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining limitations:**

* Final confirmation that the HTTP 400 error is resolved requires a manual upload test with the backend and storage service running.

---

## fix 000073 — Dockerize the frontend with Nginx and API proxying

**Implemented items:**

* Added a multi-stage production Dockerfile.
* The build stage uses `node:22-bookworm-slim`, `npm ci`, and `npm run build`.
* Added `ARG VITE_API_URL=/api`, `ENV VITE_API_URL=$VITE_API_URL`, and `ENV NODE_OPTIONS=--max-old-space-size=4096` for the build.
* The runtime stage uses `nginx:1.27` and serves the `dist` output from `/usr/share/nginx/html`.
* Added `nginx.conf` with SPA fallback and `/api/` proxying to `http://api:3000/api/`.
* Added proxy headers, 300-second timeouts, and `client_max_body_size 30M`.
* Added `docker-compose.yml` for standalone frontend execution on default port `8080`, connected to the external `iam-crm-backend_default` network.
* Added `.dockerignore` to reduce the build context and exclude `node_modules`, `dist`, `.git`, logs, real environment files, caches, and IDE files.
* Reviewed `src/lib/axios.ts` and left it unchanged because it already supports `VITE_API_URL` and removes `Content-Type` for `FormData`.
* Reviewed attachment downloads and confirmed they continue to use the backend endpoint with `responseType: 'blob'`.

**Important changed/new files:**

* `Dockerfile`
* `nginx.conf`
* `docker-compose.yml`
* `.dockerignore`
* `README.md`

**Backend assumptions and dependencies:**

* This was a frontend-only fix; the backend was not changed.
* The backend service must be available in Docker Compose as `api` on port `3000`.
* The expected external network is `iam-crm-backend_default`. If the backend project name differs, update the network in `docker-compose.yml`.
* The production `VITE_API_URL` value is `/api`; no public backend IP or URL is hardcoded in frontend source code.
* Nginx inside the frontend container proxies `/api/` to `http://api:3000/api/` rather than to container-local `localhost`.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* `docker compose config` was run.
* `docker compose build --no-cache --progress=plain` was run.
* `docker compose up -d` was run.
* `docker logs --tail=100 iam-crm-frontend` was run.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining limitations:**

* If the target environment reports `host not found in upstream "api"`, align the backend Docker service and network names with the server's Docker Compose configuration.
* Complete API and authentication testing requires the backend to run on the expected network.

---

## fix 000074 — Resolve stale Docker DNS in the frontend API proxy

**Implemented items:**

* Investigated intermittent Nginx HTTP 502 errors after the backend container was rebuilt or recreated.
* Replaced the static `proxy_pass http://api:3000/api/` upstream pattern so Nginx no longer retains the backend service's previous Docker IP.
* Added Docker's internal resolver to the `/api/` location through `resolver 127.0.0.11 valid=10s ipv6=off;`.
* Defined the backend upstream through `set $api_upstream api:3000;` so Nginx re-resolves the Docker service name.
* Changed `proxy_pass` to `http://$api_upstream` and removed the `/api/` suffix so the original request URI is preserved.
* Paths such as `/api/auth/login` are now forwarded to `http://api:3000/api/auth/login`.
* Preserved the existing proxy headers and 300-second timeouts.

**Important changed files:**

* `nginx.conf`
* `README.md`

**Backend assumptions and dependencies:**

* This fix affected only the frontend/Nginx layer; the backend was not changed.
* The backend must be available on the same Docker network under service name `api` and port `3000`.
* If upstream errors continue in the target environment, verify the actual backend network and service names and align `docker-compose.yml` and `nginx.conf`.

**Verification status:**

* `docker compose up -d --build` was run.
* `docker logs --tail=100 iam-crm-frontend` was run, and Nginx started without startup errors.
* Direct live API testing was not performed.

**Remaining limitations:**

* Full confirmation of the HTTP 502 fix requires recreating the backend in the target environment and then testing login through `/api/auth/login`.

---

## fix 000075 — Complete company registration profile and legal documents

**Implemented items:**

* Extended company types with `registrationNumber`, `nationalId`, `economicCode`, `establishmentDate`, `activityStatus`, `registeredCapital`, `employeeCount`, `parentCompanyIds`, `subsidiaryCompanyIds`, `parentCompanies`, and `subsidiaryCompanies`.
* Added company legal-document types for `OFFICIAL_GAZETTE` and `LATEST_CHANGES`.
* Extended company create and edit forms with registration number, national ID, economic code, establishment date, activity status, registered capital, employee count, parent companies, and subsidiary companies.
* Activity status is displayed with Persian labels for Active, Inactive, Merged, and Unknown.
* Parent and subsidiary companies are selected through a multi-select Autocomplete with server-side search.
* The current company is excluded from ownership-structure options during editing, and selecting the same company as both parent and subsidiary is validated.
* Registered capital and employee count normalize Persian and Arabic digits before payload submission.
* Establishment date uses the existing Jalali component in the UI and sends an ISO/Gregorian value to the backend.
* Company details now include Registration and Legal Information, Company Status and Size, and Ownership Structure sections.
* Parent and subsidiary companies are shown as clickable chips in the company profile.
* Added a Legal Documents tab to the company profile.
* Implemented legal-document upload with metadata for document type, title, description, and document date.
* Implemented legal-document listing, secure backend attachment download, and deletion.

**Important changed/new files:**

* `src/features/companies/types/company.types.ts`
* `src/features/companies/services/companies.service.ts`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/components/CompanyForm.tsx`
* `src/features/companies/components/CreateCompanyDialog.tsx`
* `src/features/companies/components/EditCompanyDialog.tsx`
* `src/features/companies/components/CompanyLegalDocumentsTab.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/utils/companyDisplay.ts`
* `src/features/attachments/types/attachment.types.ts`
* `README.md`

**Backend assumptions and dependencies:**

* The backend must support the new company fields and `/companies/:companyId/legal-documents` endpoints.
* Legal-document upload uses `POST /companies/:companyId/legal-documents/upload` with multipart field `file`.
* Legal-document downloads continue through the backend attachment route; the frontend does not construct direct MinIO URLs.
* Existing `company:view` and `company:update` permissions are used for viewing and for edit/upload/delete actions respectively.
* Live create, edit, upload, download, and delete testing against a running backend was not performed.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining manual checklist:**

* Create a company with the new fields.
* Edit a company with the new fields.
* Verify the new fields in company details.
* Select and display parent and subsidiary companies.
* Upload, display, download, and delete Official Gazette and Latest Changes documents.
* Verify backend validation messages in live scenarios.

---

## fix 000076 — Repair corrupted Persian text encoding in the frontend

**Implemented items:**

* Reviewed and corrected corrupted Persian text in the company details page.
* Replaced broken tab labels, buttons, error messages, primary-information cards, registration and legal information, company status and size, ownership structure, and legal-document tab text with readable UTF-8 Persian strings.
* Verified that `index.html` already contains `meta charset="UTF-8"`.
* Searched source files and the README for mojibake and found no remaining common corruption markers.

**Important changed files:**

* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/components/CompanyLegalDocumentsTab.tsx`
* `README.md`

**Assumptions and dependencies:**

* This was a frontend-only correction and did not change any API contract or backend behavior.
* The issue originated from corrupted string literals in source code, not from the font or theme.
* Changed files were saved with readable Persian text in UTF-8.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining manual checklist:**

* The production build was opened locally and Persian text on the login page rendered correctly. Company details could not be opened because an authenticated session and accessible backend were unavailable.
* Perform final verification of tabs, buttons, primary-information cards, registration and legal information, company status and size, ownership structure, and legal documents in an authenticated environment.

---

## fix 000077 — Add employment and education history to person profiles

**Implemented items:**

* Added Employment History and Education History sections to the person detail panel.
* Employment-history companies are selected through an Autocomplete with server-side search over existing companies.
* Multiple positions can be added for one company when creating employment history; individual position creation, editing, and deletion are also supported.
* Each position includes title, start date, end date, current-position status, and description. Dates are shown as Jalali values in the UI and sent as ISO values in payloads.
* For current positions, the end date is disabled and cleared. Start/end date ordering is validated in the frontend.
* Implemented education-history create, edit, and delete flows with degree, university, year, and description fields.
* Persian and Arabic digits in year values are normalized before submission, and the integer range 1000–3000 is validated.
* Added loading, empty, and error states plus success/error messages for both sections.
* Viewing uses `person:view`; management uses the existing `person:update` permission. No new permission was created.

**Important changed/new files:**

* `src/features/people/types/person.types.ts`
* `src/features/people/services/people.service.ts`
* `src/features/people/hooks/usePeople.ts`
* `src/features/people/components/PersonEmploymentHistorySection.tsx`
* `src/features/people/components/PersonEducationHistorySection.tsx`
* `src/features/people/components/PersonDetailDrawer.tsx`
* `src/features/people/components/PeopleTab.tsx`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `README.md`

**Backend dependencies:**

* `/people/:personId/employment-history` and `/people/:personId/education-history` endpoints must be available.
* Position management uses nested endpoints under `/people/:personId/employment-history/:employmentId/positions`.
* Employment-history responses must include a company summary and `positions` array according to the backend contract.
* Live create/edit/delete testing requires an authenticated session, a running backend, and applied migrations.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining manual checklist:**

* Verify both history sections and their empty, loading, and error states in person details.
* Create and edit employment history with an existing company and multiple positions.
* Add, edit, and delete individual positions and delete an entire employment-history record.
* Create, edit, and delete education history with degree, university, and year.
* Verify Persian UI text in an authenticated environment with the backend ready.

---

## fix 000078 — Fix `crypto.randomUUID` errors in the employment-history form

**Implemented items:**

* Identified that the Add Employment History form crashed because `crypto.randomUUID()` was called directly in browsers or HTTP origins where the API is unavailable.
* Added a shared `createClientId` helper that uses `randomUUID`, then `getRandomValues`, and finally a time-and-random-value fallback.
* Removed direct calls from the employment-history component and generated temporary position IDs with the `employment-position` prefix.
* Temporary IDs are stored only as `clientTempId` for React keys and form-row management; they are not sent to the backend in position or employment-history payloads.
* Creating employment history and adding multiple positions no longer depends directly on `crypto.randomUUID` when temporary rows are created.
* Added a lightweight `errorElement` with a Persian-language message, retry action, and links back to primary routes.

**Important changed/new files:**

* `src/shared/utils/createClientId.ts`
* `src/features/people/components/PersonEmploymentHistorySection.tsx`
* `src/routes/RouteErrorPage.tsx`
* `src/routes/index.tsx`
* `README.md`

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Manual checklist:**

* Open person details and the Add Employment History form over HTTP without a `crypto.randomUUID` error.
* Select a company, add one or more positions, and save the record.
* Verify add, edit, and delete operations for positions and employment history with a ready backend and authenticated session.
* Check the browser console and confirm that no `crypto.randomUUID` error occurs.
* The provided HTTP address was opened in a browser and redirected to login without a console error. Interactive testing of the person-detail form was not performed because no authenticated session was available.

---

## fix 000079 — Refine education history and add the university library

**Implemented items:**

* Replaced the free-text degree field in education-history create/edit forms with a dropdown.
* Degree options are exactly `DIPLOMA`, `ASSOCIATE`, `BACHELOR`, `PHD`, and `POSTDOC`, with Persian labels for Diploma, Associate, Bachelor, PhD, and Postdoctoral. A Master's degree option was intentionally not added.
* Replaced the free-text university field with an Autocomplete backed by active university-library records; only `universityId` is sent to the backend.
* Removed the numeric year input and replaced it with a Jalali Education Date picker; the ISO/Gregorian value is sent through `educationDate`.
* Education-history display now shows the Persian degree label, university relation name or historical snapshot, Jalali date, and description.
* Added a Universities tab to Admin Libraries with listing, create, edit, activate/deactivate, and status display through the university endpoints.
* The university form includes name, optional code/identifier, description, active status, and backend validation-message display.
* Added existing backend permissions `library:university:view` and `library:university:manage` to the frontend's known-permission list.

**Important changed files:**

* `src/features/people/types/person.types.ts`
* `src/features/people/components/PersonEducationHistorySection.tsx`
* `src/features/catalogs/types/catalog.types.ts`
* `src/features/catalogs/services/catalogs.service.ts`
* `src/features/catalogs/components/CatalogItemDialog.tsx`
* `src/features/catalogs/components/CatalogTab.tsx`
* `src/features/catalogs/pages/AdminLibrariesPage.tsx`
* `src/features/admin/permissions/types/adminPermission.types.ts`
* `README.md`

**Backend dependencies:**

* `GET/POST /universities` and `PATCH/DELETE /universities/:id` must be available. According to the backend contract, DELETE deactivates a university.
* The admin list uses `includeInactive=true`; education-history selection uses the default active-university list.
* Education-history payloads contain only `degree`, `universityId`, `educationDate`, and `description`; `year` and free-text university/degree values are no longer sent.
* The education-history cleanup and university-library migration must be applied in the backend environment.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining manual checklist:**

* Create, edit, and deactivate a university in the Universities tab against a migrated backend and authenticated session.
* Open the education-history form and verify the degree dropdown, active university options, and Jalali date picker.
* Save and verify the degree label, university name, and education date in person details.
* Verify live backend validation messages and edit/delete behavior in the integrated environment.

---

## fix 000080 — Redesign role and permission management

**Implemented items:**

* Replaced the previous fixed four-role matrix with a Role and Permission Management page containing separate Permissions and Roles tabs.
* The Permissions tab supports listing, search, create, edit, and delete operations with permission code, display name, group, description, and status fields.
* System permissions are clearly marked; their codes cannot be edited and deletion is disabled in the UI. Backend restriction errors are also displayed.
* The Roles tab supports listing, search, create, edit, and delete operations with code, name, base role, description, status, system-role flag, and permission count.
* Deletion is disabled in the UI for system roles and ADMIN. Restrictions for roles assigned to users are delegated to the backend and their messages are displayed.
* Added an Assign Permissions action for each role. The role-permission dialog displays all active permissions, assigned state, search, grouping, select all, and clear all.
* Assignments are saved as a complete replacement of the `permissionIds` array. After success, the role list and permission counts are refreshed.
* The user-role edit form now loads active database-backed roles from the API and sends `roleId`; user-role display prefers `roleName`/`assignedRole`.
* Aligned the admin menu with actual `permission:view`, `permission:manage`, `role:view`, and `role:manage` permissions.

**Important changed files:**

* `src/features/admin/permissions/types/adminPermission.types.ts`
* `src/features/admin/permissions/services/adminPermissions.service.ts`
* `src/features/admin/permissions/hooks/useAdminPermissions.ts`
* `src/features/admin/permissions/components/AdminPermissionsPage.tsx`
* `src/features/admin/users/types/adminUser.types.ts`
* `src/features/admin/users/components/EditUserRoleDialog.tsx`
* `src/features/admin/users/components/AdminUsersPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Backend dependencies and limitations:**

* Permission CRUD uses `/permissions`; role CRUD uses `/roles`.
* Role assignments use `GET /roles/:id/permissions` and atomic replacement through `PUT /roles/:id/permissions` with `{ permissionIds }`.
* UI permission checks use exactly `permission:view`, `permission:manage`, `role:view`, and `role:manage`.
* `PATCH /users/:id/role` supports `roleId`, enabling dynamic frontend role editing.
* The backend create-user DTO still does not accept `roleId` and requires the base `role` enum. The create-user form therefore intentionally retains the four base roles rather than fabricating dynamic-role support.
* Dynamic-RBAC migrations and seeds must be applied, and users must log in again to receive updated permissions.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining manual checklist:**

* Create, edit, and delete a regular permission and verify system-permission protection.
* Create, edit, and delete a regular role and verify protection for system roles, ADMIN, and roles assigned to users.
* Open the permission-assignment dialog, change selections, and save the full replacement.
* Verify refreshed permission counts and backend validation/restriction errors.
* Edit a user's role with an active database-backed role and log in again to verify updated permissions.

---

## fix 000081 — Improve pipeline layout and remove horizontal page scrolling

**Implemented items:**

* Identified that the poor UX came from rendering every pipeline stage in one horizontal Stack with a fixed 310-pixel column width and `overflowX: auto`.
* Replaced the horizontal layout with a multi-row CSS Grid so the page scrolls vertically instead of horizontally.
* Configured responsive columns as one on mobile, two on small screens, three on medium screens, four on large screens, and five on wide desktop screens.
* Stage ordering still follows backend `sortOrder`; source order was not changed, and in RTL the first stage naturally appears at the right side of a row.
* Each stage card now has flexible width without a forced minimum width and a fixed, viewport-aware height between 520 and 640 pixels.
* The stage header, including name and opportunity count, remains outside the scroll area. Only that stage's opportunity list scrolls through `overflowY: auto`.
* Standardized each stage's empty-state message to the Persian equivalent of “No opportunities exist in this stage,” while preserving independent loading and error states.
* Made opportunity cards more compact while retaining title, company, contact, priority, owner, close date, value, and view/company/change-stage actions.
* Preserved search, priority filtering, refresh, opportunity details, and stage-change behavior without changing API contracts.
* The existing implementation did not contain drag-and-drop. The real Change Stage fallback remains available, and no DnD capability was removed.

**Important changed files:**

* `src/features/pipeline/pages/PipelinePage.tsx`
* `src/features/pipeline/components/PipelineColumn.tsx`
* `src/features/opportunities/components/OpportunityCard.tsx`
* `README.md`

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.

**Remaining manual checklist:**

* Verify `/pipeline` on mobile, tablet, medium, large, and wide-desktop viewports with real multi-stage data.
* Confirm five columns per row on wide desktop, no page-level horizontal scrolling, and correct RTL ordering.
* Verify independent internal scrolling for a stage with many opportunities while its header remains fixed.
* Verify opportunity clicks, company navigation, stage changes, search, priority filtering, and refresh with a valid backend session.
* The provided `/pipeline` URL was opened but redirected to login. The new grid could not be visually verified with real data in that deployment because no authenticated session was available.

---

## fix 000082 — Correct `sourceOptionId` submission during opportunity creation

**Implemented items:**

* Identified that the frontend sent invalid `sourceOptionId` values, including empty strings and non-UUID values.
* Optional opportunity UUID fields are normalized at the create/update service boundary. `sourceOptionId`, `ownerId`, and `primaryContactId` are sent only when valid UUIDs; otherwise, they are removed from the payload.
* The opportunity-source dropdown shows only options with valid UUID identifiers and stores each option's `id`. When no option is selected, `sourceOptionId` is omitted.
* Company-scoped creation through `POST /api/companies/:companyId/opportunities`, global creation, and update flows share the same normalization. Required fields such as title are preserved, and the selected `stageId` is sent unchanged.
* Improved form errors so `details` arrays from standardized or legacy validation responses, including `sourceOptionId must be a UUID`, are shown both in the form and in toasts.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.

**Important changed files:**

* `src/shared/utils/optionalUuid.ts`
* `src/features/opportunities/components/OpportunityForm.tsx`
* `src/features/opportunities/components/OpportunityFormDialog.tsx`
* `src/features/opportunities/services/opportunities.service.ts`
* `src/lib/apiResponse.ts`
* `README.md`

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Live endpoint testing with an authenticated backend session was not performed. Removal of empty or invalid `sourceOptionId` values was verified in the shared service-payload layer.

---

## fix 000083 — Implement automatic access-token renewal in the frontend

**Implemented items:**

* The refresh token is stored only in an HttpOnly cookie according to the backend contract. The frontend does not read it from JavaScript or send it in a request body or header.
* Added `withCredentials: true` to Axios so the session cookie is included in `POST /auth/refresh` and other authentication requests.
* The request interceptor continues to add the `accessToken` stored in `localStorage` as a Bearer token.
* For HTTP 401 responses from non-login/non-refresh requests, the response interceptor runs `POST /auth/refresh` once, stores the new `accessToken` and user, and retries the original request with the refreshed token.
* Concurrent HTTP 401 responses share one refresh promise, so only one refresh request runs while the others wait for its result.
* If refresh fails or the retried request returns HTTP 401 again, the access token and user are cleared, the query cache is reset, and the user is redirected to login. HTTP 403 responses do not enter the refresh flow.
* Existing logout actions in the main navigation and legacy layout call `POST /auth/logout` first and always perform local cleanup in `finally`, even if the endpoint fails.
* Password, passkey, and SSO login flows continue to store only `accessToken` and `user` from the response and do not depend on a refresh token in JSON.
* Preserved the current `VITE_API_URL` and localhost fallback; no new server IP was hardcoded.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.

**Important changed files:**

* `src/lib/axios.ts`
* `src/features/auth/services/auth.service.ts`
* `src/components/dashboard/AppNavbar.tsx`
* `src/layouts/MainLayout.tsx`
* `README.md`

**Backend dependency:**

* The backend must issue the refresh-token cookie with appropriate HttpOnly/SameSite/Secure settings and credential-compatible CORS, support `POST /api/auth/refresh` for cookie rotation and `{ accessToken, user }` responses, and expose `POST /api/auth/logout`.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Manual login, cookie, and access-token-expiration testing with a backend browser session was not performed. It requires a running backend, correct CORS/cookie configuration, and a valid session.

---

## fix 000084 — Add All/Mine ownership filters to companies and opportunities

**Implemented items:**

* Added the shared `OwnershipScope` type with `all`, `mine`, `team`, and `unassigned` values and used it in company and opportunity list parameters.
* Added a Display filter to the company list with All Companies, My Companies, My Team, and Unassigned options.
* Added a Display filter to the opportunity list with All, Mine Only, My Team, and Unassigned options while preserving search, existing filters, and pagination.
* Both lists default to `all`. The frontend no longer generates the current user's `ownerId` for the default state; it sends the selected scope directly through the `ownershipScope` parameter.
* The My Team option is hidden from company, opportunity, and pipeline lists for users without a team.
* Added a compact Display control to the pipeline with All Opportunities, My Opportunities, and My Team. The scope is included in each column's query key and stage request, so changes trigger refetching and update stage counts.
* Preserved the multi-column grid and no-horizontal-scroll behavior; only the new filter dimension was added to existing queries.
* Backend validation errors for company lists, opportunity lists, and pipeline columns are displayed with API response details.
* Reviewed reports. Existing advanced owner/team filters are optional and do not apply `ownerId` or a Mine state by default, so reports were not changed to avoid sending unsupported parameters.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.

**Important changed files:**

* `src/shared/types/ownership.ts`
* `src/features/companies/types/company.types.ts`
* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/opportunities/types/opportunity.types.ts`
* `src/features/opportunities/pages/OpportunitiesPage.tsx`
* `src/features/pipeline/hooks/usePipeline.ts`
* `src/features/pipeline/pages/PipelinePage.tsx`
* `README.md`

**Backend dependency:**

* Company and opportunity list endpoints must apply `ownershipScope=all|mine|team|unassigned` together with organization scoping and view permissions. Pagination totals must be calculated after the same filter.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Manual testing with the backend and sales users with and without teams was not performed. It requires organizational data and valid sessions.

**Manual verification checklist:**

* In Companies, the default state should show all organization-visible companies; My Companies and Unassigned should show the corresponding records while preserving search and pagination.
* In Opportunities, the default state should show all visible opportunities; Mine Only and My Team should return the corresponding records.
* In Pipeline, switching from All Opportunities to My Opportunities should refetch columns and stage counts, and switching back to All should work correctly.

---

## fix 000085 — Display lookup labels on people screens

**Implemented items:**

* Identified that people tables and details displayed stored lookup values such as `ECONOMIC_BUYER` directly instead of resolving them against lookup options.
* Added the shared `getLookupLabel` helper, which matches values against an option's `id`, `code`, or `value` and displays the Persian API `label`.
* Persona roles from `persona-roles` now display their labels in the global `/people` directory, company People tab, and person detail drawer.
* Other lookup-backed person fields, including department, job title, and seniority level, also resolve labels from their corresponding groups in the same views.
* Filters and form dropdowns continue to display option labels while preserving backend-compatible stored values (`value`/code, or existing IDs in legacy records). Persian labels are not sent instead of API contract values.
* During lookup loading/errors or when no matching option exists, the previous raw value is shown as a fallback; empty values display `—`.
* Contact-method type and social-platform display were not changed because those areas use their existing explicit enums and labels, and their current person forms do not use the lookup contract.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.

**Important changed files:**

* `src/features/catalogs/types/catalog.types.ts`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `src/features/people/components/PeopleTab.tsx`
* `src/features/people/components/PersonDetailDrawer.tsx`
* `src/features/people/components/PersonForm.tsx`
* `README.md`

**Backend dependency:**

* The backend must return active options for `persona-roles`, `departments`, `job-titles`, and `seniority-levels` with `id`, `code`, and `label` through the existing lookup API. If lookup data is missing or unavailable, the frontend displays the stored value.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Manual testing with a backend record containing `ECONOMIC_BUYER` was not performed. It requires lookup data and a valid session.

**Manual verification checklist:**

* In `/people`, the Persona Role column should display the Persian label equivalent of Economic Decision Maker instead of `ECONOMIC_BUYER`, while search and filters continue to work.
* The company People tab and person detail drawer should display the same resolved label.
* Person create/edit forms should display labels in dropdowns and submit backend-compatible values.
* Records without matching lookup options should display their raw codes without crashing.

---

## fix 000086 — Correct legal-document upload result handling

**Implemented items:**

* Reviewed and preserved the upload route as `POST /companies/:companyId/legal-documents/upload`, using `FormData` with the file field named `file`. Metadata includes `type`, `title`, `description`, and `documentDate`.
* Removed manual `Content-Type` configuration from the upload request so the shared Axios interceptor can remove the JSON header and the browser can generate the correct multipart boundary.
* The upload response is now unwrapped and validated. The created record can be read from a direct response or from `data`, `document`, and `legalDocument` envelopes.
* When a valid record is returned, the legal-document list cache is updated immediately with the new document, the active legal-document query is explicitly refetched, and the company-detail query is invalidated.
* After confirmed success, the UI displays a success message, resets the form, and closes the dialog.
* When a 2xx response does not contain a document record, the UI no longer reports false success. It displays a warning, refetches the list, and then resets and closes the dialog.
* Non-2xx errors display the backend message both inside the form and in a toast. The form remains open for correction or retry, and HTTP 403 responses show a clear permission-denied message.
* Aligned the Company Legal Documents section title and the Upload Legal Document dialog title with the Persian UI labels.

**Important changed files:**

* `src/features/companies/services/companies.service.ts`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/components/CompanyLegalDocumentsTab.tsx`
* `README.md`

**Backend dependency:**

* The backend must support `POST /api/companies/:companyId/legal-documents/upload` with `FileInterceptor('file')` and the metadata listed above. After a successful upload, it must return the created document record and make the new record immediately available through the legal-document list endpoint.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Manual upload testing with a real file and running backend was not performed. It requires an authenticated session, a running backend, and connected storage.

---

## fix 000087 — Add owner filtering and preserve company-list page size

**Implemented items:**

* Added an Owner filter to the Companies page with All Owners, Unassigned, and active users returned by the owner-options endpoint.
* Each owner option displays the user's full name and shows available email, team, and role information as secondary details. No users are hardcoded in the frontend.
* Selecting a specific owner sends `ownerId` together with `ownershipScope=all` to the Companies API. Selecting Unassigned uses the existing `ownershipScope=unassigned` contract.
* Selecting My Companies, My Team, or Unassigned clears any previously selected owner to prevent conflicts between `ownerId` and the selected ownership scope. Selecting a specific owner resets the scope to `all`.
* If the owner-options request fails, the Owner filter is disabled and a Persian-language warning is displayed, while company loading and all other filters remain usable.
* Company DataGrid page-size options now include `5`, `10`, `20`, `50`, and `100`, with a Persian-language Rows per Page label.
* Pagination remains controlled. The `page` and `limit` values are stored in the `/companies` query string, and the selected page size is also persisted in `localStorage` so it survives refreshes and navigation back to the list.
* Changing pages preserves the selected page size. Changing search text or filters resets only the page to 1 and does not change the page size.
* The back link from Company Details preserves the current company-list query string, and the query key/API request continue to use the controlled page and limit values.
* Updated the empty-state message to the Persian equivalent of “No companies were found with these filters.”
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.

**Important changed files:**

* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/companies/types/company.types.ts`
* `README.md`

**Backend dependency:**

* The backend must support `GET /api/users/owner-options` for assignable users and the Companies list endpoint with `ownerId`, `ownershipScope`, `page`, and `limit`, including `limit=100`.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Manual testing with a running backend and authenticated browser session was not performed. It requires multi-owner data and a valid session.

**Manual verification checklist:**

* On `/companies`, select page size 20, navigate to page 2, and confirm that page size 20 remains selected. Refresh and confirm that `limit=20` is preserved.
* Select page size 50 and change a filter or search term. Confirm that the page resets to 1 while page size 50 remains selected.
* Select page size 100 and confirm in Network that the Companies request sends `limit=100`.
* Select a specific owner and verify that `ownerId` is sent. Then select Unassigned and verify that only unassigned companies are returned.

---

## fix 000088 — Add server-side search and pagination to company selectors

**Implemented items:**

* Identified that incomplete company option lists were caused by loading one small fixed page and filtering only that data in the browser. The shared company selector now delegates searching and pagination to the backend.
* Added reusable single-select and multi-select company components with a 400-millisecond debounce, 25-record pages, and next-page loading when the option list is scrolled near the end.
* Query keys include the normalized search text and excluded company ID. `AbortSignal` is passed to Axios so stale search responses cannot replace newer results.
* Results from multiple pages and selected records are merged and deduplicated by `id`. Existing selections are hydrated from expanded record data or, for the single-select component, from the option-detail endpoint when a label is unavailable.
* Option labels are built from brand name and legal name, with national ID or registration number shown as secondary text. API errors are displayed inside the field and do not crash the form.
* Company selection in the People Directory filter, Task form, person employment history, and parent/subsidiary company relationships now uses the shared component. Payloads continue to send only company IDs.
* While editing a company, the current company is excluded server-side from parent/subsidiary options through `excludeId`, and the two relationship selections cannot overlap.
* No local filtering is performed over a limited page. Changing the search term restarts pagination for that query from page 1.

**Important changed files:**

* `src/components/companies/CompanyAutocomplete.tsx`
* `src/features/companies/hooks/useCompanies.ts`
* `src/features/companies/services/companies.service.ts`
* `src/features/companies/types/company.types.ts`
* `src/features/companies/utils/companyOption.ts`
* `src/features/companies/components/CompanyForm.tsx`
* `src/features/companies/components/EditCompanyDialog.tsx`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `src/features/people/components/PersonEmploymentHistorySection.tsx`
* `src/features/tasks/components/TaskFormDialog.tsx`
* `README.md`

**Backend dependency:**

* The backend must support `GET /api/companies/options` with `search`, `page`, `limit`, and `excludeId`, plus `GET /api/companies/options/:id` for hydrating existing selections. These endpoints must enforce organization scope and company-view permissions and return the fields required to build option labels.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks passed as part of `npm run build`.
* `npm run build` passed.
* Non-blocking warning: Vite still reports a chunk larger than 500 kB.
* Automated tests were not run because this repository has no configured `test` script or test runner in `package.json`.
* Manual browser testing with a running backend and authenticated session was not performed.

**Manual verification checklist:**

* Search for a company that is not present on the first result page and confirm that the backend result is displayed.
* Scroll to the end of the list and verify in Network that the next page is fetched and merged without duplicate options.
* Open an edit form with an existing company selection and confirm that the selected label appears before any search is performed.
* In company relationships, confirm that the current company is absent and that payloads contain only arrays of parent/subsidiary company IDs.
* Simulate an authorization or network error from the options endpoint and confirm that the field displays the error without crashing the form.

---

## fix 000089 — Add meeting-management user interface

**Implemented items:**

* Added a Meetings navigation item governed by the dynamic `meeting:view` permission and added `/meetings` and `/meetings/:meetingId` routes. No role-based meeting restriction is hardcoded in the frontend.
* Implemented a global Meetings page with search, quick filters for Today, Upcoming, Past, Completed, Cancelled, and My Meetings, plus status, meeting mode, and date-range filters, server-side pagination, and a responsive DataGrid. Filter and pagination parameters are persisted in the URL.
* Added a reusable create/edit meeting form with company, related opportunity, title, agenda, description, meeting mode, location, meeting link, start/end date and time, reminder, internal assignees, and company attendees.
* Company options come from `GET /api/companies/options`, opportunities from the selected company's opportunity API, assignees from `GET /api/users/assignee-options`, and attendees from the People Directory with server-side search and pagination. Payloads send only IDs.
* Selected assignees and attendees remain available even when they are not on the first page of options, and all options are deduplicated by `id`. Changing the company clears incompatible opportunity and attendee selections after user confirmation.
* Added reminder presets for None, 15/30 Minutes Before, 1/2 Hours Before, One Day Before, and Custom Time. Presets calculate an exact UTC `reminderAt` value from `startAt`; end time and reminder timing are validated before submission.
* In-person meetings show only Location, online meetings show only Meeting Link, and hybrid meetings show both. Meeting links open with `target="_blank"` and `rel="noopener noreferrer"`.
* The Meeting Details page supports edit with `meeting:update`, completion with `meeting:complete`, and cancellation with `meeting:cancel`, including confirmation dialogs, result notes/cancellation reasons, backend messages, and query invalidation.
* Added a Meetings tab to Company Details and Opportunity Details. The shared form opens with the company/opportunity preselected, and a scoped View All Meetings link navigates to the global Meetings page.
* Added the `MEETING_REMINDER` notification type and `MEETING` entity type with Persian labels, and allowed safe notification navigation to `/meetings/:meetingId`.
* Meeting status and mode enums are displayed with Persian labels and Chips. Long meeting URLs are not printed directly in table cells.

**Backend endpoints used:**

* `GET/POST /api/meetings`
* `GET/PATCH /api/meetings/:id`
* `PATCH /api/meetings/:id/complete`
* `PATCH /api/meetings/:id/cancel`
* `GET /api/companies/options`
* `GET /api/companies/:companyId/opportunities`
* `GET /api/users/assignee-options`
* `GET /api/people/directory`

**Important changed/new files:**

* `src/features/meetings/types/meeting.types.ts`
* `src/features/meetings/services/meetings.service.ts`
* `src/features/meetings/hooks/useMeetings.ts`
* `src/features/meetings/utils/meetingDisplay.ts`
* `src/features/meetings/components/MeetingFormDialog.tsx`
* `src/features/meetings/components/MeetingStatusActionDialog.tsx`
* `src/features/meetings/components/ScopedMeetingsTab.tsx`
* `src/features/meetings/pages/MeetingsPage.tsx`
* `src/features/meetings/pages/MeetingDetailsPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/notifications/types/notification.types.ts`
* `src/features/notifications/utils/notificationDisplay.ts`
* `src/features/notifications/utils/notificationNavigation.ts`
* `README.md`

**Backend dependencies and limitations:**

* Meeting and option endpoints must enforce permissions and organization scope according to the backend contract. Reminder notifications must return `actionUrl=/meetings/:meetingId` and entity type `MEETING`.
* The current `UpdateMeetingDto` does not accept `null` for `opportunityId` or `reminderAt`. Definitively clearing either existing value during edit therefore requires explicit backend support for `null`.
* The current frontend opportunity service does not accept an `AbortSignal`. Opportunity searches use distinct query keys, but their network requests are not cancelled like meeting, company, and user option requests.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks and `npm run build` passed.
* Non-blocking warning: Vite reports a chunk larger than 500 kB. The main bundle is approximately 1,869 kB and approximately 535 kB gzip-compressed.
* Automated tests were not run because `package.json` has no configured `test` script or test runner.
* Manual testing with a running backend, real data, an authenticated browser session, and meeting permissions was not performed.

---

## fix 000090 — Add multi-channel product pricing and exchange-rate management

**Implemented items:**

* Updated the Product Library form to use the real backend contract for `pricingCurrency`, in-person and Digikala pricing inputs, channel margin percentages, and final IRR prices.
* In IRR mode, the form shows only the two channel prices in rials. In USD mode, it collects a base USD price and a separate margin percentage for each channel.
* Loads the active dollar exchange rate from `GET /api/admin/exchange-rates/current` and displays IRR previews for both channels using integer/BigInt calculations to reduce floating-point errors in monetary values. Calculated previews are not sent as trusted final values; the backend response remains authoritative.
* Missing active exchange-rate data produces a clear blocking error and disables saving USD-priced products. Empty or negative prices and percentages are rejected before submission, while backend validation messages remain visible in the form.
* The edit form hydrates currency, both channel inputs, margin percentages, and the exchange rate used for the product's latest calculation, and displays the stored final IRR prices.
* Added the centralized `formatIrrPrice` formatter with Persian thousand separators and a Rial label. The Product list now has In-person Price and Digikala Price columns displaying final IRR values.
* Selecting a product in an opportunity line item uses `inPersonPriceIrr` as the default unit price. The value remains editable, and previously stored sales line items are not rewritten when the dollar rate changes.
* Added a read-only dollar exchange-rate history page and current-rate card at `/admin/exchange-rates`. The page includes loading, empty, error/retry, server-side pagination, Jalali dates, active/expired status, and a Persian-language “Until Present” value for the current rate.
* The Add Exchange Rate action is shown only with `exchange-rate:manage`. Before submission, the UI confirms that USD product prices will be recalculated. After success, current-rate, history, and product queries are invalidated and the recalculated product count is displayed.
* Added a Dollar Exchange Rate navigation item under Administration using dynamic `exchange-rate:view` and `exchange-rate:manage` permissions. No ADMIN/MANAGER role restriction is hardcoded.

**Confirmed backend endpoints:**

* `GET /api/admin/exchange-rates/current`
* `GET /api/admin/exchange-rates?page=&limit=`
* `POST /api/admin/exchange-rates`
* `GET/POST/PATCH /api/product-catalog`

**Important changed/new files:**

* `src/features/productCatalog/types/productCatalog.types.ts`
* `src/features/productCatalog/components/ProductCatalogFormDialog.tsx`
* `src/features/productCatalog/components/ProductCatalogTable.tsx`
* `src/features/opportunityLineItems/components/OpportunityLineItemFormDialog.tsx`
* `src/features/opportunityLineItems/utils/money.ts`
* `src/features/exchangeRates/types/exchangeRate.types.ts`
* `src/features/exchangeRates/services/exchangeRates.service.ts`
* `src/features/exchangeRates/hooks/useExchangeRates.ts`
* `src/features/exchangeRates/pages/ExchangeRatesPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `src/routes/index.tsx`
* `README.md`

**Backend dependency:**

* The backend must return the multi-channel pricing fields in product list/detail responses, require an active exchange rate for USD products, calculate final IRR prices, and keep `defaultUnitPrice` aligned with the final in-person price.
* Adding a new exchange rate must close the current rate period, transactionally recalculate USD products, and return `{ rate, recalculatedProductCount }`. Historical sales, documents, and line items must not be changed.
* The authenticated user's permission set must include `exchange-rate:view` and `exchange-rate:manage` as applicable.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks and `npm run build` passed.
* Non-blocking warning: Vite reports a chunk larger than 500 kB. The main bundle is approximately 1,879.94 kB and approximately 538.07 kB gzip-compressed.
* Automated tests were not run because this repository has no configured `test` script or test runner.
* Manual testing with a running backend, a real exchange rate, and an authenticated browser session was not performed.

---

## fix 000091 — Correct dashboard metrics and complete report filters

**Implemented items:**

* The dashboard's Active Opportunities card now calls `GET /api/opportunities?page=1&limit=1&activeOnly=true` and displays the exact `meta.total`. WON and LOST opportunities are no longer counted simply because they are not archived.
* Added `activeOnly` to opportunity filter types and included it in the existing React Query parameter object/query key without changing prior opportunity-list behavior.
* Removed client-side overdue-task counting over the first 100 tasks. The dashboard now calls `GET /api/tasks?page=1&limit=1&overdueOnly=true` and uses `meta.total` as the source of truth.
* Added `overdueOnly` to task filters with an independent query and separate loading/error state. Open Tasks is calculated from the exact `meta.total` values of TODO and IN_PROGRESS queries using `limit=1`.
* Snapshot dashboard metrics—active opportunities, open tasks, and overdue tasks—no longer use a 30-day range. Pipeline summary and overall conversion rate are also requested as all-history values without `startDate/endDate`. Only the Recent 30-Day Activities card retains a 30-day range.
* Added the `ownershipScope` report filter using the backend values `all`, `mine`, `team`, and `unassigned`, with Persian labels for All, Mine, My Team, and Unassigned. The default and reset value is `all`; ownership logic is not reconstructed in the frontend.
* Added a multi-company filter through the shared `CompanyMultiAutocomplete`, including server-side debounced search, pagination, load-more, deduplication, and preservation of selected options. Report requests send only UUID values in `companyIds`, and company-options errors do not disable other filters or report queries.
* Preserved separate draft and applied report-filter state. Changing company selections or any other filter does not issue a new report query until Apply Filters is pressed. Reset clears selected companies, restores scope, and updates the active-filter count.
* Added optional, backward-compatible `ReportPeriod` typing. Subtitles explicitly describe the date basis: pipeline summary uses `opportunity.createdAt`, conversion uses stage transitions, stage duration uses stage exit, and activity reports use `occurredAt`.
* Clarified that pipeline summary represents opportunities created in the range and conversion rates represent transitions performed in the range. Backend field names and legacy response compatibility were not changed.
* Error/loading states for each metric and report remain distinct from a legitimate zero value, and existing dynamic permissions and API helpers were preserved.

**Important changed files:**

* `src/components/dashboard/MainGrid.tsx`
* `src/features/opportunities/types/opportunity.types.ts`
* `src/features/tasks/types/task.types.ts`
* `src/features/reports/types/report.types.ts`
* `src/features/reports/pages/ReportsPage.tsx`
* `src/features/reports/components/ReportFilterPanel.tsx`
* `src/features/reports/components/PipelineSummarySection.tsx`
* `src/features/reports/components/ConversionRatesSection.tsx`
* `src/features/reports/components/StageDurationsSection.tsx`
* `src/features/reports/components/ActivityReportSection.tsx`
* `src/features/reports/components/PipelineByOwnerSection.tsx`
* `src/features/reports/utils/reportDisplay.ts`
* `README.md`

**Backend dependency:**

* Backend fix `000070` must support `activeOnly=true` on `/api/opportunities` and `overdueOnly=true` on `/api/tasks`, with accurate pagination metadata.
* `/api/reports/*` endpoints must apply `ownershipScope` and `companyIds` according to `ReportFiltersDto`. The backend `OwnershipScope` enum uses lowercase values.
* `GET /api/companies/options` and `GET /api/companies/options/:id` must support organization scope, pagination, search, and hydration of existing selections.
* Optional `period.dateBasis` metadata is used for pipeline summary, conversion, and activity responses. Missing metadata in legacy responses is handled safely. The current stage-duration endpoint does not return period metadata, so the UI displays a fixed correct label.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks and `npm run build` passed.
* Automated tests were not run because `package.json` has no configured `test` script or test runner.
* Non-blocking warning: Vite reports a chunk larger than 500 kB. The main bundle is approximately 1,882.49 kB and approximately 538.70 kB gzip-compressed.
* Manual testing with a running backend, real data, and an authenticated session was not performed.

---

## fix 000092 — Add management dashboard and advanced sales and operations reports

**Implemented items:**

* The management dashboard now uses a single aggregated `GET /api/dashboard/summary` query and no longer counts paginated opportunity and task rows to calculate organization-level metrics. It displays current sales position, tasks and meetings requiring action, period performance, a 90-day forecast, three attention lists, and the report generation time.
* Summary failure is distinguished from legitimate zero values and has independent loading, unavailable, and retry states. Organization status, unread notifications, and quick-access actions remain available when the summary request fails.
* Attention-list links are created only when the user has the dynamic `opportunity:view`, `task:view`, or `meeting:view` permission. Viewing aggregated statistics remains controlled by `report:view`; no new role restriction was added.
* Split the Reports page into Overview, Sales Forecast, Opportunity Aging, Meetings, and Tasks & SLA tabs while retaining all previous reports under Overview. The selected tab, applied filters, and Aging page/page size are stored in the URL. Draft filters do not issue queries until Apply Filters is pressed, and Reset returns to Overview and page 1.
* The Forecast report displays authoritative backend status cards, nominal and weighted values, a monthly chart, and stage/owner details. Cards and tables use the centralized IRR formatter with decimal-string support, and weighted aggregation is not recalculated in the browser.
* Opportunity Aging is a snapshot report that intentionally omits `startDate/endDate`. It displays backend-provided buckets and a server-paginated detail table with Jalali dates and emphasis for overdue, unassigned, missing-close-date, and long-in-stage items.
* Meeting Performance displays summary metrics, status/mode breakdowns, and an organizer table using the correct Scheduled Duration wording. Task Performance separates the current snapshot from period flow and includes priority breakdowns plus an assignee SLA table. Missing assignees are shown as Unassigned.
* Added TypeScript contracts, service methods, React Query hooks, `AbortSignal` support, stale times, and query keys containing all relevant filters. Each endpoint mapper sends only supported parameters; Aging intentionally excludes date-range filters.
* Reused filters introduced in fix `000091` and added static meeting status/mode and task status filters. Failure of async company/report options does not disable static filters, and existing corrupted Persian text in the Reports page and filter panel was corrected.

**Backend endpoints used:**

* `GET /api/dashboard/summary`
* `GET /api/reports/opportunities/forecast`
* `GET /api/reports/opportunities/aging`
* `GET /api/reports/meetings/performance`
* `GET /api/reports/tasks/performance`
* Existing `/api/reports/*` endpoints remain available under the Overview tab.

**Important changed/new files:**

* `src/components/dashboard/MainGrid.tsx`
* `src/features/reports/types/report.types.ts`
* `src/features/reports/services/reports.service.ts`
* `src/features/reports/hooks/useReports.ts`
* `src/features/reports/pages/ReportsPage.tsx`
* `src/features/reports/components/ReportFilterPanel.tsx`
* `src/features/reports/components/AdvancedReportSections.tsx`
* `README.md`

**Dependencies and warnings:**

* This implementation depends on backend fix `000071`. The actual backend endpoints and DTOs were inspected in the backend working tree, but fix `000071` had not yet been committed at the time of review. The deployed backend must include those files and the `report:view` permission.
* Monetary card and table values rely on safe decimal strings. Charts use only finite values that can be converted to Number; out-of-range values are not plotted.
* Browser testing, authenticated API requests, and validation with real data were not performed. Production data behavior and real permission combinations therefore require manual verification.

**Verification status:**

* `npm run lint` passed without errors.
* TypeScript checks and `npm run build` passed.
* Automated tests were not run because `package.json` has no configured `test` script or test runner.
* Non-blocking warning: Vite reports a chunk larger than 500 kB. The main bundle is approximately 2,169.60 kB and approximately 627.46 kB gzip-compressed.
* A mojibake scan of `src`, `index.html`, and `README.md` found no remaining issues.

---

## fix 000093 — Add sales channels, price history, and financial/commercial reports

**Implemented items:**

* Added the centralized `SalesChannel` type and shared label/Chip formatter for `LEGACY_UNKNOWN`, `IN_PERSON`, `DIGIKALA`, and `OTHER`. The legacy value is display-only and cannot be selected during create or edit.
* For new opportunity line items, the form defaults to the in-person channel and its current price. Switching to Digikala suggests that channel's current price, while the Other channel requires an explicit negotiated price. The catalog price snapshot, actual price, amount difference, and percentage difference are displayed separately, and the calculated snapshot field is not sent to the backend.
* Editing a legacy line item without changing its product or channel preserves `LEGACY_UNKNOWN` and displays a historical-data warning. The opportunity line-items table now includes Sales Channel, Catalog Price Snapshot, and Actual/Negotiated Price columns.
* Added a read-only Price History action to the product table, governed by the dynamic `product:view` permission. The dialog supports server-side pagination, reason filtering, a Jalali date range, loading/empty/error/retry states, and all snapshots for both sales channels, exchange rate, creator, and notes.
* Added Financial & Collections, Product Performance, and Exchange Rate & Price Impact report tabs without removing the tabs introduced in fix `000092`. Related tab and page state is preserved in the URL.
* The financial report separates the current snapshot from period flow, displays aging, collection trends, and owner/company breakdowns using backend aggregations, and clearly warns when non-IRR currencies are excluded from IRR totals.
* The product report separates won sales based on `wonAt` from the current value of the active pipeline, preserves historical product name/code snapshots, and displays all four sales channels without merging legacy records.
* The exchange-rate impact report displays the current and previous rates, rate history, aggregate pricing impact, and a paginated detail table. Missing previous values are shown as insufficient history rather than being replaced with synthetic zero values.
* Added optional finance, catalog, and sales-channel sections to the dashboard. During staggered deployments, missing new sections are displayed as unavailable in the backend response and are not mistaken for zero values.
* Completed the required types, services, React Query hooks, `AbortSignal` handling, filter/page-aware query keys, and targeted invalidation for product history, product reports, exchange-rate impact, dashboard data, and opportunity line items.

**Backend endpoints used:**

* `GET /api/product-catalog/:id/price-history`
* `GET /api/reports/financial/collections`
* `GET /api/reports/products/performance`
* `GET /api/reports/exchange-rates/impact`
* `GET /api/dashboard/summary`
* Existing opportunity line-item create, update, and list endpoints with the `salesChannel` field

**Important changed/new files:**

* `src/features/opportunityLineItems/types/opportunityLineItem.types.ts`
* `src/features/opportunityLineItems/utils/salesChannel.ts`
* `src/features/opportunityLineItems/components/OpportunityLineItemFormDialog.tsx`
* `src/features/opportunityLineItems/components/OpportunityLineItemsTab.tsx`
* `src/features/opportunityLineItems/hooks/useOpportunityLineItems.ts`
* `src/features/productCatalog/types/productCatalog.types.ts`
* `src/features/productCatalog/services/productCatalog.service.ts`
* `src/features/productCatalog/hooks/useProductCatalog.ts`
* `src/features/productCatalog/components/ProductCatalogTable.tsx`
* `src/features/productCatalog/components/ProductPriceHistoryDialog.tsx`
* `src/features/reports/types/report.types.ts`
* `src/features/reports/services/reports.service.ts`
* `src/features/reports/hooks/useReports.ts`
* `src/features/reports/pages/ReportsPage.tsx`
* `src/features/reports/components/ReportFilterPanel.tsx`
* `src/features/reports/components/ReportProductMultiAutocomplete.tsx`
* `src/features/reports/components/CommercialReportSections.tsx`
* `src/components/dashboard/MainGrid.tsx`
* `src/features/exchangeRates/hooks/useExchangeRates.ts`
* `README.md`

**Dependencies and verification status:**

* The backend contract from fix `000072` was reviewed in commit `9ff5875d`, and the implementation was based on the actual enums, DTOs, and response shapes.
* `npm run lint` passed without errors.
* TypeScript checks and `npm run build` passed without errors.
* Automated tests were not run because `package.json` has no configured `test` script or test runner.
* Browser testing, live API testing, and real-session permission testing were not performed.
* Vite reported a non-blocking chunk-size warning for a chunk larger than 500 kB. The main bundle is approximately 2,210.36 kB and approximately 639.43 kB gzip-compressed.
* A mojibake scan of `src`, `index.html`, and `README.md` found no issues.

---
**Built with ❤️ for sales team**

---

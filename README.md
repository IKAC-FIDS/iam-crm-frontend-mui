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
fix 000001 → fix 000100
```

The fix history below documents what changed in each numbered fix.

---

# Fix History

## fix 000001 — Build error fixes and initial dashboard cleanup

* Fixed MUI type imports.
* Aligned Date Picker customization types.
* Removed unused imports.
* Made login error handling type-safe.
* Used `mutateAsync` in the login flow.
* Controlled DataGrid pagination state.
* Enabled the companies route.
* Removed menu items that did not have actual pages.
* No new backend dependency was identifiable in this commit.
* Verification status was not recorded in Git history.

---

## fix 000002 — RTL layout and Persian document setup

* Set `lang="fa"` and `dir="rtl"`.
* Applied RTL direction and alignment at document and layout level.
* Moved sidebar navigation to the right side.
* Replaced direction-dependent spacing and borders with logical CSS properties.
* No new backend dependency was identified.
* Verification status was not recorded in Git history.

---

## fix 000003 — Responsive dashboard and navigation

* Added temporary mobile drawer and open button.
* Kept permanent drawer on large screens.
* Fixed content spacing below AppBar.
* Made page padding responsive.
* Improved responsive behavior for dashboard cards, activity table, and login form.
* No new backend dependency was identifiable.
* Verification status was not recorded in Git history.

---

## fix 000004 — Company list, detail page, and create flow

* Built companies list with debounced search.
* Added stage, priority, and owner filters.
* Added server-side pagination.
* Added loading/error states.
* Added create company form with Zod validation.
* Built company detail page.
* Defined types, service, and React Query hooks.
* Added company detail route.
* Added cache invalidation after create.
* Depends on company list, detail, and create APIs.
* Verification status was not recorded in Git history.

---

## fix 000005 — Company owner from auth and Iran province selector

* Removed manual owner input from company create form.
* Sent the logged-in user ID as `ownerId`.
* Prevented company creation when user info is missing.
* Added `team` to the user model in frontend auth state.
* Added shared Iran province selector.
* Verification status was not recorded in Git history.

---

## fix 000006 — Company ownership type and province selector

* Defined company ownership enum and Persian labels.
* Added ownership to company type and create payload.
* Displayed ownership in company details.
* Used province selector for company head office location.
* Backend must accept ownership values: `PRIVATE`, `STATE`, `SEMI_STATE`, `PUBLIC_LISTED`, `BANK`, `HOLDING`
* Verification status was not recorded in Git history.

---

## fix 000007 — Overview tab and company update actions

* Added company detail tabs.
* Completed overview tab.
* Added company edit form.
* Added change stage dialog.
* Added priority change.
* Added owner assignment to current user.
* Added edit and stage-change mutations.
* Added company data invalidation.
* Depends on `PATCH /companies/:id` and `PATCH /companies/:id/stage`.
* Verification status was not recorded in Git history.

---

## fix 000008 — API, types, permissions, and company owner assignment cleanup

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
* Verification: lint and production build passed.

---

## fix 000009 — Company forms, enums, validation, and mutation flows

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
* Verification: lint and production build passed.

---

## fix 000010 — Company people tab, contacts, and socials

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
* Backend must support `OTHER` enum value for contact type and social platform.
* Verification: lint and production build passed.

---

## fix 000011 — Company activity timeline and activity creation flow

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
* Depends on `GET /api/activities`, `POST /api/activities`, and company people API.
* Verification: lint and production build passed.

---

## fix 000012 — Company Call Card tab

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
* Depends on: `GET /api/companies/:companyId/call-card`, `GET /api/companies/:companyId/call-card/suggest`, `PUT /api/companies/:companyId/call-card`, company people API.
* Verification: lint and production build passed.

---

## fix 000013 — Company branch management

* Completed Branches tab in company details.
* Displayed branches in table with name, city, address, phone, and last update.
* Added create, edit, and delete flows with confirmation dialog.
* Added shared create/edit form with Zod.
* Required at least one non-empty field.
* Trimmed strings and removed empty values before sending.
* Added loading, empty, error, success, and pending states.
* Applied view/manage/delete permissions.
* Added invalidation for branches and company details after mutations.
* Depends on: `GET /api/companies/:companyId/branches`, `POST /api/companies/:companyId/branches`, `PATCH /api/companies/:companyId/branches/:branchId`, `DELETE /api/companies/:companyId/branches/:branchId`
* Verification: lint and production build passed.

---

## fix 000014 — Branch location selector aligned with company form

* Replaced free-text branch city input with shared Iran province selector.
* Displayed predefined Iran province list.
* Preserved selected value during edit.
* Disabled selector while submitting.
* Payload field name remains `city` for backend compatibility.
* Verification: lint and production build passed.

---

## fix 000015 — Company social channels

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
* Depends on: `GET /api/companies/:companyId/social-channels`, `POST /api/companies/:companyId/social-channels`, `PATCH /api/companies/:companyId/social-channels/:channelId`, `DELETE /api/companies/:companyId/social-channels/:channelId`
* Verification: lint and production build passed.

---

## fix 000016 — Sales pipeline page

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
* No new endpoint was added.
* Verification: lint and production build passed.

---

## fix 000017 — Due follow-ups page

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
* Complete, edit, and delete actions were not implemented due to missing confirmed endpoints at that time.
* Verification: lint and production build passed.

---

## fix 000018 — Reports and real dashboard metrics

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
* Depends on: `/api/reports/pipeline-summary`, `/api/reports/conversion-rates`, `/api/reports/stage-durations`, `/api/reports/activities`
* Verification: lint and production build passed.

---

## fix 000019 — Safe preparation for activity edit and follow-up reschedule

* Audited Activities and Follow-ups services, hooks, and components for update, reschedule, and complete endpoints.
* Added disabled edit action to activity items for permitted users.
* Added disabled reschedule action next to the existing follow-up action.
* Corrected the follow-up completion action label to the Persian equivalent of “Completed”.
* Explicitly avoided local mutation or guessed endpoints.
* At that time, no confirmed endpoint existed for: `PATCH /api/activities/:activityId`, reschedule, complete.
* Verification: lint and production build passed.

---

## fix 000020 — Admin users, permissions, and owner assignment

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
* Depends on `/api/users` and `/api/admin/permissions/*`.
* Verification: lint and production build passed.

---

## fix 000021 — Stabilization, QA, and API contract cleanup

* Audited protected routes, services, query keys, permissions, and response normalizers.
* Added pipeline and report invalidation after company mutations.
* Refreshed follow-ups and reports after activity creation.
* Invalidated owner options after user mutations.
* Hardened report response handling for missing arrays or summaries.
* Verified no raw `fetch`, duplicated base URL, or `/api/api` path.
* Ran manual QA with ADMIN and REP roles.
* Checked direct route access, conditional menu, company details, and owner assignment.
* Role permission-state endpoint and final bulk-owner payload contract were not available.
* Verification: lint and production build passed.

---

## fix 000022 — Connect activity and follow-up lifecycle to backend

* Enabled activity editing for permitted roles/users.
* Reused shared create/edit activity form.
* Initialized person, type, dates, notes, and outcome.
* Locked `STAGE_CHANGE` activity type.
* Connected `PATCH /api/activities/:id`.
* Enabled follow-up completion with outcome/note dialog.
* Enabled rescheduling with future-date validation.
* Connected complete and reschedule endpoints.
* Added automatic invalidation for Activities, Follow-ups, Company Detail, Reports, and Dashboard after mutations.
* Backend supports: `PATCH /api/activities/:activityId`, `PATCH /api/activities/:activityId/complete`, `PATCH /api/activities/:activityId/reschedule`
* Verification: lint and production build passed.

---

## fix 000023 — Advanced filters and detailed reports

* Added unified report filter panel.
* Added date range filter.
* Added multi-select filters for users, teams, owners, pipeline stages, priorities, industries, lead sources, and activity types.
* Loaded filter options from backend.
* Applied filters to pipeline summary, conversion rates, stage durations, and activities.
* Dashboard uses the shared filter contract with default 30-day range.
* Added activity-by-user table.
* Added pipeline-by-owner table with stage breakdown.
* Added loading, empty, error, refresh, clear-filter, and date-range validation states.
* Depends on: `GET /api/reports/filter-options`, existing four report endpoints, `GET /api/reports/activities/by-user`, `GET /api/reports/pipeline/by-owner`
* Verification: lint and production build passed.

---

## fix 000024 — Libraries and base data management

* Added protected `/admin/libraries` route.
* Added Libraries menu item under Admin.
* Created six tabs: Industries, Lead Sources, Pain Points, Use Cases, Personas, Lookup Options.
* Implemented list, create, edit, activate/deactivate through edit, and delete flows with real APIs.
* Added loading, empty, and error states.
* Replaced company industry and lead source text inputs with dropdowns containing active items only.
* Replaced person department and persona fields with active lookup options.
* Added no default or fake catalog data.
* Frontend contract uses: `GET/POST /api/industries`, `GET/POST /api/lead-sources`, `GET/POST /api/pain-points`, `GET/POST /api/use-cases`, `GET/POST /api/persona-library`, `GET/POST /api/lookups/:group`, `PATCH/DELETE /api/:resource/:id`
* Verification: lint and production build passed.

---

## fix 000025 — Pipeline stages and transition rules settings

* Added protected `/admin/pipeline` route.
* Added Pipeline Settings menu item under Admin.
* Created Stages and Transition Rules tabs.
* Displayed and edited: label, description, display order, color, active status, terminal-stage status.
* Listed, created, edited, and deleted transition rules.
* Transition rules include: from stage, to stage, role, allowed/blocked status.
* Pipeline board now uses backend-provided stage order, labels, active stages, and colors.
* Stage-change dialog limits destination stages based on allowed backend rules for current stage and user role.
* Real backend error is shown for invalid transitions.
* Frontend contract depends on: `GET/PATCH /api/admin/pipeline/stages`, `GET/POST/PATCH/DELETE /api/admin/pipeline/transitions`
* Verification: lint and production build passed.

---

## fix 000026 — Global People Directory

* Added protected `/people` route.
* Added People menu item for allowed roles/permissions.
* Created global people table with: name, title, department, persona, primary contact, company, owner, contact summary, actions.
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
* Verification: lint and production build passed.

---

## fix 000027 — Owner assignment and users polish

* Replaced the generic users request in company owner assignment with `GET /api/users/owner-options`.
* Added an independent owner-options service method, React Query hook, and cache invalidation.
* Restricted assignable owners to active `REP` and `MANAGER` users.
* Excluded `ADMIN`, `BOARDS`, and inactive users even if they are returned unexpectedly.
* Preserved manager owner assignment when the backend includes the manager in owner options.
* Added Admin Users filters for search, role, team, and active/inactive status.
* Search matches user name, email, and team.
* Team options are derived from the real users response without fake values.
* Added a filtered empty state to the users table.
* Owner assignment depends on `GET /api/users/owner-options` returning eligible user records with role and active-status fields.
* Verification: lint and production build passed.

---

## fix 000028 — Permission matrix cleanup

* Replaced the unavailable-state notice and hardcoded permission action controls with the real permission matrix.
* Added `GET /api/admin/permissions/matrix` service and React Query integration.
* Rendered permission actions as rows and `ADMIN`, `MANAGER`, `REP`, and `BOARDS` as columns.
* Displayed assigned and unassigned state with interactive checkboxes derived only from backend data.
* Connected unassigned cell toggles to `POST /api/admin/permissions/assign`.
* Connected assigned cell toggles to `POST /api/admin/permissions/bulk-revoke` with one selected action.
* Preserved bulk assign and bulk revoke for actions selected directly from the real matrix.
* Preserved permission creation and refreshes the matrix after every successful mutation.
* Added loading, empty, and error states without synthesizing permission assignments.
* Matrix state depends on `GET /api/admin/permissions/matrix` and accepts row arrays, a `matrix` envelope, a `permissions` envelope, or role-keyed permission arrays.
* Verification: lint and production build passed.

---

## fix 000029 — Company archive and restore

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
* Verification: lint and production build passed.

---

## fix 000030 — Audit log

* Added the protected `/admin/audit-logs` route and a Persian-language Audit Logs navigation item.
* Added a dedicated audit-log type, service, React Query hook, and page.
* Loaded audit events from real `GET /api/admin/audit-logs` with server-side pagination.
* Added actor, entity type, entity ID, action, and date-range filters.
* Populated the actor filter from the real users endpoint without fake users.
* Added date, actor, action, entity type, entity ID, and metadata columns.
* Added loading, empty, error, and invalid-date-range states.
* Safely displayed metadata as escaped preformatted text, with JSON parsing used only for readable formatting.
* Supported direct and paginated `data` or `items` response envelopes.
* Audit records may use `createdAt` or `timestamp`, nested `actor`, `actorName`, or `actorId`, and arbitrary JSON-compatible metadata.
* Verification: lint and production build passed.

---

## fix 000031 — Navigation return-state support

* Added React Router navigation state when opening Company Detail from the Companies list.
* Added `backTo: '/companies'` and a Persian-language “Back to Companies” label for Companies navigation.
* Added return state to both company and person actions in Follow-up cards.
* Added `backTo: '/follow-ups'` and a Persian-language “Back to Follow-ups” label for Follow-ups navigation.
* Added return state when opening Company Detail from Pipeline cards.
* Added `backTo: '/pipeline'` and a Persian-language “Back to Pipeline” label for Pipeline navigation.
* Updated Company Detail to read typed location state for its back destination and label.
* Preserved `/companies` and a Persian-language “Back to Companies” label as the fallback for direct URL access or missing state.
* Applied the same fallback behavior to the Company Detail error-state back button.
* This fix has no backend or API dependency.
* Verification: lint and production build passed.

---

## fix 000032 — Restore shared lib files and verify API infrastructure

* Inspected the current repository, Git history, and clean working tree before verification.
* Confirmed `src/lib/axios.ts` already exists and is the single shared Axios instance.
* Confirmed Axios uses `import.meta.env.VITE_API_URL` with `http://localhost:3000/api` fallback.
* Confirmed the 30-second timeout, JSON content type, bearer token request interceptor, and 401 token cleanup/login redirect.
* Confirmed `src/lib/queryClient.ts` already exists with five-minute stale time, one query retry, disabled window-focus refetch, and zero mutation retries.
* Confirmed the shared QueryClient is mounted through `QueryProvider` at the application root.
* Verified all `@/lib/axios` and `@/lib/queryClient` imports resolve successfully.
* Verified matching `@/*` aliases in TypeScript and Vite configuration.
* Confirmed no duplicate Axios instance or raw feature-component API replacement was introduced.
* This was a local infrastructure verification; no live backend request was required or performed.
* Verification: lint and production build passed.

---

## fix 000033 — Pipeline config API contract cleanup

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
* The backend stage response uses `stage`; `code` remains accepted only as the explicitly requested safe response fallback.
* Verification: lint and production build passed.

---

## fix 000034 — Reports, follow-up and permission contract cleanup

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
* Permission checks use only the backend-supported keys supplied for libraries, pipeline settings, and the people directory.
* Verification: lint and production build passed.

---

## fix 000035 — Catalogs and libraries API alignment

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
* Backend Lead Source and Lookup list endpoints filter by a boolean `active` query, so Admin combines `active=true` and `active=false` results to manage both states.
* Verification: lint and production build passed.

---

## fix 000036 — Connect Global People Directory to backend contract

* Connected the global `/people` page to `GET /api/people/directory` instead of calling `GET /api/people` without `companyId`.
* Sent `page`, `limit`, `search`, `companyId`, `ownerId`, `team`, `department`, `personaTag`, `isPrimaryContact`, `hasEmail`, and `hasPhone` filters to the directory endpoint.
* Normalized the paginated `{ data, meta }` response into the existing directory table model, including company, owner, contacts, socials, and backend-provided email/phone summaries.
* Restricted page access and the People side-menu item to `people:directory:view`, while preserving the internal `ADMIN` role fallback in the permission helper.
* Kept the company-scoped `GET /api/people?companyId=...` endpoint and the People tab in Company Details unchanged.
* Filter options are still loaded from the real Companies, Reports, and Department/Persona lookup endpoints. No fake data was added.
* The directory endpoint requires the `people:directory:view` permission and returns `{ data, meta }`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000037 — Move sales pipeline from companies to opportunities

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
* Contracts were checked directly from backend fix `000012` in commit `ab501e44` and the dynamic stage migration in backend fix `000013` in commit `3297cfec`; therefore, the frontend uses `stageId` for stage filtering and stage mutations.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000038 — Full dynamic pipeline stage support

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
* The backend uses `pipeline:config:view`, `pipeline:config:manage`, `pipeline:transition:view`, and `pipeline:transition:manage`; no fake `pipeline:manage` permission was added.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000039 — Align company archive filter with API contract

* Preserved the UI `archiveStatus` state with `ACTIVE`, `ALL`, and `ARCHIVED` values without sending it directly to the backend.
* Mapped `ACTIVE` to a request with no archive parameter, `ALL` to `includeArchived=true`, and `ARCHIVED` to `archivedOnly=true`.
* Removed the forced default `archiveStatus=ACTIVE` parameter from `GET /api/companies` requests.
* Avoided sending `includeArchived=false` or any unnecessary extra parameter.
* Updated the archive contract explanation in fix `000029` according to the current backend DTO.
* The contract was checked directly from the current backend repository’s `FindCompaniesDto` and controller; the DTO only accepts `includeArchived` and `archivedOnly`.
* Verification: lint and production build passed; live/manual testing was not performed.

---

## fix 000040 — Add usernameless Passkey login and account Passkey management

* Added the `@simplewebauthn/browser` dependency and used `startRegistration` and `startAuthentication` with backend-provided JSON options.
* Preserved the existing email/password login without removing or changing its contract.
* Added a separate “Login with Passkey” button to the login page; this button does not validate the email/password form and sends an empty `{}` body to start authentication.
* Successful Passkey login uses the same success flow as normal login: storing `accessToken`, setting the user in the auth store, and redirecting to the dashboard.
* Added user-friendly errors for unsupported browsers/devices, user-cancelled operations, expired challenges, and failed login.
* Added the protected `/account/security` page for account security and Passkey management.
* The Passkey list displays device name or “Unnamed key”, registration date, last used date or “Never used”, transports, `backedUp`, and `credentialDeviceType`.
* Added new Passkey registration with a device name and Passkey deletion from the Account Security page.
* Added Passkey routes to the README API contract documentation.
* The Axios `baseURL` already includes `/api`, and Passkey endpoints are called without an extra prefix.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000041 — Separate Passkey cache between users

* Changed the React Query key for the Passkey list from the generic `['passkeys']` key to the user-scoped `['passkeys', 'list', userId]` key.
* The Passkey list query now only runs when the user is authenticated and `user.id` exists.
* To prevent showing the previous user’s data, the Passkey list query now uses `staleTime: 0`, `gcTime: 0`, `refetchOnMount: 'always'`, and `refetchOnWindowFocus: true`.
* Passkey registration and deletion mutations only invalidate the Passkey list query for the current user.
* On logout through the central `clearUser` path, the token is removed, the user is cleared from the auth store, and the global React Query cache is cleared with `queryClient.clear()`.
* On successful email/password login and successful Passkey login, the previous user’s cache is cleared before storing the new token and user.
* The Axios `401` flow is also connected to auth store cleanup and React Query cache cleanup so forced logout does not retain previous-user data.
* The backend contract did not change, and `/me/passkeys` plus `/auth/passkeys/...` endpoints keep the same contract as fix `000040`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000042 — Sync frontend API client with standardized backend response contract

* Added centralized API response/error contract helpers in `src/lib/apiResponse.ts`.
* Added support for both raw legacy responses and standardized `{ success, data, meta }` responses.
* Added centralized paginated unwrapping that preserves the frontend `{ data, meta }` shape.
* Updated auth login and Passkey authentication verify to unwrap both direct and standardized response shapes.
* Updated auth error handling to read standardized `error.message` before legacy `message`.
* Added optional `organizationId` to the authenticated frontend user type.
* Updated selected high-impact services to use centralized response helpers, including auth, companies, opportunities, activities, people, reports, passkeys, admin users, admin permissions, catalogs, pipeline config, follow-ups, audit logs, call cards, branches, and social channels.
* Preserved existing React Query cache clearing on login/logout and Axios 401 handling.
* Kept API endpoint paths unchanged; Axios baseURL still owns the `/api` prefix.
* Depends on the standardized backend response/error contract from backend fix 000030.
* Verification: lint and production build passed.

---

## fix 000043 — Add dedicated opportunity detail page and opportunity navigation

* Added protected `/opportunities` and `/opportunities/:opportunityId` routes.
* Added a global opportunities list page with server-side pagination, search, priority filter, backend-driven stage filter, archive filter, loading/error/empty states, and row actions.
* Added a dedicated opportunity detail page with loading/error states, back navigation state, summary fields, company link, edit/stage/owner/archive actions, and an overview tab.
* Added placeholder tabs for line items, commercial documents, payments, tasks, attachments, and activities without fake data or CRUD.
* Extended opportunity types for optional backend-expanded `lineItems`, `commercialDocuments`, `payments`, `tasks`, and `_count`.
* Added `useOpportunity` detail query and improved opportunity mutation invalidation to include list, detail, company opportunity list, pipeline, company detail, and reports caches.
* Added an Opportunities entry to the sidebar.
* Added “View Details” navigation from the company opportunities tab.
* Added opportunity detail navigation from pipeline opportunity cards while preserving company navigation and stage-change behavior.
* Depends on existing backend opportunity APIs for list, detail, create/update, stage change, owner change, archive, and restore.
* Verification: lint and production build passed.

---

## fix 000044 — Add product catalog and opportunity line items UI

* Added a `productCatalog` feature module with typed API service, React Query hooks, server-side paginated product table, search/category/status filters, create/edit dialog, and activate/deactivate actions.
* Added Product Catalog as the Products tab inside Admin Libraries and extended sidebar visibility so users with `product:view` can reach the catalog UI.
* Added an `opportunityLineItems` feature module with typed API service, React Query hooks, decimal-safe money utilities, line-item table, create/edit dialog, delete confirmation, product selector, product default-price prefill, and calculated frontend preview.
* Replaced the Opportunity Details Line Items placeholder with the real line-items tab while keeping later tabs for commercial documents, payments, tasks, attachments, and activities unchanged.
* Added permission gates for `product:view`, `product:manage`, `opportunity-line-item:view`, and `opportunity-line-item:manage`.
* Invalidated line-item list, opportunity detail/list caches, pipeline, company opportunity/detail caches, and reports after line-item create/update/delete mutations.
* Preserved decimal payload values as strings where entered and used backend-calculated `lineTotal` as the source of truth after saves.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000045 — Add commercial documents and payment tracking UI

* Added a `commercialDocuments` feature module with typed API service, React Query hooks, display helpers, server-side paginated table, search/type/status filters, create/edit dialog, status-change dialog, delete confirmation, and safe external `fileUrl` links.
* Added a `payments` feature module with typed API service, React Query hooks, display helpers, server-side paginated table, status filter, create/edit dialog, mark-paid dialog, cancel dialog, and delete confirmation.
* Replaced the Opportunity Details Commercial Documents and Payments placeholders with real tabs while preserving the line-items tab from fix `000044` and the later task, attachment, and activity placeholders.
* Added permission gates for `commercial-document:view`, `commercial-document:manage`, `payment:view`, and `payment:manage`.
* Payment forms can select a real related commercial document from the same opportunity when the user has document view access; no fake document options were added.
* Status-change flows use backend endpoints as the source of truth and surface standardized backend error messages when a transition/action is rejected.
* Invalidation now refreshes commercial documents, payments, opportunity detail/list caches, pipeline, company opportunity/detail caches, and related summaries after document/payment mutations.
* No secure file upload/download, attachment management, tasks, or notification UI was added in this fix.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000046 — Add secure attachment UI

* Added an `attachments` feature module with typed attachment models, API service, React Query hooks, display utilities, upload dialog, delete confirmation dialog, and reusable `AttachmentsTab`.
* Connected attachment listing, upload, protected download, and delete flows to `/attachments` APIs using the shared authenticated Axios client.
* Upload uses `multipart/form-data` through `FormData` and explicitly avoids forcing a JSON content type so the browser can set the multipart boundary.
* Download always uses the protected backend `/attachments/:id/download` endpoint with `responseType: 'blob'`; no MinIO/local storage paths or public URLs are exposed.
* Replaced the Opportunity Details Attachments placeholder with real opportunity attachments for `entityType="OPPORTUNITY"`.
* Added attachment row actions for commercial documents and payments, opening dialog-scoped attachment lists for `COMMERCIAL_DOCUMENT` and `PAYMENT`.
* Added permission gates for `attachment:view` and `attachment:manage`; users without manage access can view/download but cannot upload/delete.
* Added file-size, MIME label, safe filename, and content-disposition filename helpers. Client-side size/MIME messaging is only a hint; backend validation remains authoritative.
* No task management UI or notification center was added in this fix.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000047 — Add dedicated task management UI

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
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000048 — Add notification center UI

* Added a `notifications` feature module with typed notification models, API service, React Query hooks, Persian display helpers, safe action URL navigation, notification bell, recent menu, full notification center page, table, send dialog, and delete confirmation.
* Connected notification listing, unread count, detail, create, mark read/unread, read-all, archive/unarchive, and delete flows to `/notifications` APIs using the shared Axios client and standardized response helpers.
* Added unread-count polling every 60 seconds and mutation invalidation for notification lists, unread count, and affected notification details. No WebSocket, SSE, service worker push, or browser push was added.
* Added protected `/notifications` route, sidebar item gated by `notification:view`, and app header bell/menu gated by `notification:view`.
* Added server-side paginated notification listing with search, status, type, priority, entity type, and archive filters.
* Added permission gates for `notification:view`, `notification:manage`, and `notification:send`; view-only users can open notifications but cannot mark, archive, unarchive, delete, or send.
* Manual notification sending uses the existing real `/users/owner-options` user source through existing hooks. No fake recipients were added.
* Safe action URL handling only routes internal app paths or same-origin URLs that resolve to known frontend route prefixes; unsafe external URLs are not opened automatically.
* Depends on backend fix `000030` standardized response contract and the frontend API response helpers from fix `000042`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000049 — Add organization context and current organization UI

* Added an `organizations` feature module with typed organization models, current-organization API service, React Query hook, Persian display helpers, compact current organization badge, and suspended/archived status alert.
* Connected `GET /organizations/current` through the shared Axios client and standardized API response helpers while supporting raw and wrapped organization response shapes.
* Added an organization-aware current query key using `user.organizationId`, a 5-minute stale time, no polling, and no global cache clearing from the organization hook.
* Gated current organization fetching behind authenticated `organization:view` access so users without access do not call `/organizations/current`.
* Added the current organization badge to the dashboard app navbar near the notification/account area without removing notification bell, profile, logout, sidebar, or layout behavior.
* Added a non-blocking authenticated-layout warning banner for `SUSPENDED` and `ARCHIVED` organizations; frontend routing is not blocked and users are not logged out due to organization status.
* Reviewed auth compatibility: `AuthUser` and login/passkey login response typing already include optional `organizationId`, and login/passkey login still clear React Query cache before storing the new user.
* Admin organization management and organization switching are not implemented in this fix.
* Depends on backend fix `000030` standardized response contract.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000050 — Add admin organizations management UI

* Extended the `organizations` feature module with admin organization types, API service methods, React Query hooks, Persian display helpers, admin page, server-side paginated table, create/edit form dialog, and activate/suspend confirmation dialog.
* Connected admin organization list, detail, create, update, activate, and suspend flows to `/admin/organizations` APIs through the shared Axios client and standardized API response helpers.
* Added stable organization query keys for current organization, lists, list params, and details.
* Organization create/update/activate/suspend mutations invalidate organization lists/details and refresh the current organization query when the changed organization matches the logged-in user's `organizationId`.
* Added protected `/admin/organizations` route and sidebar item gated by `organization:manage`.
* Added server-side filters for search and status, status chips, Persian date formatting, and empty/error/loading states.
* Organization form validates technical organization code format, defaults create values to `Asia/Tehran`, `fa-IR`, and `ACTIVE`, and accepts optional settings as validated JSON object text.
* Reused the current organization context from fix `000049` without adding organization switching or changing auth token behavior.
* Organization switching, user-to-organization assignment, delete/archive organization, and tenant-scoped library/settings management are not implemented in this fix.
* Depends on backend fix `000030` standardized response contract.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000051 — Add SSO login and admin SSO provider management UI

* Added a `sso` feature module with typed SSO provider models, public/admin API service methods, React Query hooks, display helpers, safe backend redirect URL builder, login buttons, SSO callback page, admin provider page, provider form dialog, provider status/delete dialog, and sensitive-secret warning.
* Verified backend SSO routes from the sibling backend source and used the actual paths: `/auth/sso/providers`, `/auth/oidc/:providerId/login`, `/auth/saml/:providerId/login`, `/auth/sso/exchange`, and `/admin/sso-providers`.
* Added SSO provider buttons to the login page without changing password login or Passkey login.
* Added `/auth/sso/callback` to exchange backend-issued SSO tickets for the normal CRM login response, clear React Query cache, store the access token, and set the same auth user state used by password/passkey login.
* Added `/admin/sso-providers` route and sidebar item gated by `sso-provider:view` or `sso-provider:manage`.
* Added admin provider listing with search, type, and active-state filters, plus create/edit, activate, disable, delete, and test-login actions.
* Provider forms use backend field names including `entityId`, `ssoUrl`, `x509Certificate`, `scopes`, `defaultRole`, `allowedDomains`, and SAML signature flags.
* Existing client secrets and certificates are never displayed; new secret/certificate values are sent only when entered.
* The frontend does not implement OIDC/SAML protocol internals. It redirects to backend login endpoints and exchanges backend-issued tickets only.
* Depends on backend fix `000030` standardized response contract.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000052 — Update dashboard, sidebar, and reports for new backend modules

* Reorganized the sidebar into Sales Operations, Management, and Account groups while preserving mobile drawer behavior, RTL layout, route highlighting, and permission-based visibility.
* Audited sidebar links against implemented routes through frontend fixes `000043` to `000051`, including opportunities, tasks, notifications, organizations, SSO providers, reports, and existing admin pages.
* Expanded the dashboard with real backend-backed cards for companies, opportunities, pipeline reports, conversion rate, open/overdue tasks, unread notifications, recent activities, and current organization status.
* Added permission-aware dashboard quick links for opportunities, tasks, notifications, reports, product catalog via Admin Libraries, admin organizations, and SSO providers.
* Kept dashboard failures isolated: each metric card can show unavailable/loading state without breaking the rest of the dashboard.
* Updated Reports copy to emphasize the opportunity-first pipeline model and added an operational links section for real existing routes.
* Confirmed existing reports still use standardized response helpers and preserve legacy backend field names while displaying opportunity-oriented labels.
* Did not add new backend reporting endpoints and did not fabricate unavailable payment/document/global metrics.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000053 — Remove sales stage from company views

* Removed company sales-stage display from Company Details header chips and overview fields.
* Removed company stage change action and the deprecated company stage dialog from Company Details.
* Removed company stage column and stage filter from the Companies list.
* Stopped sending company `stage` as a list filter and removed the deprecated `/companies/:id/stage` frontend service/hook path.
* Kept the legacy optional `Company.stage?: string | null` field only for backend response compatibility, with a note that sales pipeline stage belongs to Opportunity.
* Added a small Company Overview helper message that sales stage is managed through the company's sales opportunities, with a button to open the Opportunities tab.
* Preserved Opportunity stage display/change flows in Opportunities, Opportunity Detail, Company Opportunities tab, and Pipeline.
* Depends on backend fix `000026` deprecating company pipeline mutation and enforcing opportunity pipeline.
* Verification: lint and production build passed.

---

## fix 000054 — Separate department, job title, and sales role in person forms

* Decoupled the person create/edit form from the free-text job-title field and the legacy Persona Library source, and connected it to managed lookup options.
* Department is loaded from `departments`, job title from `job-titles`, sales-process role from `persona-roles`, and seniority level from `seniority-levels`.
* Form submissions use the new backend aliases `jobTitle` and `personaRole`, while legacy records using `title` and `personaTag` remain displayable.
* Updated the company people list, global people directory, directory filters, person details, activity form, and Call Card contact selector to use the clarified labels.
* Aligned Admin Libraries lookup groups with `job-titles` and `persona-roles`, replacing the ambiguous Persona terminology with Job Titles and Sales Roles labels.
* Extended frontend person and Call Card contact models with `jobTitle`, `personaRole`, and `seniorityLevel`.
* Depends on backend lookup groups `departments`, `job-titles`, `persona-roles`, and `seniority-levels`.
* Verification: lint and production build passed.

---

## fix 000055 — Clarify opportunity definition fields and opportunity source

* Clarified opportunity form labels so the opportunity `source` is not confused with the company acquisition source.
* Renamed the Source field to Opportunity Source and connected it to the `opportunity-sources` lookup group.
* Added the `opportunity-sources` group to Admin Libraries lookup management under the Opportunity Sources label.
* Clarified fields for opportunity owner, sales stage, estimated value, expected close date, primary contact, win probability, potential competitor, and requirements/opportunity description.
* Limited primary-contact options to people belonging to the opportunity company.
* Extended opportunity types with `sourceOptionId`, `opportunitySource`, `sourceOption`, `primaryContactId`, `primaryContact`, `probability`, and `competitor`.
* Updated the global opportunities list, company opportunities tab, opportunity details, and owner-change dialog to use the clarified labels.
* Added an Opportunity Source filter to the global opportunities list.
* Depends on backend lookup group `opportunity-sources` and opportunity DTO fields `sourceOptionId`, `opportunitySource`, `primaryContactId`, `probability`, and `competitor`.
* Verification: lint and production build passed.

---

## fix 000056 — Add Jalali date input and display across the UI

* Added the lightweight `jalaali-js` dependency for Jalali/Gregorian date conversion.
* Added the shared `jalaliDate` utility for converting backend ISO values to Jalali display values, converting Jalali input to ISO, normalizing Persian/Arabic digits, and creating end-of-day ranges.
* Added the shared `JalaliDateField` component so forms can accept Jalali values such as `1403/05/20` and `1403/05/20 14:30` while sending ISO values to the API.
* Migrated date/time inputs in activities, Call Cards, opportunities, tasks, task rescheduling, follow-up rescheduling, commercial documents, payments, task filters, report filters, and Audit Log filters from native Gregorian inputs to the shared Jalali input.
* Migrated general date displays for companies, tasks, activities, notifications, organizations, SSO, opportunities, documents, payments, attachments, and logs to the shared Jalali `YYYY/MM/DD - HH:mm` formatters.
* Range filters send start-of-day and end-of-day ISO values to the backend so the backend contract remains unchanged.
* The backend continues to receive and store dates in Gregorian/ISO format; this fix changes only the UI date layer to Jalali.
* Verification: lint and production build passed.

---

## fix 000057 — Add Jalali calendar pickers for date and time fields

* Added the `react-multi-date-picker` dependency so users can select Jalali dates from a calendar instead of entering them manually.
* Added shared `JalaliDatePicker`, `JalaliDateTimePicker`, and `JalaliDateRangePicker` components with a Persian calendar, Persian locale, RTL-friendly layout, clear action, and MUI-based input.
* Preserved the compatible `JalaliDateField` API while replacing its plain text input with the Jalali calendar picker.
* Migrated task, report, and Audit Log range filters to `JalaliDateRangePicker`.
* Date-time pickers for activities, follow-ups, tasks, reminders, and Call Cards use the time plugin and convert selected hours/minutes to backend ISO values.
* The backend contract remains unchanged, and all picker outputs remain ISO/Gregorian-compatible.
* The backend continues to receive and store dates in ISO/Gregorian format.
* Verification: lint and production build passed.

---

## fix 000058 — Fix Jalali date picker runtime error

* Defensively unwrapped the `react-multi-date-picker` and time-plugin imports in `JalaliDateField` so the React component itself is rendered instead of a module object at runtime.
* Preserved the correct `DateObject`, Persian calendar, and Persian locale imports, and standardized the locale name to `persian_fa`.
* Added a small development guard that provides a clearer error if the dependencies fail to resolve to valid components again.
* Kept the backend date payload contract unchanged.
* This is a frontend-only fix and does not change any backend API contract or dependency.
* Verification: lint and production build passed.

---

## fix 000059 — Fix Jalali date field runtime error

* Removed the `JalaliDateField` development guard that incorrectly rejected valid React components using `typeof Component === 'function'`.
* Restored the documented default imports for `DatePicker` and `TimePicker` from `react-multi-date-picker` and its time plugin.
* Preserved the correct `DateObject`, Persian calendar, and `persian_fa` locale imports.
* `JalaliDatePicker`, `JalaliDateTimePicker`, and `JalaliDateRangePicker` continue to produce ISO/Gregorian-compatible values without changing the backend contract.
* This is a frontend-only fix and does not change any backend API contract or dependency.
* Verification: lint and production build passed.

---

## fix 000060 — Fix Jalali date picker rendering error

* Investigated the reported JSX failure in `JalaliDatePicker` and resolved the problematic `DatePicker` tag to the dependency’s actual default export.
* Added an interop resolver for `DatePicker` and `TimePicker`, without guards or logging, so a module namespace object is never passed directly to React.
* The resolver preserves valid object-shaped React components such as `forwardRef` components.
* Preserved the correct imports for `react-multi-date-picker`, `react-date-object`, the Persian calendar, the `persian_fa` locale, and MUI icons.
* This is a frontend-only fix and does not change any backend API contract or dependency.
* Verification: lint and production build passed.

---

## fix 000061 — Make task creation context-aware for company and opportunity

* Removed raw `companyId` and `opportunityId` text fields from the task create/edit form.
* Updated the shared `TaskFormDialog` to display readable company/opportunity context and submit identifiers from that context.
* When creating a task from an opportunity, the company and opportunity are locked and displayed as read-only context.
* When creating a task from a company, the company is locked and displayed as read-only context.
* On the global Tasks page, company, opportunity, and person are selected through API-backed autocomplete/selectors.
* Opportunity options are filtered by the selected company, and choosing an opportunity consistently sets its related company.
* Person options are loaded only for the selected or current company.
* Added a Tasks tab to Company Details so tasks can be created in company context.
* This is a frontend-only fix and does not change any backend API contract.
* Verification: lint and production build passed.

---

## fix 000062 — Establish a unified design system and RTL foundation

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
* This fix establishes frontend/UI foundations only and does not change API contracts, route behavior, permissions, validation, or business workflows.
* Verification: lint and production build passed.

---

## fix 000063 — Complete component RTL support and standardize grid row actions

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
* This is a frontend-only fix and does not change backend API contracts, routes, permissions, payloads, validation, or workflows.
* Text buttons inside cards and timelines that are not Data Grid/Table row actions remain textual to preserve readability and the existing workflow.
* Verification: lint and production build passed.

---

## fix 000064 — Fix RTL runtime failure and align Stylis with Emotion

* Dependency-tree inspection showed that `@emotion/cache@11.14.0` used `stylis@4.2.0`, while the direct `prefixer` import and generic `stylis-plugin-rtl@2.1.1` resolved through `stylis@4.4.0`.
* This combination executed Stylis plugins against incompatible internals during Emotion serialization and caused `Cannot read properties of undefined (reading 'push')` failures in `append/lift/prefixer` while inserting MUI styles.
* After the fix, `npm ls stylis` reports only `stylis@4.2.0` for Emotion, `prefixer`, and `@mui/stylis-plugin-rtl`.
* Fixed the Emotion/Stylis runtime error that occurred while rendering MUI TextField components.
* Removed the generic `stylis-plugin-rtl` dependency and replaced it with the official `@mui/stylis-plugin-rtl` plugin.
* Pinned the app-level `stylis` version from `^4.4.0` to exact version `4.2.0` to match the version used by `@emotion/cache@11.14.0`.
* Updated the RTL plugin import in `src/lib/rtlCache.ts` to `@mui/stylis-plugin-rtl` while preserving the `prefixer`-before-`rtlPlugin` order.
* Preserved the existing provider order for `CacheProvider`, `ThemeProvider`, `CssBaseline`, `RouterProvider`, and `QueryProvider`.
* Preserved root RTL settings (`dir="rtl"` and `lang="fa"`) and `theme.direction = 'rtl'`.
* Cleared the Vite optimization cache under `node_modules/.vite` so RTL dependencies were rebundled.
* Retained `@types/stylis` after a removal test because TypeScript requires its declarations for the direct `prefixer` import.
* Did not change colors, routes, API contracts, authentication flow, permissions, or validation.
* No backend API contract, route, authentication behavior, permission, payload, or validation changed.
* Authenticated navigation and live API testing were not performed because a running backend and valid session were not tested in this fix.
* Verification: lint and production build passed; automated tests passed.

---

## fix 000065 — Fix apparent LTR regression after enabling the RTL cache

* After `fix 000064`, the RTL infrastructure was active and stable, but parts of the theme and layout still emitted `direction: 'rtl'`, `textAlign: 'right'`, or `direction: 'ltr'` through Emotion.
* `@mui/stylis-plugin-rtl` mirrors these physical CSS declarations, so manual rules such as `direction: rtl` and `text-align: right` became `direction: ltr` and `text-align: left` in browser output.
* Chrome inspection before the correction showed that `html[dir="rtl"]` was active while some containers and the login form had computed `direction: ltr` and `text-align: left`.
* Investigated the apparent LTR regression after `fix 000064` and isolated it to double mirroring in styles generated through the Emotion RTL cache.
* Preserved the core RTL configuration unchanged: document `dir="rtl"`, `theme.direction = 'rtl'`, and the Emotion cache based on `@mui/stylis-plugin-rtl`.
* Removed manual `direction: 'rtl'` and `textAlign: 'right'` declarations that Stylis mirrored again inside `sx`/theme overrides, or replaced them with `textAlign: 'start'`.
* Preserved LTR direction for technical content such as email addresses, passwords, and Jalali date fields through input-level `dir="ltr"` and the `.ltr` class rather than Emotion-generated rules.
* Corrected the main drawer position after inspecting computed styles; because the RTL cache mirrors the Drawer’s physical CSS, the physical anchor in `SideMenu` was set so the drawer renders on the right side of the viewport.
* Cleaned Data Grid alignment and direction overrides so the grid inherits direction from the document/theme and columns do not revert to LTR under RTL.
* Corrected login, SSO callback, dashboard layout, Jalali date field, and grid pages without changing API contracts, routes, permissions, validation, or workflows.
* Cleared the Vite optimization cache in `node_modules/.vite` after the RTL changes.
* No backend API contract, route behavior, authentication flow, permission, payload, validation, or business workflow changed.
* Live API testing against a running backend was not performed.
* Verification: lint and production build passed.

---

## fix 000066 — Add team management and replace free-text team fields with managed team selection

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
* The Teams implementation depends on the following real backend endpoints: `GET /teams`, `POST /teams`, `PATCH /teams/:id`, `PATCH /teams/:id/activate`, `PATCH /teams/:id/deactivate`, `GET /teams/:id/members`, `POST /teams/:id/members`, `DELETE /teams/:id/members/:userId`
* Runtime behavior of the Teams endpoints must be verified in an environment connected to the new backend.
* Verification: lint and production build passed.

---

## fix 000067 — Improve team-management access control and 403 handling

* Reviewed the `/admin/teams` route and Teams navigation item. The API path in `teams.service.ts` remains `/teams` because `axiosInstance` already uses `VITE_API_URL`, or the default `http://localhost:3000/api`, as its base URL.
* The Teams navigation item is shown when the user has backend-aligned `team:view` or `team:manage` permission.
* The team management page accepts `team:view` or `team:manage` for page access and shows create, edit, member-management, and status-change operations only with `team:manage`.
* When `GET /teams?includeInactive=true` returns 403, the page shows a clear access warning instead of rendering a broken grid or form.
* Teams queries do not retry on 403 errors, preventing repeated noisy permission failures.
* For 403 errors during team creation or editing, the form shows a clear permission message in both the toast and inline alert.
* Added the shared `isForbiddenError` helper to `src/lib/apiResponse.ts` so 403 detection is not duplicated inside the feature.
* This fix does not bypass backend security; it only improves the frontend UX for permission failures.
* Resolving the underlying 403 requires aligning backend permissions and the user token with `team:view` and `team:manage`. ---.
* Verification: lint and production build passed.

---

## fix 000068 — Add file upload to the commercial document form

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
* Because the backend has no multipart update endpoint for an existing document, a replacement file is attached through the secure `/attachments` route using entity type `COMMERCIAL_DOCUMENT` and the document `entityId`.
* Displaying an uploaded file name in the documents list depends on the backend returning the `fileAttachment` summary in the document response; otherwise, files remain visible and downloadable from the Attachments dialog. ---.
* Verification: lint and production build passed.

---

## fix 000070 — Improve attachment download and error handling

* Reviewed the attachment download path. The frontend continues to call the correct `GET /attachments/:id/download` endpoint through `axiosInstance`, which resolves to `/api/attachments/:id/download` in the browser.
* Preserved `responseType: 'blob'` for download requests.
* Preserved and hardened secure browser downloads using `Blob`, `URL.createObjectURL`, a temporary link with `download`, and `revokeObjectURL`.
* Corrected file-name priority: `Content-Disposition` first, then the human-readable row file name, and finally `attachment-{id}` as the fallback.
* Mapped attachment download failures by HTTP status to clear Persian-language messages: `403`: the user does not have permission to download the file, `404`: the attachment was not found, `400`: the attachment does not contain an uploaded file, `500`: the storage repository could not return the file.
* The download action in `AttachmentsTab` now catches failures instead of leaving a rejected promise unhandled.
* The download action is shown only for rows backed by a stored file; external-only rows receive an Open Link action.
* Attachment table file names are resolved from `originalFileName`, `originalName`, or `fileName`, with a fallback only when no human-readable name is available.
* The uploader display still prioritizes `uploadedBy.fullName`, then email, and finally `uploadedById`.
* Added optional `originalName`, `fileName`, `externalUrl`, and `fileUrl` fields to the attachment type for compatibility with legacy or mixed backend responses.
* When the backend provides only `externalUrl` or `fileUrl` for a record, the frontend opens the external link instead of calling the backend download endpoint.
* Resolving the underlying 500 download failure requires backend/storage investigation and confirmation that the file exists in the storage repository. ---.
* Verification: lint and production build passed.

---

## fix 000071 — Align commercial document file-upload contract

* Aligned the frontend contract for `POST /opportunities/:opportunityId/commercial-documents/upload` with the backend contract.
* Commercial document files are sent in `FormData` under the `file` field.
* Removed manual `Content-Type` configuration for multipart requests so the browser and Axios can generate the correct boundary.
* Restricted metadata sent to the backend to supported commercial-document fields. Frontend-only fields such as `file`, `attachmentId`, and `fileAttachmentId` are no longer included in the textual payload.
* Preserved the optional external-link field in the form, while sending it through `fileUrl` in the commercial-document persistence contract.
* Improved HTTP 400 handling in the commercial-document form. Backend validation messages are displayed when available; otherwise, a Persian-language fallback indicates that the document information or selected file is invalid.
* The backend commercial-document upload contract uses `FileInterceptor('file')`.
* Final verification of file persistence in MinIO requires a manual upload scenario with the backend and storage infrastructure running. ---.
* Verification: lint and production build passed.

---

## fix 000072 — Correct multipart handling for commercial document uploads

* Aligned the commercial-document upload request in `commercialDocuments.service.ts` with the established attachment-service pattern.
* When sending `FormData` to `POST /opportunities/:opportunityId/commercial-documents/upload`, set the request-level `Content-Type` value to `undefined` so the browser generates the correct multipart boundary.
* Updated the shared Axios interceptor to remove `Content-Type` when `config.data` is a `FormData` instance, preventing the default `application/json` value from leaking into multipart requests.
* Kept the file field name as `file` and did not change the backend endpoint path.
* This was a frontend-only fix; the backend was not changed.
* Final confirmation that the HTTP 400 error is resolved requires a manual upload test with the backend and storage service running. ---.
* Verification: lint and production build passed.

---

## fix 000073 — Dockerize the frontend with Nginx and API proxying

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
* This was a frontend-only fix; the backend was not changed.
* If the target environment reports `host not found in upstream "api"`, align the backend Docker service and network names with the server's Docker Compose configuration.
* Verification: lint and production build passed.

---

## fix 000074 — Resolve stale Docker DNS in the frontend API proxy

* Investigated intermittent Nginx HTTP 502 errors after the backend container was rebuilt or recreated.
* Replaced the static `proxy_pass http://api:3000/api/` upstream pattern so Nginx no longer retains the backend service's previous Docker IP.
* Added Docker's internal resolver to the `/api/` location through `resolver 127.0.0.11 valid=10s ipv6=off;`.
* Defined the backend upstream through `set $api_upstream api:3000;` so Nginx re-resolves the Docker service name.
* Changed `proxy_pass` to `http://$api_upstream` and removed the `/api/` suffix so the original request URI is preserved.
* Paths such as `/api/auth/login` are now forwarded to `http://api:3000/api/auth/login`.
* Preserved the existing proxy headers and 300-second timeouts.
* This fix affected only the frontend/Nginx layer; the backend was not changed.
* Full confirmation of the HTTP 502 fix requires recreating the backend in the target environment and then testing login through `/api/auth/login`. ---.
* Verification: live/manual testing was not performed.

---

## fix 000075 — Complete company registration profile and legal documents

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
* The backend must support the new company fields and `/companies/:companyId/legal-documents` endpoints.
* Verification: lint and production build passed.

---

## fix 000076 — Repair corrupted Persian text encoding in the frontend

* Reviewed and corrected corrupted Persian text in the company details page.
* Replaced broken tab labels, buttons, error messages, primary-information cards, registration and legal information, company status and size, ownership structure, and legal-document tab text with readable UTF-8 Persian strings.
* Verified that `index.html` already contains `meta charset="UTF-8"`.
* Searched source files and the README for mojibake and found no remaining common corruption markers.
* This was a frontend-only correction and did not change any API contract or backend behavior.
* Verification: lint and production build passed.

---

## fix 000077 — Add employment and education history to person profiles

* Added Employment History and Education History sections to the person detail panel.
* Employment-history companies are selected through an Autocomplete with server-side search over existing companies.
* Multiple positions can be added for one company when creating employment history; individual position creation, editing, and deletion are also supported.
* Each position includes title, start date, end date, current-position status, and description. Dates are shown as Jalali values in the UI and sent as ISO values in payloads.
* For current positions, the end date is disabled and cleared. Start/end date ordering is validated in the frontend.
* Implemented education-history create, edit, and delete flows with degree, university, year, and description fields.
* Persian and Arabic digits in year values are normalized before submission, and the integer range 1000–3000 is validated.
* Added loading, empty, and error states plus success/error messages for both sections.
* Viewing uses `person:view`; management uses the existing `person:update` permission. No new permission was created.
* Employment-history responses must include a company summary and `positions` array according to the backend contract.
* Verification: lint and production build passed.

---

## fix 000078 — Fix `crypto.randomUUID` errors in the employment-history form

* Identified that the Add Employment History form crashed because `crypto.randomUUID()` was called directly in browsers or HTTP origins where the API is unavailable.
* Added a shared `createClientId` helper that uses `randomUUID`, then `getRandomValues`, and finally a time-and-random-value fallback.
* Removed direct calls from the employment-history component and generated temporary position IDs with the `employment-position` prefix.
* Temporary IDs are stored only as `clientTempId` for React keys and form-row management; they are not sent to the backend in position or employment-history payloads.
* Creating employment history and adding multiple positions no longer depends directly on `crypto.randomUUID` when temporary rows are created.
* Added a lightweight `errorElement` with a Persian-language message, retry action, and links back to primary routes.
* Verification: lint and production build passed.

---

## fix 000079 — Refine education history and add the university library

* Replaced the free-text degree field in education-history create/edit forms with a dropdown.
* Degree options are exactly `DIPLOMA`, `ASSOCIATE`, `BACHELOR`, `PHD`, and `POSTDOC`, with Persian labels for Diploma, Associate, Bachelor, PhD, and Postdoctoral. A Master's degree option was intentionally not added.
* Replaced the free-text university field with an Autocomplete backed by active university-library records; only `universityId` is sent to the backend.
* Removed the numeric year input and replaced it with a Jalali Education Date picker; the ISO/Gregorian value is sent through `educationDate`.
* Education-history display now shows the Persian degree label, university relation name or historical snapshot, Jalali date, and description.
* Added a Universities tab to Admin Libraries with listing, create, edit, activate/deactivate, and status display through the university endpoints.
* The university form includes name, optional code/identifier, description, active status, and backend validation-message display.
* Added existing backend permissions `library:university:view` and `library:university:manage` to the frontend's known-permission list.
* The education-history cleanup and university-library migration must be applied in the backend environment.
* Verification: lint and production build passed.

---

## fix 000080 — Redesign role and permission management

* Replaced the previous fixed four-role matrix with a Role and Permission Management page containing separate Permissions and Roles tabs.
* The Permissions tab supports listing, search, create, edit, and delete operations with permission code, display name, group, description, and status fields.
* System permissions are clearly marked; their codes cannot be edited and deletion is disabled in the UI. Backend restriction errors are also displayed.
* The Roles tab supports listing, search, create, edit, and delete operations with code, name, base role, description, status, system-role flag, and permission count.
* Deletion is disabled in the UI for system roles and ADMIN. Restrictions for roles assigned to users are delegated to the backend and their messages are displayed.
* Added an Assign Permissions action for each role. The role-permission dialog displays all active permissions, assigned state, search, grouping, select all, and clear all.
* Assignments are saved as a complete replacement of the `permissionIds` array. After success, the role list and permission counts are refreshed.
* The user-role edit form now loads active database-backed roles from the API and sends `roleId`; user-role display prefers `roleName`/`assignedRole`.
* Aligned the admin menu with actual `permission:view`, `permission:manage`, `role:view`, and `role:manage` permissions.
* The backend create-user DTO still does not accept `roleId` and requires the base `role` enum. The create-user form therefore intentionally retains the four base roles rather than fabricating dynamic-role support.
* Verification: lint and production build passed.

---

## fix 000081 — Improve pipeline layout and remove horizontal page scrolling

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
* Verification: lint and production build passed.

---

## fix 000082 — Correct `sourceOptionId` submission during opportunity creation

* Identified that the frontend sent invalid `sourceOptionId` values, including empty strings and non-UUID values.
* Optional opportunity UUID fields are normalized at the create/update service boundary. `sourceOptionId`, `ownerId`, and `primaryContactId` are sent only when valid UUIDs; otherwise, they are removed from the payload.
* The opportunity-source dropdown shows only options with valid UUID identifiers and stores each option's `id`. When no option is selected, `sourceOptionId` is omitted.
* Company-scoped creation through `POST /api/companies/:companyId/opportunities`, global creation, and update flows share the same normalization. Required fields such as title are preserved, and the selected `stageId` is sent unchanged.
* Improved form errors so `details` arrays from standardized or legacy validation responses, including `sourceOptionId must be a UUID`, are shown both in the form and in toasts.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000083 — Implement automatic access-token renewal in the frontend

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
* The backend must issue the refresh-token cookie with appropriate HttpOnly/SameSite/Secure settings and credential-compatible CORS, support `POST /api/auth/refresh` for cookie rotation and `{ accessToken, user }` responses, and expose `POST /api/auth/logout`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000084 — Add All/Mine ownership filters to companies and opportunities

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
* Company and opportunity list endpoints must apply `ownershipScope=all|mine|team|unassigned` together with organization scoping and view permissions. Pagination totals must be calculated after the same filter.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000085 — Display lookup labels on people screens

* Identified that people tables and details displayed stored lookup values such as `ECONOMIC_BUYER` directly instead of resolving them against lookup options.
* Added the shared `getLookupLabel` helper, which matches values against an option's `id`, `code`, or `value` and displays the Persian API `label`.
* Persona roles from `persona-roles` now display their labels in the global `/people` directory, company People tab, and person detail drawer.
* Other lookup-backed person fields, including department, job title, and seniority level, also resolve labels from their corresponding groups in the same views.
* Filters and form dropdowns continue to display option labels while preserving backend-compatible stored values (`value`/code, or existing IDs in legacy records). Persian labels are not sent instead of API contract values.
* During lookup loading/errors or when no matching option exists, the previous raw value is shown as a fallback; empty values display `—`.
* Contact-method type and social-platform display were not changed because those areas use their existing explicit enums and labels, and their current person forms do not use the lookup contract.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.
* The backend must return active options for `persona-roles`, `departments`, `job-titles`, and `seniority-levels` with `id`, `code`, and `label` through the existing lookup API. If lookup data is missing or unavailable, the frontend displays the stored value.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000086 — Correct legal-document upload result handling

* Reviewed and preserved the upload route as `POST /companies/:companyId/legal-documents/upload`, using `FormData` with the file field named `file`. Metadata includes `type`, `title`, `description`, and `documentDate`.
* Removed manual `Content-Type` configuration from the upload request so the shared Axios interceptor can remove the JSON header and the browser can generate the correct multipart boundary.
* The upload response is now unwrapped and validated. The created record can be read from a direct response or from `data`, `document`, and `legalDocument` envelopes.
* When a valid record is returned, the legal-document list cache is updated immediately with the new document, the active legal-document query is explicitly refetched, and the company-detail query is invalidated.
* After confirmed success, the UI displays a success message, resets the form, and closes the dialog.
* When a 2xx response does not contain a document record, the UI no longer reports false success. It displays a warning, refetches the list, and then resets and closes the dialog.
* Non-2xx errors display the backend message both inside the form and in a toast. The form remains open for correction or retry, and HTTP 403 responses show a clear permission-denied message.
* Aligned the Company Legal Documents section title and the Upload Legal Document dialog title with the Persian UI labels.
* The backend must support `POST /api/companies/:companyId/legal-documents/upload` with `FileInterceptor('file')` and the metadata listed above. After a successful upload, it must return the created document record and make the new record immediately available through the legal-document list endpoint.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000087 — Add owner filtering and preserve company-list page size

* Added an Owner filter to the Companies page with All Owners, Unassigned, and active users returned by the owner-options endpoint.
* Each owner option displays the user's full name and shows available email, team, and role information as secondary details. No users are hardcoded in the frontend.
* Selecting a specific owner sends `ownerId` together with `ownershipScope=all` to the Companies API. Selecting Unassigned uses the existing `ownershipScope=unassigned` contract.
* Selecting My Companies, My Team, or Unassigned clears any previously selected owner to prevent conflicts between `ownerId` and the selected ownership scope. Selecting a specific owner resets the scope to `all`.
* If the owner-options request fails, the Owner filter is disabled and a Persian-language warning is displayed, while company loading and all other filters remain usable.
* Company DataGrid page-size options now include `5`, `10`, `20`, `50`, and `100`, with a Persian-language Rows per Page label.
* Pagination remains controlled. The `page` and `limit` values are stored in the `/companies` query string, and the selected page size is also persisted in `localStorage` so it survives refreshes and navigation back to the list.
* Changing pages preserves the selected page size. Changing search text or filters resets only the page to 1 and does not change the page size.
* The back link from Company Details preserves the current company-list query string, and the query key/API request continue to use the controlled page and limit values.
* Updated the empty-state message to the Persian equivalent of “No companies were found with these filters.”.
* Searched `src`, `index.html`, and `README.md` for Persian encoding-corruption patterns and found none.
* The backend must support `GET /api/users/owner-options` for assignable users and the Companies list endpoint with `ownerId`, `ownershipScope`, `page`, and `limit`, including `limit=100`.
* Verification: lint and production build passed; automated tests passed; live/manual testing was not performed.

---

## fix 000088 — Add server-side search and pagination to company selectors

* Identified that incomplete company option lists were caused by loading one small fixed page and filtering only that data in the browser. The shared company selector now delegates searching and pagination to the backend.
* Added reusable single-select and multi-select company components with a 400-millisecond debounce, 25-record pages, and next-page loading when the option list is scrolled near the end.
* Query keys include the normalized search text and excluded company ID. `AbortSignal` is passed to Axios so stale search responses cannot replace newer results.
* Results from multiple pages and selected records are merged and deduplicated by `id`. Existing selections are hydrated from expanded record data or, for the single-select component, from the option-detail endpoint when a label is unavailable.
* Option labels are built from brand name and legal name, with national ID or registration number shown as secondary text. API errors are displayed inside the field and do not crash the form.
* Company selection in the People Directory filter, Task form, person employment history, and parent/subsidiary company relationships now uses the shared component. Payloads continue to send only company IDs.
* While editing a company, the current company is excluded server-side from parent/subsidiary options through `excludeId`, and the two relationship selections cannot overlap.
* No local filtering is performed over a limited page. Changing the search term restarts pagination for that query from page 1.
* The backend must support `GET /api/companies/options` with `search`, `page`, `limit`, and `excludeId`, plus `GET /api/companies/options/:id` for hydrating existing selections. These endpoints must enforce organization scope and company-view permissions and return the fields required to build option labels.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000089 — Add meeting-management user interface

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
* Meeting and option endpoints must enforce permissions and organization scope according to the backend contract. Reminder notifications must return `actionUrl=/meetings/:meetingId` and entity type `MEETING`.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000090 — Add multi-channel product pricing and exchange-rate management

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
* The backend must return the multi-channel pricing fields in product list/detail responses, require an active exchange rate for USD products, calculate final IRR prices, and keep `defaultUnitPrice` aligned with the final in-person price.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000091 — Correct dashboard metrics and complete report filters

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
* `/api/reports/*` endpoints must apply `ownershipScope` and `companyIds` according to `ReportFiltersDto`. The backend `OwnershipScope` enum uses lowercase values.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000092 — Add management dashboard and advanced sales and operations reports

* The management dashboard now uses a single aggregated `GET /api/dashboard/summary` query and no longer counts paginated opportunity and task rows to calculate organization-level metrics. It displays current sales position, tasks and meetings requiring action, period performance, a 90-day forecast, three attention lists, and the report generation time.
* Summary failure is distinguished from legitimate zero values and has independent loading, unavailable, and retry states. Organization status, unread notifications, and quick-access actions remain available when the summary request fails.
* Attention-list links are created only when the user has the dynamic `opportunity:view`, `task:view`, or `meeting:view` permission. Viewing aggregated statistics remains controlled by `report:view`; no new role restriction was added.
* Split the Reports page into Overview, Sales Forecast, Opportunity Aging, Meetings, and Tasks & SLA tabs while retaining all previous reports under Overview. The selected tab, applied filters, and Aging page/page size are stored in the URL. Draft filters do not issue queries until Apply Filters is pressed, and Reset returns to Overview and page 1.
* The Forecast report displays authoritative backend status cards, nominal and weighted values, a monthly chart, and stage/owner details. Cards and tables use the centralized IRR formatter with decimal-string support, and weighted aggregation is not recalculated in the browser.
* Opportunity Aging is a snapshot report that intentionally omits `startDate/endDate`. It displays backend-provided buckets and a server-paginated detail table with Jalali dates and emphasis for overdue, unassigned, missing-close-date, and long-in-stage items.
* Meeting Performance displays summary metrics, status/mode breakdowns, and an organizer table using the correct Scheduled Duration wording. Task Performance separates the current snapshot from period flow and includes priority breakdowns plus an assignee SLA table. Missing assignees are shown as Unassigned.
* Added TypeScript contracts, service methods, React Query hooks, `AbortSignal` support, stale times, and query keys containing all relevant filters. Each endpoint mapper sends only supported parameters; Aging intentionally excludes date-range filters.
* Reused filters introduced in fix `000091` and added static meeting status/mode and task status filters. Failure of async company/report options does not disable static filters, and existing corrupted Persian text in the Reports page and filter panel was corrected.
* Verification: lint and production build passed; automated tests were not run.

---

## fix 000093 — Add sales channels, price history, and financial/commercial reports

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
* The backend contract from fix `000072` was reviewed in commit `9ff5875d`, and the implementation was based on the actual enums, DTOs, and response shapes.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000094 — Add data quality, period comparison, audit, and report exports

* Added the Data Quality and Period Comparison tabs without removing any existing tabs. The selected tab and applied filters are preserved in the URL.
* Data quality is displayed in two completely separate sections: Organization Data Quality and Global Catalog Data Quality. Their scores are never combined. A missing `globalCatalog` section is not treated as an error, and no global-catalog data or navigation is rendered without the dynamic `product:view` permission.
* A `null` score is displayed as insufficient data for calculation. Entity, severity, and rule summaries use the actual backend severity and scope values.
* Added rule drill-down with server-side pagination, Organization/Global Catalog scope, missing-field details, descriptions, snapshot timestamps, and permission-aware links. `routeHint` is used only after a permission check, and no auto-fix behavior was added.
* Global rules display an explicit tenancy notice. Ownership, company, owner, and team filters are applied only by organization-scoped backend rules.
* Period comparison uses the backend-resolved ranges, `PREVIOUS_PERIOD`, `PREVIOUS_YEAR`, and `CUSTOM` modes, polarity, and `isImprovement`. An increase is not assumed to be positive for every metric, and unavailable `percentChange` values are displayed as not calculable.
* Enhanced the existing Audit Log page instead of creating a parallel page. Summary, filter options, compact list, server-side pagination, event details, and URL-backed filters are connected to the endpoints introduced in backend fix `000073`.
* Audit details are rendered with normal React components and safe JSON display. Initial depth is limited, and obvious secret, token, password, and cookie keys are hidden as defense in depth. Added `changedFields`, `before`, `after`, `metadata`, and safe copy actions for Request ID and JSON.
* Added a shared Blob-download service with fixed report keys, safe filenames, a stable fallback filename, CSV/XLSX support, Object URL revocation, duplicate-click prevention, and a specific `EXPORT_ROW_LIMIT_EXCEEDED` message. Report exports use applied report filters, and Audit exports use applied Audit filters.
* The dashboard displays optional Organization Data Quality, a separate optional Global Catalog Data Quality section, and period-comparison metrics from the same dashboard-summary response. Missing backend sections are not mistaken for zero values.
* Renamed the Audit navigation label to Audit Events. Access remains controlled only by `audit-log:view`.
* The backend contract from fix `000073` in commit `58e417cf` was reviewed and used as the basis for the types, filters, and endpoints.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000095 — Prevent period-comparison filters from leaking into other reports

* Identified the production error as `comparisonMode` and comparison dates being stored in the general report type/state and sent to strict non-comparison endpoints.
* Separated general `ReportFilters` from `PeriodComparisonFilters`. General defaults no longer contain comparison fields, and comparison state and URL parameters are managed only inside the Period Comparison tab.
* Added an explicit parameter allowlist at the service boundary for the dashboard and every report endpoint, so each endpoint receives only the filters it supports.
* React Query keys are built from the same allowlists. Changing a comparison filter no longer changes cache keys or refetches unrelated reports.
* CSV/XLSX exports now use a separate allowlist per `reportKey`; only `period-comparison` may send `comparisonMode`, `compareStartDate`, and `compareEndDate`.
* Custom comparison dates are sent only in `CUSTOM` mode and are removed from the URL, request, and query key when another comparison mode is selected.
* Frontend fix `000094` was confirmed before implementation. This change requires no backend modification and remains compatible with the existing strict contract.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000096 — Add accessible metric explanations to the dashboard and reports

* Added a metric information architecture with 53 stable semantic dashboard keys and a typed registry. Display title, definition, time range, calculation method, included/excluded items, and interpretation are separated from the visible label.
* Extended the shared `ReportMetricCard` API with help content, context, secondary text, tone, status, and comparison support while preserving backward compatibility for existing call sites.
* Every dashboard metric card now includes an information icon, a Metric Explanation tooltip, and a multi-section popover. Interaction supports tap/click, keyboard focus, Escape, click-away, `aria-label`, `aria-haspopup`, `aria-expanded`, and focus restoration.
* Action-oriented cards receive a semantic tone and a Needs Review/Action text label only when their value is positive, so meaning does not depend solely on color.
* Win rate, on-time completion rate, and meeting-held rate display insufficient data when no valid denominator exists, while preserving legitimate zero values.
* The dollar exchange rate is displayed in a combined card as “1 USD = ... IRR” with its Jalali effective date. The separate exchange-rate date card was removed.
* Comparison cards display the current value, comparison-period value, direction, percentage change or a non-calculable message, and interpretation based on backend `isImprovement`.
* Added registry explanations for ambiguous forecast, aging, meeting, task, and collection metrics.
* This is a frontend-only fix and requires no backend, API-contract, or migration changes.
* Verification: lint and production build passed; automated tests were not run.

---

## fix 000097 — Simplify metric explanations and fully correct RTL behavior

* Simplified the help-content model from a multi-section structure to a typed `title` and `description` contract. Dependencies on range, calculation, included, excluded, and interpretation fields were removed.
* Rewrote all 59 existing registry entries independently using natural, consistent, professional language without removing or changing any semantic key.
* Removed form-like headings such as Calculation Range, Calculation Method, Included, Excluded, and Interpretation, along with internal lists and dividers. The popover now displays only a title and one coherent explanation.
* Applied explicit RTL direction and right alignment to the Paper, title, and explanation text. Preserved responsive width up to 400 pixels, readable line height, normal wrapping, `overflowWrap`, and safe bidirectional handling for mixed-language content.
* Preserved previous accessibility behavior, including the icon label, short tooltip, click/keyboard activation, `aria-haspopup`, `aria-expanded`, `aria-controls`, Escape/click-away dismissal, and focus restoration.
* Dashboard and report values, calculations, tones, statuses, comparisons, routes, and permissions were not changed.
* This change is entirely frontend-only and requires no backend, API-contract, or migration changes.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000098 — Complete metric-explanation coverage across the Reports page

* Added consistent metric explanations to all summary cards in the Overview, Sales Forecast, Opportunity Aging, Meetings, Tasks & SLA, Financial & Collections, Product Performance, Exchange Rate & Price Impact, and Data Quality tabs. The report registry gained 78 semantic keys for a total of 84 `report.*` keys, and no key depends on a translated display label.
* Added the typed `ReportMetricItem` model and shared `ReportMetricCards` renderer. Every card uses a valid `MetricHelpKey` and deterministic `getMetricHelp`; card tuples, `helpByLabel`, and the special-case Collection Rate label condition were removed.
* Standardized custom `Paper` cards in Data Quality summaries and entity-type cards on `ReportMetricCard`. Preserved unavailable-score handling, critical/high-severity events, separation of organization data from the global catalog, and the `product:view` requirement for catalog visibility.
* Added an information icon next to each metric label in the period-comparison table without converting rows into cards. Shared help text explains periods, date basis, absolute and percentage changes, zero-baseline behavior, and interpretation based on `polarity` and `isImprovement`. No icon was added to numeric cells.
* Popovers use RTL direction, right-aligned Typography, responsive width up to 400 pixels, and one coherent title and paragraph. Preserved the Metric Explanation tooltip, tap/click, keyboard activation, Escape, click-away, focus restoration, and `aria-label`, `aria-haspopup`, `aria-expanded`, and `aria-controls`.
* Rates without a valid denominator are displayed as unavailable while legitimate zero values are preserved. Warning text and semantic tone are used only for action-oriented metrics such as overdue items, incomplete data, USD products using an outdated rate, and critical/high-severity data-quality issues.
* This is a frontend-only fix and required no backend, API-contract, report-calculation, or migration changes.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000099 — Fully correct RTL and rewrite metric explanations in business language

* Added the shared internal `MetricHelpPopover` component and made both `ReportMetricCard` and `MetricHelpButton` use the same popover implementation. Direction, sizing, typography, and accessibility behavior can no longer diverge between cards and the comparison table.
* Applied explicit `dir="rtl"` to the portal Paper and internal wrapper, set the content language to `fa`, right-aligned the title and description, and anchored/transformed the popover from the right. Preserved responsive width up to 400 pixels and removed `unicodeBidi: plaintext` from the full paragraph.
* Reviewed all 137 dashboard and report registry entries and rewrote 105 explanations. Internal field names, implementation terminology, backend references, snapshot wording, technical-state language, and record/event terminology were removed from user-facing explanations and replaced with natural CRM business language.
* Reviewed explanations for current metrics, period metrics, 90-day forecasts, aging, meetings, tasks, collections, products, exchange rates, data quality, and period comparison for date basis, included values, and interpretation. Calculations and displayed values were not changed.
* Rewrote dashboard and commercial-report messages that still exposed field names or backend terminology.
* This is a frontend-only fix and required no backend, API-contract, calculation, permission, route, filter, export, or migration changes.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000100 — Add meeting minutes and secure meeting documents

* Added `MEETING` to `AttachmentEntityType` with the corresponding meeting label. Reused the existing secure attachment service for listing, multipart upload, authenticated Blob download, and deletion.
* Added a dedicated Meeting Minutes and Documents section to the Meeting Details page. Scheduled meetings display a message that upload becomes available after completion, cancelled meetings cannot accept uploads, and completed meetings display the full attachment list and upload controls.
* Extended `AttachmentsTab` and `AttachmentUploadDialog` with optional `uploadButtonLabel`, `uploadDialogTitle`, and `descriptionLabel` props. Preserved the existing `title` and `emptyMessage` props, and kept opportunity, payment, and commercial-document call sites behaviorally compatible.
* After a meeting is successfully marked as completed, the existing meeting-query invalidation now awaits the refetch. The new status and documents section therefore appear without a full page reload, and the upload dialog does not open automatically.
* Preserved `meeting:view`, `attachment:view`, and `attachment:manage` permissions. Users without manage access can only view and download, while meeting-status restrictions remain authoritatively enforced by the backend.
* This feature depends on backend fix `000076` in commit `53932509`, which provides secure meeting attachments after completion. No backend files were changed in this frontend fix.
* Verification: lint and production build passed; automated tests were not run; live/manual testing was not performed.

---

## fix 000101 — عملیات مستقیم جلسات و دسترسی به مستندات از فهرست

* ستون عملیات صفحه سراسری جلسات از دکمه متنی به `RowActions` مشترک و کنترل‌های فقط‌آیکن تبدیل شد؛ Tooltip و `aria-label` فارسی، توقف انتشار رویداد، وضعیت غیرفعال و منوی عملیات بیشتر از همان الگوی استاندارد DataGrid استفاده می‌کنند.
* عملیات پایدار مشاهده، ویرایش، ثبت به‌عنوان برگزارشده، لغو و «صورتجلسه و مستندات» به هر ردیف اضافه شد. مشاهده و عملیات اصلی به‌صورت inline و عملیات اضافی در منوی overflow همراه آیکن نمایش داده می‌شوند؛ ستون عملیات ۱۴۸ پیکسل، وسط‌چین و فاقد sort/filter/column-menu است.
* برای جلسه برنامه‌ریزی‌شده، مشاهده همیشه در دسترس است و ویرایش، تکمیل و لغو فقط با permissionهای `meeting:update`، `meeting:complete` و `meeting:cancel` ظاهر می‌شوند. جلسه برگزارشده فقط مشاهده و مستندات را با `attachment:view` ارائه می‌کند و جلسه لغوشده هیچ transition یا ویرایش جدیدی ندارد.
* تکمیل و لغو مستقیم از فهرست، `MeetingStatusActionDialog` موجود را با ورودی یادداشت/دلیل، نمایش خطای backend، loading، toast موفقیت و invalidation فعلی جلسات، داشبورد و اعلان‌ها بازاستفاده می‌کند؛ تغییر وضعیت بدون تأیید انجام نمی‌شود.
* ویرایش مستقیم، `MeetingFormDialog` موجود را برای همان ردیف باز می‌کند و پس از موفقیت از invalidation فعلی React Query برای تازه‌سازی فهرست استفاده می‌شود.
* کامپوننت واکنش‌گرای `MeetingAttachmentsDialog` اضافه شد که عنوان جلسه را نمایش می‌دهد و `AttachmentsTab` موجود را با `entityType="MEETING"` بازاستفاده می‌کند. فهرست، دانلود، upload، delete، pagination و دانلود امن دوباره پیاده‌سازی نشده‌اند.
* دسترسی مشاهده/دانلود مستندات با `attachment:view` و upload/delete با `attachment:manage` داخل زیرساخت مشترک کنترل می‌شود. اقدام مستندات فقط برای جلسه برگزارشده نمایش داده می‌شود و بخش موجود در صفحه جزئیات جلسه بدون تغییر باقی ماند.

**فایل‌های مهم تغییرکرده/جدید:**

* `src/features/meetings/pages/MeetingsPage.tsx`
* `src/features/meetings/components/MeetingAttachmentsDialog.tsx`
* `README.md`

**وابستگی‌ها و وضعیت بررسی:**

* آخرین پیاده‌سازی مستندات جلسه در commit تاریخی با برچسب `fix 0000100` تأیید شد و شماره یا تاریخچه آن بازنویسی نشد.
* این fix به backend fix `000076` و قرارداد امن پیوست‌های جلسه موجود وابسته است؛ هیچ فایل backend، API contract یا migration تغییر نکرد.
* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check و `npm run build`: بدون خطا اجرا شد.
* تست خودکار اجرا نشد، زیرا `package.json` اسکریپت `test` یا test runner پیکربندی‌شده ندارد.
* تست دستی مرورگر، permission نشست واقعی، transition وضعیت و upload/download واقعی انجام نشد.
* Vite هشدار غیرمسدودکننده chunk بزرگ‌تر از 500 kB داد؛ bundle اصلی حدود 2,302.43 kB و gzip آن حدود 658.34 kB است.

---
## fix 000102 — نمایش یکپارچه تاریخ جلالی با منطقه زمانی کاربر در اعلان‌ها

* utility مشترک `timeZone.ts` اضافه شد و timezone مؤثر را به‌ترتیب از timezone ترجیحی معتبر، timezone مرورگر، timezone سازمان در metadata و در نهایت `Asia/Tehran` انتخاب می‌کند. نام‌های IANA با `Intl.DateTimeFormat` اعتبارسنجی می‌شوند و هیچ offset عددی یا افزودن دستی ساعت استفاده نشده است.
* formatterهای `formatUserJalaliDate`، `formatUserJalaliDateTime` و `formatUserTime` با locale فارسی، تقویم جلالی، timezone صریح، تاریخ/زمان دورقمی و ساعت ۲۴ ساعته اضافه شدند. APIهای قدیمی `formatJalaliDate` و `formatJalaliDateTime` برای سازگاری حفظ و به مسیر جدید متصل شدند.
* type و validation زمان اجرای metadata یادآوری جلسه برای عنوان، شروع، پایان، زمان یادآوری و timezone سازمان اضافه شد؛ metadata نامعتبر باعث crash یا نمایش داده خام نمی‌شود.
* helper واحد `getNotificationDisplayBody` برای NotificationMenu و NotificationsTable اضافه شد. یادآوری‌های جدید از metadata به متن طبیعی جلالی تبدیل می‌شوند و اعلان‌های قدیمی دارای تاریخ ISO نیز فقط برای نوع `MEETING_REMINDER` به زمان محلی کاربر تبدیل می‌شوند.
* اگر تاریخ قدیمی یادآوری نامعتبر باشد، ISO خام نمایش داده نمی‌شود و پیام معنادار «جلسه ... به‌زودی برگزار می‌شود» جایگزین می‌گردد. متن اعلان‌های غیرجلسه‌ای بدون تغییر باقی می‌ماند.
* NotificationMenu و NotificationsTable اکنون متن یکسانی نمایش می‌دهند. زمان جلسه در body و زمان ایجاد اعلان در caption/ستون مستقل باقی مانده‌اند و هر دو از timezone مؤثر یکسان استفاده می‌کنند؛ منو نیز توضیح کوتاه timezone دستگاه را نشان می‌دهد.
* مسیرهای نمایش مشترک تاریخ در جلسات، کارها، فرصت‌ها، فعالیت‌ها، پرداخت‌ها، اسناد تجاری، پیوست‌ها، گزارش‌ها، داشبورد و رویدادهای ممیزی بررسی شدند و مصرف‌کنندگان formatter مشترک بدون تغییر timestampهای UTC به پیاده‌سازی جدید منتقل شدند. `toISOString()`های باقی‌مانده مربوط به payload، فیلتر، input یا نام فایل هستند و در UI نمایش داده نمی‌شوند.

**فایل‌های مهم تغییرکرده/جدید:**

* `src/shared/utils/timeZone.ts`
* `src/shared/utils/jalaliDate.ts`
* `src/features/notifications/types/notification.types.ts`
* `src/features/notifications/utils/notificationDisplay.ts`
* `src/features/notifications/components/NotificationMenu.tsx`
* `src/features/notifications/components/NotificationsTable.tsx`
* `README.md`

**وابستگی‌ها و وضعیت بررسی:**

* آخرین fix فرانت `000101` در commit `9a1ea94` پیش از تغییر تأیید شد.
* این fix به backend fix `000077` برای metadata استاندارد یادآوری جلسه وابسته است؛ سازگاری اعلان‌های تاریخی در فرانت حفظ شده و هیچ فایل backend یا migration تغییر نکرد.
* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check و `npm run build`: بدون خطا اجرا شد.
* تست خودکار اجرا نشد، زیرا `package.json` اسکریپت `test` یا test runner پیکربندی‌شده ندارد.
* تست دستی مرورگر، تغییر timezone واقعی دستگاه و بررسی API زنده انجام نشد.
* Vite هشدار غیرمسدودکننده chunk بزرگ‌تر از 500 kB داد؛ bundle اصلی حدود 2,303.32 kB و gzip آن حدود 658.40 kB است.

---
## fix 000103 — افزودن شماره تماس شرکت

* فیلد اختیاری `centralPhone` به مدل کامل شرکت، آیتم فهرست و payload ایجاد اضافه شد. payload ویرایش به‌صورت صریح `string | null` را پشتیبانی می‌کند تا پاک‌کردن شماره با `null` به backend ارسال شود.
* فیلد «شماره تماس شرکت» در بخش اطلاعات پایه CompanyForm و نزدیک وب‌سایت/دفتر مرکزی اضافه شد. ورودی LTR با `inputMode="tel"`، autocomplete تلفن، محدودیت طول و helper متن «شماره دفتر مرکزی یا شماره عمومی شرکت» دارد و پس از خطای backend داخل فرم حفظ می‌شود.
* helper محدود به تلفن شرکت، ارقام فارسی و عربی را به انگلیسی تبدیل و فاصله، خط تیره و پرانتز را حذف می‌کند، بدون استفاده از `Number`/`parseInt` یا حذف صفر ابتدایی. علامت مثبت فقط در ابتدای شماره پذیرفته می‌شود و ورودی نامعتبر پیام «شماره تماس واردشده معتبر نیست.» نشان می‌دهد.
* در ایجاد شرکت، شماره خالی حذف می‌شود و شماره پرشده به شکل canonical ارسال می‌گردد. در ویرایش، مقدار موجود بارگذاری و مقدار جدید normalized ارسال می‌شود؛ پاک‌کردن شماره موجود صریحاً `centralPhone: null` می‌فرستد و شماره قبلی را بازنمی‌گرداند.
* صفحه جزئیات شرکت، شماره را زیر «اطلاعات اصلی» به‌صورت LTR و لینک دسترس‌پذیر `tel:` نمایش می‌دهد. مقدار خالی «—» است و لینک نامعتبر یا خالی ساخته نمی‌شود.
* فهرست شرکت‌ها ستون compact «شماره تماس» با عرض حداقل ۱۵۰ پیکسل و لینک تماس اضافه کرد. pagination و search همچنان server-side هستند و placeholder جستجو به «نام شرکت، برند، صنعت یا شماره تماس» تغییر یافت.
* خطاهای اعتبارسنجی backend در هر دو دیالوگ ایجاد و ویرایش با `getApiErrorMessage` نمایش داده می‌شوند. فرم‌های تماس اشخاص و تلفن شعب تغییر نکردند.

**فایل‌های مهم تغییرکرده/جدید:**

* `src/features/companies/types/company.types.ts`
* `src/features/companies/utils/companyPhone.ts`
* `src/features/companies/components/CompanyForm.tsx`
* `src/features/companies/components/EditCompanyDialog.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/pages/CompaniesPage.tsx`
* `README.md`

**وابستگی‌ها و وضعیت بررسی:**

* آخرین fix فرانت `000102` در commit `86feb6c` پیش از تغییر تأیید شد.
* این تغییر به backend fix `000078` برای ذخیره، اعتبارسنجی، پاک‌کردن و جستجوی `centralPhone` وابسته است؛ هیچ فایل backend یا migration در این مخزن تغییر نکرد.
* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check و `npm run build`: بدون خطا اجرا شد.
* تست خودکار اجرا نشد، زیرا `package.json` اسکریپت `test` یا test runner پیکربندی‌شده ندارد.
* تست دستی مرورگر و API زنده برای create/edit/clear/search و لینک تماس انجام نشد.
* Vite هشدار غیرمسدودکننده chunk بزرگ‌تر از 500 kB داد؛ bundle اصلی حدود 2,305.21 kB و gzip آن حدود 658.92 kB است.

---

## fix 000104 — افزودن مرکز فعالیت‌ها و آخرین فعالیت‌های داشبورد

* مسیر جدید `/activities` و گزینه «فعالیت‌ها» با آیکن History مستقیماً زیر «افراد» در منوی کناری اضافه شد و نمایش آن به مجوز پویا `activity:view` وابسته است.
* مرکز فعالیت‌ها از `GET /api/activities` با pagination کاملاً server-side استفاده می‌کند و ستون‌های نوع، عنوان، شخص، شرکت، ایجادکننده، وضعیت، تاریخ فعالیت، تاریخ ایجاد و عملیات را نمایش می‌دهد.
* جستجوی server-side برای عنوان، شخص، شرکت و توضیحات و فیلترهای نوع فعالیت، وضعیت، مالک، شرکت، شخص، بازه تاریخ جلالی، «فعالیت‌های من» و تیم با نام پارامترهای backend پیاده‌سازی شدند. تغییر صفحه یا اندازه صفحه موجب فیلتر client-side نمی‌شود.
* وضعیت loading با Skeleton، حالت خالی با پیام «هیچ فعالیتی ثبت نشده است.» و خطای شبکه/API با پیام قابل مشاهده و دکمه «تلاش مجدد» از یکدیگر تفکیک شدند.
* کارت «آخرین فعالیت‌ها» با درخواست مستقل `GET /api/dashboard/latest-activities` حداکثر ۱۰ فعالیت اخیر، آیکن، عنوان، شخص، شرکت، ایجادکننده و تاریخ فعالیت را نشان می‌دهد و پیوند «مشاهده همه فعالیت‌ها» به مرکز فعالیت‌ها دارد. این widget نیز فقط با `activity:view` نمایش داده می‌شود و شکست آن سایر بخش‌های داشبورد را مختل نمی‌کند.
* timeline فعلی اشخاص/شرکت‌ها و طراحی سایر بخش‌های داشبورد تغییر نکردند.

**فایل‌های مهم تغییرکرده/جدید:**

* `src/features/activities/pages/ActivitiesPage.tsx`
* `src/features/activities/components/LatestActivitiesWidget.tsx`
* `src/features/activities/types/activity.types.ts`
* `src/features/activities/services/activities.service.ts`
* `src/features/activities/hooks/useActivities.ts`
* `src/components/dashboard/SideMenu.tsx`
* `src/components/dashboard/MainGrid.tsx`
* `src/routes/index.tsx`
* `README.md`

**وابستگی‌ها و وضعیت بررسی:**

* آخرین fix فرانت `000103` در commit `d8c2616` و ثبت آن در README پیش از تغییر تأیید شد؛ شماره این تغییر `fix 000104` است.
* این تغییر به backend fix `000079` و قراردادهای واقعی `GET /api/activities` و `GET /api/dashboard/latest-activities` وابسته است؛ هیچ فایل backend در این مخزن تغییر نکرد.
* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check و `npm run build`: بدون خطا اجرا شد.
* تست خودکار اجرا نشد، زیرا `package.json` اسکریپت `test` یا test runner پیکربندی‌شده ندارد.
* تست دستی مرورگر، navigation و API زنده انجام نشد.
* فرمان درخواستی `grep` روی محیط PowerShell موجود نبود؛ بررسی معادل encoding با `rg` اجرا شد و متن خراب جدیدی در فایل‌های تغییرکرده یافت نشد.
* Vite هشدار غیرمسدودکننده chunk بزرگ‌تر از 500 kB داد؛ bundle اصلی حدود 2,316.65 kB و gzip آن حدود 662.21 kB است.

---

## fix 000105 — تبدیل آخرین فعالیت‌های داشبورد به فید فشرده فارسی

* widget «آخرین فعالیت‌ها» بدون تغییر dashboard یا endpoint موجود، از ردیف کشیده قبلی به feed فشرده سه‌بخشی آیکن، محتوای اصلی و زمان تبدیل شد. عرض محتوای feed محدود و فاصله‌های افقی زائد حذف شده‌اند؛ Divider ظریف، ارتفاع ردیف کنترل‌شده و ترتیب طبیعی RTL خوانایی سریع را بهتر می‌کنند.
* ساختار محتوایی هر ردیف اکنون عنوان معنادار یا نوع فارسی فعالیت، شرکت و شخص بدون separator خالی، تغییر مرحله فارسی و ثبت‌کننده واقعی از فیلد `createdBy` با قالب «توسط {نام}» را جداگانه نمایش می‌دهد. مالک شرکت به‌اشتباه به‌عنوان اجراکننده استفاده نمی‌شود.
* resolver متمرکز نمایش فعالیت اضافه شد. `CALL` با «تماس تلفنی» و سایر typeهای واقعی API با label فارسی نمایش داده می‌شوند؛ مقدار ناشناخته به «فعالیت» fallback می‌کند و enum خام underscoreدار به کاربر نشان داده نمی‌شود.
* transitionهای `OLD -> NEW` موجود در payload بدون تغییر API استخراج می‌شوند و کدهای pipeline پیش‌فرض با همان labelهای فارسی backend seed نمایش داده می‌شوند؛ در صورت نبود نگاشت معتبر، label امن «مرحله نامشخص» جایگزین enum خام می‌شود.
* formatter مشترک تاریخ جلالی با استفاده از همان timezone resolver پروژه توسعه یافت: فعالیت روز جاری به‌شکل «امروز، ساعت»، روز قبل به‌شکل «دیروز، ساعت» و تاریخ‌های قدیمی با روز، نام ماه و سال فارسی نشان داده می‌شوند. تاریخ خالی یا نامعتبر کاملاً حذف می‌شود و `Invalid Date` نمایش داده نمی‌شود.
* icon container از رنگ‌های theme-aware استفاده می‌کند. در موبایل زمان زیر محتوا قرار می‌گیرد و در tablet/desktop ستون فشرده خودش را دارد؛ feed horizontal scroll ایجاد نمی‌کند. لینک شرکت فقط با شناسه معتبر ساخته می‌شود و برای شخص، چون route جزئیات مستقل در پروژه وجود ندارد، متن ساده باقی مانده است.
* Skeletonهای فشرده هم‌شکل feed، empty state کوچک، خطای inline با retry و footer جداشده «مشاهده همه فعالیت‌ها» حفظ شدند. تعداد داده همچنان حداکثر ۱۰ ردیف و مجوز نمایش همچنان `activity:view` است.

**فایل‌های مهم تغییرکرده/جدید:**

* `src/features/activities/components/LatestActivitiesWidget.tsx`
* `src/features/activities/utils/activityDisplay.ts`
* `src/features/activities/types/activity.types.ts`
* `src/shared/utils/jalaliDate.ts`
* `README.md`

**وابستگی‌ها و وضعیت بررسی:**

* آخرین fix فرانت `000104` در commit `a18f761` و README پیش از تغییر تأیید شد؛ شماره این تغییر `fix 000105` است.
* endpoint و قرارداد موجود `GET /api/dashboard/latest-activities` بدون تغییر استفاده می‌شود. نمایش transition به `title` فعلی backend با قالب `OLD -> NEW` و نمایش ثبت‌کننده به `createdBy` وابسته است؛ backend، Prisma schema و migration تغییر نکردند.
* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check و `npm run build`: بدون خطا اجرا شد.
* تست خودکار اجرا نشد، زیرا `package.json` اسکریپت `test` یا test runner پیکربندی‌شده ندارد؛ نتیجه تستی ساخته یا ادعا نشده است.
* تست دستی مرورگر/API زنده و بررسی بصری در اندازه‌های واقعی viewport انجام نشد.
* Vite هشدار غیرمسدودکننده chunk بزرگ‌تر از 500 kB داد؛ bundle اصلی حدود 2,321.15 kB و gzip آن حدود 663.86 kB است.

---

---
**Built with ❤️ for sales team**

---

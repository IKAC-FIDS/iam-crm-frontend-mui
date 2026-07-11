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
fix 000001 → fix 000047
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
* Corrected complete action label to `انجام شد`.
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

* Added protected `/admin/audit-logs` route and Persian «لاگ تغییرات» navigation item.
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
* Added `backTo: '/companies'` and Persian «بازگشت به شرکت‌ها» label for Companies navigation.
* Added return state to both company and person actions in Follow-up cards.
* Added `backTo: '/follow-ups'` and Persian «بازگشت به پیگیری‌ها» label for Follow-ups navigation.
* Added return state when opening Company Detail from Pipeline cards.
* Added `backTo: '/pipeline'` and Persian «بازگشت به پایپ‌لاین» label for Pipeline navigation.
* Updated Company Detail to read typed location state for its back destination and label.
* Preserved `/companies` and «بازگشت به شرکت‌ها» as the fallback for direct URL access or missing state.
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
* Added a sidebar entry for `فرصت‌ها`.
* Added “مشاهده جزئیات” navigation from the company opportunities tab.
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
* Added Product Catalog as the `محصولات` tab inside Admin Libraries and extended sidebar visibility so users with `product:view` can reach the catalog UI.
* Added an `opportunityLineItems` feature module with typed API service, React Query hooks, decimal-safe money utilities, line-item table, create/edit dialog, delete confirmation, product selector, product default-price prefill, and calculated frontend preview.
* Replaced the Opportunity Details `آیتم‌ها` placeholder with the real line-items tab while keeping later tabs for commercial documents, payments, tasks, attachments, and activities unchanged.
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
* Depends on frontend fix `000043` for the dedicated Opportunity Details page and `آیتم‌ها` tab location.
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
* Replaced the Opportunity Details `اسناد تجاری` and `پرداخت‌ها` placeholders with real tabs while preserving the line-items tab from fix `000044` and the later task/attachment/activity placeholders.
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
* Replaced the Opportunity Details `پیوست‌ها` placeholder with real opportunity attachments for `entityType="OPPORTUNITY"`.
* Added `پیوست‌ها` row actions for commercial documents and payments, opening dialog-scoped attachment lists for `COMMERCIAL_DOCUMENT` and `PAYMENT`.
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
**Built with ❤️ for sales team**

---

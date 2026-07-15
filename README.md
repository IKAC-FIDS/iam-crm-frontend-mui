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
fix 000001 → fix 000068
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

* Reorganized the sidebar into `عملیات فروش`, `مدیریت`, and `حساب` groups while preserving mobile drawer behavior, RTL layout, route highlighting, and permission-based visibility.
* Audited sidebar links against implemented routes through frontend fixes `000043` تا `000051`, including opportunities, tasks, notifications, organizations, SSO providers, reports, and existing admin pages.
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
* Includes navigation for SSO from backend fixes `000021` تا `000023`.
* Depends on frontend fixes `000043` تا `000051` for the implemented opportunity, catalog, document/payment, attachment, task, notification, organization, and SSO pages.
* Payment and commercial-document global report cards remain a future backend reporting dependency because current frontend APIs are opportunity-scoped.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.
* Live authenticated dashboard/report API testing was not performed in this fix.

---
## fix 000053 — حذف مرحله فروش از نمای شرکت

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
## fix 000054 — اصلاح فرم اشخاص برای تفکیک دپارتمان، سمت و نقش فروش

**Implemented items:**

* فرم ایجاد و ویرایش شخص را از فیلد متنی سمت و منبع قدیمی Persona Library جدا کرد و به گزینه‌های پایه متصل کرد.
* دپارتمان از گروه `departments`، سمت سازمانی از گروه `job-titles`، نقش در فرآیند فروش از گروه `persona-roles` و سطح ارشدیت از گروه `seniority-levels` خوانده می‌شود.
* ارسال فرم از aliasهای جدید backend یعنی `jobTitle` و `personaRole` استفاده می‌کند و برای داده‌های قدیمی همچنان `title` و `personaTag` را نمایش می‌دهد.
* فهرست افراد شرکت، فهرست سراسری افراد، فیلترهای دایرکتوری، جزئیات شخص، فرم فعالیت و انتخاب مخاطب Call Card با برچسب‌های جدید هماهنگ شد.
* گروه‌های گزینه‌های پایه در Admin Libraries با `job-titles` و `persona-roles` هماهنگ شد و برچسب‌های «سمت‌ها» و «نقش‌های فروش» جایگزین نام مبهم پرسونا شدند.
* تایپ‌های frontend برای `jobTitle`، `personaRole` و `seniorityLevel` به مدل‌های شخص و مخاطب Call Card اضافه شد.

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
## fix 000055 — اصلاح فرم تعریف فرصت و شفاف‌سازی منبع ایجاد فرصت

**Implemented items:**

* برچسب‌های فرم فرصت را شفاف‌تر کرد تا `source` فرصت با «منبع جذب شرکت» اشتباه نشود.
* فیلد «منبع» در فرم فرصت به «منبع ایجاد فرصت» تغییر کرد و به گروه گزینه‌های پایه `opportunity-sources` متصل شد.
* گروه `opportunity-sources` با برچسب «منابع ایجاد فرصت» در Admin Libraries / گزینه‌های پایه قابل مدیریت شد.
* فرم ایجاد فرصت برای «مسئول فرصت»، «مرحله فروش»، «ارزش تخمینی فرصت»، «تاریخ پیش‌بینی‌شده بستن فرصت»، «مخاطب اصلی»، «احتمال موفقیت»، «رقیب احتمالی» و «شرح نیازمندی / توضیحات فرصت» شفاف‌سازی شد.
* مخاطب اصلی فقط از افراد همان شرکت فرصت خوانده می‌شود.
* تایپ‌های فرصت برای `sourceOptionId`، `opportunitySource`، `sourceOption`، `primaryContactId`، `primaryContact`، `probability` و `competitor` تکمیل شد.
* فهرست فرصت‌ها، تب فرصت‌های شرکت، جزئیات فرصت و دیالوگ تغییر مسئول فرصت با برچسب‌های جدید هماهنگ شد.
* فیلتر «منبع ایجاد فرصت» به فهرست سراسری فرصت‌ها اضافه شد.

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
## fix 000056 — شمسی‌سازی ورودی و نمایش تاریخ‌ها در رابط کاربری

**Implemented items:**

* وابستگی سبک `jalaali-js` برای تبدیل تاریخ شمسی/میلادی اضافه شد.
* ابزار مشترک `jalaliDate` برای تبدیل مقدار backend ISO به نمایش شمسی، تبدیل ورودی شمسی به ISO، نرمال‌سازی ارقام فارسی/عربی و ساخت بازه انتهای روز اضافه شد.
* کامپوننت مشترک `JalaliDateField` اضافه شد تا فرم‌ها تاریخ شمسی را با الگوهای `۱۴۰۳/۰۵/۲۰` و `۱۴۰۳/۰۵/۲۰ ۱۴:۳۰` دریافت کنند و مقدار ISO به API بدهند.
* ورودی‌های تاریخ/زمان در فعالیت‌ها، کال‌کارت، فرصت، کارها، زمان‌بندی مجدد کار، زمان‌بندی مجدد پیگیری، اسناد تجاری، پرداخت‌ها، فیلتر کارها، فیلتر گزارش‌ها و فیلتر Audit Log از ورودی native میلادی به ورودی شمسی مشترک منتقل شد.
* نمایش‌های عمومی تاریخ از جمله شرکت‌ها، کارها، فعالیت‌ها، اعلان‌ها، سازمان‌ها، SSO، فرصت‌ها، اسناد، پرداخت‌ها، پیوست‌ها و لاگ‌ها از مسیرهای formatter مشترک به نمایش شمسی `YYYY/MM/DD - HH:mm` منتقل شدند.
* برای فیلترهای بازه‌ای، مقدار شروع روز و انتهای روز به صورت ISO به backend ارسال می‌شود تا قرارداد backend تغییر نکند.

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

* Backend همچنان تاریخ‌ها را به صورت Gregorian/ISO دریافت و ذخیره می‌کند؛ این fix فقط لایه UI را شمسی می‌کند.
* ورودی مشترک فعلا متن شمسی کنترل‌شده است و Date Picker تقویمی تصویری اضافه نشده تا تغییر UI کم‌ریسک و متمرکز بماند.
* فیلدهای date-only به ISO محلی تبدیل می‌شوند و برای `to` در فیلترهای بازه‌ای انتهای روز ارسال می‌شود.
* Live authenticated API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000057 — افزودن انتخابگر تقویم شمسی برای فیلدهای تاریخ و زمان

**Implemented items:**

* وابستگی `react-multi-date-picker` اضافه شد تا کاربران تاریخ‌ها را از تقویم شمسی انتخاب کنند و مجبور به تایپ دستی نباشند.
* کامپوننت‌های مشترک `JalaliDatePicker`، `JalaliDateTimePicker` و `JalaliDateRangePicker` با تقویم Persian، locale فارسی، چیدمان RTL-friendly، دکمه پاک‌کردن و input مبتنی بر MUI اضافه شدند.
* کامپوننت سازگار `JalaliDateField` حفظ شد و اکنون به جای ورودی متنی ساده، از انتخابگر تقویم شمسی استفاده می‌کند.
* فیلترهای بازه‌ای کارها، گزارش‌ها و Audit Log به `JalaliDateRangePicker` منتقل شدند.
* انتخابگرهای date-time برای فعالیت‌ها، پیگیری‌ها، کارها، یادآوری‌ها و کال‌کارت از plugin زمان استفاده می‌کنند و ساعت/دقیقه انتخاب‌شده را به ISO backend تبدیل می‌کنند.
* قرارداد backend بدون تغییر باقی ماند و همه خروجی‌های انتخابگرها همچنان ISO/Gregorian-compatible هستند.

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

* Backend همچنان تاریخ‌ها را به صورت ISO/Gregorian دریافت و ذخیره می‌کند.
* این fix از همان تبدیل‌های مرکزی fix `000056` استفاده می‌کند و منطق تبدیل تاریخ در فرم‌ها پخش نشده است.
* Live authenticated API testing was not performed in this fix.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000058 — رفع خطای اجرای انتخابگر تاریخ شمسی

**Implemented items:**

* importهای `react-multi-date-picker` و plugin زمان در `JalaliDateField` به‌صورت defensive unwrap شدند تا در زمان اجرا به‌جای module object، خود کامپوننت React رندر شود.
* importهای `DateObject`، تقویم Persian و locale فارسی در همان قرارداد صحیح نگه داشته شدند و locale به نام `persian_fa` یکسان‌سازی شد.
* برای محیط توسعه یک guard کوچک اضافه شد تا اگر dependencyها دوباره به کامپوننت معتبر resolve نشوند، خطای واضح‌تری نمایش داده شود.
* قرارداد ارسال تاریخ‌ها به backend بدون تغییر باقی ماند.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* این fix فقط frontend است و هیچ API contract یا dependency سمت backend را تغییر نمی‌دهد.
* فرم‌های استفاده‌کننده از `JalaliDatePicker`، `JalaliDateTimePicker` و `JalaliDateRangePicker` از همان کامپوننت مشترک استفاده می‌کنند.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000059 — رفع خطای اجرای فیلد انتخاب تاریخ شمسی

**Implemented items:**

* guard توسعه‌ای `JalaliDateField` که با `typeof Component === 'function'` کامپوننت‌های معتبر React را رد می‌کرد حذف شد.
* importهای `DatePicker` و `TimePicker` به import پیش‌فرض مستندشده از `react-multi-date-picker` و plugin زمان برگشتند.
* importهای `DateObject`، تقویم Persian و locale `persian_fa` در شکل صحیح حفظ شدند.
* `JalaliDatePicker`، `JalaliDateTimePicker` و `JalaliDateRangePicker` همچنان بدون تغییر قرارداد backend مقدار ISO/Gregorian-compatible تولید می‌کنند.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* این fix فقط frontend است و هیچ API contract یا dependency سمت backend را تغییر نمی‌دهد.
* خطای runtime ناشی از guard محلی بود، نه نیاز به تغییر فرم‌ها یا endpointها.

**Verification status:**

* Vite cache cleared.
* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000060 — رفع خطای رندر انتخابگر تاریخ شمسی

**Implemented items:**

* JSX خط گزارش‌شده در `JalaliDatePicker` بررسی شد و tag مشکل‌دار، `DatePicker`، به خروجی default واقعی dependency resolve شد.
* برای `DatePicker` و `TimePicker` یک interop resolver بدون guard و بدون log اضافه شد تا module namespace object مستقیم به React داده نشود.
* resolver کامپوننت‌های object-shaped معتبر React مثل `forwardRef` را به‌عنوان کامپوننت معتبر حفظ می‌کند.
* importهای `react-multi-date-picker`، `react-date-object`، تقویم Persian، locale `persian_fa` و آیکن‌های MUI در شکل صحیح باقی ماندند.

**Important files:**

* `src/shared/components/JalaliDateField.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* این fix فقط frontend است و هیچ API contract یا dependency سمت backend را تغییر نمی‌دهد.
* فرم فرصت‌ها و سایر فرم‌ها از همان کامپوننت مشترک `JalaliDateField` استفاده می‌کنند.

**Verification status:**

* Vite cache cleared.
* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000061 — اصلاح فرم ایجاد کار بر اساس زمینه شرکت و فرصت

**Implemented items:**

* فیلدهای متنی raw برای `companyId` و `opportunityId` از فرم ایجاد/ویرایش کار حذف شدند.
* فرم مشترک `TaskFormDialog` بر اساس زمینه شرکت و فرصت، context خواندنی نمایش می‌دهد و شناسه‌ها را از همان context ارسال می‌کند.
* در ایجاد کار از داخل فرصت، شرکت و فرصت قفل و فقط به‌صورت خواندنی نمایش داده می‌شوند.
* در ایجاد کار از داخل شرکت، شرکت قفل و به‌صورت خواندنی نمایش داده می‌شود.
* در صفحه عمومی کارها، شرکت، فرصت و مخاطب با Autocomplete/selector مبتنی بر APIهای موجود انتخاب می‌شوند.
* فرصت‌ها با شرکت انتخاب‌شده فیلتر می‌شوند و انتخاب فرصت، شرکت مرتبط را به‌صورت سازگار تنظیم می‌کند.
* مخاطب‌ها فقط بر اساس شرکت انتخاب‌شده/current بارگذاری می‌شوند.
* تب کارها به صفحه جزئیات شرکت اضافه شد تا ایجاد کار در زمینه شرکت امکان‌پذیر باشد.

**Important files:**

* `src/features/tasks/components/TaskFormDialog.tsx`
* `src/features/tasks/components/TasksTable.tsx`
* `src/features/tasks/components/OpportunityTasksTab.tsx`
* `src/features/tasks/components/CompanyTasksTab.tsx`
* `src/features/opportunities/pages/OpportunityDetailsPage.tsx`
* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* این fix فقط frontend است و هیچ API contract سمت backend را تغییر نمی‌دهد.
* payload کار همچنان با DTO موجود `CreateTaskPayload` / `UpdateTaskPayload` ارسال می‌شود.
* برای سازگاری، وقتی context شرکت موجود است `companyId` همان context ارسال می‌شود؛ کاربر امکان ویرایش raw id ندارد.
* Live authenticated API testing انجام نشد.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000062 — پایه‌گذاری سیستم طراحی یکپارچه و RTL

**Implemented items:**

* theme مرکزی MUI با حفظ کامل palette تاییدشده توسعه داده شد و رنگ‌های پروژه تغییر نکردند.
* tokenهای مشترک layout، اندازه‌ها، radius و shadow در `src/theme/tokens.ts` اضافه شدند.
* customizationهای موجود MUI X برای DataGrid، Charts، Date Pickers و Tree View به theme اصلی متصل شدند.
* default/style overrideهای مشترک برای Button، IconButton، TextField، FormControl، Autocomplete، Paper، Card، Dialog، Table، Tabs، Chip، Alert، Menu و Tooltip اضافه شد.
* CSS پایه اپلیکیشن از کدهای قالب Vite پاک‌سازی شد و helperهای RTL/LTR و جلوگیری از overflow افقی اضافه شدند.
* کامپوننت‌های مشترک `PageContainer`، `PageHeader`، `PageSection`، `FilterPanel`، `ResponsiveActionGroup` و `StateBlock` اضافه شدند.
* layout اصلی داشبورد به container مرکزی با max-width و padding واکنش‌گرا منتقل شد.
* Header داشبورد از inline style به MUI sx و typography استاندارد منتقل شد.
* فاصله‌گذاری منطقی RTL در AppNavbar و SideMenu بهبود یافت.
* صفحه مدیریت کارها به الگوی جدید PageContainer/PageHeader منتقل شد.

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

* این fix فقط frontend و UI foundation است و هیچ API contract، route behavior، permission، validation یا business workflow را تغییر نمی‌دهد.
* رنگ‌های موجود پروژه به‌عنوان source of truth حفظ شدند؛ تمرکز این fix روی spacing، density، RTL، responsive shell و component defaults است.
* migration کامل همه صفحات به shared components در این fix انجام نشد؛ صفحات باقیمانده از طریق theme مرکزی یکدست‌تر شده‌اند اما هنوز می‌توانند در fixهای بعدی به `PageHeader`، `FilterPanel` و `PageSection` مهاجرت کنند.
* visual browser inspection و live API testing انجام نشد.

**Verification status:**

* Lint passed without errors.
* Production build passed.
* The non-blocking Vite bundle-size warning remains.

---
## fix 000063 — تکمیل راست‌چین‌سازی کامپوننت‌ها و استانداردسازی عملیات گرید

**Implemented items:**

* زیرساخت کامل RTL برای MUI/Emotion اضافه شد؛ علاوه بر `dir="rtl"` در ریشه و `theme.direction = 'rtl'`، یک Emotion cache با `stylis-plugin-rtl` و `prefixer` به ریشه اپلیکیشن متصل شد.
* رفتار داخلی `TextField`، `InputBase`، `OutlinedInput`، `InputLabel`، `Select`، `Autocomplete`، `InputAdornment`، `Menu`، `TablePagination` و `Pagination` در theme مرکزی برای متن فارسی، placeholder، label، notch، menu item و pagination راست‌چین شد.
* helperهای LTR برای داده‌های فنی مثل تاریخ، ایمیل، شناسه، URL و کد حفظ و کامل‌تر شدند تا اصلاح global RTL فیلدهای فنی را خراب نکند.
* مشکل هم‌پوشانی آیکن‌های فیلد تاریخ شمسی با متن در `JalaliDateField` از مسیر مشترک picker اصلاح شد؛ ورودی تاریخ همچنان LTR و قرارداد خروجی ISO/Gregorian-compatible باقی ماند.
* کامپوننت مشترک `RowActions` و `RowActionButton` اضافه شد تا عملیات ردیفی با `IconButton`، tooltip فارسی، `aria-label` فارسی و منوی overflow قابل دسترس نمایش داده شوند.
* ستون‌های عملیات متنی و عریض در گریدهای شرکت‌ها، فرصت‌ها، کارها، افراد، پیوست‌ها، اسناد تجاری، پرداخت‌ها، محصولات، سازمان‌ها، اعلان‌ها، SSO، کتابخانه‌ها، شعب، کانال‌های اجتماعی، آیتم‌های فرصت و تنظیمات پایپ‌لاین به عملیات آیکنی فشرده تبدیل شدند.
* اکشن‌های پرتکرار مستقیم نگه داشته شدند و اکشن‌های ثانویه مانند تغییر وضعیت، ارجاع، بایگانی، حذف و تعلیق در منوی `MoreVert` قرار گرفتند.
* عرض ستون‌های عملیات کنترل شد و برای اغلب گریدها به حدود 104 تا 136 پیکسل کاهش یافت.
* labelهای pagination دستی در فعالیت‌ها و پیگیری‌ها با متن فارسی یکسان `تعداد ردیف در صفحه` و الگوی `از {from} تا {to} از {count}` هماهنگ شد.
* wrap/flex-shrink دکمه‌ها و action containerها در theme بهبود یافت تا متن‌هایی مانند «به‌روزرسانی» از محدوده دکمه بیرون نزند.

**Root cause found:**

* اپلیکیشن فقط در لایه document/theme راست‌چین شده بود و Emotion cache برای تبدیل CSSهای MUI به RTL وجود نداشت.
* بسیاری از input/select/autocompleteها رفتار داخلی پیش‌فرض LTR یا padding/adornment نامتناسب داشتند.
* ستون‌های عملیات با دکمه‌های متنی طولانی ساخته شده بودند و باعث مصرف عرض زیاد، overflow و تجربه ضعیف در viewportهای کوچک می‌شدند.

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

* این fix فقط frontend است و هیچ API contract، route، permission، payload، validation یا workflow سمت backend را تغییر نمی‌دهد.
* رنگ‌های تاییدشده پروژه تغییر نکردند؛ تغییرات روی RTL، alignment، responsive behavior، accessibility و عرض ستون‌های عملیات متمرکز است.
* برای اجرای RTL cache، وابستگی‌های سبک `@emotion/cache`، `stylis`، `stylis-plugin-rtl` و تایپ `@types/stylis` به صورت صریح به frontend اضافه شدند.
* visual browser inspection با مرورگر در این fix انجام نشد.
* Live API testing انجام نشد چون backend در این فرایند اجرا/تست نشد.

**Verification status:**

* Lint passed without errors: `npm run lint`.
* TypeScript check passed as part of `npm run build`.
* Production build passed: `npm run build`.
* The non-blocking Vite bundle-size warning remains.

**Remaining known limitations:**

* دکمه‌های متنی داخل cardها و timelineها که عملیات ردیفی DataGrid/Table نیستند، برای حفظ خوانایی و workflow فعلی متنی باقی ماندند.
* بازبینی تصویری چند viewport و تست زنده نقش‌ها/API هنوز باید در محیط دارای backend و مرورگر انجام شود.

---
## fix 000064 — رفع خطای Runtime زیرساخت RTL و هماهنگ‌سازی Stylis با Emotion

**Implemented items:**

* خطای runtime مربوط به Emotion/Stylis در زمان رندر MUI TextField برطرف شد.
* dependency عمومی `stylis-plugin-rtl` حذف و با پلاگین رسمی `@mui/stylis-plugin-rtl` جایگزین شد.
* نسخه app-level `stylis` از `^4.4.0` به نسخه exact `4.2.0` pin شد تا با نسخه مورد استفاده `@emotion/cache@11.14.0` هماهنگ باشد.
* import پلاگین RTL در `src/lib/rtlCache.ts` به `@mui/stylis-plugin-rtl` تغییر کرد و ترتیب `prefixer` قبل از `rtlPlugin` حفظ شد.
* `CacheProvider`، `ThemeProvider`، `CssBaseline`، `RouterProvider` و `QueryProvider` با همان ترتیب قبلی حفظ شدند.
* تنظیمات RTL ریشه (`dir="rtl"` و `lang="fa"`) و `theme.direction = 'rtl'` حفظ شد.
* cache بهینه‌سازی Vite در `node_modules/.vite` پاک شد تا dependencyهای RTL دوباره bundle شوند.
* `@types/stylis` بعد از تست حذف، به دلیل نیاز TypeScript به declaration برای import مستقیم `prefixer` حفظ شد.
* رنگ‌ها، routeها، API contractها، authentication flow، permissionها و validationها تغییر نکردند.

**Root cause:**

* بازرسی dependency tree نشان داد `@emotion/cache@11.14.0` از `stylis@4.2.0` استفاده می‌کرد، اما import مستقیم `prefixer` و package عمومی `stylis-plugin-rtl@2.1.1` از `stylis@4.4.0` resolve می‌شدند.
* این ترکیب باعث اجرای pluginهای Stylis با internalهای ناسازگار در مسیر Emotion serialization می‌شد و در زمان insertion استایل‌های MUI به خطای `Cannot read properties of undefined (reading 'push')` در `append/lift/prefixer` می‌رسید.
* بعد از fix، `npm ls stylis` فقط `stylis@4.2.0` را برای Emotion، `prefixer` و `@mui/stylis-plugin-rtl` نشان می‌دهد.

**Important files:**

* `src/lib/rtlCache.ts`
* `package.json`
* `package-lock.json`
* `README.md`

**Assumptions and backend dependencies:**

* این fix فقط frontend است.
* هیچ API contract، route، authentication behavior، permission، payload یا validation سمت backend تغییر نکرد.
* `npm dedupe` طبق دستور اجرا شد و lockfile را برای tree جدید هماهنگ کرد؛ یک patch transitive غیرعملکردی برای dependency داخلی `ignore` در مسیر TypeScript ESLint نیز در lockfile normalize شد.
* Live API testing انجام نشد؛ backend عملیاتی در این fix هدف تست نبود.

**Verification status:**

* `npm ls stylis`: همه مسیرها به `stylis@4.2.0` dedupe شدند.
* `npm ls @emotion/cache`: `@emotion/cache@11.14.0` معتبر و dedupe شده است.
* `npm ls @mui/stylis-plugin-rtl`: `@mui/stylis-plugin-rtl@9.1.1` نصب است.
* `npm ls stylis-plugin-rtl`: empty؛ package عمومی حذف شده است.
* Dev server: `npm run dev -- --host 127.0.0.1 --port 5173` اجرا شد، Vite dependency optimization شروع شد و `/login` با HTTP 200 پاسخ داد.
* Browser verification: با Chrome محلی از طریق Playwright، `/login` رندر شد؛ ۲ input قابل مشاهده بود، `dir="rtl"` و `lang="fa"` برقرار بود، page error وجود نداشت، React Router default ErrorBoundary نمایش داده نشد و خطاهای `Emotion Insertion`، `append`، `lift`، `prefixer` یا `Cannot read properties of undefined (reading 'push')` دیده نشد.
* Browser console فقط خطای CORS برای درخواست `http://localhost:3000/api/auth/sso/providers` نشان داد، چون backend/live API در این تست در دسترس نبود؛ این خطا به fix RTL مربوط نیست.
* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان باقی است.

**Remaining known limitations:**

* تست authenticated navigation و live API انجام نشد، چون backend عملیاتی و session معتبر در این fix تست نشد.
* نصب managed Chromium خود Playwright به دلیل خطای 403 CDN در موقعیت فعلی ممکن نبود؛ برای browser verification از Chrome نصب‌شده محلی استفاده شد.

---
## fix 000065 — رفع بازگشت ظاهری چیدمان به LTR بعد از فعال‌سازی RTL cache

**Implemented items:**

* علت ظاهری LTR شدن صفحات بعد از `fix 000064` بررسی و به double mirroring در استایل‌های تولیدشده توسط Emotion RTL cache محدود شد.
* تنظیمات اصلی RTL یعنی `dir="rtl"` در document، `theme.direction = 'rtl'` و Emotion cache مبتنی بر `@mui/stylis-plugin-rtl` بدون تغییر حفظ شد.
* `direction: 'rtl'` و `textAlign: 'right'`های دستی که داخل `sx`/theme overrides دوباره توسط Stylis معکوس می‌شدند حذف یا با `textAlign: 'start'` جایگزین شدند.
* جهت محتوای فنی مثل ایمیل، رمز و فیلد تاریخ شمسی با `dir="ltr"` و کلاس `.ltr` در سطح خود input حفظ شد تا وابسته به ruleهای Emotion نباشد.
* جایگاه drawer اصلی بعد از بررسی computed style اصلاح شد؛ با توجه به mirror شدن CSS فیزیکی `Drawer` توسط RTL cache، مقدار physical anchor در `SideMenu` طوری تنظیم شد که drawer در سمت راست viewport رندر شود.
* overrideهای DataGrid برای alignment و direction پاک‌سازی شدند تا grid جهت را از document/theme بگیرد و ستون‌ها در RTL دوباره به LTR برنگردند.
* مسیرهای ورود، SSO callback، layout داشبورد، فیلد تاریخ شمسی و صفحات گریدی بدون تغییر در API contract، route، permission، validation یا workflow اصلاح شدند.
* cache بهینه‌سازی Vite در `node_modules/.vite` بعد از تغییرات RTL پاک شد.

**Root cause:**

* بعد از `fix 000064` زیرساخت RTL درست و بدون crash فعال بود، اما بخشی از theme و layout هنوز `direction: 'rtl'`، `textAlign: 'right'` یا `direction: 'ltr'` را از مسیر Emotion تولید می‌کرد.
* `@mui/stylis-plugin-rtl` این CSSهای فیزیکی را mirror می‌کند؛ بنابراین ruleهای دستی مثل `direction: rtl` و `text-align: right` در خروجی مرورگر به `direction: ltr` و `text-align: left` تبدیل می‌شدند.
* بررسی Chrome قبل از اصلاح نشان داد `html[dir="rtl"]` برقرار است اما computed style بعضی containerها و فرم ورود `direction: ltr` و `text-align: left` شده بود.

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

* این fix فقط frontend است.
* هیچ API contract، route behavior، authentication flow، permission، payload، validation یا business workflow سمت backend تغییر نکرد.
* رنگ‌های تاییدشده پروژه تغییر نکردند.
* برای تست صفحات authenticated از localStorage تستی با نقش `ADMIN` استفاده شد؛ backend live/API معتبر در این fix تست نشد.

**Verification status:**

* `Remove-Item -Recurse -Force .\node_modules\.vite`: اجرا شد تا Vite dependency cache بعد از تغییرات RTL تازه‌سازی شود.
* `npm ls stylis @mui/stylis-plugin-rtl stylis-plugin-rtl`: همه مسیرهای Emotion/MUI به `stylis@4.2.0` dedupe شدند، `@mui/stylis-plugin-rtl@9.1.1` نصب است و package عمومی `stylis-plugin-rtl` در tree وجود ندارد.
* `rg` برای `direction: 'rtl'`، `direction: 'ltr'`، `textAlign: 'right'` و `textAlign: 'left'` در `src`: فقط `theme.direction = 'rtl'` باقی ماند.
* Dev server: `npm run dev -- --host 127.0.0.1 --port 5173` اجرا شد و `/login` با HTTP 200 پاسخ داد.
* Browser verification با Chrome محلی از طریق Playwright/Node REPL انجام شد:
  * `/login` در viewportهای 375 و 1280: `html` و فرم `rtl`، متن‌ها `text-align: start`، فیلدهای ایمیل/رمز `dir="ltr"`، بدون router error و بدون overflow افقی.
  * `/dashboard` در viewportهای 375، 1280 و 1920: `html`، main، appbar و عنوان `rtl`، بدون overflow افقی، drawer دسکتاپ در سمت راست viewport و drawer موبایل از سمت راست باز شد.
  * `/tasks` در viewport 1280: DataGrid و محتوای صفحه `rtl`، فیلد تاریخ `ltr`، بدون router error و بدون overflow افقی.
* Browser console در این بررسی خطای مرتبط با Emotion/Stylis/RTL، `Element type is invalid` یا React Router ErrorBoundary نشان نداد.
* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان باقی است.

**Remaining known limitations:**

* live API testing با backend عملیاتی انجام نشد.
* تست مرورگر روی نمونه‌های نماینده انجام شد، نه روی تک‌تک routeهای authenticated.

---
## fix 000066 — افزودن مدیریت تیم‌ها و تبدیل تیم کاربران به انتخاب از تیم‌های تعریف‌شده

**Implemented items:**

* صفحه مدیریت تیم‌ها در مسیر `/admin/teams` اضافه شد.
* آیتم «تیم‌ها» با permission `team:manage` به منوی بخش مدیریت اضافه شد.
* feature مستقل `teams` برای types، service، hooks، صفحه لیست، فرم ایجاد/ویرایش و مدیریت اعضا اضافه شد.
* لیست تیم‌ها نام، کد، مدیر، تعداد اعضا، وضعیت، تاریخ ایجاد/بروزرسانی و عملیات را نمایش می‌دهد.
* عملیات ایجاد، ویرایش، فعال/غیرفعال‌سازی و مدیریت اعضای تیم از طریق Teams API پیاده‌سازی شد.
* فرم تیم شامل نام تیم، کد تیم، مدیر تیم، توضیحات و وضعیت است.
* مدیر تیم از بین کاربران فعال با نقش `ADMIN` یا `MANAGER` و از مسیر existing users/owner options انتخاب می‌شود و raw user id در UI نمایش داده نمی‌شود.
* دیالوگ اعضای تیم اعضای فعلی را نمایش می‌دهد، افزودن عضو را با selector کاربر انجام می‌دهد، از انتخاب عضو تکراری جلوگیری می‌کند و حذف عضو را از مسیر member API انجام می‌دهد.
* فیلد متنی آزاد «تیم» در `AdminUserFormDialog` حذف و با selector تیم‌های فعال جایگزین شد.
* فیلد متنی آزاد «تیم» در `EditUserRoleDialog` حذف و با selector تیم‌های فعال جایگزین شد.
* اعتبارسنجی موجود حفظ شد: برای نقش‌های `MANAGER` و `REP` انتخاب تیم الزامی است و برای `ADMIN` و `BOARDS` می‌تواند خالی بماند.
* `AdminUsersPage` دیگر گزینه‌های فیلتر تیم را از مقدارهای `user.team` استخراج نمی‌کند و تیم‌ها را از Teams API می‌گیرد.
* جدول کاربران نام تیم را نمایش می‌دهد و از نمایش raw `teamId` در UI عادی جلوگیری می‌کند.
* type کاربر ادمین برای پشتیبانی از `teamId`، `teamName` و `teamCode` توسعه داده شد و compatibility با فیلد legacy `team` حفظ شد.
* lookup group موجود `teams` حذف نشد؛ منبع assignment کاربران در این fix Teams API است.

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

* این fix فقط frontend است و API contractهای موجود کاربران، routeها، permissionها و workflowهای غیرمرتبط را تغییر نمی‌دهد.
* پیاده‌سازی Teams به backend واقعی برای endpointهای زیر وابسته است:
  * `GET /teams`
  * `POST /teams`
  * `PATCH /teams/:id`
  * `PATCH /teams/:id/activate`
  * `PATCH /teams/:id/deactivate`
  * `GET /teams/:id/members`
  * `POST /teams/:id/members`
  * `DELETE /teams/:id/members/:userId`
* فرم‌های کاربر برای contract جدید `teamId` ارسال می‌کنند و دیگر مقدار typed/free-text تیم را ارسال نمی‌کنند.
* compatibility نمایش و فیلتر با `team` legacy حفظ شد تا در دوره migration، کاربران قدیمی بدون `teamId` همچنان نام تیم را نمایش دهند.
* اگر backend فقط assign کردن تیم روی User را پشتیبانی کند و endpoint مدیریت اعضای تیم را نداشته باشد، دیالوگ اعضا خطای backend را نمایش می‌دهد و member management ساختگی انجام نمی‌دهد.
* live API testing انجام نشد، چون backend عملیاتی در این فرایند تست نشد.

**Verification status:**

* `rg`: فیلد متنی آزاد `TextField label="تیم"` در admin user/team code باقی نماند.
* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان باقی است.

**Remaining known limitations:**

* صحت runtime endpointهای Teams باید در محیط متصل به backend جدید بررسی شود.
* صفحه مدیریت اعضا به پشتیبانی backend از endpointهای member management وابسته است.

---
## fix 000067 — بهبود کنترل دسترسی و خطای ۴۰۳ در مدیریت تیم‌ها

**Implemented items:**

* مسیر `/admin/teams` و آیتم منوی «تیم‌ها» بازبینی شد و مسیر API در `teams.service.ts` روی `/teams` باقی ماند، چون `axiosInstance` خودش `VITE_API_URL` یا پیش‌فرض `http://localhost:3000/api` را به عنوان baseURL دارد.
* آیتم منوی «تیم‌ها» با permissionهای backend-aligned `team:view` یا `team:manage` نمایش داده می‌شود.
* صفحه مدیریت تیم‌ها برای دسترسی صفحه از `team:view` یا `team:manage` استفاده می‌کند و عملیات ایجاد/ویرایش/مدیریت اعضا/تغییر وضعیت را فقط برای `team:manage` نمایش می‌دهد.
* اگر `GET /teams?includeInactive=true` با ۴۰۳ برگردد، صفحه پیام هشدار «شما دسترسی مدیریت تیم‌ها را ندارید.» را نمایش می‌دهد و grid/form شکسته را رندر نمی‌کند.
* queryهای Teams روی خطای ۴۰۳ retry نمی‌شوند تا خطای permission به صورت noisy تکرار نشود.
* برای خطای ۴۰۳ در ایجاد یا ویرایش تیم، فرم پیام روشن «شما مجوز ایجاد یا ویرایش تیم را ندارید.» را در toast و alert داخلی نمایش می‌دهد.
* helper مشترک `isForbiddenError` به `src/lib/apiResponse.ts` اضافه شد تا تشخیص خطای ۴۰۳ فقط در feature محلی تکرار نشود.

**Important files:**

* `src/lib/apiResponse.ts`
* `src/features/teams/hooks/useTeams.ts`
* `src/features/teams/pages/AdminTeamsPage.tsx`
* `src/features/teams/components/TeamFormDialog.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**Assumptions and backend dependencies:**

* این fix امنیت backend را دور نمی‌زند و فقط UX خطای permission را در frontend بهتر می‌کند.
* backend همچنان منبع نهایی authorization برای `team:view` و `team:manage` است.
* خطای runtime گزارش‌شده برای `GET /api/teams?includeInactive=true` و `POST /api/teams` با ۴۰۳ به permission backend وابسته است.
* live API testing انجام نشد؛ نتیجه ۴۰۳ بر اساس گزارش runtime و handling frontend پیاده‌سازی شد.

**Verification status:**

* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان باقی است.

**Remaining known limitations:**

* برای رفع اصل ۴۰۳ باید permissionهای backend/user token با `team:view` و `team:manage` هماهنگ شوند.

---
## fix 000068 — افزودن بارگذاری فایل در فرم سند

**Implemented items:**

* فرم افزودن/ویرایش سند تجاری بازبینی شد و UX اصلی «لینک فایل» با کنترل بارگذاری فایل جایگزین شد.
* دکمه «انتخاب فایل»، نمایش نام فایل انتخاب‌شده، نمایش حجم فایل و اکشن «حذف فایل انتخاب‌شده» به فرم سند اضافه شد.
* فیلد لینک خارجی فایل حفظ شد اما به عنوان گزینه ثانویه و اختیاری با label «لینک خارجی فایل، اختیاری» نمایش داده می‌شود.
* برای سند جدید، کاربر باید فایل سند را انتخاب کند یا لینک خارجی معتبر وارد کند؛ انتخاب فایل باعث الزامی نبودن لینک خام می‌شود.
* validation سبک frontend برای پسوندهای مجاز `.pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx` و سقف ۲۵MB مطابق backend اضافه شد.
* ایجاد سند جدید با فایل از endpoint backend `POST /opportunities/:opportunityId/commercial-documents/upload` و `multipart/form-data` انجام می‌شود.
* ویرایش سند موجود با فایل جدید metadata سند را بروزرسانی می‌کند و سپس فایل را از مسیر موجود `/attachments` به همان سند تجاری attach می‌کند.
* frontend هیچ اتصال مستقیمی به MinIO ندارد و فقط فایل را به backend ارسال می‌کند.
* نمایش ستون فایل در لیست اسناد تجاری بهبود یافت؛ اگر backend `fileAttachment` برگرداند نام فایل نمایش داده می‌شود و دانلود از endpoint امن backend `/attachments/:id/download` انجام می‌شود.
* لینک خارجی legacy همچنان فقط در صورت وجود URL امن `http/https` نمایش داده می‌شود.
* پیام‌های خطای فارسی برای فایل نامعتبر، حجم بیش از حد مجاز، خطای بارگذاری فایل سند و خطای دریافت فایل سند اضافه شد.
* invalidation مربوط به attachments سند تجاری بعد از upload/update به invalidationهای موجود اسناد تجاری اضافه شد.

**Important files:**

* `src/features/commercialDocuments/components/CommercialDocumentFormDialog.tsx`
* `src/features/commercialDocuments/components/CommercialDocumentsTab.tsx`
* `src/features/commercialDocuments/services/commercialDocuments.service.ts`
* `src/features/commercialDocuments/hooks/useCommercialDocuments.ts`
* `src/features/commercialDocuments/types/commercialDocument.types.ts`
* `README.md`

**Assumptions and backend dependencies:**

* این fix فقط frontend است و backend یا MinIO را تغییر نمی‌دهد.
* قرارداد backend از repository محلی backend بررسی شد: endpoint آپلود سند `POST /api/opportunities/:opportunityId/commercial-documents/upload` با فیلد multipart `file` و metadata متناظر با `CreateCommercialDocumentDto` است.
* ذخیره واقعی فایل در MinIO/Local از طریق backend و زیرساخت موجود attachments انجام می‌شود؛ frontend هیچ bucket، objectKey، credential یا URL داخلی MinIO نمی‌سازد و نمایش نمی‌دهد.
* برای ویرایش سند موجود، چون backend endpoint multipart update برای سند ندارد، فایل جدید از مسیر امن `/attachments` به entity type `COMMERCIAL_DOCUMENT` و `entityId` سند موجود attach می‌شود.
* دانلود فایل‌های upload شده فقط از مسیر backend `/attachments/:id/download` انجام می‌شود.
* live upload/download testing انجام نشد، چون backend عملیاتی و فایل واقعی در این مرحله تست نشد.

**Verification status:**

* `npm run lint`: passed without errors.
* TypeScript check: passed as part of `npm run build`.
* `npm run build`: passed.
* Non-blocking warning: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان باقی است.

**Remaining known limitations:**

* نمایش نام فایل upload شده در لیست اسناد به این وابسته است که backend در پاسخ سند، summary فیلد `fileAttachment` را برگرداند؛ در غیر این صورت فایل‌ها همچنان از دیالوگ «پیوست‌ها» قابل مشاهده و دانلود هستند.

---
**Built with ❤️ for sales team**

---

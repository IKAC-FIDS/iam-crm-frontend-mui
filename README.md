ChatGPT Plus




















Pasted markdown.md
File
میشه readme‌هایی که بهت میدم رو کامل انگلیسی با ادبیات یکسان بکنی؟


Memory updated
Worked for 5m 41s
انجام شد. README آپلودشده 

 با این استانداردها بازنویسی شد:

تمام بخش‌های فارسی Changelog از fix 000039 تا fix 000048 به انگلیسی حرفه‌ای تبدیل شدند.

لحن Fixها، عناوین، وضعیت تست‌ها، وابستگی فرانت‌اند و الزامات Migration یکدست شدند.

ساختار Markdown، APIها، کدها، مسیر فایل‌ها، enumها و شماره Fixها حفظ شدند.

عنوان Change log به Changelog و عنوان ناهماهنگ backend fix 000038 نیز اصلاح شد.

عبارت‌های فارسی جدول Import Excel عمداً به‌عنوان نام دقیق ستون‌های ورودی حفظ شده‌اند و معنی انگلیسی آن‌ها نیز اضافه شده است.

README.backend.english.md



Pasted markdown(1).md
File

Worked for 6m 52s
انجام شد. README فرانت‌اند 

 به انگلیسی حرفه‌ای و یکدست تبدیل شد.

تمام متن‌های فارسی، به‌ویژه fix 000053 تا fix 000070، ترجمه شدند.

۲۶۲ خط فارسی یا ترکیبی بازنویسی شد.

ساختار Markdown، جدول‌ها و ۳۴ بلوک کد بدون تغییر حفظ شدند.

مسیرهای API، نام فایل‌ها، enumها، permissionها و شناسه‌های فنی تغییر نکردند.

شماره Fixها عیناً حفظ شدند؛ چون در فایل اصلی fix 000069 وجود نداشت، مورد جدیدی ساخته نشد.

فایل نهایی هیچ نویسه فارسی یا عربی ندارد.

README.frontend.english.md



Library
/
README.frontend.english.md


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

## استقرار Docker فرانت‌اند

این پروژه برای اجرای production با Docker و Nginx آماده شده است. در حالت production مقدار `VITE_API_URL` برابر `/api` است تا مرورگر درخواست‌ها را به همان host فرانت بفرستد و Nginx داخل container مسیر `/api/` را به سرویس بک‌اند Docker Compose منتقل کند.

مسیر درخواست‌ها در production:

```text
Browser -> http://SERVER_IP:8080/api/... -> Nginx frontend -> http://api:3000/api/...
```

اجرای فرانت:

```bash
docker compose up -d --build
```

مشاهده logها:

```bash
docker logs -f iam-crm-frontend
```

پورت پیش‌فرض فرانت `8080` است و می‌توان آن را با متغیر محیطی تغییر داد:

```bash
FRONTEND_PORT=8081 docker compose up -d --build
```

نکات مهم:

* `VITE_API_URL=/api` در زمان build تنظیم می‌شود.
* Nginx مسیر `/api/` را با resolver داخلی Docker یعنی `127.0.0.11` به سرویس `api:3000` proxy می‌کند تا پس از recreate شدن backend، IP قدیمی upstream در Nginx باقی نماند.
* نام سرویس بک‌اند در Docker Compose باید `api` باشد.
* این compose به شبکه خارجی `iam-crm-backend_default` وصل می‌شود. اگر نام project بک‌اند روی سرور متفاوت است، نام network در `docker-compose.yml` باید با network واقعی بک‌اند هماهنگ شود.
* برای build داخل Docker مقدار `NODE_OPTIONS=--max-old-space-size=4096` تنظیم شده است تا خطای JavaScript heap out of memory در buildهای Vite/TypeScript کاهش پیدا کند. اگر سرور RAM کمی دارد، افزودن swap یک نیاز عملیاتی است.
* هیچ رمز عبور، token یا secret نباید در Dockerfile، nginx config، README یا فایل‌های env commit شده قرار بگیرد.

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
fix 000001 → fix 000081
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

## fix 000071 — اصلاح قرارداد آپلود فایل سند تجاری در فرانت

**موارد پیاده‌سازی‌شده:**

* قرارداد `POST /opportunities/:opportunityId/commercial-documents/upload` در فرانت با قرارداد بک‌اند هماهنگ شد.
* فایل سند تجاری با نام فیلد `file` داخل `FormData` ارسال می‌شود.
* تنظیم دستی `Content-Type` برای درخواست multipart حذف شد تا مرورگر و axios مقدار boundary را درست تنظیم کنند.
* متادیتای ارسالی به بک‌اند به فیلدهای مجاز سند تجاری محدود شد و فیلدهای داخلی فرانت مثل `file`، `attachmentId` و `fileAttachmentId` در payload متنی ارسال نمی‌شوند.
* لینک خارجی اختیاری فرم همچنان حفظ شد، اما در قرارداد ذخیره‌سازی سند تجاری از مسیر `fileUrl` ارسال می‌شود.
* پیام خطای ۴۰۰ در فرم سند تجاری اصلاح شد تا پیام اعتبارسنجی بک‌اند در صورت وجود نمایش داده شود و در غیر این صورت پیام فارسی «اطلاعات سند یا فایل انتخاب‌شده معتبر نیست.» نمایش داده شود.

**فایل‌های مهم تغییرکرده:**

* `src/features/commercialDocuments/services/commercialDocuments.service.ts`
* `src/features/commercialDocuments/components/CommercialDocumentFormDialog.tsx`
* `README.md`

**فرض‌ها و وابستگی‌های بک‌اند:**

* این اصلاح فقط فرانت‌اند است و بک‌اند تغییر نکرده است.
* قرارداد بک‌اند برای آپلود سند تجاری از `FileInterceptor('file')` استفاده می‌کند.
* فرانت مستقیم به MinIO وصل نمی‌شود و فایل فقط از طریق API بک‌اند ارسال می‌شود.
* enumهای سند تجاری همچنان با کدهای بک‌اند مثل `PROPOSAL`، `PROFORMA` و `CONTRACT` ارسال می‌شوند.
* تست زنده آپلود روی بک‌اند در حال اجرا انجام نشد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**محدودیت‌های باقی‌مانده:**

* تأیید نهایی ذخیره فایل در MinIO نیازمند اجرای دستی سناریوی آپلود با بک‌اند و زیرساخت ذخیره‌سازی فعال است.

---

## fix 000072 — اصلاح ارسال multipart در آپلود سند تجاری

**موارد پیاده‌سازی‌شده:**

* درخواست آپلود سند تجاری در `commercialDocuments.service.ts` با الگوی موجود سرویس پیوست‌ها هماهنگ شد.
* هنگام ارسال `FormData` به `POST /opportunities/:opportunityId/commercial-documents/upload`، مقدار `Content-Type` در تنظیمات همان درخواست `undefined` شد تا مرورگر boundary صحیح multipart را بسازد.
* در interceptor مشترک Axios، اگر `config.data` از نوع `FormData` باشد، هدر `Content-Type` حذف می‌شود تا مقدار پیش‌فرض `application/json` وارد درخواست multipart نشود.
* نام فیلد فایل همچنان `file` باقی ماند و مسیر endpoint بک‌اند تغییر نکرد.

**فایل‌های مهم تغییرکرده:**

* `src/lib/axios.ts`
* `src/features/commercialDocuments/services/commercialDocuments.service.ts`
* `README.md`

**فرض‌ها و وابستگی‌های بک‌اند:**

* این اصلاح فقط فرانت‌اند است و بک‌اند تغییر نکرده است.
* بک‌اند برای آپلود سند تجاری همچنان `FileInterceptor('file')` را انتظار دارد.
* اگر پس از اصلاح header همچنان خطای ۴۰۰ دیده شود، بررسی بعدی باید روی جزئیات validation بک‌اند، مقدار `amount`، فرمت تاریخ‌ها و enumهای `type` و `status` انجام شود.
* تست زنده آپلود با بک‌اند در حال اجرا انجام نشد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**محدودیت‌های باقی‌مانده:**

* تأیید نهایی رفع خطای ۴۰۰ نیازمند اجرای دستی آپلود روی backend و storage فعال است.

---

## fix 000073 — داکرایز کردن فرانت با Nginx و Proxy API

**موارد پیاده‌سازی‌شده:**

* Dockerfile production چندمرحله‌ای اضافه شد.
* مرحله build از `node:22-bookworm-slim`، `npm ci` و `npm run build` استفاده می‌کند.
* مقدارهای `ARG VITE_API_URL=/api`، `ENV VITE_API_URL=$VITE_API_URL` و `ENV NODE_OPTIONS=--max-old-space-size=4096` برای build اضافه شد.
* مرحله runtime از `nginx:1.27` استفاده می‌کند و خروجی `dist` را در `/usr/share/nginx/html` سرو می‌کند.
* `nginx.conf` برای SPA fallback و proxy مسیر `/api/` به `http://api:3000/api/` اضافه شد.
* تنظیمات proxy headerها، timeoutهای ۳۰۰ ثانیه‌ای و `client_max_body_size 30M` اضافه شد.
* `docker-compose.yml` برای اجرای standalone فرانت با پورت پیش‌فرض `8080` و اتصال به network خارجی `iam-crm-backend_default` اضافه شد.
* `.dockerignore` برای کاهش build context و حذف `node_modules`، `dist`، `.git`، logها، envهای واقعی، cache و فایل‌های IDE اضافه شد.
* رفتار موجود `src/lib/axios.ts` بازبینی شد و بدون تغییر باقی ماند؛ چون از `VITE_API_URL` پشتیبانی می‌کند و `Content-Type` را برای `FormData` حذف می‌کند.
* دانلود پیوست‌ها بازبینی شد و همچنان از endpoint بک‌اند با `responseType: 'blob'` استفاده می‌کند.

**فایل‌های مهم تغییرکرده یا جدید:**

* `Dockerfile`
* `nginx.conf`
* `docker-compose.yml`
* `.dockerignore`
* `README.md`

**فرض‌ها و وابستگی‌های بک‌اند:**

* این اصلاح فقط فرانت‌اند است و بک‌اند تغییر نکرده است.
* سرویس بک‌اند در Docker Compose باید با نام `api` روی پورت `3000` در دسترس باشد.
* network خارجی مورد انتظار `iam-crm-backend_default` است. اگر نام project بک‌اند متفاوت باشد، این network باید در `docker-compose.yml` اصلاح شود.
* مقدار production برای `VITE_API_URL` برابر `/api` است و هیچ IP یا URL عمومی بک‌اند در سورس فرانت hardcode نشده است.
* Nginx داخل container فرانت، `/api/` را به `http://api:3000/api/` proxy می‌کند و به `localhost` داخل container اشاره نمی‌کند.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* `docker compose config`: اجرا شد.
* `docker compose build --no-cache --progress=plain`: اجرا شد.
* `docker compose up -d`: اجرا شد.
* `docker logs --tail=100 iam-crm-frontend`: اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**محدودیت‌های باقی‌مانده:**

* اگر در محیط هدف خطای `host not found in upstream "api"` دیده شود، باید network و نام سرویس backend با Docker Compose سرور هماهنگ شود.
* تست کامل API و احراز هویت نیازمند اجرای همزمان backend روی network مورد انتظار است.

---

## fix 000074 — رفع stale DNS در proxy فرانت به API

**موارد پیاده‌سازی‌شده:**

* مشکل 502 گهگاهی Nginx پس از rebuild یا recreate شدن container بک‌اند بررسی شد.
* `nginx.conf` از حالت static upstream با `proxy_pass http://api:3000/api/` خارج شد تا Nginx IP قدیمی سرویس Docker را نگه ندارد.
* در location مربوط به `/api/`، resolver داخلی Docker با `resolver 127.0.0.11 valid=10s ipv6=off;` اضافه شد.
* upstream بک‌اند با متغیر `set $api_upstream api:3000;` تعریف شد تا Nginx نام سرویس Docker را دوباره resolve کند.
* `proxy_pass` به `http://$api_upstream` تغییر کرد و suffix `/api/` از آن حذف شد تا URI اصلی درخواست حفظ شود.
* مسیرهایی مثل `/api/auth/login` اکنون به `http://api:3000/api/auth/login` ارسال می‌شوند.
* headerهای proxy و timeoutهای ۳۰۰ ثانیه‌ای بدون تغییر حفظ شدند.

**فایل‌های مهم تغییرکرده:**

* `nginx.conf`
* `README.md`

**فرض‌ها و وابستگی‌های بک‌اند:**

* این اصلاح فقط فرانت‌اند/Nginx است و بک‌اند تغییر نکرده است.
* سرویس backend باید روی همان Docker network با نام service برابر `api` و پورت `3000` در دسترس باشد.
* اگر در محیط هدف همچنان خطای upstream دیده شود، باید نام network و نام service واقعی backend بررسی و با `docker-compose.yml` و `nginx.conf` هماهنگ شود.

**وضعیت بررسی‌ها:**

* `docker compose up -d --build`: اجرا شد.
* `docker logs --tail=100 iam-crm-frontend`: اجرا شد و Nginx بدون خطای startup بالا آمد.
* تست مستقیم API live انجام نشد.

**محدودیت‌های باقی‌مانده:**

* برای تأیید کامل رفع 502 باید backend در محیط هدف recreate شود و سپس login از مسیر `/api/auth/login` تست شود.

---

## fix 000075 — تکمیل فرم و پروفایل شرکت با اطلاعات ثبتی و اسناد حقوقی

**موارد پیاده‌سازی‌شده:**

* typeهای شرکت برای `registrationNumber`، `nationalId`، `economicCode`، `establishmentDate`، `activityStatus`، `registeredCapital`، `employeeCount`، `parentCompanyIds`، `subsidiaryCompanyIds`، `parentCompanies` و `subsidiaryCompanies` تکمیل شد.
* typeهای اسناد حقوقی شرکت برای `OFFICIAL_GAZETTE` و `LATEST_CHANGES` اضافه شد.
* فرم ایجاد و ویرایش شرکت با فیلدهای شماره ثبت، شناسه ملی، کد اقتصادی، تاریخ تاسیس، وضعیت فعالیت، سرمایه ثبتی، تعداد پرسنل، شرکت‌های مادر و شرکت‌های زیرمجموعه تکمیل شد.
* وضعیت فعالیت با برچسب‌های فارسی «فعال»، «غیر فعال»، «ادغام شده» و «نامشخص» نمایش داده می‌شود.
* انتخاب شرکت‌های مادر و زیرمجموعه با Autocomplete چندانتخابی و جستجوی server-side انجام می‌شود.
* شرکت جاری در حالت ویرایش از گزینه‌های ساختار مالکیتی حذف می‌شود و انتخاب همزمان یک شرکت به‌عنوان مادر و زیرمجموعه اعتبارسنجی می‌شود.
* مقدارهای عددی سرمایه ثبتی و تعداد پرسنل، ارقام فارسی/عربی را قبل از ارسال payload نرمال می‌کنند.
* تاریخ تاسیس با کامپوننت Jalali موجود نمایش داده می‌شود و مقدار ISO/Gregorian به backend ارسال می‌شود.
* صفحه جزئیات شرکت بخش‌های «اطلاعات ثبتی و حقوقی»، «وضعیت و اندازه شرکت» و «ساختار مالکیتی» را نمایش می‌دهد.
* شرکت‌های مادر و زیرمجموعه در پروفایل شرکت به‌صورت chip قابل کلیک نمایش داده می‌شوند.
* تب «اسناد حقوقی» به پروفایل شرکت اضافه شد.
* بارگذاری سند حقوقی شرکت با metadata شامل نوع سند، عنوان، توضیحات و تاریخ سند پیاده‌سازی شد.
* فهرست اسناد حقوقی، دانلود فایل از مسیر امن attachment backend، و حذف سند حقوقی پیاده‌سازی شد.

**فایل‌های مهم تغییرکرده یا جدید:**

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

**فرض‌ها و وابستگی‌های بک‌اند:**

* backend باید فیلدهای جدید شرکت و endpointهای `/companies/:companyId/legal-documents` را پشتیبانی کند.
* upload سند حقوقی شرکت از `POST /companies/:companyId/legal-documents/upload` با فیلد multipart `file` استفاده می‌کند.
* دانلود فایل سند حقوقی همچنان از مسیر attachment backend انجام می‌شود و frontend هیچ URL مستقیم MinIO نمی‌سازد.
* مجوزهای استفاده‌شده مطابق قرارداد موجود `company:view` برای مشاهده و `company:update` برای ویرایش/بارگذاری/حذف هستند.
* تست زنده create/edit/upload/download/delete با backend در حال اجرا انجام نشد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی باقی‌مانده:**

* ایجاد شرکت با فیلدهای جدید.
* ویرایش شرکت با فیلدهای جدید.
* نمایش فیلدهای جدید در جزئیات شرکت.
* انتخاب و نمایش شرکت‌های مادر و زیرمجموعه.
* آپلود، نمایش، دانلود و حذف روزنامه رسمی و آخرین تغییرات.
* بررسی نمایش خطاهای validation backend در سناریوهای واقعی.

---

## fix 000076 — اصلاح به‌هم‌ریختگی encoding متن‌های فارسی در فرانت

**موارد پیاده‌سازی‌شده:**

* متن‌های فارسی خراب‌شده در صفحه جزئیات شرکت بازبینی و اصلاح شدند.
* برچسب‌های تب‌ها، دکمه‌ها، پیام خطا، کارت اطلاعات اصلی، بخش اطلاعات ثبتی و حقوقی، وضعیت و اندازه شرکت، ساختار مالکیتی و تب اسناد حقوقی به متن خوانای فارسی UTF-8 تبدیل شدند.
* فایل `index.html` بررسی شد و `meta charset="UTF-8"` از قبل وجود داشت.
* جستجوی mojibake در source و README انجام شد و نشانگرهای رایج متن خراب باقی نماندند.

**فایل‌های مهم تغییرکرده:**

* `src/features/companies/pages/CompanyDetailsPage.tsx`
* `src/features/companies/components/CompanyLegalDocumentsTab.tsx`
* `README.md`

**فرض‌ها و وابستگی‌ها:**

* این اصلاح فقط فرانت‌اند است و هیچ قرارداد API یا رفتار backend تغییر نکرد.
* مشکل از string literalهای خراب‌شده در source بود، نه از فونت یا theme.
* فایل‌های تغییرکرده با متن فارسی خوانا و UTF-8 ذخیره شدند.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی باقی‌مانده:**

* خروجی production در مرورگر محلی باز شد و متن فارسی صفحه ورود صحیح نمایش داده شد؛ اما صفحه جزئیات شرکت به‌دلیل نیاز به نشست احرازشده و backend قابل دسترس نبود.
* بررسی نهایی تب‌ها، دکمه‌ها، کارت اطلاعات اصلی، اطلاعات ثبتی و حقوقی، وضعیت و اندازه شرکت، ساختار مالکیتی و اسناد حقوقی باید در محیط دارای نشست معتبر انجام شود.

---

## fix 000077 — افزودن سوابق شغلی و تحصیلی به پروفایل افراد

**موارد پیاده‌سازی‌شده:**

* دو بخش «سوابق شغلی» و «سوابق تحصیلی» به پنل جزئیات شخص اضافه شد.
* انتخاب شرکت سابقه شغلی با Autocomplete و جستجوی server-side شرکت‌های موجود انجام می‌شود.
* هنگام ایجاد سابقه شغلی می‌توان چند سمت برای یک شرکت افزود؛ افزودن، ویرایش و حذف مستقل سمت‌ها نیز پشتیبانی می‌شود.
* هر سمت شامل عنوان، تاریخ شروع و پایان، وضعیت «سمت فعلی» و توضیحات است؛ تاریخ‌ها در رابط کاربری جلالی و در payload به‌صورت ISO ارسال می‌شوند.
* برای سمت فعلی، تاریخ پایان غیرفعال و پاک می‌شود و ترتیب تاریخ شروع/پایان در frontend اعتبارسنجی می‌شود.
* افزودن، ویرایش و حذف سابقه تحصیلی با فیلدهای مدرک، دانشگاه، سال و توضیحات پیاده‌سازی شد.
* ارقام فارسی و عربی سال قبل از ارسال نرمال می‌شوند و بازه عدد صحیح ۱۰۰۰ تا ۳۰۰۰ اعتبارسنجی می‌شود.
* وضعیت‌های loading، empty و error و پیام‌های موفقیت/خطا برای هر دو بخش اضافه شد.
* مشاهده با `person:view` و عملیات مدیریتی با مجوز موجود `person:update` انجام می‌شود و مجوز جدیدی ساخته نشد.

**فایل‌های تغییرکرده یا جدید:**

* `src/features/people/types/person.types.ts`
* `src/features/people/services/people.service.ts`
* `src/features/people/hooks/usePeople.ts`
* `src/features/people/components/PersonEmploymentHistorySection.tsx`
* `src/features/people/components/PersonEducationHistorySection.tsx`
* `src/features/people/components/PersonDetailDrawer.tsx`
* `src/features/people/components/PeopleTab.tsx`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `README.md`

**وابستگی‌های backend:**

* endpointهای `/people/:personId/employment-history` و `/people/:personId/education-history` باید فعال باشند.
* مدیریت سمت‌ها از endpointهای nested مسیر `/people/:personId/employment-history/:employmentId/positions` استفاده می‌کند.
* پاسخ سوابق شغلی باید summary شرکت و آرایه `positions` را مطابق قرارداد backend برگرداند.
* تست زنده create/edit/delete به نشست احرازشده، backend در حال اجرا و migration اعمال‌شده نیاز دارد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی باقی‌مانده:**

* نمایش دو بخش سوابق در جزئیات شخص و بررسی حالت‌های خالی، loading و error.
* ایجاد و ویرایش سابقه شغلی با شرکت موجود و چند سمت.
* افزودن، ویرایش و حذف مستقل سمت و حذف کل سابقه شغلی.
* ایجاد، ویرایش و حذف سابقه تحصیلی با مدرک، دانشگاه و سال.
* بررسی نهایی متن‌های فارسی در محیط دارای نشست معتبر و backend آماده.

---

## fix 000078 — اصلاح خطای crypto.randomUUID در فرم سوابق شغلی

**موارد پیاده‌سازی‌شده:**

* علت crash فرم «افزودن سابقه شغلی»، فراخوانی مستقیم `crypto.randomUUID()` در مرورگرها یا originهای HTTP فاقد این API بود.
* helper مشترک `createClientId` اضافه شد که به‌ترتیب از `randomUUID`، سپس `getRandomValues` و در نهایت fallback مبتنی بر زمان و مقدار تصادفی استفاده می‌کند.
* فراخوانی‌های مستقیم از کامپوننت سوابق شغلی حذف و شناسه‌های موقت سمت‌ها با پیشوند `employment-position` تولید شدند.
* شناسه موقت فقط با نام `clientTempId` برای React key و مدیریت ردیف‌های فرم استفاده می‌شود و در payload سمت یا سابقه شغلی به backend ارسال نمی‌شود.
* مسیر افزودن سابقه شغلی و افزودن چند سمت دیگر هنگام ایجاد ردیف موقت به `crypto.randomUUID` وابستگی مستقیم ندارد.
* یک `errorElement` سبک با پیام فارسی، دکمه تلاش مجدد و بازگشت به routeهای اصلی اضافه شد.

**فایل‌های تغییرکرده یا جدید:**

* `src/shared/utils/createClientId.ts`
* `src/features/people/components/PersonEmploymentHistorySection.tsx`
* `src/routes/RouteErrorPage.tsx`
* `src/routes/index.tsx`
* `README.md`

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی:**

* بازکردن جزئیات شخص و فرم افزودن سابقه شغلی روی HTTP بدون خطای `crypto.randomUUID`.
* انتخاب شرکت، افزودن یک یا چند سمت و ذخیره سابقه.
* بررسی افزودن، ویرایش و حذف سمت‌ها و سابقه شغلی با backend آماده و نشست معتبر.
* بررسی console مرورگر و اطمینان از نبود خطای `crypto.randomUUID`.
* آدرس HTTP اعلام‌شده در مرورگر باز شد و بدون خطای console به صفحه ورود هدایت شد؛ به‌دلیل نبود نشست احرازشده، تست تعاملی فرم جزئیات شخص در آن محیط انجام نشد.

---

## fix 000079 — اصلاح فرم سوابق تحصیلی و افزودن کتابخانه دانشگاه‌ها

**موارد پیاده‌سازی‌شده:**

* فیلد مدرک در فرم افزودن/ویرایش سابقه تحصیلی از متن آزاد به dropdown تبدیل شد.
* گزینه‌های مدرک دقیقاً شامل `DIPLOMA` (دیپلم)، `ASSOCIATE` (کاردانی)، `BACHELOR` (کارشناسی)، `PHD` (دکتری) و `POSTDOC` (پسا دکتری) هستند و کارشناسی ارشد اضافه نشد.
* فیلد دانشگاه از متن آزاد به Autocomplete دانشگاه‌های فعال کتابخانه تبدیل شد و فقط `universityId` به backend ارسال می‌شود.
* ورودی عددی سال حذف و با date picker جلالی «تاریخ تحصیل» جایگزین شد؛ مقدار ISO/Gregorian در فیلد `educationDate` ارسال می‌شود.
* نمایش سابقه تحصیلی اکنون برچسب فارسی مدرک، نام relation دانشگاه یا snapshot تاریخی، تاریخ جلالی و توضیحات را نشان می‌دهد.
* تب «دانشگاه‌ها» به صفحه کتابخانه‌های مدیریتی اضافه شد و فهرست، ایجاد، ویرایش، فعال/غیرفعال‌سازی و نمایش وضعیت را مطابق endpoint دانشگاه‌ها پشتیبانی می‌کند.
* فرم دانشگاه شامل نام دانشگاه، کد/شناسه اختیاری، توضیحات و وضعیت فعال است و پیام validation backend را نمایش می‌دهد.
* permissionهای موجود backend یعنی `library:university:view` و `library:university:manage` به فهرست شناخته‌شده frontend اضافه شدند.

**فایل‌های تغییرکرده:**

* `src/features/people/types/person.types.ts`
* `src/features/people/components/PersonEducationHistorySection.tsx`
* `src/features/catalogs/types/catalog.types.ts`
* `src/features/catalogs/services/catalogs.service.ts`
* `src/features/catalogs/components/CatalogItemDialog.tsx`
* `src/features/catalogs/components/CatalogTab.tsx`
* `src/features/catalogs/pages/AdminLibrariesPage.tsx`
* `src/features/admin/permissions/types/adminPermission.types.ts`
* `README.md`

**وابستگی‌های backend:**

* endpointهای `GET/POST /universities` و `PATCH/DELETE /universities/:id` باید فعال باشند؛ DELETE طبق قرارداد backend دانشگاه را غیرفعال می‌کند.
* فهرست مدیریتی از `includeInactive=true` و انتخاب فرم سابقه تحصیلی از فهرست پیش‌فرض دانشگاه‌های فعال استفاده می‌کند.
* payload سابقه تحصیلی فقط شامل `degree`، `universityId`، `educationDate` و `description` است و دیگر `year` یا university/degree متن آزاد ارسال نمی‌شود.
* migration پالایش سوابق تحصیلی و کتابخانه دانشگاه‌ها باید در محیط backend اعمال شده باشد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی باقی‌مانده:**

* ایجاد، ویرایش و غیرفعال‌سازی دانشگاه در تب «دانشگاه‌ها» با backend مهاجرت‌داده‌شده و نشست معتبر.
* بازکردن فرم سابقه تحصیلی و بررسی dropdown مدرک، دانشگاه‌های فعال و date picker جلالی.
* ذخیره و نمایش برچسب مدرک، نام دانشگاه و تاریخ تحصیل در جزئیات شخص.
* بررسی پیام validation واقعی backend و رفتار ویرایش/حذف در محیط یکپارچه.

---

## fix 000080 — بازطراحی صفحه مدیریت نقش‌ها و مجوزها

**موارد پیاده‌سازی‌شده:**

* صفحه مدیریت قبلی ماتریس چهار نقش ثابت با صفحه «مدیریت نقش‌ها و مجوزها» و تب‌های مستقل «مجوزها» و «نقش‌ها» جایگزین شد.
* تب مجوزها فهرست، جستجو، ایجاد، ویرایش و حذف permission را با فیلدهای کد مجوز، نام نمایشی، گروه، توضیحات و وضعیت پشتیبانی می‌کند.
* مجوزهای سیستمی با نشانگر مشخص نمایش داده می‌شوند، کد آن‌ها قابل تغییر نیست و حذف آن‌ها در UI غیرفعال است؛ خطاهای محدودیت backend نیز نمایش داده می‌شوند.
* تب نقش‌ها فهرست، جستجو، ایجاد، ویرایش و حذف role را با کد، نام، نقش پایه، توضیحات، وضعیت، سیستمی بودن و تعداد مجوزها ارائه می‌کند.
* حذف نقش‌های سیستمی و ADMIN در UI غیرفعال است و محدودیت نقش‌های دارای کاربر به backend واگذار و پیام آن نمایش داده می‌شود.
* دکمه «اختصاص مجوز» برای هر نقش اضافه شد و dialog مدیریت مجوزهای نقش، همه مجوزهای فعال، وضعیت assigned، جستجو، گروه‌بندی، انتخاب همه و حذف انتخاب همه را نمایش می‌دهد.
* ذخیره تخصیص‌ها به‌صورت replacement کامل آرایه `permissionIds` انجام می‌شود و پس از موفقیت، فهرست نقش‌ها و تعداد مجوزها refresh می‌شوند.
* فرم ویرایش نقش کاربر اکنون نقش‌های فعال دیتابیسی را از API می‌گیرد و `roleId` ارسال می‌کند؛ نمایش نقش کاربر نیز `roleName`/`assignedRole` را ترجیح می‌دهد.
* منوی مدیریت با permissionهای واقعی `permission:view`، `permission:manage`، `role:view` و `role:manage` هم‌تراز شد.

**فایل‌های تغییرکرده:**

* `src/features/admin/permissions/types/adminPermission.types.ts`
* `src/features/admin/permissions/services/adminPermissions.service.ts`
* `src/features/admin/permissions/hooks/useAdminPermissions.ts`
* `src/features/admin/permissions/components/AdminPermissionsPage.tsx`
* `src/features/admin/users/types/adminUser.types.ts`
* `src/features/admin/users/components/EditUserRoleDialog.tsx`
* `src/features/admin/users/components/AdminUsersPage.tsx`
* `src/components/dashboard/SideMenu.tsx`
* `README.md`

**وابستگی‌ها و محدودیت‌های backend:**

* permission CRUD از `/permissions` و role CRUD از `/roles` استفاده می‌کند.
* تخصیص نقش از `GET /roles/:id/permissions` و replacement اتمیک از `PUT /roles/:id/permissions` با `{ permissionIds }` استفاده می‌کند.
* permissionهای مورد استفاده UI دقیقاً `permission:view`، `permission:manage`، `role:view` و `role:manage` هستند.
* endpoint ویرایش نقش کاربر `PATCH /users/:id/role` از `roleId` پشتیبانی می‌کند و در frontend پویا شد.
* DTO ایجاد کاربر backend هنوز `roleId` را نمی‌پذیرد و `role` enum پایه را الزامی می‌داند؛ بنابراین فرم ایجاد کاربر عمداً چهار نقش پایه را حفظ کرده و نقش پویا را جعل نمی‌کند.
* migration و seed مربوط به RBAC پویا باید اعمال شده و کاربران برای دریافت permissionهای جدید دوباره login کرده باشند.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی باقی‌مانده:**

* ایجاد، ویرایش و حذف permission عادی و بررسی حفاظت permission سیستمی.
* ایجاد، ویرایش و حذف role عادی و بررسی حفاظت role سیستمی/ADMIN و role دارای کاربر.
* بازکردن dialog اختصاص مجوز، تغییر انتخاب‌ها و ذخیره replacement کامل.
* بررسی refresh تعداد مجوزهای نقش و خطاهای validation/محدودیت backend.
* ویرایش نقش کاربر با role دیتابیسی فعال و login مجدد برای مشاهده permissions جدید.

---

## fix 000081 — بهبود چیدمان صفحه پایپ‌لاین و حذف اسکرول افقی

**موارد پیاده‌سازی‌شده:**

* علت UX نامناسب، نمایش همه مراحل پایپ‌لاین در یک Stack افقی با عرض ثابت ۳۱۰ پیکسل برای هر ستون و `overflowX: auto` بود.
* چیدمان افقی با CSS Grid چندردیفه جایگزین شد تا صفحه به‌جای اسکرول افقی با اسکرول عمودی پیمایش شود.
* تعداد ستون‌های responsive به‌ترتیب یک ستون در موبایل، دو ستون در نمایشگر کوچک، سه ستون در medium، چهار ستون در large و پنج ستون در desktop عریض تنظیم شد.
* ترتیب stageها همچنان براساس `sortOrder` backend است؛ source order تغییر نکرده و در RTL اولین مرحله به‌طور طبیعی در سمت راست ردیف قرار می‌گیرد.
* کارت هر مرحله عرض منعطف بدون min-width اجباری و ارتفاع ثابت/viewport-aware بین ۵۲۰ تا ۶۴۰ پیکسل دارد.
* header مرحله شامل نام و تعداد فرصت‌ها خارج از ناحیه اسکرول باقی می‌ماند و فقط فهرست فرصت‌های همان مرحله با `overflowY: auto` اسکرول می‌شود.
* متن خالی هر مرحله به «فرصتی در این وضعیت وجود ندارد.» هم‌راستا شد و loading/error مستقل ستون‌ها حفظ شدند.
* کارت فرصت فشرده‌تر شد و همچنان عنوان، شرکت، مخاطب، اولویت، مالک، تاریخ بسته‌شدن، ارزش و عملیات مشاهده/شرکت/تغییر مرحله را نمایش می‌دهد.
* فیلتر جستجو، فیلتر اولویت، refresh، بازکردن جزئیات فرصت و تغییر مرحله بدون تغییر قرارداد یا رفتار API حفظ شدند.
* در پیاده‌سازی موجود drag-and-drop وجود نداشت؛ fallback واقعی «تغییر مرحله» حفظ شد و هیچ قابلیت DnD حذف نشد.

**فایل‌های تغییرکرده:**

* `src/features/pipeline/pages/PipelinePage.tsx`
* `src/features/pipeline/components/PipelineColumn.tsx`
* `src/features/opportunities/components/OpportunityCard.tsx`
* `README.md`

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده: هشدار Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.

**چک‌لیست دستی باقی‌مانده:**

* بررسی `/pipeline` در viewportهای موبایل، تبلت، medium، large و desktop عریض با داده واقعی چندمرحله‌ای.
* اطمینان از پنج ستون در ردیف desktop عریض، نبود اسکرول افقی صفحه و ترتیب صحیح RTL.
* بررسی اسکرول داخلی مستقل مرحله دارای فرصت‌های زیاد و ثابت‌ماندن header مرحله.
* بررسی کلیک فرصت، مشاهده شرکت، تغییر مرحله، جستجو، فیلتر اولویت و refresh با backend و نشست معتبر.
* آدرس اعلام‌شده `/pipeline` در مرورگر باز شد اما به صفحه ورود هدایت شد؛ به‌دلیل نبود نشست احرازشده، بررسی بصری grid جدید با داده واقعی در آن deployment انجام نشد.

---

## fix 000082 — اصلاح ارسال sourceOptionId در ایجاد فرصت

**موارد پیاده‌سازی‌شده:**

* علت خطا ارسال مقدار نامعتبر (از جمله رشته خالی یا مقدار غیر UUID) در `sourceOptionId` از frontend بود.
* شناسه‌های UUID اختیاری فرصت در مرز سرویس create/update نرمال می‌شوند؛ `sourceOptionId`، `ownerId` و `primaryContactId` فقط در صورت UUID معتبر ارسال و در غیر این صورت از payload حذف می‌شوند.
* dropdown منبع ایجاد فرصت فقط گزینه‌های دارای شناسه UUID معتبر را نمایش می‌دهد و مقدار `id` گزینه را ذخیره می‌کند؛ در حالت بدون انتخاب، `sourceOptionId` ارسال نمی‌شود.
* مسیر ایجاد فرصت شرکت (`POST /api/companies/:companyId/opportunities`) و مسیرهای ایجاد عمومی و ویرایش از نرمال‌سازی مشترک استفاده می‌کنند؛ فیلدهای الزامی مانند عنوان حذف نشده‌اند و `stageId` انتخاب‌شده دست‌نخورده ارسال می‌شود.
* نمایش خطای فرم بهبود یافت تا آرایه `details` در پاسخ validation استاندارد یا legacy، از جمله `sourceOptionId must be a UUID`، داخل فرم و toast نمایش داده شود.
* جست‌وجوی الگوهای خرابی encoding فارسی در `src`، `index.html` و `README.md` انجام شد و موردی پیدا نشد.

**فایل‌های تغییرکرده:**

* `src/shared/utils/optionalUuid.ts`
* `src/features/opportunities/components/OpportunityForm.tsx`
* `src/features/opportunities/components/OpportunityFormDialog.tsx`
* `src/features/opportunities/services/opportunities.service.ts`
* `src/lib/apiResponse.ts`
* `README.md`

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.
* تست زنده endpoint با نشست backend اجرا نشد؛ صحت حذف `sourceOptionId` خالی/نامعتبر در لایه مشترک payload سرویس بررسی شد.

---

## fix 000083 — پیاده‌سازی تمدید خودکار access token در فرانت

**موارد پیاده‌سازی‌شده:**

* refresh token مطابق قرارداد backend فقط در cookie از نوع HttpOnly نگهداری می‌شود؛ frontend آن را از JavaScript نمی‌خواند و در body یا header ارسال نمی‌کند.
* گزینه `withCredentials: true` به Axios اضافه شد تا cookie نشست در درخواست `POST /auth/refresh` و سایر درخواست‌های احراز هویت ارسال شود.
* request interceptor همچنان `accessToken` موجود در `localStorage` را به‌صورت Bearer token به درخواست‌ها اضافه می‌کند.
* response interceptor فقط برای پاسخ 401 درخواست‌های غیر login/refresh، یک بار `POST /auth/refresh` را اجرا می‌کند، `accessToken` و کاربر جدید را ذخیره می‌کند و درخواست اصلی را با توکن تازه retry می‌کند.
* 401های هم‌زمان یک refresh promise مشترک دارند؛ بنابراین تنها یک درخواست refresh در حال اجرا است و درخواست‌های دیگر تا نتیجه همان درخواست منتظر می‌مانند.
* در صورت شکست refresh یا دریافت 401 دوباره پس از retry، access token و کاربر پاک، query cache خالی و کاربر به صفحه ورود هدایت می‌شود؛ پاسخ 403 وارد فرایند refresh نمی‌شود.
* logout موجود در نوار اصلی و layout قدیمی ابتدا `POST /auth/logout` را فراخوانی می‌کند و cleanup محلی را حتی در صورت شکست endpoint در بخش `finally` انجام می‌دهد.
* login معمولی، passkey و SSO همچنان فقط `accessToken` و `user` پاسخ را ذخیره می‌کنند و به وجود refresh token در JSON وابسته نیستند.
* مقدار `VITE_API_URL` و fallback فعلی localhost حفظ شد و IP سرور جدیدی hardcode نشد.
* جست‌وجوی الگوهای خرابی encoding فارسی در `src`، `index.html` و `README.md` انجام شد و موردی پیدا نشد.

**فایل‌های تغییرکرده:**

* `src/lib/axios.ts`
* `src/features/auth/services/auth.service.ts`
* `src/components/dashboard/AppNavbar.tsx`
* `src/layouts/MainLayout.tsx`
* `README.md`

**وابستگی backend:**

* backend باید cookie مربوط به refresh token را با تنظیمات مناسب HttpOnly/SameSite/Secure و CORS سازگار با credentials صادر کند، `POST /api/auth/refresh` را برای rotation cookie و بازگرداندن `accessToken` و `user` پشتیبانی کند و endpoint `POST /api/auth/logout` را در دسترس قرار دهد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.
* بررسی دستی login/cookie/انقضای access token با backend و نشست مرورگر اجرا نشد؛ این بررسی به backend در حال اجرا، تنظیمات CORS/cookie و نشست معتبر نیاز دارد.

---

## fix 000084 — افزودن فیلتر نمایش همه / مال من در شرکت‌ها و فرصت‌ها

**موارد پیاده‌سازی‌شده:**

* نوع مشترک `OwnershipScope` با مقادیر `all`، `mine`، `team` و `unassigned` اضافه و در پارامترهای فهرست شرکت‌ها و فرصت‌ها استفاده شد.
* فیلتر «نمایش» به فهرست شرکت‌ها اضافه شد و گزینه‌های «همه شرکت‌ها»، «شرکت‌های من»، «تیم من» و «بدون مالک» را ارائه می‌کند.
* فیلتر «نمایش» به فهرست فرصت‌ها اضافه شد و گزینه‌های «همه»، «فقط مال من»، «تیم من» و «بدون مالک» را بدون حذف جستجو، فیلترهای قبلی یا pagination ارسال می‌کند.
* مقدار پیش‌فرض هر دو فهرست `all` است؛ frontend دیگر برای حالت پیش‌فرض `ownerId` کاربر جاری را تولید نمی‌کند و انتخاب scope مستقیماً با پارامتر `ownershipScope` به backend ارسال می‌شود.
* برای کاربری که team ندارد، گزینه «تیم من» در فهرست‌های شرکت و فرصت و پایپ‌لاین نمایش داده نمی‌شود.
* کنترل فشرده «نمایش» با گزینه‌های «همه فرصت‌ها»، «فرصت‌های من» و «تیم من» به پایپ‌لاین اضافه شد؛ scope در query key هر ستون و درخواست فرصت‌های همان stage قرار می‌گیرد تا تغییر فیلتر refetch و شمارش stageها را به‌روز کند.
* grid چندستونه و رفتار بدون اسکرول افقی پایپ‌لاین تغییر نکرد و فقط بعد جدید فیلتر به queryهای موجود اضافه شد.
* خطاهای validation backend برای فهرست شرکت‌ها، فرصت‌ها و ستون‌های پایپ‌لاین با جزئیات پاسخ API نمایش داده می‌شوند.
* گزارش‌ها بررسی شدند؛ فیلترهای پیشرفته موجود owner/team اختیاری هستند و هیچ `ownerId` یا حالت «مال من» به‌صورت پیش‌فرض اعمال نمی‌کنند، بنابراین برای جلوگیری از ارسال پارامتر پشتیبانی‌نشده تغییری در گزارش‌ها داده نشد.
* جست‌وجوی الگوهای خرابی encoding فارسی در `src`، `index.html` و `README.md` انجام شد و موردی پیدا نشد.

**فایل‌های تغییرکرده:**

* `src/shared/types/ownership.ts`
* `src/features/companies/types/company.types.ts`
* `src/features/companies/pages/CompaniesPage.tsx`
* `src/features/opportunities/types/opportunity.types.ts`
* `src/features/opportunities/pages/OpportunitiesPage.tsx`
* `src/features/pipeline/hooks/usePipeline.ts`
* `src/features/pipeline/pages/PipelinePage.tsx`
* `README.md`

**وابستگی backend:**

* endpointهای فهرست شرکت‌ها و فرصت‌ها باید پارامتر `ownershipScope=all|mine|team|unassigned` را با محدودیت organization و مجوز view اعمال کنند؛ شمارش pagination نیز باید پس از همین فیلتر محاسبه شود.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.
* بررسی دستی با backend و کاربران فروش دارای/بدون team اجرا نشد؛ این بررسی به داده سازمانی و نشست‌های معتبر نیاز دارد.

**چک‌لیست بررسی دستی:**

* در فهرست شرکت‌ها، حالت پیش‌فرض همه شرکت‌های قابل مشاهده سازمان را نشان دهد؛ «شرکت‌های من» و «بدون مالک» نتایج متناظر را نشان دهند و جستجو/pagination حفظ شود.
* در فهرست فرصت‌ها، حالت پیش‌فرض همه فرصت‌های قابل مشاهده را نشان دهد و «فقط مال من» و «تیم من» نتایج متناظر را برگردانند.
* در پایپ‌لاین، تغییر از «همه فرصت‌ها» به «فرصت‌های من» ستون‌ها و شمارش stageها را refetch کند و بازگشت به همه نیز درست کار کند.

---

## fix 000085 — نمایش label گزینه‌های پایه در صفحه مخاطبین

**موارد پیاده‌سازی‌شده:**

* علت نمایش نادرست این بود که جدول‌ها و جزئیات شخص مقدار ذخیره‌شده lookup مانند `ECONOMIC_BUYER` را مستقیماً نمایش می‌دادند و آن را با گزینه‌های پایه تطبیق نمی‌دادند.
* helper مشترک `getLookupLabel` اضافه شد که مقدار را با `id`، `code` یا `value` گزینه تطبیق می‌دهد و `label` فارسی API را نمایش می‌دهد.
* نقش پرسونا از گروه `persona-roles` در فهرست سراسری `/people`، تب افراد شرکت و drawer جزئیات شخص با label نمایش داده می‌شود.
* فیلدهای lookup-backed دیگر شخص شامل دپارتمان، سمت سازمانی و سطح ارشدیت نیز در همین نماها از گروه‌های متناظر خود label می‌گیرند.
* فیلترها و dropdownهای فرم همچنان label گزینه را نمایش می‌دهند و مقدار backend-compatible موجود (`value`/code و در رکورد legacy شناسه موجود) را نگه می‌دارند؛ label فارسی به‌جای مقدار قرارداد API ارسال نمی‌شود.
* هنگام loading یا خطای lookup و همچنین نبود گزینه متناظر، مقدار خام قبلی به‌عنوان fallback نمایش داده می‌شود و مقدار خالی با «—» نمایش داده می‌شود.
* نمایش نوع راه تماس و پلتفرم اجتماعی تغییر داده نشد، زیرا این بخش‌ها از enumها و labelهای صریح موجود خود استفاده می‌کنند و قرارداد lookup جاری آن‌ها در فرم‌های شخص فعال نیست.
* جست‌وجوی الگوهای خرابی encoding فارسی در `src`، `index.html` و `README.md` انجام شد و موردی پیدا نشد.

**فایل‌های تغییرکرده:**

* `src/features/catalogs/types/catalog.types.ts`
* `src/features/people/pages/PeopleDirectoryPage.tsx`
* `src/features/people/components/PeopleTab.tsx`
* `src/features/people/components/PersonDetailDrawer.tsx`
* `src/features/people/components/PersonForm.tsx`
* `README.md`

**وابستگی backend:**

* backend باید گزینه‌های فعال گروه‌های `persona-roles`، `departments`، `job-titles` و `seniority-levels` را با `id`، `code` و `label` از API lookup موجود برگرداند؛ در صورت نبود یا خطای lookup، frontend مقدار ذخیره‌شده را نمایش می‌دهد.

**وضعیت بررسی‌ها:**

* `npm run lint`: بدون خطا اجرا شد.
* TypeScript check: به‌عنوان بخشی از `npm run build` بدون خطا اجرا شد.
* `npm run build`: بدون خطا اجرا شد.
* هشدار غیرمسدودکننده Vite درباره chunk بزرگ‌تر از 500 kB همچنان وجود دارد.
* بررسی دستی با backend و رکورد دارای `ECONOMIC_BUYER` اجرا نشد؛ این بررسی به داده lookup و نشست معتبر نیاز دارد.

**چک‌لیست بررسی دستی:**

* در `/people` ستون «نقش پرسونا» به‌جای `ECONOMIC_BUYER` مقدار label فارسی مانند «تصمیم‌گیر اقتصادی» را نشان دهد و جستجو/فیلترها کار کنند.
* تب افراد شرکت و drawer جزئیات شخص نیز همان label را نمایش دهند.
* ایجاد/ویرایش شخص label را در dropdown نشان دهد و مقدار backend-compatible را ارسال کند.
* برای مقدار بدون گزینه متناظر، کد خام بدون crash نمایش داده شود.

---
**Built with ❤️ for sales team**

---

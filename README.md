# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## تاریخچه Fixها

### fix 000001 — رفع خطاهای Build و مشکلات اولیه داشبورد

- موارد پیاده‌سازی‌شده: اصلاح type importهای MUI، هماهنگ‌سازی نوع سفارشی‌سازی Date Picker، حذف importهای بدون استفاده، type-safe کردن خطای ورود، استفاده از `mutateAsync` در ورود، کنترل state صفحه‌بندی DataGrid، فعال‌سازی مسیر شرکت‌ها و حذف گزینه‌های منوی فاقد صفحه.
- فایل‌های مهم: `src/features/auth/hooks/useAuth.ts`، `src/features/auth/pages/LoginPage.tsx`، `src/components/dashboard/MainGrid.tsx`، `src/components/dashboard/SideMenu.tsx`، `src/routes/index.tsx`، فایل‌های `src/theme/customizations/*` و فایل‌های TypeScript config.
- فرض‌ها و وابستگی‌ها: جزئیات از diff کامیت `2bd29cc` استنباط شده‌اند؛ وابستگی Backend تازه‌ای در این کامیت قابل تشخیص نیست.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000002 — تکمیل چیدمان RTL و تنظیمات فارسی سند

- موارد پیاده‌سازی‌شده: تنظیم `lang="fa"` و `dir="rtl"`، اعمال جهت و تراز RTL در سطح سند و layoutها، انتقال منوی کناری به سمت راست و جایگزینی فاصله‌ها و borderهای وابسته به جهت با ویژگی‌های منطقی CSS.
- فایل‌های مهم: `index.html`، `src/main.tsx`، `src/index.css`، `src/layouts/DashboardLayout.tsx`، `src/layouts/MainLayout.tsx`، `src/components/dashboard/SideMenu.tsx` و `src/features/auth/pages/LoginPage.tsx`.
- فرض‌ها و وابستگی‌ها: این جمع‌بندی بر اساس diff کامیت `95ea7b1` است؛ وابستگی Backend تازه‌ای دیده نمی‌شود.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000003 — واکنش‌گرا کردن داشبورد و ناوبری

- موارد پیاده‌سازی‌شده: افزودن منوی موقت موبایل و دکمه بازکردن آن، حفظ Drawer دائمی در نمایشگرهای بزرگ، اصلاح فاصله محتوای زیر AppBar و واکنش‌گرا کردن padding، کارت‌های داشبورد، جدول فعالیت‌ها و فرم ورود.
- فایل‌های مهم: `src/components/dashboard/AppNavbar.tsx`، `src/components/dashboard/SideMenu.tsx`، `src/components/dashboard/MainGrid.tsx`، `src/layouts/DashboardLayout.tsx` و `src/features/auth/pages/LoginPage.tsx`.
- فرض‌ها و وابستگی‌ها: این جمع‌بندی از diff کامیت `dbd4298` استخراج شده است؛ وابستگی Backend تازه‌ای قابل تشخیص نیست.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000004 — پیاده‌سازی فهرست، جزئیات و ایجاد شرکت

- موارد پیاده‌سازی‌شده: ساخت فهرست شرکت‌ها با جست‌وجوی debounce، فیلتر مرحله، اولویت و مالک، صفحه‌بندی سمت سرور و وضعیت‌های loading/error؛ افزودن فرم ایجاد شرکت با Zod؛ ساخت صفحه جزئیات؛ تعریف typeها، service و hookهای React Query؛ افزودن route جزئیات شرکت و invalidation کش پس از ایجاد.
- فایل‌های مهم: `src/features/companies/components/CreateCompanyDialog.tsx`، `src/features/companies/pages/CompaniesPage.tsx`، `src/features/companies/pages/CompanyDetailsPage.tsx`، `src/features/companies/services/companies.service.ts`، `src/features/companies/hooks/useCompanies.ts`، `src/features/companies/hooks/useDebouncedValue.ts`، `src/features/companies/types/company.types.ts` و `src/routes/index.tsx`.
- فرض‌ها و وابستگی‌ها: به APIهای فهرست، جزئیات و ایجاد شرکت وابسته است. گزینه فیلتر مالک مشخص و حذف شرکت در UI این نسخه غیرفعال بوده‌اند. جزئیات از diff کامیت `ccc44f2` استخراج شده‌اند.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000005 — استخراج مالک شرکت از احراز هویت و انتخاب استان ایران

- موارد پیاده‌سازی‌شده: حذف ورودی دستی مالک از فرم ایجاد شرکت، ارسال شناسه کاربر واردشده به‌عنوان `ownerId`، جلوگیری از ثبت در نبود اطلاعات کاربر، افزودن `team` به مدل کاربر و ایجاد انتخاب‌گر مشترک استان‌های ایران.
- فایل‌های مهم: `src/features/companies/components/CreateCompanyDialog.tsx`، `src/features/auth/services/auth.service.ts`، `src/store/authStore.ts`، `src/shared/components/IranProvinceSelect.tsx` و `src/shared/constants/iranProvinces.ts`.
- فرض‌ها و وابستگی‌ها: پاسخ ورود باید `id` کاربر و فیلد `team` را فراهم کند و API ایجاد شرکت باید `ownerId` را بپذیرد. جمع‌بندی بر اساس diff کامیت `7a0ad88` است.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000006 — افزودن نوع مالکیت شرکت و انتخاب استان

- موارد پیاده‌سازی‌شده: تعریف enum و برچسب‌های فارسی نوع مالکیت، افزودن آن به type و payload ایجاد شرکت، نمایش آن در جزئیات و استفاده از انتخاب‌گر استان برای دفتر مرکزی در فرم ایجاد.
- فایل‌های مهم: `src/features/companies/types/company.types.ts`، `src/features/companies/components/CreateCompanyDialog.tsx` و `src/features/companies/pages/CompanyDetailsPage.tsx`.
- فرض‌ها و وابستگی‌ها: Backend باید مقادیر `PRIVATE`، `STATE`، `SEMI_STATE`، `PUBLIC_LISTED`، `BANK` و `HOLDING` را برای `ownership` بپذیرد. این موارد از diff کامیت `6a0597b` استخراج شده‌اند.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000007 — تکمیل تب نمای کلی و عملیات به‌روزرسانی شرکت

- موارد پیاده‌سازی‌شده: افزودن تب‌های صفحه جزئیات، تکمیل نمای کلی، فرم ویرایش شرکت، دیالوگ تغییر مرحله، تغییر اولویت و تخصیص مالک به کاربر فعلی؛ افزودن mutationهای ویرایش و تغییر مرحله و invalidation داده‌های شرکت.
- فایل‌های مهم: `src/features/companies/components/EditCompanyDialog.tsx`، `src/features/companies/components/ChangeCompanyStageDialog.tsx`، `src/features/companies/pages/CompanyDetailsPage.tsx`، `src/features/companies/hooks/useCompanies.ts`، `src/features/companies/services/companies.service.ts` و `src/features/companies/types/company.types.ts`.
- فرض‌ها و وابستگی‌ها: به `PATCH /companies/:id` و `PATCH /companies/:id/stage` در لایه Axios پروژه وابسته است؛ در این نسخه تخصیص مالک با شناسه کاربر فعلی و از مسیر عمومی به‌روزرسانی انجام می‌شد. جزئیات از diff کامیت `1b6efd6` استخراج شده‌اند.
- وضعیت بررسی: نتیجه اجرای lint یا build در تاریخچه Git ثبت نشده است.

### fix 000008 — استانداردسازی API، typeها، مجوزها و تخصیص مالک شرکت‌ها

- موارد پیاده‌سازی‌شده: تکمیل موارد ۷ تا ۱۴ نیازمندی‌های ماژول شرکت‌ها؛ تغییر اولویت با `PATCH /api/companies/:id`؛ اتصال endpoint تخصیص مالک با `PATCH /api/companies/:id/owner`؛ استانداردسازی `PaginatedResult<T>` و typeهای شرکت؛ استفاده از `unknown` برای relationهای هنوز پیاده‌سازی‌نشده؛ افزودن helper مجوزها با نقش‌های fallback؛ اعمال مجوز ایجاد، ویرایش، تغییر مرحله، تغییر اولویت و تخصیص مالک؛ افزودن متن‌های دقیق وضعیت خالی و خطای بارگذاری؛ و invalidation کش فهرست و جزئیات پس از mutationها.
- فایل‌های مهم: `src/features/auth/utils/permissions.ts`، `src/features/companies/types/company.types.ts`، `src/store/authStore.ts` و فایل‌های مرتبط service، hook و UI شرکت‌ها.
- فرض‌ها و وابستگی‌ها: چون API کاربران موجود نبود، کاربر جعلی یا فهرست ثابت مالک‌ها اضافه نشد و تخصیص مالک غیرفعال باقی ماند.
- وضعیت بررسی: lint و build با موفقیت اجرا شده‌اند.

### fix 000009 — تکمیل فرم‌ها، enumها، validation و mutation flowهای شرکت‌ها

- موارد پیاده‌سازی‌شده: یکپارچه‌سازی فرم ایجاد و ویرایش در `CompanyForm`؛ افزودن validation با Zod و اعتبارسنجی URL؛ trim رشته‌ها و حذف مقادیر خالی پیش از ارسال؛ ایجاد optionها، labelها و helperهای نمایش تاریخ مشترک؛ افزودن دیالوگ مستقل تغییر اولویت؛ بهبود دیالوگ تغییر مرحله و پیام‌ها؛ نمایش badgeهای فارسی؛ پاک‌سازی query paramها؛ استانداردسازی نام توابع API و حفظ invalidation فهرست و جزئیات.
- فایل‌های مهم: `src/features/companies/components/CompanyForm.tsx`، `src/features/companies/components/ChangeCompanyPriorityDialog.tsx`، `src/features/companies/utils/companyDisplay.ts`، `src/features/companies/types/company.types.ts` و فایل‌های مرتبط صفحه، دیالوگ، service و hook شرکت‌ها.
- فرض‌ها و وابستگی‌ها: تخصیص مالک به دلیل نبود API کاربران غیرفعال ماند؛ مالک شرکت هنگام ایجاد از کاربر واردشده گرفته می‌شود و محل دفتر مرکزی انتخاب‌گر استان است.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000010 — تکمیل تب افراد شرکت، تماس‌ها و شبکه‌های اجتماعی

- موارد پیاده‌سازی‌شده: تکمیل تب افراد با فهرست و صفحه‌بندی و اندازه‌های ۵، ۱۰ و ۲۰؛ جریان‌های ایجاد، ویرایش و حذف همراه تأیید حذف و مدیریت خطا؛ drawer جزئیات کامل فرد؛ CRUD روش‌های تماس و شبکه‌های اجتماعی؛ فرم‌های مشترک و validation با Zod؛ گزینه‌های فارسی؛ کنترل دسترسی مبتنی بر نقش/مجوز؛ invalidation کش افراد، شرکت، تماس‌ها و شبکه‌های اجتماعی؛ و متمرکز کردن همه APIها در service اختصاصی بدون Axios در componentها.
- فایل‌های مهم: `src/features/people/types/person.types.ts`، `src/features/people/services/people.service.ts`، `src/features/people/hooks/usePeople.ts`، `src/features/people/components/PersonForm.tsx`، `src/features/people/components/PersonFormDialog.tsx`، `src/features/people/components/PeopleTab.tsx`، `src/features/people/components/PersonDetailDrawer.tsx`، `src/features/people/components/PersonContactForm.tsx` و `src/features/people/components/PersonSocialForm.tsx`.
- فرض‌ها و وابستگی‌ها: Backend باید مقدار enum برابر `OTHER` را برای نوع تماس و پلتفرم شبکه اجتماعی پشتیبانی کند. تست زنده API به اجرای Backend نیاز دارد.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند.

### fix 000011 — پیاده‌سازی تایم‌لاین و جریان ثبت فعالیت‌های شرکت

- موارد پیاده‌سازی‌شده: تکمیل تب فعالیت‌ها در جزئیات شرکت؛ نمایش فعالیت‌ها در تایم‌لاین واکنش‌گرا با صفحه‌بندی و اندازه‌های ۵، ۱۰ و ۲۰؛ نمایش نوع فعالیت، شخص مرتبط، ثبت‌کننده، یادداشت، نتیجه، زمان انجام، پیگیری بعدی و تاریخ ثبت؛ مشخص‌کردن پیگیری‌های عقب‌افتاده، امروز و آینده؛ افزودن فرم ثبت فعالیت با Zod، انتخاب شخص واقعی از افراد شرکت و تبدیل تاریخ‌ها به ISO؛ نمایش `STAGE_CHANGE` بدون امکان ثبت دستی آن؛ کنترل دسترسی و invalidation کش فعالیت‌ها و جزئیات شرکت پس از ثبت.
- فایل‌های مهم: `src/features/activities/types/activity.types.ts`، `src/features/activities/services/activities.service.ts`، `src/features/activities/hooks/useActivities.ts`، `src/features/activities/components/ActivitiesTab.tsx`، `src/features/activities/components/ActivityForm.tsx`، `src/features/activities/components/ActivityFormDialog.tsx` و `src/features/companies/pages/CompanyDetailsPage.tsx`.
- فرض‌ها و وابستگی‌ها: به `GET /api/activities`، `POST /api/activities` و API افراد شرکت وابسته است. Backend باید صفحه‌بندی فعالیت‌ها و مقدارهای تعریف‌شده `ActivityType` را پشتیبانی کند؛ تست زنده API به اجرای Backend نیاز دارد و داده جعلی اضافه نشده است.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000012 — پیاده‌سازی تب کال کارت شرکت

- موارد پیاده‌سازی‌شده: تکمیل تب کال کارت با وضعیت‌های loading، empty و error؛ ایجاد و ویرایش کال کارت؛ انتخاب مخاطب اصلی و دوم از افراد واقعی شرکت؛ نمایش بخش‌های مخاطبان، استراتژی، متن‌های شروع ارتباط، سؤالات کشف نیاز، اعتراض‌ها و پاسخ‌ها، ارزیابی صلاحیت و پیگیری؛ مدیریت داینامیک سؤال‌ها و اعتراض‌ها با Zod و حذف مقادیر خالی؛ دریافت و پیش‌نمایش پیشنهادهای Backend و اعمال تأییدشده آن‌ها در فرم بدون ذخیره خودکار؛ merge محافظه‌کارانه پیشنهادها با داده موجود؛ کپی متن ایمیل و پیام لینکدین؛ مدیریت پاسخ 404 یا خالی به‌عنوان نبود کال کارت؛ کنترل دسترسی و invalidation کش کال کارت و جزئیات شرکت پس از ذخیره.
- فایل‌های مهم: `src/features/callCards/types/callCard.types.ts`، `src/features/callCards/services/callCards.service.ts`، `src/features/callCards/hooks/useCallCards.ts`، `src/features/callCards/components/CallCardTab.tsx`، `src/features/callCards/components/CallCardView.tsx`، `src/features/callCards/components/CallCardForm.tsx`، `src/features/callCards/components/CallCardFormDialog.tsx`، `src/features/callCards/components/CallCardSuggestionDialog.tsx`، `src/features/callCards/utils/callCardDisplay.ts` و `src/features/companies/pages/CompanyDetailsPage.tsx`.
- فرض‌ها و وابستگی‌ها: به `GET /api/companies/:companyId/call-card`، `GET /api/companies/:companyId/call-card/suggest`، `PUT /api/companies/:companyId/call-card` و API افراد شرکت وابسته است. شکل فیلدهای ناشناخته پیشنهادها با `unknown` نگه داشته شده و تست زنده به اجرای Backend نیاز دارد؛ پیشنهادها در Frontend تولید یا خودکار ذخیره نمی‌شوند.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000013 — پیاده‌سازی مدیریت شعب شرکت

- موارد پیاده‌سازی‌شده: تکمیل تب شعب در جزئیات شرکت؛ نمایش شعب در جدول با نام، شهر، آدرس، تلفن و آخرین بروزرسانی؛ افزودن جریان‌های ایجاد، ویرایش و حذف با دیالوگ تأیید؛ فرم مشترک create/edit با Zod و الزام ورود حداقل یک فیلد؛ trim رشته‌ها و حذف مقادیر خالی پیش از ارسال؛ مدیریت وضعیت‌های loading، empty، error، success و pending؛ اعمال مجوزهای مشاهده، مدیریت و حذف؛ و invalidation کش شعب و جزئیات شرکت پس از mutationها.
- فایل‌های مهم: `src/features/companyBranches/types/companyBranch.types.ts`، `src/features/companyBranches/services/companyBranches.service.ts`، `src/features/companyBranches/hooks/useCompanyBranches.ts`، `src/features/companyBranches/components/CompanyBranchesTab.tsx`، `src/features/companyBranches/components/CompanyBranchForm.tsx`، `src/features/companyBranches/components/CompanyBranchFormDialog.tsx` و `src/features/companies/pages/CompanyDetailsPage.tsx`.
- فرض‌ها و وابستگی‌ها: به endpointهای `GET` و `POST /api/companies/:companyId/branches` و `PATCH` و `DELETE /api/companies/:companyId/branches/:branchId` وابسته است. فرم داده ناقص اما غیرخالی را مجاز می‌داند و داده جعلی اضافه نشده است؛ تست زنده API به اجرای Backend نیاز دارد.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000014 — هماهنگ‌سازی انتخاب محل شعبه با فرم شرکت

- موارد پیاده‌سازی‌شده: جایگزینی ورودی متنی شهر در فرم ایجاد و ویرایش شعبه با انتخاب‌گر مشترک استان‌های ایران؛ نمایش لیست استان‌های ازپیش‌تعریف‌شده پروژه؛ حفظ مقدار انتخاب‌شده در حالت ویرایش؛ و غیرفعال‌کردن انتخاب‌گر هنگام ارسال فرم.
- فایل‌های مهم: `src/features/companyBranches/components/CompanyBranchForm.tsx` و کامپوننت مشترک موجود `src/shared/components/IranProvinceSelect.tsx`.
- فرض‌ها و وابستگی‌ها: برای سازگاری با قرارداد فعلی Backend، نام فیلد payload همچنان `city` باقی مانده اما مقدار آن از فهرست استان‌های ایران انتخاب می‌شود؛ API یا داده جعلی تازه‌ای اضافه نشده است.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000015 — پیاده‌سازی کانال‌های اجتماعی شرکت

- موارد پیاده‌سازی‌شده: تکمیل تب مستقل کانال‌های اجتماعی شرکت؛ نمایش پلتفرم، آدرس یا هندل و آخرین بروزرسانی؛ ایجاد، ویرایش و حذف با تأیید؛ فرم مشترک create/edit با انتخاب enum پلتفرم و اعتبارسنجی اجباری هندل با Zod؛ trim مقدار پیش از ارسال؛ نمایش امن لینک‌های معتبر برای وب‌سایت، لینکدین، اینستاگرام، یوتیوب و آپارات؛ مدیریت وضعیت‌های loading، empty، error، success و pending؛ کنترل مجوزها؛ و invalidation کش کانال‌ها و جزئیات شرکت.
- فایل‌های مهم: `src/features/companySocialChannels/types/companySocialChannel.types.ts`، `src/features/companySocialChannels/services/companySocialChannels.service.ts`، `src/features/companySocialChannels/hooks/useCompanySocialChannels.ts`، `src/features/companySocialChannels/components/CompanySocialChannelsTab.tsx`، `src/features/companySocialChannels/components/CompanySocialChannelForm.tsx`، `src/features/companySocialChannels/components/CompanySocialChannelFormDialog.tsx`، `src/features/companySocialChannels/utils/companySocialChannelDisplay.ts` و `src/features/companies/pages/CompanyDetailsPage.tsx`.
- فرض‌ها و وابستگی‌ها: این ماژول مستقل از Socialهای اشخاص است و به endpointهای `GET` و `POST /api/companies/:companyId/social-channels` و `PATCH` و `DELETE /api/companies/:companyId/social-channels/:channelId` وابسته است. مقدار `OTHER` اضافه نشده، تبدیل اجباری هندل به URL انجام نمی‌شود و تست زنده update/delete به Backend در حال اجرا نیاز دارد.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000016 — پیاده‌سازی صفحه پایپ‌لاین فروش

- موارد پیاده‌سازی‌شده: افزودن route محافظت‌شده `/pipeline` و گزینه پایپ‌لاین به منوی اصلی؛ نمایش برد افقی شامل تمام مراحل فروش با ترتیب موجود در ماژول Companies؛ دریافت ۲۰ شرکت نخست هر مرحله با queryهای cache‌شده و API واقعی شرکت‌ها؛ جستجوی debounceشده و فیلتر اولویت؛ نمایش تعداد کل هر ستون و هشدار محدودیت ۲۰ مورد؛ کارت فشرده شرکت با جزئیات، لینک صفحه شرکت و تغییر مرحله؛ reuse دیالوگ تغییر مرحله با callback موفقیت؛ refresh و invalidation پایپ‌لاین، فهرست و جزئیات شرکت؛ و مدیریت مستقل loading، empty و error هر ستون.
- فایل‌های مهم: `src/features/pipeline/hooks/usePipeline.ts`، `src/features/pipeline/pages/PipelinePage.tsx`، `src/features/pipeline/components/PipelineColumn.tsx`، `src/features/pipeline/components/PipelineCompanyCard.tsx`، `src/features/companies/components/ChangeCompanyStageDialog.tsx`، `src/routes/index.tsx` و `src/components/dashboard/SideMenu.tsx`.
- فرض‌ها و وابستگی‌ها: از `GET /api/companies` و `PATCH /api/companies/:companyId/stage` موجود استفاده شده و endpoint تازه‌ای ساخته نشده است. هر مرحله حداکثر ۲۰ شرکت نمایش می‌دهد؛ search ممکن است تا زمان پشتیبانی Backend نادیده گرفته شود و drag-and-drop یا صفحه‌بندی ستونی پیاده‌سازی نشده است.
- وضعیت بررسی: lint و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی مانده است.

### fix 000017 — پیاده‌سازی صفحه پیگیری‌های سررسید

- موارد پیاده‌سازی‌شده: افزودن route محافظت‌شده `/follow-ups` و گزینه پیگیری‌ها به منوی اصلی؛ دریافت واقعی پیگیری‌های سررسید با صفحه‌بندی و اندازه‌های ۵، ۱۰، ۲۰ و ۵۰؛ نمایش کارت‌های خلاصه تعداد صفحه جاری، عقب‌افتاده‌ها و موعد امروز؛ فیلتر client-side صفحه جاری برای همه، عقب‌افتاده، امروز و آینده؛ نمایش وضعیت، نوع فعالیت، شرکت، شخص، ثبت‌کننده، یادداشت، نتیجه، زمان انجام و زمان پیگیری؛ لینک جزئیات شرکت و شخص؛ refresh همراه حفظ داده موجود؛ و مدیریت loading، empty، error و permission.
- فایل‌های مهم: `src/features/followUps/types/followUp.types.ts`، `src/features/followUps/services/followUps.service.ts`، `src/features/followUps/hooks/useFollowUps.ts`، `src/features/followUps/utils/followUpDisplay.ts`، `src/features/followUps/components/FollowUpsSummaryCards.tsx`، `src/features/followUps/components/FollowUpCard.tsx`، `src/features/followUps/pages/FollowUpsPage.tsx`، `src/routes/index.tsx` و `src/components/dashboard/SideMenu.tsx`.
- فرض‌ها و وابستگی‌ها: فقط از `GET /api/activities/follow-ups/due` استفاده شده و responseهای آرایه‌ای یا paginated به شکل مشترک normalize می‌شوند. فیلترهای وضعیت فقط داده صفحه جاری را فیلتر می‌کنند؛ به دلیل نبود endpoint تأییدشده، ثبت انجام، ویرایش یا حذف پیگیری پیاده‌سازی نشده است.
- وضعیت بررسی: lint بدون خطا یا هشدار و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle در خروجی build باقی مانده است.

### fix 000018 — پیاده‌سازی گزارش‌ها و متریک‌های واقعی داشبورد

- موارد پیاده‌سازی‌شده: افزودن route محافظت‌شده `/reports` و گزینه شرطی گزارش‌ها برای نقش‌ها و مجوزهای مجاز؛ ایجاد گزارش خلاصه پایپ‌لاین با کارت و progress bar، نرخ تبدیل با جدول مراحل، زمان ماندگاری مراحل و گزارش فعالیت‌ها با بازه پیش‌فرض ۳۰ روزه و کنترل تاریخ؛ normalization امن مقدارهای عددی و درصدی؛ مدیریت خطای مستقل هر بخش و 403؛ جایگزینی کامل داده‌های نمونه داشبورد با هفت متریک واقعی شرکت‌ها، نرخ تبدیل و فعالیت‌های ۳۰ روز اخیر؛ حفظ داشبورد برای نقش‌های بدون دسترسی گزارش؛ refresh همه گزارش‌ها و query caching مشترک.
- فایل‌های مهم: `src/features/reports/types/report.types.ts`، `src/features/reports/services/reports.service.ts`، `src/features/reports/hooks/useReports.ts`، `src/features/reports/utils/reportDisplay.ts`، componentها و صفحه Reports، `src/components/dashboard/MainGrid.tsx`، `src/components/dashboard/SideMenu.tsx` و `src/routes/index.tsx`.
- فرض‌ها و وابستگی‌ها: به چهار endpoint واقعی `/api/reports/pipeline-summary`، `/api/reports/conversion-rates`، `/api/reports/stage-durations` و `/api/reports/activities` وابسته است. بازه فعالیت پیش‌فرض ۳۰ روز اخیر بر اساس تاریخ محلی مرورگر ساخته می‌شود؛ export، drill-down و dependency نموداری تازه اضافه نشده‌اند.
- وضعیت بررسی: lint بدون خطا یا هشدار و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle در خروجی build باقی مانده است.

### fix 000019 — آماده‌سازی امن ویرایش فعالیت و زمان‌بندی مجدد پیگیری

- موارد پیاده‌سازی‌شده: بررسی کامل serviceها، hookها و componentهای Activities و Follow-ups برای endpointهای update، reschedule و complete؛ افزودن اکشن ویرایش به آیتم‌های فعالیت برای کاربران مجاز به‌صورت غیرفعال با hint وابستگی Backend؛ افزودن اکشن زمان‌بندی مجدد کنار اکشن موجود پیگیری؛ اصلاح label اکشن تکمیل به «انجام شد»؛ و جلوگیری صریح از mutation محلی یا endpoint حدسی.
- فایل‌های مهم: `src/features/activities/components/ActivitiesTab.tsx`، `src/features/followUps/components/FollowUpCard.tsx` و بررسی service/hookهای موجود فعالیت و پیگیری.
- فرض‌ها و وابستگی‌ها: در repository فعلی هیچ endpoint یا قرارداد تأییدشده‌ای برای `PATCH /api/activities/:activityId`، reschedule یا complete وجود ندارد و پروژه فقط frontend است. به همین دلیل edit، reschedule و complete عمداً غیرفعال‌اند؛ پس از اضافه‌شدن endpointهای واقعی باید mutationها همراه invalidation کلیدهای activities، follow-ups و company پیاده‌سازی شوند.
- وضعیت بررسی: lint بدون خطا یا هشدار و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle در خروجی build باقی مانده است.

### fix 000020 — تکمیل مدیریت کاربران، مجوزها و تخصیص مالک

- موارد پیاده‌سازی‌شده: افزودن routeهای `/admin/users` و `/admin/permissions` و منوی شرطی Admin؛ فهرست، ایجاد، تغییر نقش/تیم، فعال‌سازی و غیرفعال‌سازی کاربران واقعی با جلوگیری از غیرفعال‌سازی کاربر جاری؛ پشتیبانی از `isActive` و `active`؛ عملیات assign، revoke، bulk assign، bulk revoke و ایجاد مجوز با DELETE body صحیح؛ نمایش شفاف نبود endpoint مشاهده وضعیت مجوز نقش‌ها بدون ماتریس جعلی؛ سخت‌سازی helper مجوز با دسترسی ADMIN و افزودن `canAny` و `canAll`؛ و فعال‌سازی تخصیص مالک شرکت با کاربران فعال واقعی دارای نقش REP یا MANAGER.
- فایل‌های مهم: featureهای `src/features/admin/users` و `src/features/admin/permissions`، `src/features/auth/utils/permissions.ts`، `src/features/companies/components/ChangeCompanyOwnerDialog.tsx`، `src/features/companies/pages/CompanyDetailsPage.tsx`، `src/components/dashboard/SideMenu.tsx` و `src/routes/index.tsx`.
- فرض‌ها و وابستگی‌ها: به endpointهای واقعی `/api/users` و `/api/admin/permissions/*` اعلام‌شده وابسته است. Backend endpoint فهرست وضعیت مجوزها به تفکیک نقش ارائه نکرده، بنابراین current state نقش‌ها جعل نشده است؛ team برای MANAGER و REP در frontend الزامی است و تخصیص مالک فقط کاربران فعال این دو نقش را نشان می‌دهد.
- وضعیت بررسی: lint بدون خطا یا هشدار و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle در خروجی build باقی مانده است.

### fix 000021 — پایدارسازی، QA و پاک‌سازی قراردادهای API

- موارد پیاده‌سازی‌شده: audit کامل routeهای محافظت‌شده، serviceها، query keyها، permissionها و response normalizerها؛ افزودن invalidation پایپ‌لاین و گزارش‌ها پس از mutationهای شرکت؛ تازه‌سازی follow-ups و reports پس از ایجاد فعالیت؛ invalidation گزینه‌های مالک پس از mutation کاربران؛ مقاوم‌سازی response گزارش‌ها در برابر آرایه یا summary غایب؛ بررسی نبود raw fetch، base URL تکراری و مسیر `/api/api`؛ اجرای QA واقعی با نقش‌های ADMIN و REP و بررسی دسترسی مستقیم routeها، منوی شرطی، جزئیات شرکت و تخصیص مالک.
- فایل‌های مهم: `src/features/companies/hooks/useCompanies.ts`، `src/features/activities/hooks/useActivities.ts`، `src/features/admin/users/hooks/useAdminUsers.ts`، `src/features/reports/services/reports.service.ts` و این README.
- فرض‌ها و محدودیت‌ها: endpointهای update، complete و reschedule فعالیت در frontend یا قرارداد قابل‌اجرا تأیید نشده‌اند و اکشن‌های وابسته همچنان غیرفعال و بدون موفقیت جعلی هستند. endpoint فهرست وضعیت مجوزها بر اساس نقش و payload قطعی bulk owner نیز در frontend موجود نیست؛ بنابراین state مجوزها یا قرارداد bulk owner حدس زده نشده است.
- وضعیت بررسی: ورود ADMIN و REP با حساب‌های QA محلی موفق بود؛ مسیرهای dashboard، companies، company detail، pipeline، follow-ups، reports و Admin مطابق نقش‌ها render شدند و خطای console مشاهده نشد. lint بدون خطا یا هشدار و build تولید موفق بود؛ فقط هشدار غیرمسدودکننده اندازه bundle باقی ماند.

## چک‌لیست قرارداد API فرانت‌اند

تمام مسیرهای زیر نسبت به `baseURL` مشترک Axios با پسوند `/api` فراخوانی می‌شوند:

- شرکت‌ها: `GET/POST /companies`، `GET/PATCH /companies/:id`، `PATCH /companies/:id/stage` و `PATCH /companies/:id/owner`.
- افراد: `GET/POST /people`، `GET/PATCH/DELETE /people/:id`، و CRUD مسیرهای `/people/:id/contacts` و `/people/:id/socials`.
- فعالیت‌ها: `GET/POST /activities`، `PATCH /activities/:id`، `PATCH /activities/:id/complete`، `PATCH /activities/:id/reschedule` و `GET /activities/follow-ups/due`.
- کال کارت: `GET/PUT /companies/:id/call-card` و `GET /companies/:id/call-card/suggest`.
- شعب و کانال‌های اجتماعی: CRUD مسیرهای `/companies/:id/branches` و `/companies/:id/social-channels`.
- گزارش‌ها: `GET /reports/pipeline-summary`، `/reports/conversion-rates`، `/reports/stage-durations` و `/reports/activities`.
- کاربران: `GET/POST /users`، `GET /users/:id` و PATCH مسیرهای role، activate و deactivate.
- مجوزها: POST مسیرهای assign، bulk-assign و create و DELETE مسیرهای revoke و bulk-revoke با body به‌شکل `{ data: payload }`.

### fix 000022 — اتصال چرخه عمر فعالیت و پیگیری به Backend

- موارد پیاده‌سازی‌شده: فعال‌سازی ویرایش فعالیت برای نقش‌ها و مجوزهای مجاز؛ فرم مشترک create/edit با مقداردهی اولیه شخص، نوع، تاریخ‌ها، یادداشت و نتیجه؛ قفل نوع فعالیت‌های `STAGE_CHANGE`؛ اتصال `PATCH /api/activities/:id`؛ فعال‌سازی تکمیل پیگیری با دیالوگ نتیجه و یادداشت؛ فعال‌سازی زمان‌بندی مجدد با اعتبارسنجی تاریخ آینده؛ اتصال endpointهای complete و reschedule؛ و invalidation خودکار Activities، Follow-ups، Company Detail، Reports و Dashboard پس از mutationها.
- فایل‌های مهم: type/service/hookهای Activities و Follow-ups، `ActivityForm.tsx`، `EditActivityDialog.tsx`، `ActivitiesTab.tsx`، `CompleteFollowUpDialog.tsx`، `RescheduleFollowUpDialog.tsx` و `FollowUpCard.tsx`.
- فرض‌ها و وابستگی‌ها: Backend سه endpoint `PATCH /api/activities/:activityId`، `/complete` و `/reschedule` را با payloadهای اعلام‌شده پشتیبانی می‌کند. پاک‌کردن مقادیر اختیاری در edit با `null` انجام می‌شود و تاریخ‌ها به ISO تبدیل می‌شوند؛ هیچ completion یا reschedule محلی و جعلی وجود ندارد.
- وضعیت بررسی: lint بدون خطا یا هشدار و build تولید با موفقیت اجرا شده‌اند؛ فقط هشدار غیرمسدودکننده اندازه bundle در خروجی build باقی مانده است.

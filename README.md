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

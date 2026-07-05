export interface IranProvince {
  id: number;
  name: string;
}

export const IRAN_PROVINCES: readonly IranProvince[] = [
  { id: 1, name: 'تهران' },
  { id: 2, name: 'خوزستان' },
  { id: 3, name: 'بوشهر' },
  { id: 4, name: 'اصفهان' },
  { id: 5, name: 'خراسان رضوی' },
  { id: 6, name: 'فارس' },
  { id: 7, name: 'آذربایجان شرقی' },
  { id: 8, name: 'مازندران' },
  { id: 9, name: 'کرمان' },
  { id: 10, name: 'البرز' },
  { id: 11, name: 'گیلان' },
  { id: 12, name: 'کهگیلویه و بویراحمد' },
  { id: 13, name: 'آذربایجان غربی' },
  { id: 14, name: 'هرمزگان' },
  { id: 15, name: 'مرکزی' },
  { id: 16, name: 'یزد' },
  { id: 17, name: 'فرامنطقه‌ای' },
  { id: 18, name: 'کرمانشاه' },
  { id: 19, name: 'قزوین' },
  { id: 20, name: 'سیستان و بلوچستان' },
  { id: 21, name: 'همدان' },
  { id: 22, name: 'ایلام' },
  { id: 23, name: 'گلستان' },
  { id: 24, name: 'لرستان' },
  { id: 25, name: 'زنجان' },
  { id: 26, name: 'اردبیل' },
  { id: 27, name: 'قم' },
  { id: 28, name: 'کردستان' },
  { id: 29, name: 'سمنان' },
  { id: 30, name: 'چهارمحال و بختیاری' },
  { id: 31, name: 'خراسان شمالی' },
  { id: 32, name: 'خراسان جنوبی' },
] as const;

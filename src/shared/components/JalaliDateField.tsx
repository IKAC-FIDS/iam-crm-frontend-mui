import { useState } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import {
  parseJalaliInputToIso,
  toJalaliInputValue,
} from '@/shared/utils/jalaliDate';

type JalaliDateFieldProps = Omit<TextFieldProps, 'value' | 'onChange' | 'type'> & {
  value?: string | null;
  onChange: (value: string | undefined) => void;
  includeTime?: boolean;
};

export default function JalaliDateField({
  value,
  onChange,
  includeTime = false,
  helperText,
  error,
  placeholder,
  ...props
}: JalaliDateFieldProps) {
  const [text, setText] = useState(() => toJalaliInputValue(value, includeTime));
  const [parseError, setParseError] = useState('');
  const example = includeTime ? '۱۴۰۳/۰۵/۲۰ ۱۴:۳۰' : '۱۴۰۳/۰۵/۲۰';

  return (
    <TextField
      {...props}
      value={text}
      placeholder={placeholder ?? example}
      error={error || Boolean(parseError)}
      helperText={parseError || helperText || `نمونه: ${example}`}
      onChange={(event) => {
        const next = event.target.value;
        setText(next);

        if (!next.trim()) {
          setParseError('');
          onChange(undefined);
          return;
        }

        const iso = parseJalaliInputToIso(next, includeTime);
        if (iso) {
          setParseError('');
          onChange(iso);
        } else {
          setParseError('تاریخ شمسی معتبر نیست.');
        }
      }}
    />
  );
}

import { IconButton, InputAdornment, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import type { ChangeEvent, ReactNode } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { toEndOfDayIso } from '@/shared/utils/jalaliDate';
import 'react-multi-date-picker/styles/layouts/mobile.css';

type PickerValue = DateObject | null;

type BasePickerProps = Omit<TextFieldProps, 'value' | 'onChange' | 'type'> & {
  value?: string | null;
  onChange: (value: string | undefined) => void;
};

interface RangePickerProps extends Omit<TextFieldProps, 'value' | 'onChange' | 'type'> {
  startValue?: string | null;
  endValue?: string | null;
  onChange: (range: { start?: string; end?: string }) => void;
}

function isoToDateObject(value?: string | null): PickerValue {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new DateObject({ date, calendar: persian, locale: persian_fa });
}

function dateObjectToIso(value: DateObject | null | undefined, includeTime = false): string | undefined {
  if (!value) return undefined;
  const date = value.toDate();
  if (!includeTime) date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function PickerTextField({
  label,
  value,
  openCalendar,
  handleValueChange,
  onClear,
  helperText,
  error,
  required,
  disabled,
  fullWidth,
  placeholder,
}: {
  label?: ReactNode;
  value: string;
  openCalendar: () => void;
  handleValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  helperText?: ReactNode;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={handleValueChange}
      onClick={openCalendar}
      helperText={helperText}
      error={error}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      placeholder={placeholder}
      slotProps={{
        htmlInput: { dir: 'ltr' },
        input: {
          endAdornment: (
          <InputAdornment position="end">
            {value && !disabled ? (
              <IconButton size="small" onClick={(event) => { event.stopPropagation(); onClear(); }} aria-label="پاک‌کردن تاریخ">
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : null}
            <IconButton size="small" onClick={(event) => { event.stopPropagation(); openCalendar(); }} disabled={disabled} aria-label="بازکردن تقویم">
              <CalendarMonthIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
          ),
        },
      }}
    />
  );
}

export function JalaliDatePicker({
  value,
  onChange,
  helperText,
  error,
  label,
  required,
  disabled,
  fullWidth,
  placeholder = 'انتخاب تاریخ',
  ...props
}: BasePickerProps) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      format="YYYY/MM/DD"
      value={isoToDateObject(value)}
      disabled={disabled}
      onChange={(date) => onChange(dateObjectToIso(date as DateObject | null))}
      render={(inputValue, openCalendar, handleValueChange) => (
        <PickerTextField
          {...props}
          label={label}
          value={inputValue}
          openCalendar={openCalendar}
          handleValueChange={handleValueChange}
          onClear={() => onChange(undefined)}
          helperText={helperText}
          error={error}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export function JalaliDateTimePicker({
  value,
  onChange,
  helperText,
  error,
  label,
  required,
  disabled,
  fullWidth,
  placeholder = 'انتخاب تاریخ و زمان',
  ...props
}: BasePickerProps) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      format="YYYY/MM/DD HH:mm"
      value={isoToDateObject(value)}
      disabled={disabled}
      plugins={[<TimePicker key="time" position="bottom" hideSeconds />]}
      onChange={(date) => onChange(dateObjectToIso(date as DateObject | null, true))}
      render={(inputValue, openCalendar, handleValueChange) => (
        <PickerTextField
          {...props}
          label={label}
          value={inputValue}
          openCalendar={openCalendar}
          handleValueChange={handleValueChange}
          onClear={() => onChange(undefined)}
          helperText={helperText}
          error={error}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export function JalaliDateRangePicker({
  startValue,
  endValue,
  onChange,
  helperText,
  error,
  label = 'بازه تاریخ',
  required,
  disabled,
  fullWidth,
  placeholder = 'از تاریخ تا تاریخ',
  ...props
}: RangePickerProps) {
  return (
    <DatePicker
      range
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      format="YYYY/MM/DD"
      value={[isoToDateObject(startValue), isoToDateObject(endValue)].filter(Boolean) as DateObject[]}
      disabled={disabled}
      onChange={(dates) => {
        const values = Array.isArray(dates) ? dates : [];
        const start = dateObjectToIso(values[0] as DateObject | null);
        const end = toEndOfDayIso(dateObjectToIso(values[1] as DateObject | null));
        onChange({ start, end });
      }}
      render={(inputValue, openCalendar, handleValueChange) => (
        <PickerTextField
          {...props}
          label={label}
          value={inputValue}
          openCalendar={openCalendar}
          handleValueChange={handleValueChange}
          onClear={() => onChange({ start: undefined, end: undefined })}
          helperText={helperText}
          error={error}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export default function JalaliDateField(props: BasePickerProps & { includeTime?: boolean }) {
  const { includeTime, ...pickerProps } = props;
  return includeTime ? <JalaliDateTimePicker {...pickerProps} /> : <JalaliDatePicker {...pickerProps} />;
}

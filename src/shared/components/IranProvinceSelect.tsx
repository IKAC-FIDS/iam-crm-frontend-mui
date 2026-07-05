import { useId } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { IRAN_PROVINCES } from '../constants/iranProvinces';

interface IranProvinceSelectProps {
  value: string;
  onChange: (provinceName: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function IranProvinceSelect({
  value,
  onChange,
  label = 'استان',
  disabled = false,
  required = false,
}: IranProvinceSelectProps) {
  const labelId = useId();

  return (
    <FormControl fullWidth disabled={disabled} required={required}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <MenuItem value="">
          <em>انتخاب نشده</em>
        </MenuItem>
        {IRAN_PROVINCES.map((province) => (
          <MenuItem key={province.id} value={province.name}>
            {province.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

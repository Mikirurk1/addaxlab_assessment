import type { InputHTMLAttributes } from 'react';
import { Field } from '@/components/atoms/Field';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  variant?: 'default' | 'header';
}

export function SearchBar({
  value,
  onChange,
  placeholder,
  variant = 'default',
  ...rest
}: SearchBarProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <Field
      bare
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant={variant}
      {...rest}
    />
  );
}

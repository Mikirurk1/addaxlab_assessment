import type { InputHTMLAttributes } from 'react';
import { Input } from '@/components/atoms/Input';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  variant?: 'default' | 'header';
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  variant = 'default',
  ...rest
}: SearchBarProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant={variant}
      {...rest}
    />
  );
}

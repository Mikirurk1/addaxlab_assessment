import type { InputHTMLAttributes } from 'react';
import { StyledInput } from './Input.styled';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'as'> {
  variant?: 'default' | 'header';
}

export function Input({ variant = 'default', ...props }: InputProps) {
  return <StyledInput $variant={variant} {...props} />;
}

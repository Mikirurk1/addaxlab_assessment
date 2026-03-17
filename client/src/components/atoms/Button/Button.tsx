import type { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './Button.styled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'dashed';
  children: React.ReactNode;
}

export function Button({ variant = 'default', children, ...props }: ButtonProps) {
  return (
    <StyledButton type="button" $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
}

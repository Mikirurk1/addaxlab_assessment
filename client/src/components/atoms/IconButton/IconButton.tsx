import type { ButtonHTMLAttributes } from 'react';
import { StyledIconButton } from './IconButton.styled';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function IconButton({ active, children, ...props }: IconButtonProps) {
  return (
    <StyledIconButton type="button" $active={active} {...props}>
      {children}
    </StyledIconButton>
  );
}

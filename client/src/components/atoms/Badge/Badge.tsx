import { StyledBadge } from './Badge.styled';

interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return <StyledBadge>{children}</StyledBadge>;
}

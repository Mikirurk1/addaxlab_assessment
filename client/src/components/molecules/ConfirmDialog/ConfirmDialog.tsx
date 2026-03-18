import type { ReactNode } from 'react';
import { Backdrop, Box, Title, Text, Actions } from './ConfirmDialog.styled';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  actions: ReactNode;
}

export function ConfirmDialog({ open, title, children, onClose, actions }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <Backdrop onClick={onClose} role="dialog" aria-modal="true">
      <Box onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Text>{children}</Text>
        <Actions>{actions}</Actions>
      </Box>
    </Backdrop>
  );
}


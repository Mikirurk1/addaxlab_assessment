import type { PropsWithChildren } from 'react';
import { Backdrop, Card, ScrollBody } from './Modal.styled';

interface ModalProps extends PropsWithChildren {
  onClose: () => void;
  maxWidth?: string;
  role?: string;
  /** Enable internal scroll container around children */
  scroll?: boolean;
  /** Padding for scroll container (when scroll=true) */
  contentPadding?: string;
}

export function Modal({
  onClose,
  maxWidth = '28rem',
  role = 'dialog',
  scroll,
  contentPadding,
  children,
}: ModalProps) {
  return (
    <Backdrop onClick={onClose} role={role} aria-modal="true">
      <Card $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {scroll ? <ScrollBody $padding={contentPadding}>{children}</ScrollBody> : children}
      </Card>
    </Backdrop>
  );
}


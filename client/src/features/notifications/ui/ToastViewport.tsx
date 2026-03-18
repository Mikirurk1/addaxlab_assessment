import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeToast } from '@/features/notifications/model/notificationsSlice';
import { Viewport, ToastCard, IconWrap, Content, TitleRow, Title, Description, CloseBtn } from './ToastViewport.styled';
import { ICONS } from '@/shared/assets/icons';
import { useT } from '@/features/i18n';

function toastIconSrc(kind: 'success' | 'info' | 'warning' | 'error') {
  switch (kind) {
    case 'success':
      return ICONS.successGreen;
    case 'warning':
      return ICONS.warningAmber;
    case 'error':
      return ICONS.errorRed;
    default:
      return ICONS.infoBlue;
  }
}

export function ToastViewport() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((s) => s.notifications.toasts);
  const tr = useT();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      window.setTimeout(() => dispatch(removeToast(t.id)), t.durationMs)
    );
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <Viewport aria-live="polite" aria-relevant="additions removals">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} $kind={toast.kind} role="status">
          <IconWrap $kind={toast.kind} aria-hidden>
            <img src={toastIconSrc(toast.kind)} width={16} height={16} alt="" aria-hidden />
          </IconWrap>
          <Content>
            <TitleRow>
              <Title>{toast.title}</Title>
              <CloseBtn type="button" onClick={() => dispatch(removeToast(toast.id))} aria-label={tr('common.close')}>
                ×
              </CloseBtn>
            </TitleRow>
            {toast.description ? <Description>{toast.description}</Description> : null}
          </Content>
        </ToastCard>
      ))}
    </Viewport>
  );
}


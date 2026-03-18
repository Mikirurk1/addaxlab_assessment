import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeConflictModal, setEditModalTaskId, setEventModalOpen } from '@/features/calendar/model';
import type { TaskItem } from '@/features/calendar/types';
import { Modal } from '@/components/atoms/Modal';
import { getConflictingTasks } from '@/features/calendar/lib/conflicts';
import { useT } from '@/features/i18n';
import {
  Header,
  CloseBtn,
  Title,
  Subtitle,
  List,
  Item,
  ItemMain,
  ItemTitle,
  ItemMeta,
  Chevron,
  EmptyState,
} from './ConflictModal.styled';

function formatTaskTime(task: TaskItem): string {
  const s = task.startTime ?? '09:00';
  const e = task.endTime ?? '10:00';
  return `${s} – ${e}`;
}

export function ConflictModal() {
  const dispatch = useAppDispatch();
  const conflict = useAppSelector((s) => s.ui.conflictModal);
  const tasks = useAppSelector((s) => s.tasks.items);
  const t = useT();

  const conflicts = useMemo(() => {
    if (!conflict.open || conflict.kind !== 'conflict') return [];
    if (!conflict.dateKey || !conflict.startTime || !conflict.endTime) return [];
    return getConflictingTasks({
      tasks,
      dateKey: conflict.dateKey,
      startTime: conflict.startTime,
      endTime: conflict.endTime,
      excludeTaskId: conflict.excludeTaskId,
    });
  }, [conflict.open, conflict.dateKey, conflict.startTime, conflict.endTime, conflict.excludeTaskId, tasks]);

  const handleClose = () => dispatch(closeConflictModal());

  if (!conflict.open) return null;

  const title =
    conflict.title ?? (conflict.kind === 'warning' ? t('conflict.warningTitle') : t('conflict.busyTitle'));

  return (
    <Modal onClose={handleClose} maxWidth="28rem" scroll>
        <Header>
          <div>
            <Title>{title}</Title>
            {conflict.message ? <Subtitle>{conflict.message}</Subtitle> : null}
            {conflict.kind === 'conflict' && conflict.dateKey && conflict.startTime && conflict.endTime ? (
              <Subtitle>
                {conflict.dateKey} · {conflict.startTime} – {conflict.endTime}
              </Subtitle>
            ) : null}
          </div>
          <CloseBtn aria-label={t('common.close')} onClick={handleClose}>
            ×
          </CloseBtn>
        </Header>

        {conflict.kind === 'warning' ? (
          <EmptyState />
        ) : conflicts.length === 0 ? (
          <EmptyState>{t('conflict.noneFound')}</EmptyState>
        ) : (
          <List>
            {conflicts.map((t) => (
              <Item
                key={t._id}
                type="button"
                onClick={() => {
                  dispatch(closeConflictModal());
                  dispatch(setEditModalTaskId(t._id));
                  dispatch(setEventModalOpen(true));
                }}
              >
                <ItemMain>
                  <ItemTitle>{t.title}</ItemTitle>
                  <ItemMeta>{formatTaskTime(t)}</ItemMeta>
                </ItemMain>
                <Chevron aria-hidden>›</Chevron>
              </Item>
            ))}
          </List>
        )}
    </Modal>
  );
}


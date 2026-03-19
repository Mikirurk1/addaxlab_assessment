import { useMemo, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { createTask, createTasksBulk, updateTask, updateSeries, detachTask, deleteTask, setEventModalOpen, setEditModalTaskId, setEventModalSelectedTime, openConflictModal } from '@/features/calendar/model';
import { toDateKey, parseDateKey, getDateRangeKeys } from '@/shared/utils/calendar';
import { hasTimeConflict } from '@/features/calendar/lib/conflicts';
import { isPastTimeToday } from '@/features/calendar/lib/rules';
import { LabelColorPicker } from '@/components/molecules/LabelColorPicker';
import { HOLIDAY_COUNTRIES } from '@/features/calendar/constants/countries';
import { Modal } from '@/components/atoms/Modal';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { SubLabel, Select as StyledSelect, PillsWrap, TogglePill, HiddenCheckbox, ErrorText, HelperText } from '@/components/molecules/Form';
import { ICONS } from '@/shared/assets/icons';
import { useT } from '@/features/i18n';
import { canDeleteTask, canEditTask } from '@/features/auth/lib/permissions';
import { getDisplayNickname } from '@/features/auth/lib/displayNickname';
import { fetchNicknameByEmail } from '@/features/auth/model';
import { UserAvatar } from '@/components/molecules/UserAvatar';
import {
  ModalHeader,
  ModalTitle,
  HeaderActions,
  HeaderIconAction as HeaderIconActionStyled,
  CloseBtn,
  FormGroup,
  Label,
  Input,
  Row,
  CountryGrid,
  CountryChip,
  CreatedByRow,
  Actions,
  BtnSecondary,
  BtnPrimary,
  BtnDanger,
} from './EventModal.styled';

type RecurrenceFreq = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
const WEEKDAYS: Array<{ idx: number; key: string }> = [
  { idx: 1, key: 'eventModal.weekdays.mon' },
  { idx: 2, key: 'eventModal.weekdays.tue' },
  { idx: 3, key: 'eventModal.weekdays.wed' },
  { idx: 4, key: 'eventModal.weekdays.thu' },
  { idx: 5, key: 'eventModal.weekdays.fri' },
  { idx: 6, key: 'eventModal.weekdays.sat' },
  { idx: 0, key: 'eventModal.weekdays.sun' },
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function genSeriesId() {
  // browser-safe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyCrypto: any = globalThis.crypto;
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID();
  return `series_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function EventModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.eventModalOpen);
  const t = useT();
  const selectedDate = useAppSelector((s) => s.ui.eventModalSelectedDate);
  const selectedTime = useAppSelector((s) => s.ui.eventModalSelectedTime);
  const editModalTaskId = useAppSelector((s) => s.ui.editModalTaskId);
  const allTasks = useAppSelector((s) => s.tasks.items);
  const taskToEdit = useAppSelector((s) =>
    editModalTaskId ? s.tasks.items.find((t) => t._id === editModalTaskId) : null
  );
  const nicknamesByEmail = useAppSelector((s) => s.auth.nicknamesByEmail);

  const currentUser = useAppSelector((s) => s.auth.user);
  const canEditThisTask = canEditTask(currentUser, taskToEdit ?? null);
  const canDeleteThisTask = canDeleteTask(currentUser, taskToEdit ?? null);
  const isReadOnly = !canEditThisTask;

  const today = toDateKey(new Date());
  const defaultDate = selectedDate || today;
  const isEditMode = Boolean(editModalTaskId && taskToEdit);

  useEffect(() => {
    const email = taskToEdit?.createdBy?.email?.trim().toLowerCase();
    if (!email) return;
    if (nicknamesByEmail[email]) return;
    void dispatch(fetchNicknameByEmail(email));
  }, [taskToEdit?.createdBy?.email, nicknamesByEmail, dispatch]);

  const [title, setTitle] = useState('');
  const [startDateKey, setStartDateKey] = useState(defaultDate);
  const [endDateKey, setEndDateKey] = useState(defaultDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [colors, setColors] = useState<string[]>(['#2196f3']);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDetachConfirmOpen, setIsDetachConfirmOpen] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceFreq>('none');
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  const [repeatUntilKey, setRepeatUntilKey] = useState(defaultDate);
  const [formError, setFormError] = useState<string | null>(null);

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof allTasks> = {};
    for (const t of allTasks) {
      const dateKey = typeof t.date === 'string' ? t.date : undefined;
      if (!dateKey) continue;
      (map[dateKey] ??= []).push(t);
    }
    return map;
  }, [allTasks]);

  const hasTimeConflictInDay = (dateKey: string, start: string, end: string, excludeId?: string | null) => {
    const dayTasks = tasksByDate[dateKey] ?? [];
    return hasTimeConflict({
      tasks: dayTasks,
      dateKey,
      startTime: start,
      endTime: end,
      excludeTaskId: excludeId ?? null,
    });
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && taskToEdit) {
        setTitle(taskToEdit.title);
        setStartDateKey(taskToEdit.date);
        setEndDateKey(taskToEdit.date);
        setStartTime(taskToEdit.startTime ?? '09:00');
        setEndTime(taskToEdit.endTime ?? '10:00');
        setColors(taskToEdit.labels?.length ? taskToEdit.labels : ['#2196f3']);
        setCountryCodes(taskToEdit.countryCodes ?? []);
        setRecurrenceFreq(taskToEdit.recurrence?.freq ?? 'none');
        setWeeklyDays(taskToEdit.recurrence?.byWeekDays ?? []);
        setRepeatUntilKey(taskToEdit.date);
        setFormError(null);
      } else {
        const d = selectedDate || today;
        const start = selectedTime || '09:00';
        const end = selectedTime
          ? (() => {
              const [h, m] = start.split(':').map(Number);
              return `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            })()
          : '10:00';
        setTitle('');
        setStartDateKey(d);
        setEndDateKey(d);
        setStartTime(start);
        setEndTime(end);
        setColors(['#2196f3']);
        setCountryCodes([]);
        setRecurrenceFreq('none');
        setWeeklyDays([]);
        setRepeatUntilKey(toDateKey(addDays(parseDateKey(d), 30)));
        setFormError(null);
      }
    }
  }, [isOpen, selectedDate, selectedTime, today, isEditMode, taskToEdit]);

  useEffect(() => {
    // Mutual exclusion: either date range OR recurrence.
    if (recurrenceFreq !== 'none') {
      if (endDateKey !== startDateKey) setEndDateKey(startDateKey);
      if (repeatUntilKey < startDateKey) setRepeatUntilKey(startDateKey);
      if (recurrenceFreq === 'weekly' && weeklyDays.length === 0) {
        const dow = parseDateKey(startDateKey).getDay();
        setWeeklyDays([dow]);
      }
    }
  }, [recurrenceFreq, startDateKey, endDateKey, repeatUntilKey, weeklyDays.length]);

  const toggleWeeklyDay = (idx: number) => {
    setWeeklyDays((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  const computeOccurrenceDates = (): string[] => {
    if (recurrenceFreq === 'none') return getDateRangeKeys(startDateKey, endDateKey);
    const start = parseDateKey(startDateKey);
    const until = parseDateKey(repeatUntilKey);
    const out: string[] = [];
    const cap = 366; // safety cap

    if (recurrenceFreq === 'daily') {
      for (let d = new Date(start), i = 0; d <= until && i < cap; i++) {
        out.push(toDateKey(d));
        d = addDays(d, 1);
      }
      return out;
    }

    if (recurrenceFreq === 'weekly') {
      const days = weeklyDays.slice().sort();
      if (days.length === 0) return [];
      for (let d = new Date(start), i = 0; d <= until && out.length < cap; ) {
        // move day by day, pick matching weekdays
        if (days.includes(d.getDay())) out.push(toDateKey(d));
        d = addDays(d, 1);
        i++;
        if (i > cap * 14) break; // extra safety
      }
      return out;
    }

    if (recurrenceFreq === 'monthly') {
      const dayOfMonth = start.getDate();
      for (let i = 0; i < cap; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, dayOfMonth);
        if (d > until) break;
        // skip months without that day
        if (d.getDate() === dayOfMonth) out.push(toDateKey(d));
      }
      return out;
    }

    // yearly
    const m = start.getMonth();
    const day = start.getDate();
    for (let i = 0; i < cap; i++) {
      const d = new Date(start.getFullYear() + i, m, day);
      if (d > until) break;
      if (d.getMonth() === m && d.getDate() === day) out.push(toDateKey(d));
    }
    return out;
  };

  const toggleColor = (hex: string) => {
    setColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const toggleCountry = (code: string) => {
    setCountryCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSave = async () => {
    setFormError(null);
    if (!title.trim() || colors.length === 0) return;
    if (!currentUser) return;
    if (!canEditThisTask) return;
    const labels = colors;
    const startTimeVal = startTime || undefined;
    const endTimeVal = endTime || undefined;

    const countryCodesVal = countryCodes.length > 0 ? countryCodes : undefined;

    if (recurrenceFreq === 'weekly' && weeklyDays.length === 0) {
      setFormError(t('eventModal.weeklyRequiresDay'));
      return;
    }

    const datesToCreate = computeOccurrenceDates();
    if (recurrenceFreq !== 'none' && datesToCreate.length === 0) {
      setFormError(t('eventModal.pickRecurrenceParams'));
      return;
    }

    if (isEditMode && editModalTaskId && taskToEdit) {
      if (startTimeVal && endTimeVal && hasTimeConflictInDay(startDateKey, startTimeVal, endTimeVal, editModalTaskId)) {
        dispatch(openConflictModal({ dateKey: startDateKey, startTime: startTimeVal, endTime: endTimeVal, excludeTaskId: editModalTaskId }));
        return;
      }

      // If linked series — update all automatically
      if (taskToEdit.seriesId) {
        await dispatch(
          updateSeries({
            seriesId: taskToEdit.seriesId,
            payload: {
              title: title.trim(),
              labels,
              startTime: startTimeVal,
              endTime: endTimeVal,
              countryCodes: countryCodesVal ?? [],
            },
          })
        );
      } else {
        await dispatch(
          updateTask({
            id: editModalTaskId,
            payload: {
              date: startDateKey,
              title: title.trim(),
              labels,
              startTime: startTimeVal,
              endTime: endTimeVal,
              countryCodes: countryCodesVal ?? [],
            },
          })
        );
      }
    } else {
      // Prevent creating events for past times (today only).
      // Past dates are already disabled in the calendar UI.
      if (startTimeVal) {
        const now = new Date();
        if (datesToCreate.some((dateKey) => isPastTimeToday(dateKey, startTimeVal, now))) {
          setFormError(t('eventModal.cannotCreateInPastTime'));
          return;
        }
      }

      // If single date and no recurrence — keep old single create path
      if (datesToCreate.length === 1 && recurrenceFreq === 'none') {
        const dateKey = datesToCreate[0]!;
        if (startTimeVal && endTimeVal && hasTimeConflictInDay(dateKey, startTimeVal, endTimeVal, null)) {
          dispatch(openConflictModal({ dateKey, startTime: startTimeVal, endTime: endTimeVal }));
          return;
        }
        await dispatch(
          createTask({
            date: dateKey,
            title: title.trim(),
            labels,
            startTime: startTimeVal,
            endTime: endTimeVal,
            countryCodes: countryCodesVal,
            createdBy: { name: currentUser.name, email: currentUser.email },
          })
        );
      } else {
        const seriesId = genSeriesId();
        if (startTimeVal && endTimeVal) {
          for (const dateKey of datesToCreate) {
            if (hasTimeConflictInDay(dateKey, startTimeVal, endTimeVal, null)) {
              dispatch(openConflictModal({ dateKey, startTime: startTimeVal, endTime: endTimeVal }));
              return;
            }
          }
        }
        await dispatch(
          createTasksBulk({
            tasks: datesToCreate.map((dateKey) => ({
              date: dateKey,
              title: title.trim(),
              labels,
              startTime: startTimeVal,
              endTime: endTimeVal,
              countryCodes: countryCodesVal,
              seriesId,
              createdBy: { name: currentUser.name, email: currentUser.email },
              recurrence: {
                freq: recurrenceFreq,
                ...(recurrenceFreq === 'weekly' ? { byWeekDays: weeklyDays } : {}),
              },
            })),
          })
        );
      }
    }

    setTitle('');
    setColors(['#2196f3']);
    setCountryCodes([]);
    setStartTime('09:00');
    setEndTime('10:00');
    setRecurrenceFreq('none');
    setWeeklyDays([]);
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalSelectedTime(null));
    dispatch(setEventModalOpen(false));
  };

  const handleClose = () => {
    setIsDeleteConfirmOpen(false);
    setIsDetachConfirmOpen(false);
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalSelectedTime(null));
    dispatch(setEventModalOpen(false));
  };

  const handleDetach = async () => {
    if (!editModalTaskId) return;
    await dispatch(detachTask(editModalTaskId));
  };

  const handleDelete = async () => {
    if (!editModalTaskId) return;
    await dispatch(deleteTask(editModalTaskId));
    setIsDeleteConfirmOpen(false);
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalSelectedTime(null));
    dispatch(setEventModalOpen(false));
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={handleClose} maxWidth="32rem" scroll contentPadding="24px">
        <ModalHeader>
          <ModalTitle>
            {isReadOnly ? t('eventModal.titleView') : isEditMode ? t('eventModal.titleEdit') : t('eventModal.titleNew')}
          </ModalTitle>
          <HeaderActions>
            {!isReadOnly && isEditMode && taskToEdit?.seriesId && (
              <HeaderIconActionStyled
                onClick={() => setIsDetachConfirmOpen(true)}
                aria-label={t('eventModal.unlinkAria')}
                title={t('eventModal.unlinkTitle')}
              >
                <img src={ICONS.unlinkGray} width={18} height={18} alt="" aria-hidden />
              </HeaderIconActionStyled>
            )}
            {!isReadOnly && isEditMode && canDeleteThisTask && (
              <HeaderIconActionStyled
                $tone="danger"
                onClick={() => setIsDeleteConfirmOpen(true)}
                aria-label={t('eventModal.deleteAria')}
                title={t('eventModal.deleteTitle')}
              >
                <img src={ICONS.trashRed} width={18} height={18} alt="" aria-hidden />
              </HeaderIconActionStyled>
            )}
            <CloseBtn aria-label={t('eventModal.closeAria')} onClick={handleClose}>
              ×
            </CloseBtn>
          </HeaderActions>
        </ModalHeader>

        <FormGroup>
          <Label>{t('eventModal.eventTitleLabel')}</Label>
          <Input
            bare
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('eventModal.eventTitlePlaceholder')}
            autoFocus={!isReadOnly}
            disabled={isReadOnly}
            readOnly={isReadOnly}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('eventModal.dateRangeLabel')}</Label>
          <Row>
            <div>
              <SubLabel>{t('eventModal.startLabel')}</SubLabel>
              <Input
                bare
                type="date"
                value={startDateKey}
                onChange={(e) => {
                  const v = e.target.value;
                  setStartDateKey(v);
                  if (v > endDateKey) setEndDateKey(v);
                }}
                disabled={isReadOnly || (isEditMode && Boolean(taskToEdit?.seriesId))}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <SubLabel>{recurrenceFreq === 'none' ? t('eventModal.endLabel') : t('eventModal.repeatUntilLabel')}</SubLabel>
              <Input
                bare
                type="date"
                value={recurrenceFreq === 'none' ? endDateKey : repeatUntilKey}
                min={startDateKey}
                onChange={(e) => {
                  if (recurrenceFreq === 'none') setEndDateKey(e.target.value);
                  else setRepeatUntilKey(e.target.value);
                }}
                disabled={isReadOnly || (isEditMode && Boolean(taskToEdit?.seriesId))}
                readOnly={isReadOnly}
              />
            </div>
          </Row>
        </FormGroup>

        <FormGroup>
          <Label>{t('eventModal.timeLabel')}</Label>
          <Row>
            <div>
              <SubLabel>{t('eventModal.startLabel')}</SubLabel>
              <Input
                bare
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isReadOnly}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <SubLabel>{t('eventModal.endLabel')}</SubLabel>
              <Input
                bare
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isReadOnly}
                readOnly={isReadOnly}
              />
            </div>
          </Row>
        </FormGroup>

        {!isReadOnly && (
          <FormGroup>
            <Label>{t('eventModal.recurrenceLabel')}</Label>
            <StyledSelect
              value={recurrenceFreq}
              onChange={(e) => setRecurrenceFreq(e.target.value as RecurrenceFreq)}
              disabled={isEditMode && Boolean(taskToEdit?.seriesId)}
            >
              <option value="none">{t('eventModal.recurrence.none')}</option>
              <option value="daily">{t('eventModal.recurrence.daily')}</option>
              <option value="weekly">{t('eventModal.recurrence.weekly')}</option>
              <option value="monthly">{t('eventModal.recurrence.monthly')}</option>
              <option value="yearly">{t('eventModal.recurrence.yearly')}</option>
            </StyledSelect>

            {recurrenceFreq === 'weekly' && (
              <PillsWrap>
                {WEEKDAYS.map((d) => (
                  <TogglePill key={d.idx} $active={weeklyDays.includes(d.idx)}>
                    <HiddenCheckbox
                      type="checkbox"
                      checked={weeklyDays.includes(d.idx)}
                      onChange={() => toggleWeeklyDay(d.idx)}
                    />
                    {t(d.key)}
                  </TogglePill>
                ))}
              </PillsWrap>
            )}

            {formError && <ErrorText>{formError}</ErrorText>}
            <HelperText>{t('eventModal.helperRule')}</HelperText>
          </FormGroup>
        )}

        <FormGroup>
          <Label>
            {isReadOnly ? t('eventModal.colorsLabel') : t('eventModal.colorsLabelWithHint')}
          </Label>
          <LabelColorPicker
            value={colors}
            onToggle={toggleColor}
            disabled={isReadOnly}
            showOnlySelected={isReadOnly}
          />
        </FormGroup>

        {isReadOnly ? (
          countryCodes.length > 0 && (
            <FormGroup>
              <Label>{t('eventModal.countriesLabel')}</Label>
              <CountryGrid>
                {HOLIDAY_COUNTRIES.filter(({ code }) => countryCodes.includes(code)).map(
                  ({ code, name }) => (
                    <CountryChip key={code} type="button" active disabled>
                      {t(name)}
                    </CountryChip>
                  )
                )}
              </CountryGrid>
            </FormGroup>
          )
        ) : (
          <FormGroup>
            <Label>{t('eventModal.countriesLabelWithHint')}</Label>
            <CountryGrid>
              {HOLIDAY_COUNTRIES.map(({ code, name }) => (
                <CountryChip
                  key={code}
                  type="button"
                  active={countryCodes.includes(code)}
                  onClick={() => toggleCountry(code)}
                >
                  {t(name)}
                </CountryChip>
              ))}
            </CountryGrid>
          </FormGroup>
        )}

        {currentUser && taskToEdit?.createdBy ? (
          <CreatedByRow>
            <UserAvatar
              name={taskToEdit.createdBy.name}
              email={taskToEdit.createdBy.email}
              size={24}
              showDropdown={false}
              displayTitle={nicknamesByEmail[taskToEdit.createdBy.email.trim().toLowerCase()] || getDisplayNickname(taskToEdit.createdBy)}
              isCurrentUser={currentUser.email.toLowerCase() === taskToEdit.createdBy.email?.toLowerCase()}
            />
            <span>{t('eventModal.createdBy', { name: nicknamesByEmail[taskToEdit.createdBy.email.trim().toLowerCase()] || getDisplayNickname(taskToEdit.createdBy) })}</span>
          </CreatedByRow>
        ) : null}

        <Actions>
          {isReadOnly ? (
            <BtnPrimary type="button" onClick={handleClose}>
              {t('eventModal.cancel')}
            </BtnPrimary>
          ) : (
            <>
              <BtnSecondary type="button" onClick={handleClose}>
                {t('eventModal.cancel')}
              </BtnSecondary>
              <BtnPrimary
                type="button"
                onClick={handleSave}
                disabled={!title.trim() || colors.length === 0}
              >
                {t('eventModal.save')}
              </BtnPrimary>
            </>
          )}
        </Actions>
      

      {isEditMode && isDeleteConfirmOpen && (
        <ConfirmDialog
          open
          title={t('eventModal.confirmDeleteTitle')}
          onClose={() => setIsDeleteConfirmOpen(false)}
          actions={
            <>
              <BtnSecondary type="button" onClick={() => setIsDeleteConfirmOpen(false)}>
                {t('eventModal.cancel')}
              </BtnSecondary>
              <BtnDanger type="button" onClick={handleDelete}>
                {t('eventModal.confirmDelete')}
              </BtnDanger>
            </>
          }
        >
          {t('eventModal.confirmDeleteBody')}
        </ConfirmDialog>
      )}

      {isEditMode && isDetachConfirmOpen && (
        <ConfirmDialog
          open
          title={t('eventModal.confirmUnlinkTitle')}
          onClose={() => setIsDetachConfirmOpen(false)}
          actions={
            <>
              <BtnSecondary type="button" onClick={() => setIsDetachConfirmOpen(false)}>
                {t('eventModal.cancel')}
              </BtnSecondary>
              <BtnDanger
                type="button"
                onClick={async () => {
                  await handleDetach();
                  setIsDetachConfirmOpen(false);
                }}
              >
                {t('eventModal.confirmUnlink')}
              </BtnDanger>
            </>
          }
        >
          {t('eventModal.confirmUnlinkBody')}
        </ConfirmDialog>
      )}
    </Modal>
  );
}

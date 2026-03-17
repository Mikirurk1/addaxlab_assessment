import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { createTask, updateTask, setEventModalOpen, setEditModalTaskId } from '@/features/calendar/model';
import { toDateKey } from '@/shared/utils/calendar';
import { getDateRangeKeys } from '@/shared/utils/calendar';
import { LABEL_COLORS } from '@/features/calendar/constants/labels';
import { HOLIDAY_COUNTRIES } from '@/features/calendar/constants/countries';
import {
  Backdrop,
  ModalBox,
  ModalHeader,
  ModalTitle,
  CloseBtn,
  FormGroup,
  Label,
  Input,
  Row,
  ColorGrid,
  ColorChip,
  ColorDot,
  CheckboxBlock,
  CheckboxLabel,
  Actions,
  BtnSecondary,
  BtnPrimary,
} from './EventModal.styled';

export function EventModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.eventModalOpen);
  const selectedDate = useAppSelector((s) => s.ui.eventModalSelectedDate);
  const editModalTaskId = useAppSelector((s) => s.ui.editModalTaskId);
  const taskToEdit = useAppSelector((s) =>
    editModalTaskId ? s.tasks.items.find((t) => t._id === editModalTaskId) : null
  );

  const today = toDateKey(new Date());
  const defaultDate = selectedDate || today;
  const isEditMode = Boolean(editModalTaskId && taskToEdit);

  const [title, setTitle] = useState('');
  const [startDateKey, setStartDateKey] = useState(defaultDate);
  const [endDateKey, setEndDateKey] = useState(defaultDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [dupStartKey, setDupStartKey] = useState(defaultDate);
  const [dupEndKey, setDupEndKey] = useState(defaultDate);
  const [colors, setColors] = useState<string[]>(['#2196f3']);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && taskToEdit) {
        setTitle(taskToEdit.title);
        setStartDateKey(taskToEdit.date);
        setEndDateKey(taskToEdit.date);
        setDupStartKey(taskToEdit.date);
        setDupEndKey(taskToEdit.date);
        setStartTime(taskToEdit.startTime ?? '09:00');
        setEndTime(taskToEdit.endTime ?? '10:00');
        setColors(taskToEdit.labels?.length ? taskToEdit.labels : ['#2196f3']);
        setCountryCodes(taskToEdit.countryCodes ?? []);
        setIsDuplicate(false);
      } else {
        const d = selectedDate || today;
        setTitle('');
        setStartDateKey(d);
        setEndDateKey(d);
        setDupStartKey(d);
        setDupEndKey(d);
        setStartTime('09:00');
        setEndTime('10:00');
        setColors(['#2196f3']);
        setCountryCodes([]);
        setIsDuplicate(false);
      }
    }
  }, [isOpen, selectedDate, today, isEditMode, taskToEdit]);

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
    if (!title.trim() || colors.length === 0) return;
    const labels = colors;
    const startTimeVal = startTime || undefined;
    const endTimeVal = endTime || undefined;

    const countryCodesVal = countryCodes.length > 0 ? countryCodes : undefined;

    if (isEditMode && editModalTaskId) {
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
    } else {
      if (isDuplicate) {
        const keys = getDateRangeKeys(dupStartKey, dupEndKey);
        for (const dateKey of keys) {
          await dispatch(
            createTask({
              date: dateKey,
              title: title.trim(),
              labels,
              startTime: startTimeVal,
              endTime: endTimeVal,
              countryCodes: countryCodesVal,
            })
          );
        }
      } else {
        const keys = getDateRangeKeys(startDateKey, endDateKey);
        for (const dateKey of keys) {
          await dispatch(
            createTask({
              date: dateKey,
              title: title.trim(),
              labels,
              startTime: startTimeVal,
              endTime: endTimeVal,
              countryCodes: countryCodesVal,
            })
          );
        }
      }
    }

    setTitle('');
    setColors(['#2196f3']);
    setCountryCodes([]);
    setStartTime('09:00');
    setEndTime('10:00');
    setIsDuplicate(false);
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalOpen(false));
  };

  const handleClose = () => {
    dispatch(setEditModalTaskId(null));
    dispatch(setEventModalOpen(false));
  };

  if (!isOpen) return null;

  return (
    <Backdrop onClick={handleClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isEditMode ? 'Редагувати подію' : 'Нова подія'}</ModalTitle>
          <CloseBtn type="button" onClick={handleClose} aria-label="Закрити">
            ×
          </CloseBtn>
        </ModalHeader>

        <FormGroup>
          <Label>Назва події</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть назву події"
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label>Діапазон дат</Label>
          <Row>
            <div>
              <Label style={{ fontSize: 11, color: '#6b7280' }}>Початок</Label>
              <Input
                type="date"
                value={startDateKey}
                onChange={(e) => {
                  const v = e.target.value;
                  setStartDateKey(v);
                  if (v > endDateKey) setEndDateKey(v);
                }}
              />
            </div>
            <div>
              <Label style={{ fontSize: 11, color: '#6b7280' }}>Кінець</Label>
              <Input
                type="date"
                value={endDateKey}
                min={startDateKey}
                onChange={(e) => setEndDateKey(e.target.value)}
              />
            </div>
          </Row>
        </FormGroup>

        <FormGroup>
          <Label>Час</Label>
          <Row>
            <div>
              <Label style={{ fontSize: 11, color: '#6b7280' }}>Початок</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label style={{ fontSize: 11, color: '#6b7280' }}>Кінець</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </Row>
        </FormGroup>

        {!isEditMode && (
          <FormGroup>
            <CheckboxBlock>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={isDuplicate}
                  onChange={(e) => setIsDuplicate(e.target.checked)}
                />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  Дублювати на декілька днів
                </span>
              </CheckboxLabel>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0 0' }}>
                Створити копії події для кожного дня в діапазоні
              </p>
              {isDuplicate && (
                <Row style={{ marginTop: 12 }}>
                  <div>
                    <Label style={{ fontSize: 11 }}>Від</Label>
                    <Input
                      type="date"
                      value={dupStartKey}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDupStartKey(v);
                        if (v > dupEndKey) setDupEndKey(v);
                      }}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: 11 }}>До</Label>
                    <Input
                      type="date"
                      value={dupEndKey}
                      min={dupStartKey}
                      onChange={(e) => setDupEndKey(e.target.value)}
                    />
                  </div>
                </Row>
              )}
            </CheckboxBlock>
          </FormGroup>
        )}

        <FormGroup>
          <Label>Кольори (можна декілька)</Label>
          <ColorGrid>
            {LABEL_COLORS.map((opt) => (
              <ColorChip
                key={opt.value}
                type="button"
                $active={colors.includes(opt.value)}
                onClick={() => toggleColor(opt.value)}
              >
                <ColorDot $bg={opt.value} />
                {opt.label}
              </ColorChip>
            ))}
          </ColorGrid>
        </FormGroup>

        <FormGroup>
          <Label>Країни (привʼязати подію до країн; порожньо = всі)</Label>
          <ColorGrid>
            {HOLIDAY_COUNTRIES.map(({ code, name }) => (
              <ColorChip
                key={code}
                type="button"
                $active={countryCodes.includes(code)}
                onClick={() => toggleCountry(code)}
              >
                {name}
              </ColorChip>
            ))}
          </ColorGrid>
        </FormGroup>

        <Actions>
          <BtnSecondary type="button" onClick={handleClose}>
            Скасувати
          </BtnSecondary>
          <BtnPrimary
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || colors.length === 0}
          >
            Зберегти
          </BtnPrimary>
        </Actions>
      </ModalBox>
    </Backdrop>
  );
}

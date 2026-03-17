import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setAuthModalOpen } from '@/features/calendar/model';
import {
  Backdrop,
  ModalBox,
  ModalHeader,
  HeaderText,
  ModalTitle,
  ModalSubtitle,
  CloseBtn,
  FormBody,
  FormGroup,
  Label,
  Input,
  InputWrap,
  InputIcon,
  SubmitBtn,
  LinkBtn,
  Divider,
} from './AuthModal.styled';

type View = 'login' | 'register' | 'reset';

export function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.authModalOpen);
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const switchView = (v: View) => {
    resetForm();
    setView(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      // Placeholder: no backend auth yet
    } else if (view === 'register') {
      // Placeholder
    } else {
      // reset
    }
    resetForm();
    dispatch(setAuthModalOpen(false));
  };

  const handleClose = () => dispatch(setAuthModalOpen(false));

  if (!isOpen) return null;

  const titles: Record<View, string> = {
    login: 'Вхід',
    register: 'Реєстрація',
    reset: 'Відновлення паролю',
  };
  const subtitles: Record<View, string> = {
    login: 'Увійдіть до свого календаря',
    register: 'Створіть новий акаунт',
    reset: 'Відновіть доступ до акаунту',
  };

  return (
    <Backdrop onClick={handleClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderText>
            <ModalTitle>{titles[view]}</ModalTitle>
            <ModalSubtitle>{subtitles[view]}</ModalSubtitle>
          </HeaderText>
          <CloseBtn type="button" onClick={handleClose} aria-label="Закрити">
            ×
          </CloseBtn>
        </ModalHeader>

        <FormBody>
          <form onSubmit={handleSubmit}>
            {view === 'register' && (
              <FormGroup>
                <Label>Повне ім'я</Label>
                <InputWrap>
                  <InputIcon>👤</InputIcon>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введіть ваше ім'я"
                  />
                </InputWrap>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Email</Label>
              <InputWrap>
                <InputIcon>✉</InputIcon>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </InputWrap>
            </FormGroup>

            {view !== 'reset' && (
              <FormGroup>
                <Label>Пароль</Label>
                <InputWrap>
                  <InputIcon>🔒</InputIcon>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </InputWrap>
              </FormGroup>
            )}

            {view === 'register' && (
              <FormGroup>
                <Label>Підтвердіть пароль</Label>
                <InputWrap>
                  <InputIcon>🔒</InputIcon>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </InputWrap>
              </FormGroup>
            )}

            {view === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <LinkBtn type="button" onClick={() => switchView('reset')}>
                  Забули пароль?
                </LinkBtn>
              </div>
            )}

            <SubmitBtn type="submit">
              {view === 'login' && 'Увійти'}
              {view === 'register' && 'Зареєструватися'}
              {view === 'reset' && 'Відновити пароль'}
            </SubmitBtn>
          </form>

          <Divider>або</Divider>

          <div style={{ textAlign: 'center' }}>
            {view === 'login' && (
              <p style={{ fontSize: 14, color: '#4b5563' }}>
                Ще не маєте акаунту?{' '}
                <LinkBtn type="button" onClick={() => switchView('register')}>
                  Зареєструватися
                </LinkBtn>
              </p>
            )}
            {view === 'register' && (
              <p style={{ fontSize: 14, color: '#4b5563' }}>
                Вже маєте акаунт?{' '}
                <LinkBtn type="button" onClick={() => switchView('login')}>
                  Увійти
                </LinkBtn>
              </p>
            )}
            {view === 'reset' && (
              <LinkBtn type="button" onClick={() => switchView('login')}>
                ← Повернутися до входу
              </LinkBtn>
            )}
          </div>
        </FormBody>
      </ModalBox>
    </Backdrop>
  );
}

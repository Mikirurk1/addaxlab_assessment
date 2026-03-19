import { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setAuthModalOpen, setUser, setAuthFormField, resetAuthForm } from '@/features/auth/model';
import { Modal } from '@/components/atoms/Modal';
import { useT } from '@/features/i18n';
import { isValidEmail, minLength } from '@/shared/utils/validators';
import { login, requestPasswordReset } from '@/shared/api/authApi';
import {
  ModalHeader,
  HeaderText,
  HeaderLeft,
  HeaderBadge,
  ModalTitle,
  ModalSubtitle,
  CloseBtn,
  FormBody,
  FormGroup,
  Label,
  Input,
  InputWrap,
  InputIcon,
  PasswordToggleBtn,
  FieldError,
  SubmitBtn,
  LinkBtn,
  Divider,
  RightRow,
  Center,
  MutedP,
} from './AuthModal.styled';

type View = 'login' | 'register' | 'reset';

type Errors = Partial<Record<'email' | 'password' | 'name' | 'confirmPassword', string>>;

export function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.auth.authModalOpen);
  const authForm = useAppSelector((s) => s.auth.authForm);
  const { email, name, password, confirmPassword } = authForm;
  const t = useT();
  const [view, setView] = useState<View>('login');
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    dispatch(resetAuthForm());
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchView = (v: View) => {
    resetForm();
    setView(v);
  };

  const icons = useMemo(() => {
    return {
      user: '/assets/images/icon/user-gray.svg',
      mail: '/assets/images/icon/mail-gray.svg',
      lock: '/assets/images/icon/lock-gray.svg',
    } as const;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {};

    const emailVal = email.trim();
    if (!emailVal) nextErrors.email = t('auth.validation.emailRequired');
    else if (!isValidEmail(emailVal)) nextErrors.email = t('auth.validation.emailInvalid');

    if (view === 'login') {
      if (!password) nextErrors.password = t('auth.validation.passwordRequired');
      else if (!minLength(password, 8)) nextErrors.password = t('auth.validation.passwordMin', { min: 8 });
    } else if (view === 'register') {
      if (!name.trim()) nextErrors.name = t('auth.validation.nameRequired');
      if (!password) nextErrors.password = t('auth.validation.passwordRequired');
      else if (!minLength(password, 8)) nextErrors.password = t('auth.validation.passwordMin', { min: 8 });
      if (!confirmPassword) nextErrors.confirmPassword = t('auth.validation.confirmPasswordRequired');
      else if (password !== confirmPassword) nextErrors.confirmPassword = t('auth.validation.passwordsDontMatch');
    } else {
      // reset
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (view === 'reset') {
      requestPasswordReset(emailVal)
        .then(() => {
          resetForm();
          dispatch(setAuthModalOpen(false));
        })
        .catch(() => {
          setErrors({ email: t('auth.validation.signInFailed') });
        });
      return;
    }

    const displayName =
      view === 'login'
        ? name.trim() || emailVal.split('@')[0] || t('auth.fullNamePlaceholder')
        : name.trim();

    login(emailVal, password, displayName)
      .then((me) => {
        dispatch(setUser(me));
        resetForm();
        dispatch(setAuthModalOpen(false));
      })
      .catch(() => {
        setErrors({ email: t('auth.validation.signInFailed') });
      });
  };

  const handleClose = () => dispatch(setAuthModalOpen(false));

  if (!isOpen) return null;

  const titles: Record<View, string> = {
    login: t('auth.titles.login'),
    register: t('auth.titles.register'),
    reset: t('auth.titles.reset'),
  };
  const subtitles: Record<View, string> = {
    login: t('auth.subtitles.login'),
    register: t('auth.subtitles.register'),
    reset: t('auth.subtitles.reset'),
  };

  return (
    <Modal onClose={handleClose} maxWidth="28rem" scroll>
      <ModalHeader>
        <HeaderLeft>
          <HeaderBadge aria-hidden>
            <img src="/assets/images/icon/login-white.svg" alt="" aria-hidden />
          </HeaderBadge>
          <HeaderText>
            <ModalTitle>{titles[view]}</ModalTitle>
            <ModalSubtitle>{subtitles[view]}</ModalSubtitle>
          </HeaderText>
        </HeaderLeft>
        <CloseBtn aria-label={t('auth.closeAria')} onClick={handleClose}>
          ×
        </CloseBtn>
      </ModalHeader>

      <FormBody>
        <form onSubmit={handleSubmit} noValidate>
          {view === 'register' && (
            <FormGroup>
              <Label>{t('auth.fullNameLabel')}</Label>
              <InputWrap>
                <InputIcon aria-hidden>
                  <img src={icons.user} alt="" aria-hidden />
                </InputIcon>
                <Input
                  bare
                  type="text"
                  value={name}
                  onChange={(e) => dispatch(setAuthFormField({ key: 'name', value: e.target.value }))}
                  placeholder={t('auth.fullNamePlaceholder')}
                />
              </InputWrap>
              {errors.name ? <FieldError role="alert">{errors.name}</FieldError> : null}
            </FormGroup>
          )}

          <FormGroup>
            <Label>{t('auth.emailLabel')}</Label>
            <InputWrap>
              <InputIcon aria-hidden>
                <img src={icons.mail} alt="" aria-hidden />
              </InputIcon>
              <Input
                bare
                type="email"
                value={email}
                onChange={(e) => dispatch(setAuthFormField({ key: 'email', value: e.target.value }))}
                placeholder={t('auth.emailPlaceholder')}
              />
            </InputWrap>
            {errors.email ? <FieldError role="alert">{errors.email}</FieldError> : null}
          </FormGroup>

          {view !== 'reset' && (
            <FormGroup>
              <Label>{t('auth.passwordLabel')}</Label>
              <InputWrap $hasToggle>
                <InputIcon aria-hidden>
                  <img src={icons.lock} alt="" aria-hidden />
                </InputIcon>
                <Input
                  bare
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => dispatch(setAuthFormField({ key: 'password', value: e.target.value }))}
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <PasswordToggleBtn
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </PasswordToggleBtn>
              </InputWrap>
              {errors.password ? <FieldError role="alert">{errors.password}</FieldError> : null}
            </FormGroup>
          )}

          {view === 'register' && (
            <FormGroup>
              <Label>{t('auth.confirmPasswordLabel')}</Label>
              <InputWrap $hasToggle>
                <InputIcon aria-hidden>
                  <img src={icons.lock} alt="" aria-hidden />
                </InputIcon>
                <Input
                  bare
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => dispatch(setAuthFormField({ key: 'confirmPassword', value: e.target.value }))}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
                <PasswordToggleBtn
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </PasswordToggleBtn>
              </InputWrap>
              {errors.confirmPassword ? <FieldError role="alert">{errors.confirmPassword}</FieldError> : null}
            </FormGroup>
          )}

          {view === 'login' && (
            <RightRow>
              <LinkBtn type="button" onClick={() => switchView('reset')}>
                {t('auth.forgotPassword')}
              </LinkBtn>
            </RightRow>
          )}

          <SubmitBtn type="submit">
            {view === 'login' && t('auth.submit.login')}
            {view === 'register' && t('auth.submit.register')}
            {view === 'reset' && t('auth.submit.reset')}
          </SubmitBtn>
        </form>

        <Divider>{t('auth.dividerOr')}</Divider>

        <Center>
          {view === 'login' && (
            <MutedP>
              {t('auth.noAccount')}{' '}
              <LinkBtn type="button" onClick={() => switchView('register')}>
                {t('auth.goToRegister')}
              </LinkBtn>
            </MutedP>
          )}
          {view === 'register' && (
            <MutedP>
              {t('auth.haveAccount')}{' '}
              <LinkBtn type="button" onClick={() => switchView('login')}>
                {t('auth.goToLogin')}
              </LinkBtn>
            </MutedP>
          )}
          {view === 'reset' && (
            <LinkBtn type="button" onClick={() => switchView('login')}>
              {t('auth.backToLogin')}
            </LinkBtn>
          )}
        </Center>
      </FormBody>
    </Modal>
  );
}


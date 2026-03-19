import { useCallback, useEffect, useState } from 'react';
import { useT } from '@/features/i18n';
import { Modal } from '@/components/atoms/Modal';
import {
  Header,
  Title,
  Subtitle,
  FeatureList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
  Footer,
  GotItBtn,
} from './WelcomeModal.styled';

const WELCOME_SEEN_KEY = 'addax_welcome_seen';

const FEATURE_ICONS: Record<string, string> = {
  createEvents: '/assets/images/welcome/event-add.svg',
  nickname: '/assets/images/welcome/nickname.svg',
  avatar: '/assets/images/welcome/avatar.svg',
  onlineUsers: '/assets/images/welcome/online-users.svg',
  adminPanel: '/assets/images/welcome/admin.svg',
};

const FEATURE_KEYS = [
  'createEvents',
  'nickname',
  'avatar',
  'onlineUsers',
  'adminPanel',
] as const;

function getWelcomeSeen(): boolean {
  try {
    return localStorage.getItem(WELCOME_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function setWelcomeSeen(): void {
  try {
    localStorage.setItem(WELCOME_SEEN_KEY, '1');
  } catch {
    // ignore
  }
}

export function WelcomeModal() {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getWelcomeSeen()) {
      setOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setWelcomeSeen();
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <Modal onClose={handleClose} maxWidth="32rem">
      <Header>
        <Title>{t('welcomeModal.title')}</Title>
        <Subtitle>{t('welcomeModal.subtitle')}</Subtitle>
      </Header>
      <FeatureList>
        {FEATURE_KEYS.map((key) => (
          <FeatureItem key={key}>
            <FeatureIcon>
              <img src={FEATURE_ICONS[key]} alt="" aria-hidden />
            </FeatureIcon>
            <FeatureText>{t(`welcomeModal.features.${key}`)}</FeatureText>
          </FeatureItem>
        ))}
      </FeatureList>
      <Footer>
        <GotItBtn onClick={handleClose}>{t('welcomeModal.gotIt')}</GotItBtn>
      </Footer>
    </Modal>
  );
}

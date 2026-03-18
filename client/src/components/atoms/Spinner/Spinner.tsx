import { StyledSpinner } from './Spinner.styled';
import { useT } from '@/features/i18n';

export function Spinner() {
  const t = useT();
  return <StyledSpinner aria-label={t('common.loading')} />;
}

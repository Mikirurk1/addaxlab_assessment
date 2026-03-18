import { LABEL_COLORS } from '@/components/atoms';
import { Chip, Dot, Wrap } from './LabelColorPicker.styled';
import { useT } from '@/features/i18n';

type Props = {
  value: string[];
  onToggle: (hex: string) => void;
  disabled?: boolean;
  showOnlySelected?: boolean;
};

export function LabelColorPicker({ value, onToggle, disabled, showOnlySelected }: Props) {
  const t = useT();
  const options = showOnlySelected
    ? LABEL_COLORS.filter((opt) => value.includes(opt.value))
    : LABEL_COLORS;

  return (
    <Wrap>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          type="button"
          active={value.includes(opt.value)}
          onClick={() => onToggle(opt.value)}
          disabled={disabled}
          startIcon={<Dot $color={opt.value} />}
        >
          {t(opt.labelKey)}
        </Chip>
      ))}
    </Wrap>
  );
}


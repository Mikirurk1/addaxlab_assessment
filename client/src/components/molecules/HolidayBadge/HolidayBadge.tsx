import { Badge } from '@/components/atoms/Badge';

interface HolidayBadgeProps {
  name: string;
  countryCode: string;
}

export function HolidayBadge({ name, countryCode }: HolidayBadgeProps) {
  return (
    <Badge>
      {name} ({countryCode})
    </Badge>
  );
}

import { HeaderCell } from './CalendarHeader.styled';

interface CalendarHeaderProps {
  weekdays: string[];
}

export function CalendarHeader({ weekdays }: CalendarHeaderProps) {
  return (
    <>
      {weekdays.map((d) => (
        <HeaderCell key={d}>{d}</HeaderCell>
      ))}
    </>
  );
}

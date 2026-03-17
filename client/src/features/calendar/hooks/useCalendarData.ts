import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks, fetchHolidays } from '@/features/calendar/model';

export function useCalendarData() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.tasks.loading);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  return { loading };
}

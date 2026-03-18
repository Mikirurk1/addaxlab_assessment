import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasks, fetchHolidays } from '@/features/calendar/model';
import { fetchStrings } from '@/features/i18n';
import { setUser } from '@/features/auth/model';
import { getMe } from '@/shared/api/authApi';

export function useAppBootstrapData() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const loading = useAppSelector((state) => state.tasks.loading);
  const tasksCount = useAppSelector((state) => state.tasks.items.length);
  const stringsLoading = useAppSelector((state) => state.strings.loading);
  const stringsVersion = useAppSelector((state) => state.strings.version);
  const isStringsReady = !stringsLoading && stringsVersion !== null;
  const isInitialLoading = (loading && tasksCount === 0) || !isStringsReady;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStrings('en'));
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    getMe(user.email, user.name)
      .then((me) => dispatch(setUser(me)))
      .catch(() => {});
  }, [dispatch, user?.email, user?.name]);

  return { loading, stringsLoading, isInitialLoading };
}


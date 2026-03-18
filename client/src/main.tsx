import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { Provider } from 'react-redux';
import App from '@/App';
import { store } from '@/store';
import { tasksApi } from '@/shared/api/axiosInstance';
import { authApi } from '@/shared/api/authApi';
import { pushToast } from '@/features/notifications/model/notificationsSlice';
import { GlobalStyles } from '@/shared/styles/global';

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === 'string') {
    return err.response.data.error;
  }
  if (err instanceof Error) return err.message;
  return 'Request failed';
}

tasksApi.interceptors.request.use((config) => {
  const user = store.getState().auth.user;
  if (user) {
    config.headers.set('X-User-Email', user.email);
    config.headers.set('X-User-Name', user.name);
  }
  return config;
});

tasksApi.interceptors.response.use(
  (r) => r,
  (err) => {
    store.dispatch(pushToast({ kind: 'error', title: getErrorMessage(err), durationMs: 5000 }));
    return Promise.reject(err);
  }
);

authApi.interceptors.response.use(
  (r) => r,
  (err) => {
    store.dispatch(pushToast({ kind: 'error', title: getErrorMessage(err), durationMs: 5000 }));
    return Promise.reject(err);
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyles />
      <App />
    </Provider>
  </React.StrictMode>
);

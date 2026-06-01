import { useRuntimeConfig, useNuxtApp } from '#app';
import { useRouter } from 'vue-router';

export const useApiFetch = () => {
  const config = useRuntimeConfig();
  const { $fetch } = useNuxtApp();
  const authStore = useAuthStore();

  const token = authStore.accessToken;

  return async (url, options = {}) => {
    try {

      if (!authStore.isAuth) {
        throw new Error('Anda tidak memiliki akses');
      }

      const res = await $fetch(`${config.public.apiBase}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': navigator.userAgent,
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });

      if (res?.success === false && res?.code !== 401) {
        throw new Error(res.message || 'Terjadi kesalahan pada server.');
      }

      return res;
    } catch (e) {
      throw new Error(
        e?.data?.message || e?.message || 'Terjadi kesalahan tak dikenal.'
      );
    }
  };
};

import { useRuntimeConfig, useNuxtApp } from '#app';
import { useRouter } from 'vue-router';

export const useApiFetch = () => {
  const config = useRuntimeConfig();
  const { $fetch } = useNuxtApp();

  const token = useCookie('accessToken', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  }).value;

  return async (url, options = {}) => {
    try {
      const res = await $fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
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

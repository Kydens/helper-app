import { useRuntimeConfig } from '#app';

export const useApiFetch = async (url, options = {}) => {
  const config = useRuntimeConfig();
  const token = useCookie('accessToken', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  }).value;

  try {
    const res = await $fetch(`${config.public.apiBase}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.success) {
      // Tangkap error dari API meskipun HTTP-nya 200
      throw new Error(res.message || 'Terjadi kesalahan pada server.');
    }

    return res;
  } catch (e) {
    // Tangkap error dari jaringan atau throw manual
    throw new Error(
      e?.data?.message || e?.message || 'Terjadi kesalahan tak dikenal.'
    );
  }
};

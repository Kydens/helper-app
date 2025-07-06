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
      throw new Error(res.message || 'Terjadi kesalahan pada server.');
    }

    return res;
  } catch (e) {
    if (e?.response?.status === 400) {
      await $swal.fire({
        icon: 'warning',
        timer: 1000,
        text: e?.response?._data?.message,
        showConfirmButton: false,
      });

      useCookie('accessToken').value = null;
      useCookie('refreshToken').value = null;
      router.push('/login');
      return;
    }

    throw new Error(
      e?.data?.message || e?.message || 'Terjadi kesalahan tak dikenal.'
    );
  }
};

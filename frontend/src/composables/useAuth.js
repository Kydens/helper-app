import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

export const useAuth = () => {
  const router = useRouter();
  const config = useRuntimeConfig();

  const login = async (account, password) => {
    try {
      const res = await $fetch(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': navigator.userAgent,
        },
        body: {
          account: account,
          password: password,
          device: 'web',
        },
      });

      if (res.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        // opsional: arahkan ke dashboard
        router.push('/');
      } else {
        throw new Error(res.message);
      }

      return res;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const getToken = () => localStorage.getItem('accessToken');
  const getRefreshToken = () => localStorage.getItem('refreshToken');

  return { login, logout, getToken, getRefreshToken };
};

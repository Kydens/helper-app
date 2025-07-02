import { useRuntimeConfig } from '#app';

export const useAuth = () => {
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
        useCookie('accessToken', {
          secure: true,
          sameSite: 'lax',
          path: '/',
        }).value = res.data.accessToken;
        useCookie('refreshToken', {
          secure: true,
          sameSite: 'lax',
          path: '/',
        }).value = res.data.refreshToken;
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
    useCookie('accessToken', {
      secure: true,
      sameSite: 'lax',
      path: '/',
    }).value = null;
    useCookie('refreshToken', {
      secure: true,
      sameSite: 'lax',
      path: '/',
    }).value = null;
  };

  const getToken = () =>
    useCookie('accessToken', { secure: true, sameSite: 'lax', path: '/' })
      .value;
  const getRefreshToken = () =>
    useCookie('refreshToken', { secure: true, sameSite: 'lax', path: '/' })
      .value;

  return { login, logout, getToken, getRefreshToken };
};

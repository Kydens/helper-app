import { useRuntimeConfig } from '#app';
// import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const login = async (account, password) => {
    try {
      const res = await $fetch(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
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
        // useCookie('accessToken', {
        //   secure: true,
        //   sameSite: 'lax',
        //   path: '/',
        // }).value = res.data.accessToken;
        // useCookie('refreshToken', {
        //   secure: true,
        //   sameSite: 'lax',
        //   path: '/',
        // }).value = res.data.refreshToken;
        authStore.setAccessToken(res.data.accessToken);
        authStore.setUser(
          res.data.userId,
          res.data.username,
          res.data.role_alias
        );
      } else {
        throw new Error(res.message);
      }

      return res;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await $fetch(`${config.public.apiBase}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          username: username,
          email: email,
          password: password,
        },
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      return res;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  };

  const refresh = async (cookieHeader = {}) => {
    try {
      console.log('[Refresh] Starting refresh request...');
      const res = await $fetch(`${config.public.apiBase}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...cookieHeader,
        },
      });

      console.log('[Refresh] Response received:', res);

      if (res.success && res.data.accessToken) {
        authStore.setAccessToken(res.data.accessToken);
        authStore.setUser(
          res.data.userId,
          res.data.username,
          res.data.role_alias
        );
        console.log('[Refresh] Success, token updated');
        return res;
      } else {
        throw new Error(res?.message || 'Refresh response invalid');
      }
    } catch (e) {
      authStore.logout()``;
      console.log(e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      const res = await $fetch(`${config.public.apiBase}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      console.log(authStore);

      if (res.success) {
        authStore.logout();
        console.log(authStore);
        navigateTo('/login');
      }
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  };

  const getToken = () => authStore.accessToken;

  return { login, signup, logout, getToken, refresh };
};

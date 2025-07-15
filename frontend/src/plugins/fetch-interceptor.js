export default defineNuxtPlugin((nuxtApp) => {
  const accessToken = useCookie('accessToken', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  const refreshToken = useCookie('refreshToken', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  nuxtApp.hook('app:created', () => {
    nuxtApp.$fetch = $fetch.create({
      onRequest({ options }) {
        if (accessToken.value) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken.value}`,
            'User-Agent': navigator.userAgent,
          };
        }
      },

      async onResponseError({ response }) {
        if (response.status === 401) {
          accessToken.value = null;
          refreshToken.value = null;

          window.location.href = '/login';
        }
      },
    });
  });
});

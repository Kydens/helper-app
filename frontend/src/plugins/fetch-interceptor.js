export default defineNuxtPlugin((nuxtApp) => {
  const accessToken = useCookie('accessToken', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  // Override global $fetch
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
      onResponseError({ response }) {
        if (response.status === 401) {
          accessToken.value = null;
          return navigateTo('/login');
        }
      },
    });
  });
});

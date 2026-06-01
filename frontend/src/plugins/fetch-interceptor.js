export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  // const accessToken = useCookie('accessToken', {
  //   secure: true,
  //   sameSite: 'lax',
  //   path: '/',
  // });

  // const refreshToken = useCookie('refreshToken', {
  //   secure: true,
  //   sameSite: 'lax',
  //   path: '/',
  // });

  const accessToken = nuxtApp.hook('app:created', () => {
    nuxtApp.$fetch = $fetch.create({
      onRequest({ options }) {
        if (authStore.accessToken) {
          options.headers = {
            ...options.headers,
            // Authorization: `Bearer ${accessToken.value}`,
            Authorization: `Bearer ${authStore.accessToken}`,
            'User-Agent': navigator.userAgent,
          };
        }
      },

      async onResponseError({ response }) {
        console.log(
          'log fetch-interceptor: ',
          response.status,
          ' | ',
          'log message error',
          response.message
        );
        if (response.status === 401 || response.status === 403) {
          useAuth.logout();
          navigateTo('/login');
        }
      },
    });
  });
});

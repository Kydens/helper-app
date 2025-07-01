export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$fetch = $fetch.create({
    onRequest({ options }) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'User-Agent': navigator.userAgent,
        };
      }
    },
    onResponseError({ response }) {
      if (response.status !== 200) {
        // Token kadaluarsa → Redirect atau trigger refresh
        localStorage.removeItem('accessToken');
        return navigateTo('/login');
      }
    },
  });
});

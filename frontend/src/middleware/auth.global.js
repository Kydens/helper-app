export default defineNuxtRouteMiddleware((to, from) => {
  // Ambil cookie dari headers (SSR)
  const accessToken = process.server
    ? parseCookies(useRequestHeaders(['cookie']).cookie || '').accessToken
    : useCookie('accessToken').value;

  if (!accessToken && !['/login', '/signup'].includes(to.path)) {
    return navigateTo('/login');
  }
});

function parseCookies(cookieString) {
  return Object.fromEntries(
    (cookieString || '')
      .split(';')
      .map((v) => v.split('=').map((s) => s.trim()))
      .filter(([key]) => key)
  );
}

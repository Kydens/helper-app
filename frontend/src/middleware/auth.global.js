export default defineNuxtRouteMiddleware((to, from) => {
  // Ambil cookie dari headers (SSR)
  const accessToken = process.server
    ? parseCookies(useRequestHeaders(['cookie']).cookie || '').accessToken
    : useCookie('accessToken').value;

  const isAuthPage = ['/login', '/signup'].includes(to.path);

  if (!accessToken && !isAuthPage) {
    return navigateTo('/login');
  }

  if (accessToken && isAuthPage) {
    return navigateTo('/');
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

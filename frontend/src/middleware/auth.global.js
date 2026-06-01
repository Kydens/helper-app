export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ambil cookie dari headers (SSR)
  const authStore = useAuthStore();
  // const accessToken = process.server
  //   ? parseCookies(useRequestHeaders(['cookie']).cookie || '').accessToken
  //   : useCookie('accessToken').value;

  const isAuthPage = ['/login', '/signup'].includes(to.path);

  // if (!accessToken && !isAuthPage) {
  //   return navigateTo('/login');
  // }

  // if (accessToken && isAuthPage) {
  //   return navigateTo('/');
  // }

  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Path          :', to.path);
  console.log('isAuth        :', authStore.isAuth);
  console.log('accessToken   :', !!authStore.accessToken);
  console.log('isAuthPage    :', isAuthPage);

  // Case 1: Sudah login
  if (authStore.isAuth) {
    console.log('→ Sudah login → lanjut');
    if (isAuthPage) return navigateTo('/');
    return;
  }

  // Case 2: Belum login, tapi di halaman login → boleh
  if (isAuthPage) {
    console.log('→ Di halaman login → boleh lewat');
    return;
  }

  // Case 3: Belum login + bukan halaman login → HARUS refresh
  console.log('→ BELUM LOGIN + BUKAN LOGIN PAGE → mencoba refresh...');
  const cookieHeader = useRequestHeaders(['cookie']);

  try {
    const { refresh } = useAuth();
    console.log('→ Memanggil refresh function...');
    const result = await refresh(cookieHeader);
    console.log('→ Refresh BERHASIL', result);
    return;
  } catch (error) {
    console.error('→ Refresh GAGAL:', error?.message || error);
    return navigateTo('/login');
  }
});

// function parseCookies(cookieString) {
//   return Object.fromEntries(
//     (cookieString || '')
//       .split(';')
//       .map((v) => v.split('=').map((s) => s.trim()))
//       .filter(([key]) => key)
//   );
// }

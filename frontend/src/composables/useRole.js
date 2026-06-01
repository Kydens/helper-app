// import { jwtDecode } from 'jwt-decode';

export const useRole = () => {
  const authStore = useAuthStore();
  // const token = useCookie('accessToken', {
  //   secure: true,
  //   sameSite: 'lax',
  //   path: '/',
  // }).value;

  // const decoded = token ? jwtDecode(token) : null;
  // const role = decoded?.role_alias;

  return { role: authStore.user?.role_alias };
};

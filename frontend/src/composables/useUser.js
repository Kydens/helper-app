import { jwtDecode } from 'jwt-decode';

export const useUser = () => {
  const token = useCookie('accessToken', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  }).value;

  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.id;
  const username = decoded?.username;

  return { userId, username };
};

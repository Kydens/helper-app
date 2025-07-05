export const useUser = () => {
  const role = useCookie('userRole', {
    secure: true,
    sameSite: 'lax',
    path: '/',
  }).value;

  return { role };
};

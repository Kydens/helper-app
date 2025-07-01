export const getHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('accessToken');
    return {
      Authorization: token ? `Bearer ${token}` : '',
      'User-Agent': navigator.userAgent,
      'Content-Type': 'application/json',
    };
  }
};

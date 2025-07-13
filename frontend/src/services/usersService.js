import { useApiFetch } from '@/composables/useApiFetch';

export const usersService = () => {
  const apiFetch = useApiFetch();

  const createUser = async (payload) => {
    const url = '/api/users';
    return await apiFetch(url, {
      method: 'POST',
      body: payload,
    });
  };

  const getUsers = async ({
    page = 0,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  }) => {
    const query = new URLSearchParams();

    if (page !== null) query.append('page', page);
    if (search) query.append('search', search);
    if (sortBy) query.append('sortBy', sortBy);
    if (sortOrder) query.append('sortOrder', sortOrder);

    const url = `/api/users?${query.toString()}`;

    return apiFetch(url, { method: 'GET' });
  };

  const getDetailUser = async (id) => {
    return await apiFetch(`/api/users/${id}`, { method: 'GET' });
  };

  const updateUser = async (payload, id) => {
    const url = `/api/users/${id}`;
    return await apiFetch(url, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteUser = async (id) => {
    return await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
  };

  return { createUser, getUsers, getDetailUser, updateUser, deleteUser };
};

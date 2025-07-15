import { useApiFetch } from '@/composables/useApiFetch';

export const rolesService = () => {
  const apiFetch = useApiFetch();

  const createRole = async (payload) => {
    const url = '/api/master/roles';
    return await apiFetch(url, {
      method: 'POST',
      body: payload,
    });
  };

  const getRoles = async ({
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

    const url = `/api/master/roles?${query.toString()}`;

    return apiFetch(url, { method: 'GET' });
  };

  const getDetailRole = async (id) => {
    return await apiFetch(`/api/master/roles/${id}`, { method: 'GET' });
  };

  const updateRole = async (payload, id) => {
    const url = `/api/master/roles/${id}`;
    return await apiFetch(url, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteRole = async (id) => {
    return await apiFetch(`/api/master/roles/${id}`, { method: 'DELETE' });
  };

  return { createRole, getRoles, getDetailRole, updateRole, deleteRole };
};

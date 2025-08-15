import { useApiFetch } from '@/composables/useApiFetch';

export const todolistService = () => {
  const apiFetch = useApiFetch();

  const createTodolist = async (payload) => {
    const url = '/api/features/todolist';
    return await apiFetch(url, {
      method: 'POST',
      body: payload,
    });
  };

  const getTodolists = async ({
    size = 10,
    page = 0,
    search,
    level,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  }) => {
    const query = new URLSearchParams();

    if (page !== null) query.append('page', page);
    if (size !== null) query.append('size', size);
    if (search) query.append('search', search);
    if (level) query.append('level', level);
    if (sortBy) query.append('sortBy', sortBy);
    if (sortOrder) query.append('sortOrder', sortOrder);

    const url = `/api/features/todolist?${query.toString()}`;

    return apiFetch(url, { method: 'GET' });
  };

  const getDetailTodolist = async (id) => {
    return await apiFetch(`/api/features/todolist/${id}`, { method: 'GET' });
  };

  const updateTodolist = async (payload, id) => {
    const url = `/api/features/todolist/${id}`;
    return await apiFetch(url, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteTodolist = async (id) => {
    return await apiFetch(`/api/features/todolist/${id}`, { method: 'DELETE' });
  };

  return {
    createTodolist,
    getTodolists,
    getDetailTodolist,
    updateTodolist,
    deleteTodolist,
  };
};

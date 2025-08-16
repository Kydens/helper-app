import { useApiFetch } from '@/composables/useApiFetch';

export const todolistService = () => {
  const apiFetch = useApiFetch();
  const urlApi = '/api/features/todolist';

  const createTodolist = async (payload) => {
    const url = `${urlApi}`;
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

    const url = `${urlApi}?${query.toString()}`;

    return apiFetch(url, { method: 'GET' });
  };

  const getDetailTodolist = async (id) => {
    return await apiFetch(`${urlApi}/${id}`, { method: 'GET' });
  };

  const updateTodolist = async (payload, id) => {
    const url = `${urlApi}/${id}`;
    return await apiFetch(url, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteTodolist = async (id) => {
    return await apiFetch(`${urlApi}/${id}`, { method: 'DELETE' });
  };

  const getTodolistFinish = async (payload, id) => {
    const url = `${urlApi}/finish/${id}`;
    return await apiFetch(url, {
      method: 'PUT',
      body: payload,
    });
  };

  return {
    createTodolist,
    getTodolists,
    getDetailTodolist,
    updateTodolist,
    deleteTodolist,
    getTodolistFinish,
  };
};

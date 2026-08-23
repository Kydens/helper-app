import { useApiFetch } from '@/composables/useApiFetch';
import { functionHelper } from '@/utils/functionHelper';

export const todolistService = () => {
  const { snakeCase } = functionHelper();
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
    if (sortBy) query.append('sortBy', snakeCase(sortBy));
    if (sortOrder) query.append('sortOrder', sortOrder);
    console.log(sortBy);
    console.log(snakeCase(sortBy));

    const url = `${urlApi}?${query.toString()}`;

    let data = apiFetch(url, { method: 'GET' });

    return data;
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

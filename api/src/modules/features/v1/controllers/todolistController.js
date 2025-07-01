const sendResponse = require("../../../../utils/responseUtil");
const { checkIsAdmin } = require("../../../../utils/utils");
const {
  getAllTodolistService,
  createTodolistService,
  updateTodolistService,
  getJsonRowTodolistService,
  deleteTodolistService,
  getTodolistByIdService,
} = require("../services/todolistService");

const createTodolist = async (req, res) => {
  try {
    const todolist = await createTodolistService(req);
    const result = await getJsonRowTodolistService(todolist);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menambahkan todolist",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menambahkan todolist",
      error.message
    );
  }
};

const getAllTodolist = async (req, res) => {
  let userId = req.user.id;

  if (checkIsAdmin) {
    userId = null;
  }

  try {
    const {
      size = 10,
      page = 0,
      search = "",
      sortBy = "created_at",
      sortOrder = "DESC",
      startDate,
      endDate,
    } = req.query;

    const offset = parseInt(page) * parseInt(size);
    const { data, total } = await getAllTodolistService(
      userId,
      size,
      offset,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate
    );

    const result = await getJsonRowTodolistService(data);

    const totalPages = Math.ceil(total / size);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menampilkan semua todolist",
      {
        data: result,
        paging: {
          currentPage: parseInt(page),
          totalPage: totalPages,
          total: total,
          size: parseInt(size),
        },
      }
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      "error",
      "Gagal menampilkan semua todolist",
      error.message
    );
  }
};

const getTodolistById = async (req, res) => {
  try {
    const todolist = await getTodolistByIdService(req.params.id);
    const result = await getJsonRowTodolistService(todolist);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menampilkan todolist",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menampilkan todolist",
      error.message
    );
  }
};

const updateTodolist = async (req, res) => {
  try {
    const todolist = await updateTodolistService(req, req.params.id);
    const result = await getJsonRowTodolistService(todolist);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil mengupdate todolist",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal mengupdate todolist",
      error.message
    );
  }
};

const deleteTodolist = async (req, res) => {
  try {
    const result = await deleteTodolistService(req, req.params.id);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menghapus todolist",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menghapus todolist",
      error.message
    );
  }
};

module.exports = {
  createTodolist,
  getAllTodolist,
  getTodolistById,
  updateTodolist,
  deleteTodolist,
};

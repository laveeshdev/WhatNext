
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { validate, createTodoSchema, updateTodoSchema } = require('../middlewares/validate');
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

router.route('/').get(protect, getTodos).post(protect, validate(createTodoSchema), createTodo);
router
  .route('/:id')
  .get(protect, getTodoById)
  .put(protect, validate(updateTodoSchema), updateTodo)
  .delete(protect, deleteTodo);

module.exports = router;

const Todo = require('../models/Todo');

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  // Clamp limit to [5..50]
  limit = Math.max(5, Math.min(limit, 50));

  const filter = { owner: req.user._id };

  // Priority filter (ignore "all")
  if (req.query.priority && req.query.priority !== 'all') {
    filter.priority = req.query.priority;
  }

  // Completed filter (ignore "all")
  if (req.query.completed && req.query.completed !== 'all') {
    filter.completed = req.query.completed === 'true';
  }

  // Text search
  if (req.query.q) {
    filter.$text = { $search: req.query.q };
  }

  const total = await Todo.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  // Sorting
  let sortOptions = {};
  if (req.query.sort) {
    const [field, order] = req.query.sort.split(':');
    if (field && order) {
      sortOptions[field] = order === 'asc' ? 1 : -1;
    }
  }

  const todos = await Todo.find(filter)
    .sort(sortOptions)
    .limit(limit)
    .skip((page - 1) * limit);

  res.json({
    data: todos,
    page,
    limit,
    total,
    totalPages,
  });
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo && todo.owner.toString() === req.user._id.toString()) { // ✅ owner
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

// @desc    Create a todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  const { title, description, priority, completed, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ message: 'Title and Due Date are required' });
  }

  const todo = new Todo({
    owner: req.user._id, // ✅ owner
    title,
    description,
    priority,
    completed,
    dueDate,
  });

  try {
    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    } else {
      return res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  const { title, description, priority, completed, dueDate } = req.body;

  const todo = await Todo.findById(req.params.id);

  if (todo && todo.owner.toString() === req.user._id.toString()) { // ✅ owner
    todo.title = title !== undefined ? title : todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.priority = priority !== undefined ? priority : todo.priority;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.dueDate = dueDate !== undefined ? dueDate : todo.dueDate;

    try {
      const updatedTodo = await todo.save();
      res.json(updatedTodo);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      } else {
        return res.status(500).json({ message: 'Server Error' });
      }
    }
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo && todo.owner.toString() === req.user._id.toString()) { // ✅ owner
    await todo.deleteOne();
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};

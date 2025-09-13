const { z } = require('zod');

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  completed: z.boolean().default(false),
  dueDate: z.string().datetime('Invalid date format').optional(), // Using string and validating as datetime for input
});

const createTodoSchema = todoSchema.extend({
  title: z.string().min(1, 'Title is required'),
  dueDate: z.string().datetime('Due date is required and must be a valid date'),
});

const updateTodoSchema = todoSchema.partial(); // All fields optional for update

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: (error.errors || []).map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    // For non-Zod errors, forward to error handler
    return next(error);
  }
};


module.exports = {
  validate,
  createTodoSchema,
  updateTodoSchema,
};

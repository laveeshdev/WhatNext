
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(v) {
        // Due date must be today or in the future
        const todayUtc = new Date();
        todayUtc.setUTCHours(0, 0, 0, 0); // Set to start of today in UTC
        return v.getTime() >= todayUtc.getTime(); // Compare timestamps
      },
      message: props => `${props.value} is not a valid due date! Due date must be today or in the future.`
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);

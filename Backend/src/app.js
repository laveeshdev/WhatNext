const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const cookieParser = require('cookie-parser');
dotenv.config();

connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json()); // For parsing application/json
app.use(cors({
  origin: [process.env.CORS_ORIGIN, 'https://whatnext-front.onrender.com', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

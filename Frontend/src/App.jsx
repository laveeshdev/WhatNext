import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { setupAxiosInterceptors } from './api/axiosInstance';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskCreate from './pages/TaskCreate';
import TaskEdit from './pages/TaskEdit';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/create" element={<TaskCreate />} />
          <Route path="/edit/:id" element={<TaskEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


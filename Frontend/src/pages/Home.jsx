import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/tasks');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything
};

export default Home;

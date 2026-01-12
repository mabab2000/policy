import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/Login' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // evita parpadeo mientras redirige
  }

  return <Outlet />; // renderiza las rutas hijas protegidas
}

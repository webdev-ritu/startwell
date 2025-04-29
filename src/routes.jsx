import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? (children ? children : <Outlet />) : <Navigate to="/login" />;
}

export function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? (children ? children : <Outlet />) : <Navigate to="/dashboard" />;
}
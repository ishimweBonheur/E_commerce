import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '@/app/hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.signIn.user);

  if (user && user.userType && roles.includes(user.userType.name)) {
    return children;
  }

  return <Navigate to="/signIn" />;
}

export default ProtectedRoute;

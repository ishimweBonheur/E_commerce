import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '@/app/hooks';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.signIn.user);

  // Admin has access to everything
  if (user?.userType?.name === 'Admin') {
    return children;
  }

  // Other users need to have their role in the roles array
  if (user && user.userType && roles.includes(user.userType.name)) {
    return children;
  }

  return <Navigate to="/signIn" />;
}

export default ProtectedRoute;

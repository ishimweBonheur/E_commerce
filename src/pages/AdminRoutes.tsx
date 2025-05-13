import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface Adminprops {
  children: ReactNode;
}

function AdminRoutes({ children }: Adminprops) {
  const user = useAppSelector((state) => state.signIn.user);

  // Admin has access to everything
  if (user?.userType?.name === 'Admin') {
    return children;
  }
  
  // Vendor has limited access
  if (user?.userType?.name === 'Vendor') {
    return children;
  }

  return <Navigate to="/signIn" />;
}

export default AdminRoutes;

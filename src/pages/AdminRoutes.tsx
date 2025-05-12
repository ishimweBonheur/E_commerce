import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface Adminprops {
  children: ReactNode;
}

function AdminRoutes({ children }: Adminprops) {
  const user = useAppSelector((state) => state.signIn.user);

  return user?.userType?.name === 'Admin' ||
    user?.userType?.name === 'Vendor' ? (
    children
  ) : (
    <Navigate to="/signIn" />
  );
}

export default AdminRoutes;

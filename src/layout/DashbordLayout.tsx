import { Outlet } from 'react-router-dom';
import DashboardSideNav from '@/components/dashBoard/DashboardSideNav';
import Navbar from '@/components/dashBoard/dashBoardNav';

function DashboardLayout() {
  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="fixed bg-white top-0 left-0 right-0 z-50 shadow-sm">
        <Navbar />
      </div>
      <div className="flex">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)]">
          <DashboardSideNav />
        </div>
        <div className="flex-1 ml-[200px] mt-16 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

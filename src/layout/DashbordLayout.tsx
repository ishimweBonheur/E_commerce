import { Outlet } from 'react-router-dom';
import DashboardSideNav from '@/components/dashBoard/DashboardSideNav';
import Navbar from '@/components/dashBoard/dashBoardNav';

function DashboardLayout() {
  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="fixed bg-white top-0 left-0 right-0 z-50 shadow-sm">
        <Navbar />
      </div>
      <div className="flex pt-16">
        <DashboardSideNav />
        <main className="flex-1 lg:ml-[200px] p-4 lg:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

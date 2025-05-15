import { useState } from 'react';
import { FaBell, FaAngleDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HSButton from '@/components/form/HSButton';
import { logout } from '@/features/Auth/SignInSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

function DashNavbar() {
  const dispatch = useAppDispatch();
  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
  const user = useAppSelector((state) => state.signIn.user);
  const navigate = useNavigate();

  const handleProfileMenuToggle = () => {
    setToggleProfileMenu(!toggleProfileMenu);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleProfileMenuToggle();
    }
  };

  return (
    <div className="relative flex items-center justify-between w-full h-16 px-4 lg:px-6 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 ml-10">
        <img src="/logo.png" alt="logo" className="w-8 h-8" />
        <h2 className="text-gray-800 font-bold">DOB</h2>
        <div className="hidden lg:block ml-8">
          <h2 className="text-gray-800 font-semibold">Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-6">
        <div className="relative">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <FaBell size="20" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
              1
            </div>
          </button>
        </div>

        {user ? (
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={handleProfileMenuToggle}
              onKeyPress={handleKeyPress}
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100">
                <img
                  src={user.picture}
                  className="w-full h-full object-cover"
                  alt="profile"
                />
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <h2 className="text-sm font-medium text-gray-800">
                  {`${user.firstName} ${user.lastName}`}
                </h2>
                <span className="text-xs text-gray-500">
                  {user.userType?.name}
                </span>
              </div>
              <FaAngleDown
                size="15"
                className="text-gray-500 hidden lg:block"
              />
            </button>

            {toggleProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => navigate('/profile')}
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => dispatch(logout())}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <HSButton path="/login" title="Sign In" styles="px-4 py-2" />
        )}
      </div>
    </div>
  );
}

export default DashNavbar;

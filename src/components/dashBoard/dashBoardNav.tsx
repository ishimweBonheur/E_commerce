import { useState, useEffect } from 'react';
import { FaBell, FaAngleDown } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import HSButton from '@/components/form/HSButton';
import { logout } from '@/features/Auth/SignInSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import axios from 'axios';

function DashNavbar() {
  const dispatch = useAppDispatch();
  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAppSelector((state) => state.signIn.user);
  const token = useAppSelector((state) => state.signIn.token);
  const navigate = useNavigate();

  const handleProfileMenuToggle = () => {
    setToggleProfileMenu(!toggleProfileMenu);
  };

  const handleMobileMenuToggle = () => {
    setToggleMobileMenu(!toggleMobileMenu);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleProfileMenuToggle();
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      if (!user || !token) {
        console.log('User or token not available');
        return;
      }

      let url = `${import.meta.env.VITE_BASE_URL}/notification`;

      // Add vendor-specific endpoint only for vendors
      if (user?.userType?.name === 'Vendor') {
        url += `/vendor/${user.id}`;
      }

      console.log('Fetching notifications from:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.notification) {
        console.log('No notification data in response:', response.data);
        return;
      }

      const unread = response.data.notification.filter(
        (n: any) => !n.is_read
      ).length;
      setUnreadCount(unread);
    } catch (error: any) {
      console.error(
        'Error fetching notifications:',
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUnreadNotifications();
    }
  }, [user, token]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full h-16 px-4 lg:px-6 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
          ></button>
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/iconcart.svg"
              alt=""
              className="w-10 text-primary [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(104%)_contrast(101%)]"
            />
            <h2 className="hidden md:block text-primary text-2xl font-bold">
              ShopEase
            </h2>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:gap-6">
          {user && (
            <div className="relative">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Notifications"
                onClick={() => navigate('/dashboard/notifications')}
              >
                <FaBell size="20" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                    {unreadCount}
                  </div>
                )}
              </button>
            </div>
          )}

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

      {/* Mobile Menu */}
      {toggleMobileMenu && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg z-50">
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 py-2">
              <img
                src="/iconcart.svg"
                alt=""
                className="w-8 text-primary [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(104%)_contrast(101%)]"
              />
              <h2 className="text-primary text-xl font-bold">ShopEase</h2>
            </div>
            {user && (
              <div className="py-2">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    navigate('/dashboard/notifications');
                    setToggleMobileMenu(false);
                  }}
                >
                  Notifications
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    navigate('/profile');
                    setToggleMobileMenu(false);
                  }}
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    dispatch(logout());
                    setToggleMobileMenu(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashNavbar;

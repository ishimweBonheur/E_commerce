/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { FiHeart} from 'react-icons/fi';
import { FaAngleDown, FaRegUserCircle } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import HSButton from './form/HSButton';
import { logout } from '@/features/Auth/SignInSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { selectCartItems, fetchCartItems } from '@/features/Cart/cartSlice';

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);
  const user = useAppSelector((state) => state.signIn.user);
  const cartItems = useAppSelector((state: RootState) =>
    selectCartItems(state)
  );

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-sm bg-white/95">
      <div className="relative flex items-center justify-between w-full h-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Mobile menu button */}
        <RxHamburgerMenu
          size={24}
          className="lg:hidden text-gray-600 hover:text-primary transition-all duration-300 cursor-pointer hover:scale-110"
          onClick={() => setToggleMenu(!toggleMenu)}
        />

        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="text-white  transition-all duration-300">
          <img
              src="/iconcart.svg"
              alt=""
              className="w-10 text-primary [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(104%)_contrast(101%)]"
            />
          </div>
          <h2 className="text-2xl font-bold text-primary hidden sm:block tracking-tight">
            ShopEase
          </h2>
        </div>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center h-full space-x-2">
          {[
            { path: '/', name: 'Home' },
            { path: '/shop', name: 'Shop' },
            { path: '/about', name: 'About' },
            { path: '/contact', name: 'Contact' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 h-full flex items-center justify-center font-medium transition-all duration-300 rounded-lg ${
                location.pathname === item.path
                  ? 'text-primary bg-primary/5 font-semibold'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-5">
          {user?.userType.name !== 'Vendor' && (
            <>
              <Link to="/cart" className="relative group">
                <LuShoppingCart
                  size={24}
                  className="text-gray-600 group-hover:text-primary transition-all duration-300 group-hover:scale-110"
                />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-primary/20">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <FiHeart
                size={24}
                className="text-gray-600 hover:text-primary transition-all duration-300 cursor-pointer hover:scale-110"
                onClick={() => navigate('/wishlist')}
              />
            </>
          )}

          {user ? (
            <div className="hidden lg:flex items-center gap-3 relative">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-expanded={toggleProfileMenu}
                onClick={() => setToggleProfileMenu(!toggleProfileMenu)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setToggleProfileMenu(!toggleProfileMenu);
                  }
                }}
                aria-label="Toggle Profile Menu"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all duration-300"
                    alt="profile"
                  />
                ) : (
                  <FaRegUserCircle
                    size={28}
                    className="text-gray-600 group-hover:text-primary transition-all duration-300"
                  />
                )}
                <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">
                  {`${user.firstName} ${user.lastName}`}
                </span>
                <FaAngleDown
                  size={16}
                  className={`text-gray-500 transition-all duration-300 ${toggleProfileMenu ? 'rotate-180' : ''} group-hover:text-primary`}
                />
              </div>

              {toggleProfileMenu && (
                <div className="absolute top-14 right-0 bg-white shadow-xl rounded-xl w-56 py-2 z-50 border border-gray-100">
                  {(user?.userType?.name === 'Admin' || user?.userType?.name === 'Vendor') && (
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer transition-colors"
                      onClick={() => {
                        setToggleProfileMenu(false);
                        navigate('/dashboard');
                      }}
                    >
                      <span className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </span>
                      <span>Dashboard</span>
                    </div>
                  )}
                  <div className="border-gray-100 mt-1 pt-1">
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer transition-colors"
                      onClick={() => {
                        setToggleProfileMenu(false);
                        dispatch(logout());
                      }}
                    >
                      <span className="text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                      </span>
                      <span>Sign Out</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <HSButton
              path="/signIn"
              title="Login"
              styles="hidden lg:flex bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {toggleMenu && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-xl z-40 border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            {[
              { path: '/', name: 'Home' },
              { path: '/shop', name: 'Shop' },
              { path: '/about', name: 'About' },
              { path: '/contact', name: 'Contact' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
                onClick={() => setToggleMenu(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 px-4 py-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      alt="profile"
                    />
                  ) : (
                    <FaRegUserCircle size={28} className="text-gray-600" />
                  )}
                  <span className="font-medium text-gray-800">
                    {`${user.firstName} ${user.lastName}`}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => {
                    setToggleMenu(false);
                    dispatch(logout());
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <HSButton
                path="/signIn"
                title="Login"
                styles="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

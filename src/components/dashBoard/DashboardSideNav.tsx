import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { RiCoupon2Line } from 'react-icons/ri';
import { MdDashboard } from 'react-icons/md';
import {
  ShoppingCart,
  Users,
  Box,
  ChevronDown,
  ChevronRight,
  Store,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

const sideBarItems = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <MdDashboard className="w-5 h-5" />,
    role: ['Admin', 'Vendor'],
  },
  {
    path: '/dashboard/orders',
    name: 'Orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    subItems: [
      {
        path: '/dashboard/orders',
        name: 'All orders',
        role: ['Admin', 'Vendor'],
      },
    ],
    role: ['Admin', 'Vendor'],
  },
  {
    path: '/dashboard/customers',
    name: 'Customers',
    icon: <Users className="w-5 h-5" />,
    subItems: [
      {
        name: 'All customers',
        path: '/dashboard/customers',
        role: ['Admin'],
      },
    ],
    role: ['Admin'],
  },
  {
    name: 'seller',
    path: '/dashboard/seller',
    role: ['Admin'],
    icon: <Store className="w-5 h-5" />,
  },
  {
    name: 'Products',
    icon: <Box className="w-5 h-5" />,
    subItems: [
      {
        path: '/dashboard/product',
        name: 'All Products',
        role: ['Admin', 'Vendor'],
      },
      {
        path: '/dashboard/addProduct',
        name: 'Add New',
        role: ['Vendor'],
      },
      {
        path: '/dashboard/category',
        name: 'Categories',
        role: ['Admin'],
      },
    ],
    role: ['Admin', 'Vendor'],
  },
  {
    path: '/dashboard/coupons',
    name: 'Coupons',
    icon: <RiCoupon2Line className="w-5 h-5" />,
    subItems: [
      {
        path: '/dashboard/coupons',
        name: 'All coupons',
        role: ['Admin', 'Vendor'],
      },
      {
        path: '/dashboard/addCoupons',
        name: 'Add New',
        role: ['Vendor'],
      },
    ],
    role: ['Admin', 'Vendor'],
  },
  {
    name: 'user Role',
    icon: <User className="w-5 h-5" />,
    subItems: [
      {
        name: 'Add & All Roles',
        path: '/dashboard/userRole',
        role: ['Admin'],
      },
    ],
    role: ['Admin'],
  },
];

interface SideBarItemProps {
  item: {
    path?: string;
    name: string;
    icon: React.ReactNode;
    subItems?: { path: string; name: string; role: string[] }[];
  };
  Role: string;
}

function SideBarItem({
  item,
  Role,
}: SideBarItemProps) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.path;

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <li>
      <div
        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Link
          to={item.path || '#'}
          className="flex items-center gap-3 flex-1"
          onClick={() => {
            if (!item.subItems) {
              handleExpand();
            }
          }}
        >
          <span className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
            {item.icon}
          </span>
          <span className="font-medium">{item.name}</span>
        </Link>
        {item.subItems && (
          <button
            type="button"
            onClick={handleExpand}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {expanded && item.subItems && (
        <ul className="ml-6 mt-1 space-y-1">
          {item.subItems.map((subItem) => {
            if (subItem.role.includes(Role!)) {
              const isSubItemActive = location.pathname === subItem.path;
              return (
                <li key={subItem.name}>
                  <Link
                    to={subItem.path}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSubItemActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {subItem.name}
                  </Link>
                </li>
              );
            }
            return null;
          })}
        </ul>
      )}
    </li>
  );
}

function DashboardSideNav() {
  const Role = useAppSelector((state) => state.signIn.user?.userType.name);
  const [isVisible, setIsVisible] = useState(false);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-3 z-50 p-1"
        onClick={toggleSidebar}
        type="button"
        aria-label="Toggle Menu"
      >
        <AiOutlineMenu className="text-2xl" />
      </button>
      <aside
        className={`h-[calc(100vh-4rem)] w-[200px] bg-white fixed left-0 z-40 border-r border-gray-100 ${
          isVisible ? 'block' : 'hidden'
        } lg:block`}
      >
        <nav className="h-full flex flex-col">
          <div className="lg:hidden flex justify-end p-3">
            <button
              onClick={toggleSidebar}
              type="button"
              aria-label="Close Menu"
              className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <AiOutlineClose className="text-xl" />
            </button>
          </div>
          <ul className="flex-1 px-3 py-4 space-y-1">
            {sideBarItems.map((item) => {
              if (item.role.includes(Role!)) {
                return (
                  <SideBarItem
                    Role={Role!}
                    key={item.name}
                    item={item}
                  />
                );
              }
              return null;
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default DashboardSideNav;

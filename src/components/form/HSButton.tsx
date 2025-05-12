import React from 'react';
import { Link } from 'react-router-dom';

interface MyButtonProps {
  path?: string;
  title: React.ReactNode;
  styles?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
  icon?: JSX.Element;
  target?: '_blank' | '_self' | '_parent' | '_top';
  onChange?: React.ChangeEventHandler<HTMLAnchorElement>;
}

function HSButton({
  path,
  title,
  icon,
  styles,
  target,
  onChange,
  onClick,
}: MyButtonProps) {
  if (path) {
    return (
      <Link
        target={target}
        onChange={onChange}
        rel="noopener noreferrer"
        to={path}
        onClick={onClick}
        className={`${styles} bg-primary text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm hover:text-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out`}
      >
        {title} {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles} bg-primary text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm hover:text-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out`}
    >
      {title} {icon}
    </button>
  );
}

export default HSButton;

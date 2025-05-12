// SectionHeader.tsx
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

interface SectionHeaderProps {
  title: string;
  description: string;
  link?: {
    url: string;
    text: string;
  };
}

function SectionHeader({ title, description, link }: SectionHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <div className="flex flex-col lg:flex-row gap-2 md:gap-2 lg:gap-6 w-full md:w-3/4 items-center">
        <h2 className="text-3xl font-semibold text-black w-full lg:w-auto text-center md:text-left">
          {title}
        </h2>
        <p className="text-sm font-light text-black w-full lg:w-auto text-center md:text-left">
          {description}
        </p>
      </div>
      {link && (
        <Link
          to={link.url}
          className="hidden md:flex items-center p-2 rounded-xl border-violet-700 border text-violet-700 text-sm hover:bg-violet-200"
        >
          {link.text} <IoIosArrowForward data-testid="icon" />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;

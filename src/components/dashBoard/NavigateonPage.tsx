import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';

interface CircularPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function CircularPagination({
  totalPages,
  currentPage,
  onPageChange,
}: CircularPaginationProps) {
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else if (currentPage < 3) {
      pages.push(1, 2, 3, 4, '...', totalPages - 1, totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        2,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages - 1,
        totalPages
      );
    }
    return pages;
  };

  const pages = generatePages();
  // -----------------------------------------------------------------

  const next = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label="Previous page"
        className="h-[36px] w-[36px] flex items-center justify-center rounded-full  hover:border-primary hover:border"
        onClick={prev}
        disabled={currentPage === 1}
      >
        <MdKeyboardArrowLeft className=" h-[16px] w-[16px] text-grey" />
      </button>
      <div className="flex items-center text-grey">
        {pages.map((page, index) => (
          <button
            key={index}
            type="button"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className="h-[36px] w-[36px] rounded-full text-[14px] hover:border-primary hover:border"
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label="next page"
        className="h-[36px] w-[36px] flex items-center justify-center gap-2 rounded-full hover:border-primary hover:border"
        onClick={next}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardArrowRight className=" h-[16px] w-[16px] text-grey" />
      </button>
    </div>
  );
}

export default CircularPagination;

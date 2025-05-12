import leftIcon from '@/assets/icons/Left-Arrow.svg';
import rightIcon from '@/assets/icons/Right-Arrow.svg';

interface PopularTitleProps {
  section: string;
  onLeftArrowClick: () => void;
  onRightArrowClick: () => void;
}

function PopularTitle({
  section,
  onLeftArrowClick,
  onRightArrowClick,
}: PopularTitleProps) {
  return (
    <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-t-xl shadow-sm">
      <div className="group">
        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors flex items-center gap-2">
          {section}
          <span className="text-sm text-gray-500 font-normal">({section === "Most Popular" ? "By Rating" : section === "Most Selling" ? "By Sales" : "Latest"})</span>
        </h2>
        <div className="h-0.5 w-16 bg-orange-600 rounded-full mt-1.5 group-hover:w-24 transition-all duration-300 opacity-80"></div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onLeftArrowClick}
          className="p-2 rounded-lg hover:bg-primary transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Previous items"
        >
          <img src={leftIcon} alt="Previous" className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onRightArrowClick}
          className="p-2 rounded-lg hover:bg-primarytransition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Next items"
        >
          <img src={rightIcon} alt="Next" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default PopularTitle;

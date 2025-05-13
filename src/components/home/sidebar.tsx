import WebFont from 'webfontloader';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RootState } from '@/app/store';
import { Category } from '@/types/Product';
import CategoryComponent from './Category';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import {
  selectCategories,
  setFocused,
} from '@/features/Products/categorySlice';

WebFont.load({
  google: {
    families: ['Manrope:400,500,600,700,800'],
  },
});

function Categories() {
  const categories: Category[] = useAppSelector((state: RootState) =>
    selectCategories(state)
  );
  const [clicked, setClicked] = useState(true);
  const dispatch = useAppDispatch();
  function reset() {
    setClicked(!clicked);
    dispatch(setFocused(-1));
  }
  return (
    <div>
      <div
        className={`${!clicked ? 'hidden' : 'flex'} gap-2 text-xl text-gray-800 tracking-wider w-full justify-between py-3 px-6 border-b items-center md:hidden`}
        onClick={reset}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setClicked(!clicked);
          }
        }}
      >
        <div className="flex gap-2">
          <img src="/icons/categories.svg" alt="category icon" />
          <span className="font-semibold">All Categories</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M10.103 12.778L16.81 6.08a.69.69 0 0 1 .99.012a.726.726 0 0 1-.012 1.012l-7.203 7.193a.69.69 0 0 1-.985-.006L2.205 6.72a.727.727 0 0 1 0-1.01a.69.69 0 0 1 .99 0z"
          />
        </svg>
      </div>

      <div
        className={`${!clicked ? 'flex' : 'hidden'} md:flex flex-col rounded border border-gray-300 mx-0 md:mr-8 mt-2 w-full`}
      >
        <div
          className="flex gap-2 text-xl text-gray-800 tracking-wider w-full justify-between py-3 px-6 border-b border-gray-300 items-center"
          onClick={reset}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setClicked(!clicked);
            }
          }}
        >
          <div className="flex gap-2 hover:text-primary">
            <img src="/icons/categories.svg" alt="category icon" />
            <span className="font-semibold">All Categories</span>
          </div>
          <ChevronDown />
        </div>
        <ul className={`${clicked ? 'flex flex-col' : 'hiddeb'}`}>
          {categories.map((category) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
            <li
              key={category.id}
              className="border-b border-gray-300 px-6 py-3"
              onClick={() => dispatch(setFocused(category.id))}
            >
              <CategoryComponent
                icon={
                  category.icon
                    ? category.icon
                    : `/icons/${category.name?.toLowerCase().split(' ')[0]}.svg`
                }
                name={category.name as string}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Categories;

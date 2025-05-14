import { useEffect } from 'react';
import WebFont from 'webfontloader';
import { Link } from 'react-router-dom';
import { RootState } from '@/app/store';
import { Category } from '@/types/Product';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import {
  fetchCategories,
  selectCategories,
} from '@/features/Products/categorySlice';
import { Capitalize } from '@/utils/capitalize';

// Load Google Font
WebFont.load({
  google: {
    families: ['Manrope:400,500,600,700,800'],
  },
});

function Categories() {
  const dispatch = useAppDispatch();
  const categories: Category[] = useAppSelector((state: RootState) =>
    selectCategories(state)
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3">
          Shop by Categories
        </h2>
        <p className="text-lg text-primary max-w-2xl mx-auto font-medium">
          Discover our wide range of products organized by category
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No categories found.
          </p>
        ) : (
          categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative rounded-xl overflow-hidden h-60  shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Background blur effect */}
              <div className="absolute inset-0 bg-gray-100 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

              {/* Image container */}
              <div className="relative w-full h-full z-10">
                <img
                  src={category.icon || '/default-category.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-category.jpg';
                  }}
                />

                {/* Sophisticated overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
              </div>

              {/* Category content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                {/* Glowing accent bar */}
                <div className="w-12 h-1 bg-primary mb-3 rounded-full group-hover:w-16 transition-all duration-300"></div>

                <h3
                  className="text-2xl font-bold text-white mb-2 group-hover:translate-y-1 transition-transform duration-300"
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {Capitalize(category.name)}
                </h3>
                <span className="inline-block text-primary font-medium text-sm group-hover:text-white transition-colors">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* View All Button */}
      {categories.length > 4 && (
        <div className="mt-12 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            View All Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Categories;

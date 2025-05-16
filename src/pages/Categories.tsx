import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '@/app/store';
import { Category } from '@/types/Product';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import {
  fetchCategories,
  selectCategories,
} from '@/features/Products/categorySlice';
import { Capitalize } from '@/utils/capitalize';

function Categories() {
  const dispatch = useAppDispatch();
  const categories: Category[] = useAppSelector((state: RootState) =>
    selectCategories(state)
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:underline text-primary">Home</Link>
              <span className="mx-2">&gt;</span>
            </li>
            <li className="flex items-center text-gray-700 font-semibold">All Categories</li>
          </ol>
        </nav>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">All Categories</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse all available categories</p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {categories.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full py-12">No categories found.</p>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="flex flex-col items-center group p-2 rounded-full "
              >
                <div className="w-30 h-15 mb-2 p-4 items-center rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:shadow-md">
                  {/* <img
                    src={category.icon || '/default-category.jpg'}
                    alt={category.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-category.jpg';
                    }}
                  /> */}<span className="text-sm text-gray-700 font-medium text-center group-hover:text-primary transition-colors">
                  {Capitalize(category.name)}
                </span>
                </div>
                
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories; 
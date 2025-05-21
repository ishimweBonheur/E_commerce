// src/components/MostPopular/MostPopular.tsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import PopilarTitle from './PopilarTitle';
import SingleItem from './Item';

function MostPopular() {
  const { availableProduct, status } = useSelector(
    (state: RootState) => state.availableProducts
  );

  const [start, setStart] = useState(0);
  const itemsPerPage = 6;
  const end = start + itemsPerPage;

  const handleLeftallowclick = async () => {
    if (start > 0) {
      setStart(start - itemsPerPage);
    }
  };

  const handleRightallowclick = async () => {
    if (end < availableProduct.length) {
      setStart(start + itemsPerPage);
    }
  };

  const mostRecentProducts = [...availableProduct]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(start, end);

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto">
      <PopilarTitle
        section="Most Popular"
        onLeftArrowClick={handleLeftallowclick}
        onRightArrowClick={handleRightallowclick}
      />

      <div className="bg-white rounded-b-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {status === 'loading' &&
            Array(itemsPerPage)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center gap-4 p-3 rounded-xl bg-gray-50/80 animate-pulse"
                  role="status"
                >
                  <div className="h-24 w-24 rounded-lg bg-gray-200"></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/3 mt-1"></div>
                  </div>
                </div>
              ))}

          {status === 'failed' &&
            Array(itemsPerPage)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 rounded-xl bg-gray100 text-gray600 text-sm"
                >
                  Failed to load products. Please try again.
                </div>
              ))}

          {mostRecentProducts.map((product) => (
            <SingleItem key={product.id} product={product} />
          ))}
        </div>

        {status !== 'loading' && mostRecentProducts.length === 0 && (
          <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
            No products available.
          </div>
        )}

        {/* Navigation Dots */}
        {status !== 'loading' && availableProduct.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-6">
            {Array(Math.ceil(availableProduct.length / itemsPerPage))
              .fill(null)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStart(index * itemsPerPage)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor(start / itemsPerPage) === index
                      ? 'bg-gray600 w-4'
                      : 'bg-gray300 hover:bg-gray400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MostPopular;

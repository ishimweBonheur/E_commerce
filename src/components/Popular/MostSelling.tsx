import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import PopilarTitle from './PopilarTitle';
import SingleItem from './Item';

function MostSelling() {
  const { availableProduct, status } = useSelector(
    (state: RootState) => state.availableProducts
  );

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(3);

  const handleLeftallowclick = async () => {
    if (start > 0) {
      setEnd(end - 3);
      setStart(start - 3);
    } else {
      setEnd(3);
      setStart(0);
    }
  };

  const handleRightallowclick = async () => {
    if (end < availableProduct.length) {
      setEnd(end + 3);
      setStart(start + 3);
    }
  };

  const popularProducts = availableProduct.slice(start, end);

  return (
    <div className="flex flex-col">
      <PopilarTitle
        section="Most Selling"
        onLeftArrowClick={handleLeftallowclick}
        onRightArrowClick={handleRightallowclick}
      />

      <div className="grid gap-2 bg-white rounded-b-xl p-3 shadow-sm">
        {status === 'loading' &&
          Array(3)
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
          Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 rounded-xl bg-red-50/80 text-red-600 text-sm"
              >
                Failed to load products. Please try again.
              </div>
            ))}

        {popularProducts.map((product) => (
          <SingleItem key={product.id} product={product} />
        ))}

        {status !== 'loading' && popularProducts.length === 0 && (
          <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
            No products available.
          </div>
        )}
      </div>
    </div>
  );
}

export default MostSelling;

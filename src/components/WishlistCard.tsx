import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Product } from '@/types/Product';
import { removeFromWishlist } from '@/features/Products/ProductSlice';

function WishlistCard({ product }: { product: Product }) {
  const { token } = useAppSelector((state) => state.signIn);
  const dispatch = useAppDispatch();
  return (
    <div className="relative flex bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 xs:w-full md:w-[30rem] h-64 p-4 pb-6 border border-gray-100">
      <IoClose
        size={20}
        className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-red-500 transition-colors duration-300"
        onClick={() => dispatch(removeFromWishlist({ token, id: product.id }))}
      />
      <div className="flex w-2/5">
        <img
          src={product.image}
          alt="wishlistImage"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="flex flex-col items-start gap-4 w-3/5 pl-4">
        <h1
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            product.quantity > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </h1>
        <h2 className="text-gray-800 font-semibold text-lg line-clamp-2">
          {product.name}
        </h2>
        <div className="flex items-center font-medium gap-2 relative w-fit">
          <div className="flex items-center font-medium gap-2 relative w-fit">
            <span className="text-gray-700 font-semibold">
              {product.averageRating}
            </span>
            {Array.from({ length: Math.floor(product.averageRating) }).map(
              (_, index) => {
                return (
                  <div data-testid="ratingStar" key={index}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray600"
                      viewBox="0 0 36 36"
                    >
                      <path
                        fill="currentColor"
                        d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                      />
                    </svg>
                  </div>
                );
              }
            )}
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 36 36"
                data-testid="halfStar"
              >
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                      offset={`${(product.averageRating - Math.floor(product.averageRating)) * 100}%`}
                      style={{
                        stopColor: '#4B5563',
                        stopOpacity: 1,
                      }}
                    />
                    <stop
                      offset={`${(product.averageRating - Math.floor(product.averageRating)) * 100}%`}
                      style={{
                        stopColor: '#D1D5DB',
                        stopOpacity: 1,
                      }}
                    />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#grad1)"
                  d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                />
              </svg>
            </div>
          </div>
          {Array.from({ length: Math.floor(4 - product.averageRating) }).map(
            (_, index) => {
              return (
                <div data-testid="emptyStar" key={index}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray300"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="currentColor"
                      d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                    />
                  </svg>
                </div>
              );
            }
          )}
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-red-600 font-bold text-xl">
            ${product.salesPrice}
          </span>
          <span className="line-through text-gray-400 text-sm">
            ${product.regularPrice}
          </span>
        </div>
        <button
          title="Add to Cart"
          className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        ></button>
      </div>
    </div>
  );
}

export default WishlistCard;

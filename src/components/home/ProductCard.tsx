import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import Cart from '@/interfaces/cart';
import {
  addToWishlist,
  removeFromWishlist,
} from '@/features/Products/ProductSlice';
import { Product } from '@/types/Product';
import { addCartItem, removeCartItem } from '@/features/Cart/cartSlice';
import { showSuccessToast, showErrorToast } from '@/utils/ToastConfig';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [cartId, setCartId] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.signIn);
  const { wishlistProducts } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.signIn.user);

  const isInWishlist = (prod: Product, wishlistProds: Product[]) => {
    return wishlistProds?.some((wishlistProd) => wishlistProd.id === prod.id);
  };

  function handleAddtoCart(e: React.MouseEvent<HTMLButtonElement>) {
    if (!token) {
      showErrorToast('Please login to add items to cart');
      navigate('/signin');
      return;
    }

    const element = e.target as HTMLElement;
    const isRemoving = element.classList.contains('bg-red-600');

    if (isRemoving && !cartId) {
      showErrorToast('Invalid cart item');
      return;
    }

    const action =
      isRemoving && cartId
        ? dispatch(removeCartItem(cartId))
        : dispatch(addCartItem({ productId: product.id, quantity: 1 }));

    const sibling = isRemoving ? element.nextSibling : element.previousSibling;

    if (sibling) {
      (sibling as HTMLElement).style.setProperty('display', 'inline');
      element.style.setProperty('display', 'none');
    }

    action.then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        if (
          !isRemoving &&
          res.payload &&
          typeof res.payload === 'object' &&
          'id' in res.payload
        ) {
          setCartId((res.payload as Cart).id);
          showSuccessToast('Product added to cart');
        } else if (isRemoving) {
          setCartId(null);
          showSuccessToast('Product removed from cart');
        }
      } else if (res.meta.requestStatus === 'rejected') {
        showErrorToast((res.payload as string) || 'Operation failed');
      }
    });
  }
  return (
    <div className="shadow-lg rounded-lg relative">
      <button
        type="button"
        className="bg-transparent"
        onClick={() => navigate(`/product-details/${product.id}`)}
      >
        <img
          src={
            product.image.startsWith('https') || product.image.startsWith('/')
              ? product.image
              : 'https://imageplaceholder.net/600x500'
          }
          alt={product.name}
          className="w-full h-40 object-cover rounded-tl-lg rounded-tr-lg shadow-md transition-transform transform hover:scale-105"
        />
      </button>
      <span className="absolute top-2 right-2 text-white bg-red-600 py-1 px-3 font-semibold rounded-lg text-xs shadow">
        {`${Math.round((product.regularPrice - product.salesPrice) / product.regularPrice / 0.01)}% Off`}
      </span>
      <div
        className="p-4 flex flex-col gap-2"
        style={{
          fontFamily:
            'Poppins, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Liberation Sans, sans-serif',
        }}
      >
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-md font-semibold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={() => navigate(`/product-details/${product.id}`)}
          >
            {product.name.substring(0, 15)}
            {product.name.length > 15 && '...'}
          </button>
          {user?.userType.name !== 'Vendor' &&
            (isInWishlist(product, wishlistProducts) ? (
              <FaHeart
                color="#FFA500"
                size={24}
                className="cursor-pointer hover:text-red-500 transition-colors"
                onClick={() =>
                  dispatch(removeFromWishlist({ id: product.id, token }))
                }
              />
            ) : (
              <FaRegHeart
                color="#565D6D"
                size={24}
                className="cursor-pointer hover:text-red-500 transition-colors"
                onClick={() =>
                  dispatch(addToWishlist({ token, id: product.id }))
                }
              />
            ))}
        </div>
        <p className="text-gray-500 tracking-wide font-light text-sm">
          {product.shortDesc.substring(0, 30)}
          {product.shortDesc.length > 30 && '...'}
        </p>
        <div className="flex items-center gap-2 py-2 w-fit">
          <div className="flex items-center font-medium gap-2 relative w-fit">
            <span className="text-lg">{product.averageRating}</span>

            {Array.from({ length: Math.floor(product.averageRating) }).map(
              (_, index) => {
                return (
                  <div data-testid="ratingStar" key={index}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
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
              {product.averageRating % 1 !== 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 36 36"
                  data-testid="halfStar"
                >
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset={`${(product.averageRating - Math.floor(product.averageRating)) * 100}%`}
                        style={{
                          stopColor: 'rgb(250 204 21)',
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset={`${(product.averageRating - Math.floor(product.averageRating)) * 100}%`}
                        style={{
                          stopColor: 'rgb(156 163 175)',
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
              )}
            </div>
          </div>
          {Array.from({ length: Math.floor(5 - product.averageRating) }).map(
            (_, index) => {
              return (
                <div data-testid="emptyStar" key={index}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
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
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-4 items-center">
            <span className="text-red-700 font-bold text-xl">
              ${product.salesPrice}
            </span>
            <span className="line-through text-gray-400 text-sm">
              ${product.regularPrice}
            </span>
          </div>
          <button type="button" onClick={handleAddtoCart}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="bg-red-600 text-white h-8 w-8 rounded p-2 cursor-pointer hover:bg-red-700 transition-colors duration-200"
              style={{ display: cartId ? 'block' : 'none' }}
              id="removeFromCart"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 12H4"
                color="currentColor"
              ></path>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="bg-primary text-white h-10 w-10 rounded p-2 cursor-pointer hover:bg-orange-700 transition-colors duration-200"
              viewBox="0 0 256 256"
              data-testid="addToCart"
              style={{ display: cartId ? 'none' : 'block' }}
            >
              <path
                fill="currentColor"
                d="M222 128a6 6 0 0 1-6 6h-82v82a6 6 0 0 1-12 0v-82H40a6 6 0 0 1 0-12h82V40a6 6 0 0 1 12 0v82h82a6 6 0 0 1 6 6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

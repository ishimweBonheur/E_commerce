import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import { IoClose } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import Button from '@/components/form/Button';
import { addCartItem, removeCartItem } from '@/features/Cart/cartSlice';
import Cart from '@/interfaces/cart';
import {
  addToWishlist,
  fetchProductDetails,
  removeFromWishlist,
  submitReview,
} from '@/features/Products/ProductSlice';
import { Product } from '@/types/Product';
import { showSuccessToast } from '@/utils/ToastConfig';
import { fetchBestSellingProducts } from '@/features/Popular/bestSellingProductSlice';

interface IProduct extends Product {
  similarProducts: Product[];
  totalQtySold: number;
}

function SimilarProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col xs:w-full lg:w-60 h-60 border border-grayLight overflow-hidden rounded-md">
      <button
        type="button"
        className="absolute top-2 right-2 flex p-2 items-center rounded-2xl bg-blueBg text-white text-xs"
      >
        {Math.round(
          (product.regularPrice - product.salesPrice) /
            product.regularPrice /
            0.01
        )}
        % Off
      </button>
      <button
        type="button"
        className="w-full h-[65%]"
        onClick={() => navigate(`/product-details/${product.id}`)}
      >
        <img
          src={product.image}
          alt="prodImg"
          className="w-full h-full object-cover"
        />
      </button>
      <div className="flex-1 flex flex-col justify-between pt-2 pb-4 px-2">
        <button
          type="button"
          className="flex items-center justify-start text-base font-semibold text-gray-800 cursor-pointer"
          onClick={() => navigate(`/product-details/${product.id}`)}
        >
          {product.name.substring(0, 17)}
          {product.name.length > 17 && '...'}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center font-medium gap-2 relative w-fit">
            <div className="flex items-center font-medium gap-2 relative w-fit">
              <span className="">{product.averageRating}</span>
              {Array.from({ length: Math.floor(product.averageRating) }).map(
                (_, index) => {
                  return (
                    <div data-testid="ratingStar" key={index}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
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
                  className="h-6 w-6"
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
              </div>
            </div>
            {Array.from({ length: Math.floor(4 - product.averageRating) }).map(
              (_, index) => {
                return (
                  <div data-testid="emptyStar" key={index}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-400"
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
          <h2>${product.salesPrice}</h2>
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  const product = useAppSelector((state) => state.products.productDetails);
  const { productDetailsLoading } = useAppSelector((state) => state.products);
  const bestSellers = useAppSelector(
    (state) => state.bestSellingProducts.bestSellingProduct
  );
  const { token } = useAppSelector((state) => state.signIn);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [newReview, setNewReview] = useState(false);
  const [reviewForm, setReviewForm] = useState<{
    rating: number | null;
    content: string;
    productId: number | undefined;
  }>({ rating: null, content: '', productId: product?.id });
  const [toggleLoginOverlay, setToggleLoginOverlay] = useState(false);
  const [isVisible, setIsVisible] = useState({ state: true, name: 'details' });
  const [activeImg, setActiveImg] = useState('');
  const [cartId, setCartId] = useState<number | null>(null);
  const { wishlistProducts } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.signIn.user);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveImg(product?.image || '');
  }, [product]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(parseInt(id, 10)));
    }
  }, [dispatch, newReview, id]);

  useEffect(() => {
    dispatch(fetchBestSellingProducts());
  }, [dispatch]);

  const isBestSeller = (prod: IProduct, bestSellerProds: Product[]) => {
    return bestSellerProds.some(
      (bestSellerProd) => bestSellerProd.id === prod.id
    );
  };

  const isInWishlist = (prod: Product, wishlistProds: Product[]) => {
    return wishlistProds?.some((wishlistProd) => wishlistProd.id === prod.id);
  };

  const handleAddtoCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const element = e.target as HTMLElement;
    const [, message, action] =
      element.textContent === 'Remove from Cart'
        ? [
            (element.textContent = 'Add to Cart'),
            'Product Removed From Cart',
            dispatch(removeCartItem(cartId as number)),
          ]
        : [
            (element.textContent = 'Remove from Cart'),
            'Product added to cart',
            dispatch(addCartItem({ productId: product!.id, quantity: 1 })),
          ];
    action.then((res) => {
      setCartId((res.payload as Cart).id || null);
      showSuccessToast(message);
    });
  };

  const handleCheckout = () => {
    // First add to cart if not already in cart
    if (!cartId) {
      dispatch(addCartItem({ productId: product!.id, quantity: 1 })).then(
        () => {
          navigate('/checkout');
        }
      );
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full xs:min-h-[35rem] lg:min-h-80 p-8">
      {!productDetailsLoading && !product && (
        <div className="absolute top-[40%] text-xl text-grey">
          Failed to load product details
        </div>
      )}
      {productDetailsLoading && (
        <div className="absolute top-[40%] flex flex-col items-center gap-4">
          <ClipLoader size={50} color="#6D31ED" />
          <h1 className="text-grey">Just a sec! We are almost there</h1>
        </div>
      )}
      {toggleLoginOverlay && (
        <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
          <div className="relative flex flex-col w-[30rem] h-60 bg-white rounded-lg">
            <div className="w-full p-4 py-2 border-b border-greyLight text-xl">
              Error
            </div>
            <IoClose
              color="black"
              size="25"
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setToggleLoginOverlay(false)}
            />
            <div className="flex flex-1 flex-col justify-between items-center p-4 pb-6">
              <p className="text-grey">
                Only logged in users are allowed to submit product reviews.
                Please login or create an account if you do not have one
              </p>
              <Button title="Go to login" path="/signIn" />
            </div>
          </div>
        </div>
      )}
      <h1 className="self-start">
        <Link to="/shop" className="text-linkGrey">
          Shop
        </Link>{' '}
        &gt; {(!productDetailsLoading && product?.name) || 'Product Details'}
      </h1>
      {!productDetailsLoading && product && (
        <div className="flex xs:flex-col lg:flex-row xs:w-full lg:w-[90%] xs:gap-8 lg:gap-0 mt-8">
          <div className="flex flex-col xs:w-full lg:w-3/5 h-[30rem] justify-between">
            <div className="w-full h-[73%] rounded-md overflow-hidden hover:border-[2px] border-primary">
              <img
                src={activeImg}
                alt="prodImg"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-4 w-full h-[23%] rounded-md overflow-hidden">
              {product.gallery.map((image) => (
                <button
                  type="button"
                  className="w-1/4 h-full rounded-md overflow-hidden hover:border-[2px] border-primary"
                  key={crypto.randomUUID()}
                  onClick={() => setActiveImg(image)}
                >
                  <img
                    src={image}
                    alt="galleryImg"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col xs:w-full lg:w-2/5 justify-between h-[30rem] rounded-md overflow-hidden lg:px-4">
            <div className="flex items-center gap-4 w-full">
              <h2 className="font-semibold text-lg">
                {product.name.slice(0, 25)}
                {product.name.length > 25 ? '...' : ''}
              </h2>
              {isBestSeller(product, bestSellers) && (
                <button
                  type="button"
                  className="flex px-2 py-1 items-center rounded-2xl bg-blueBg text-white text-xs"
                >
                  Best Seller
                </button>
              )}
            </div>
            <div
              className="flex items-center justify-between w-full"
              id="rating-div"
            >
              <div className="flex items-center font-medium gap-2 relative w-fit">
                <div className="flex items-center font-medium gap-2 relative w-fit">
                  <span className="">{product.averageRating}</span>
                  {Array.from({
                    length: Math.floor(product.averageRating),
                  }).map((_, index) => {
                    return (
                      <div data-testid="ratingStar" key={index}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary"
                          viewBox="0 0 36 36"
                        >
                          <path
                            fill="currentColor"
                            d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                          />
                        </svg>
                      </div>
                    );
                  })}
                  <div>
                    {product.averageRating % 1 !== 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                {Array.from({
                  length: Math.floor(5 - product.averageRating),
                }).map((_, index) => {
                  return (
                    <div data-testid="emptyStar" key={index}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="currentColor"
                          d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-linkGrey">
                <span className="text-black font-semibold">
                  {product.reviews.length}
                </span>{' '}
                Reviews
              </h2>
              <h2 className="text-linkGrey">
                <span className="text-black font-semibold">
                  {product.totalQtySold}
                </span>{' '}
                Products sold
              </h2>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-red-700 font-bold text-3xl">
                ${product.salesPrice}
              </span>
              <span className="line-through text-gray-500 text-xl">
                ${product.regularPrice}
              </span>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <h2 className="m-0">Promotion</h2>
              <div className="p-2 w-fit rounded-md text-xs flex items-center justify-center bg-violeteBg text-primary">
                {Math.round(
                  (product.regularPrice - product.salesPrice) /
                    product.regularPrice /
                    0.01
                )}
                % Off
              </div>
            </div>
            <div className="w-full flex items-center gap-4">
              <button
                type="button"
                onClick={handleAddtoCart}
                className="flex items-center justify-center border border-primary text text-primary rounded-md text-sm h-11 w-40"
              >
                Add to Cart
              </button>
              <Button title="Checkout" styles="w-40" onClick={handleCheckout} />
            </div>
            <div className="flex items-center gap-4 w-full">
              {user?.userType.name !== 'Vendor' && (
                <>
                  {isInWishlist(product, wishlistProducts) ? (
                    <FaHeart
                      color="#6D31ED"
                      size={20}
                      className="cursor-pointer"
                      onClick={() =>
                        dispatch(removeFromWishlist({ id: product.id, token }))
                      }
                    />
                  ) : (
                    <FaRegHeart
                      color="#9CA3AF"
                      size={20}
                      className="cursor-pointer"
                      onClick={() =>
                        dispatch(addToWishlist({ token, id: product.id }))
                      }
                    />
                  )}
                  <h2>Add to wishlist</h2>
                </>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-grey mr-2">Tags:</span>
              {product.tags.map((tag, i) => (
                <h2 className="m-0" key={crypto.randomUUID()}>
                  {i !== 0 && ', '}
                  {tag}
                </h2>
              ))}
            </div>
          </div>
        </div>
      )}
      {!productDetailsLoading && product && (
        <div className="flex xs:w-full lg:w-[90%] flex-col gap-4 mt-20">
          <div className="flex items-center">
            <button
              type="button"
              className={`lg:text-xl xs:text-sm text-grey font-semibold px-4 py-2 ${isVisible.name === 'details' && 'border-b-[2px] border-primary text-primary'}`}
              onClick={() => setIsVisible({ state: true, name: 'details' })}
            >
              Product Details
            </button>
            <button
              type="button"
              className={`lg:text-xl xs:text-sm text-grey font-semibold px-4 py-2 ${isVisible.name === 'reviews' && 'border-b-[2px] border-primary text-primary'}`}
              onClick={() => setIsVisible({ state: true, name: 'reviews' })}
            >
              Reviews ({product.reviews.length})
            </button>
            <button
              type="button"
              className={`lg:text-xl xs:text-sm text-grey font-semibold px-4 py-2 ${isVisible.name === 'about' && 'border-b-[2px] border-primary text-primary'}`}
              onClick={() => setIsVisible({ state: true, name: 'about' })}
            >
              About Store
            </button>
          </div>
          {isVisible.state && isVisible.name === 'details' && (
            <div className="flex flex-col gap-6 xs:w-full lg:w-4/5 pt-4">
              <div className="flex flex-col gap-4 w-full">
                <h2 className="font-semibold">Short Description</h2>
                <p className="font-light text-justify">{product.shortDesc}</p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <h2 className="font-semibold">Long Description</h2>
                <p className="font-light text-justify">{product.longDesc}</p>
              </div>
            </div>
          )}
          {isVisible.state && isVisible.name === 'about' && (
            <div className="flex flex-col gap-6 xs:w-full lg:w-4/5 pt-4">
              <div className="flex items-center gap-6 xs:flex-col lg:flex-row xs:w-full lg:w-fit">
                <div className="w-[5.6rem] h-[5.6rem] rounded-full border-[2px] border-primary flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={product.vendor.picture}
                      alt="vendorImg"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 xs:items-center lg:items-start xs:w-full lg:w-fit">
                  <h2 className="xs:hidden lg:flex font-semibold">
                    Vendor Name:
                    <span className="font-light text-grey ml-2">
                      {`${product.vendor.firstName} ${product.vendor.lastName}`}
                    </span>
                  </h2>
                  <h2 className="xs:hidden lg:flex font-semibold">
                    Vendor Email:
                    <span className="font-light text-grey ml-2">
                      {product.vendor.email}
                    </span>
                  </h2>
                  <h2 className="xs:flex lg:hidden text-grey font-semibold">
                    {`${product.vendor.firstName} ${product.vendor.lastName}`}
                  </h2>
                  <h2 className="xs:flex lg:hidden text-grey font-light">
                    {product.vendor.email}
                  </h2>
                </div>
              </div>
            </div>
          )}
          {isVisible.state && isVisible.name === 'reviews' && (
            <div className="flex flex-col gap-6 xs:w-full lg:w-4/5 pt-4">
              {token && (
                <div className="flex flex-col gap-4 w-full p-4 border border-gray-200 rounded-lg mb-6">
                  <h2 className="font-semibold text-lg">Write a Review</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewForm({ ...reviewForm, rating: star })
                          }
                          className="focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 ${
                              reviewForm.rating && star <= reviewForm.rating
                                ? 'text-primary'
                                : 'text-gray-300'
                            }`}
                            viewBox="0 0 36 36"
                          >
                            <path
                              fill="currentColor"
                              d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, content: e.target.value })
                    }
                    placeholder="Write your review here..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!reviewForm.rating || !reviewForm.content) {
                        showSuccessToast(
                          'Please provide both rating and review content'
                        );
                        return;
                      }
                      try {
                        await dispatch(
                          submitReview({
                            content: reviewForm.content,
                            rating: reviewForm.rating,
                            productId: product!.id,
                            token,
                          })
                        ).unwrap();
                        showSuccessToast('Review submitted successfully!');
                        setReviewForm({
                          rating: null,
                          content: '',
                          productId: product?.id,
                        });
                        setNewReview((prev) => !prev);
                      } catch (error) {
                        showSuccessToast(error as string);
                      }
                    }}
                    className="self-end px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              )}
              {product?.reviews.length === 0 && (
                <div className="text-grey font-medium">No reviews found</div>
              )}
              {product?.reviews.map((productReview) => (
                <div
                  className="flex flex-col w-full gap-4"
                  key={crypto.randomUUID()}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
                      <img
                        src={productReview.user.picture}
                        alt="profImg"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="font-semibold">{`${productReview.user.firstName} ${productReview.user.lastName}`}</h2>
                      <div className="flex items-center font-medium gap-2 relative w-fit">
                        <div className="flex items-center font-medium gap-2 relative w-fit">
                          <span className="">{productReview.rating}</span>
                          {Array.from({
                            length: Math.floor(productReview.rating),
                          }).map((_, index) => (
                            <div data-testid="ratingStar" key={index}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-primary"
                                viewBox="0 0 36 36"
                              >
                                <path
                                  fill="currentColor"
                                  d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379"
                                />
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="font-light">{productReview.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!productDetailsLoading && product && (
        <div className="flex xs:w-full lg:w-[90%] flex-col items-start mt-20">
          <h1 className="mb-2 text-2xl font-semibold">Similar Products</h1>
          <h3 className="text-sm text-linkGrey mb-4">
            Dont miss this opportunity at a special discount just for this week.
          </h3>
          <div className="w-full flex-wrap flex gap-4">
            {product.similarProducts.map((item: Product) => {
              if (item.id !== product.id) {
                return (
                  <SimilarProductCard
                    product={item}
                    key={crypto.randomUUID()}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;

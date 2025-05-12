import { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import WishlistCard from '@/components/WishlistCard';
import { fetchWishlistProducts } from '@/features/Products/ProductSlice';

function Wishlist() {
  const dispatch = useAppDispatch();
  const { wishlistProducts, wishlistLoading } = useAppSelector(
    (state) => state.products
  );
  const { token } = useAppSelector((state) => state.signIn);

  useEffect(() => {
    dispatch(fetchWishlistProducts(token));
  }, [dispatch, token]);

  return (
    <div className="flex flex-col w-full items-center min-h-80 p-8 gap-8">
      {wishlistLoading && wishlistProducts.length === 0 && (
        <div className="absolute top-[40%] flex flex-col items-center gap-4">
          <ClipLoader size={50} color="#6D31ED" />
          <h1 className="text-grey">Just a sec! We are almost there</h1>
        </div>
      )}
      <h1 className="text-2xl font-semibold self-start">
        My Wishlist{' '}
        <span className="text-grey">({wishlistProducts?.length} items)</span>
      </h1>
      <div className="w-full flex flex-wrap gap-4">
        {!wishlistLoading && wishlistProducts.length === 0 && (
          <div className="text-grey font-medium">
            You currently have no products in your wishlist
          </div>
        )}
        {wishlistProducts.map((product) => (
          <WishlistCard product={product} key={crypto.randomUUID()} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;

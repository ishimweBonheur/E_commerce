import { useEffect, useState } from 'react';
import CartItem from './CartItem';
import HSButton from '../form/HSButton';
import ProductCard from '../home/ProductCard';
import { RootState } from '@/app/store';
import { Product } from '@/types/Product';
import {
  selectProducts,
  fetchProducts,
} from '@/features/Products/ProductSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCartItems, fetchCartItems } from '@/features/Cart/cartSlice';

export default function Cart() {
  const products: Product[] = useAppSelector((state: RootState) =>
    selectProducts(state)
  );

  const cartItems = useAppSelector((state: RootState) =>
    selectCartItems(state)
  );
  const total = cartItems.reduce(
    (acc, item) => acc + item.product.salesPrice * item.quantity,
    0
  );

  const [viewAll, setViewAll] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCartItems());
  }, [dispatch]);
  return (
    <div className="flex flex-col max-w-screen-lg mx-auto items-center">
      <div className="flex w-full justify-between items-center py-6 max-w-screen-md sticky top-0 bg-white">
        <h1 className="text-2xl font-bold px-8">Products in cart</h1>
        <div className="flex gap-48 text-sm font-light text-gray-500">
          <span>{cartItems.length} products</span>
          <button
            type="button"
            className="gap-2 flex items-center"
            onClick={() => setViewAll((prev) => !prev)}
          >
            <span>{viewAll ? 'view few' : 'View all'}</span>
            <svg
              className={`${viewAll ? 'hidden' : 'flex'}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.66699 12.9273L5.73972 14L11.7397 8L5.73972 2L4.66699 3.07273L9.59423 8L4.66699 12.9273Z"
                fill="#9095A1"
              />
            </svg>
            <span className="hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="w-fit">
        {viewAll &&
          cartItems.map((item) => (
            <CartItem
              id={item.id}
              quantity={item.quantity}
              image={item.product.image}
              price={item.product.salesPrice}
              name={item.product.name}
              key={item.id}
            />
          ))}
        {!viewAll &&
          cartItems
            .slice(0, 3)
            .map((item) => (
              <CartItem
                id={item.id}
                image={item.product.image}
                quantity={item.quantity}
                price={item.product.salesPrice}
                name={item.product.name}
                key={item.id}
              />
            ))}
        <div className="flex justify-end gap-20 py-6 items-center sticky bottom-0 bg-white">
          {cartItems.length > 0 && (
            <div className="flex gap-2 items-center">
              <h2 className="text-2xl font-bold text-gray-900">Total:</h2>
              <span className="text-xl font-medium text-primary">${total}</span>
            </div>
          )}
          {cartItems.length === 0 && (
            <h2 className="text-2xl font-bold text-gray-900">Cart Empty</h2>
          )}
          {cartItems.length > 0 && (
            <HSButton title="CHECKOUT" path="/checkout" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <div>Recommended Products</div>
        <div className="flex justify-between">
          {products.slice(0, 4).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

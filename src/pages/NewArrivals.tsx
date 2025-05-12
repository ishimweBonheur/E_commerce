import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from '@/features/Products/ProductSlice';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/Product';

function NewArrivals() {
  const dispatch: AppDispatch = useDispatch();
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Sort products by ID (assuming higher IDs are newer)
  const sortedProducts = [...products].sort((a, b) => b.id - a.id);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Arrivals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default NewArrivals;

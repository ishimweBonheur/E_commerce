import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from '@/features/Products/ProductSlice';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/Product';

function ViewCollection() {
  const dispatch: AppDispatch = useDispatch();
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching products...');
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts()).unwrap();
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products'
        );
      }
    };
    fetchData();
  }, [dispatch]);

  const featuredProducts = products.filter((product: Product) => {
    console.log(
      'Checking product:',
      product.name,
      'isFeatured:',
      product.isFeatured
    );
    return product.isFeatured;
  });

  console.log('All products:', products);
  console.log('Featured products:', featuredProducts);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center p-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p>No products found. Please check your API connection.</p>
      </div>
    );
  }

  if (!featuredProducts.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Featured Collection</h1>
        <p className="text-center text-gray-600">
          No featured products available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Featured Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ViewCollection;

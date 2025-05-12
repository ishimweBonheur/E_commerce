import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchProducts } from '@/features/Products/ProductSlice';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/Product';

function BrowseCoats() {
  const dispatch: AppDispatch = useDispatch();
  const { products, isLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products in the coats category
  const coatProducts = products.filter(
    (product: Product) =>
      product.category.name.toLowerCase().includes('coat') ||
      product.name.toLowerCase().includes('coat')
  );

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Coats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {coatProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default BrowseCoats;

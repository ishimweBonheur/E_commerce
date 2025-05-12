import ProductCard from './ProductCard';
import { RootState } from '@/app/store';
import { Product } from '@/types/Product';
import { useAppSelector } from '@/app/hooks';
import { selectProducts } from '@/features/Products/ProductSlice';

interface FocusedProps {
  focused: string;
}

function ProductsList({ focused }: FocusedProps) {
  const products: Product[] = useAppSelector((state: RootState) =>
    selectProducts(state)
  );
  const filteredProducts = products.filter(
    (product: Product) => product.category.name === focused
  );

  const list = focused === 'all' ? products : filteredProducts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.length === 0 && (
        <div>
          <h1 className="text-center text-xl text-primary">
            No Products Found
          </h1>
        </div>
      )}
      {list.slice(0, 3).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsList;

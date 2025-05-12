// ProductGridFour.tsx
import ProductCard from './ProductCard';
import { Product } from '@/types/Product';

interface ProductGridProps {
  products: Product[];
}

function ProductGridFour({ products }: ProductGridProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <div>
          <p className="text-center text-xl text-black">No Products Found</p>
        </div>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}

export default ProductGridFour;

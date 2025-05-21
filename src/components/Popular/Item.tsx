import { Capitalize } from '@/utils/capitalize';
import Product from '../../interfaces/product';
import { FaStar } from 'react-icons/fa';

interface MostPopularItemProps {
  product: Product;
}

function SingleItem({ product }: MostPopularItemProps) {
  const discountPercentage = Math.round(
    ((product.regularPrice - product.salesPrice) / product.regularPrice) * 100
  );

  return (
    <a
      href={`product-details/${product.id}`}
      className="flex flex-row items-center gap-4 p-3 rounded-xl hover:bg-gray100/50 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="relative flex items-center justify-center h-24 w-24 overflow-hidden rounded-lg bg-white shadow-sm">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-0 left-0 bg-gray700 text-white text-xs font-semibold px-2 py-1 rounded-br">
            -{discountPercentage}%
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
        <div>
          <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
            {Capitalize(product.name)}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <FaStar className="text-primary w-3 h-3" />
            <span className="text-xs text-gray-600">
              {product.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-gray600 font-semibold text-base">
            ${product.salesPrice.toFixed(2)}
          </p>
          {discountPercentage > 0 && (
            <p className="text-gray-400 line-through text-xs">
              ${product.regularPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

export default SingleItem;

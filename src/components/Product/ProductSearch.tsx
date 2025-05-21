import React from 'react';

interface ProductSearchProps {
  title: string;
  salesPrice: number;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ title, salesPrice }) => {
  return (
    <div className="product-search">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">
        ${salesPrice}
      </p>
    </div>
  );
};

export default ProductSearch; 
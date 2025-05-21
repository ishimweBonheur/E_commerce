import React from 'react';

interface ProductSortProps {
  title: string;
  salesPrice: number;
}

const ProductSort: React.FC<ProductSortProps> = ({ title, salesPrice }) => {
  return (
    <div className="product-sort">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">${salesPrice}</p>
    </div>
  );
};

export default ProductSort;

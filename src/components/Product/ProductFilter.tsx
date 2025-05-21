import React from 'react';

interface ProductFilterProps {
  title: string;
  salesPrice: number;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ title, salesPrice }) => {
  return (
    <div className="product-filter">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">
        ${salesPrice}
      </p>
    </div>
  );
};

export default ProductFilter; 
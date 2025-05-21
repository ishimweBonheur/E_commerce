import React from 'react';

interface ProductCompareProps {
  title: string;
  salesPrice: number;
}

const ProductCompare: React.FC<ProductCompareProps> = ({
  title,
  salesPrice,
}) => {
  return (
    <div className="product-compare">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">${salesPrice}</p>
    </div>
  );
};

export default ProductCompare;

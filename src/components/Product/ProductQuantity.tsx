import React from 'react';

interface ProductQuantityProps {
  title: string;
  salesPrice: number;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({ title, salesPrice }) => {
  return (
    <div className="product-quantity">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">
        ${salesPrice}
      </p>
    </div>
  );
};

export default ProductQuantity; 
import React from 'react';

interface ProductCardProps {
  title: string;
  salesPrice: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, salesPrice }) => {
  return (
    <div className="product-card">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">${salesPrice}</p>
    </div>
  );
};

export default ProductCard;

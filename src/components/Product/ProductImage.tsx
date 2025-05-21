import React from 'react';

interface ProductImageProps {
  title: string;
  salesPrice: number;
}

const ProductImage: React.FC<ProductImageProps> = ({ title, salesPrice }) => {
  return (
    <div className="product-image">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">${salesPrice}</p>
    </div>
  );
};

export default ProductImage;

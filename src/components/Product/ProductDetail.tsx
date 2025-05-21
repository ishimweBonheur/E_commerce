import React from 'react';

interface ProductDetailProps {
  title: string;
  salesPrice: number;
  description: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  title,
  salesPrice,
  description,
}) => {
  return (
    <div className="product-detail">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">${salesPrice}</p>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Description</h4>
        <p className="text-gray600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;

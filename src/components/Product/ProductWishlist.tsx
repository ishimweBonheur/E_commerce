import React from 'react';

interface ProductWishlistProps {
  title: string;
  salesPrice: number;
}

const ProductWishlist: React.FC<ProductWishlistProps> = ({
  title,
  salesPrice,
}) => {
  return (
    <div className="product-wishlist">
      <h3 className="font-medium text-gray800 text-sm line-clamp-2 group-hover:text-gray600 transition-colors">
        {title}
      </h3>
      <p className="text-gray600 font-semibold text-base">${salesPrice}</p>
    </div>
  );
};

export default ProductWishlist;

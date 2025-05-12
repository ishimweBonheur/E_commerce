import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchProducts } from '@/features/Products/ProductSlice';
import { fetchCategories } from '@/features/Products/categorySlice';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/Product';
import ClipLoader from 'react-spinners/ClipLoader';

function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [categoryName, setCategoryName] = useState('');
  const products = useAppSelector(
    (state: RootState) => state.products.products
  );
  const categories = useAppSelector(
    (state: RootState) => state.categories.categories
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.products.isLoading
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch both products and categories
        await Promise.all([
          dispatch(fetchProducts()).unwrap(),
          dispatch(fetchCategories()).unwrap(),
        ]);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      }
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    // Set category name when categories are loaded
    const category = categories.find((cat) => cat.id === Number(categoryId));
    if (category) {
      setCategoryName(category.name);
    }
  }, [categories, categoryId]);

  // Debug logs
  console.log('Category ID:', categoryId);
  console.log('All Products:', products);
  console.log('All Categories:', categories);

  // Filter products by category
  const filteredProducts = products.filter((product: Product) => {
    // Check if the product's category name matches any category with the given ID
    const matchingCategory = categories.find(
      (cat) => cat.id === Number(categoryId)
    );
    return matchingCategory && product.category?.name === matchingCategory.name;
  });

  console.log('Filtered Products:', filteredProducts);

  const handleProductClick = (productId: number) => {
    navigate(`/product-details/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <ClipLoader size={50} color="#6D31ED" />
          <p className="text-gray-500 mt-4">Capitalize(loading products...)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName} Products
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryProducts;

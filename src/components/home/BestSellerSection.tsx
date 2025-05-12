import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionHeader from './SectionHeaderCta';
import ProductGridFour from './ProductGridFour';
import { RootState, AppDispatch } from '@/app/store';
import { fetchBestSellingProducts } from '@/features/Popular/bestSellingProductSlice';

function BestSellerSection() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.bestSellingProducts.bestSellingProduct
  );
  const status = useSelector(
    (state: RootState) => state.bestSellingProducts.status
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBestSellingProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading best-selling products.</div>;
  }

  const latestProducts = products.slice(0, 4);

  return (
    <div className="w-full mx-auto my-8 md:mt-12 px-16">
      <SectionHeader
        title="Best Seller"
        description="Don't miss this opportunity at a special discount just for this week."
        link={{ url: '/shop', text: 'View All' }}
      />
      <ProductGridFour products={latestProducts} />
    </div>
  );
}

export default BestSellerSection;

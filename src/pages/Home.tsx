import { useEffect } from 'react';
import CategoriesSection from '@/components/home/categories';
import HelloSection from '../components/HelloSection/HelloSection';
import BannerSection from '@/components/bannerAds/bannerSection';
import PopularSection from '@/components/Popular/Popular_section';
import BestSellerSection from '../components/home/BestSellerSection';
import FeaturedSection from '../components/home/FeaturedSection';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchWishlistProducts } from '@/features/Products/ProductSlice';

function Home() {
  const { token } = useAppSelector((state) => state.signIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchWishlistProducts(token));
  }, [dispatch, token]);

  return (
    <main>
      <div className="relative ">
        <HelloSection />
      </div>
      <div className="my-10">
        <CategoriesSection />
      </div>
      <div className="flex w-full h-auto py-8">
        <BannerSection />
      </div>
      <div className='flex flex-row justify-center items-center bg-white pb-10 pt-2'>
        <FeaturedSection />
      </div>
      <div>

      <BestSellerSection />
      </div>

      <div className="flex flex-row justify-center items-center  bg-white pb-10 pt-2">
        <PopularSection />
      </div>
    </main>
  );
}
export default Home;

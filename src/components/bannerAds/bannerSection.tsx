import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { fetchBannerProducts } from '@/app/bannerAds/BannerSlice';
import BannerAd from '@/components/bannerAds/bannerAds';

function BannerSection() {
  const dispatch: AppDispatch = useDispatch();
  const { items: banners, status } = useSelector(
    (state: RootState) => state.banners
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBannerProducts())
        .unwrap()
        .then((data) => {
          console.log('Banner products loaded:', data);
        })
        .catch((error) => {
          console.error('Error loading banner products:', error);
        });
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="w-full flex justify-center items-center p-8 text-red-500">
        Failed to load banner products. Please try again later.
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full flex justify-center items-center p-8 text-gray-500">
        No banner products available at the moment.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center xs:px-4 lg:p-0">
      <div className="flex lg:w-[90%] xs:w-full flex-wrap md:flex-nowrap justify-center gap-8">
        {banners.map((banner) => {
          console.log('Rendering banner:', banner);
          return (
            <BannerAd
              key={banner.id}
              s_title="Only This Week"
              title={banner.name}
              description={banner.shortDesc}
              image={banner.image}
              productId={banner.id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BannerSection;

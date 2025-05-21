// src/pages/LandingPage.tsx
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MostPopular from './MostPopular';
import MostRecent from './MostRecent';
import MostSelling from './MostSelling';
import BannerAD from './BannerAD';
import { fetchAvailableProducts } from '@/features/Popular/availableProductSlice';
import { AppDispatch } from '../../app/store';

type SectionType = 'popular' | 'recent' | 'selling';

function PopularSection() {
  const dispatch: AppDispatch = useDispatch();
  const [activeSection, setActiveSection] = useState<SectionType>('popular');

  useEffect(() => {
    dispatch(fetchAvailableProducts());
  }, [dispatch]);

  const sections = [
    { id: 'popular', title: 'Most Popular', component: MostPopular },
    { id: 'recent', title: 'Recent Products', component: MostRecent },
    { id: 'selling', title: 'Most Selling', component: MostSelling },
  ];

  return (
    <section className="bg-gray-50/50 py-8 max-w-7xl">
      <div className=" mx-auto ">
        <BannerAD />
        <div className="mt-8">
          {/* Section Tabs */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SectionType)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  activeSection === section.id
                    ? 'border-b border-b-3 border-gray600 text-gray800'
                    : 'bg-white text-gray600 hover:border-b border-b-3 border-gray200'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          <div className="relative overflow-hidden">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  sections.findIndex((s) => s.id === activeSection) * 100
                }%)`,
              }}
            >
              <div className="flex">
                {sections.map((section) => (
                  <div key={section.id} className="w-full flex-shrink-0">
                    <section.component />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularSection;

import { useState, useEffect } from 'react';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import img1 from '@/assets/360_F_458406888_GhaARrvDMxUEI8G0ybS7gxUQRBSEcGES.jpg';
import img2 from '@/assets/89163136_108185537454469_8342778628777443328_n.jpg';
import img3 from '@/assets/istockphoto-1155467348-612x612.jpg';

function HeroBanner() {
  const navigate = useNavigate();
  const slides = [
    {
      id: 1,
      title: 'Summer Collection',
      subtitle: 'Discover the hottest styles of the season',
      ctaPrimary: 'Shop Now',
      ctaSecondary: 'New Arrivals',
      image: img1,
      bgColor: 'bg-gradient-to-r from-primary to-primary-dark',
    },
    {
      id: 2,
      title: 'Limited Edition',
      subtitle: 'Exclusive pieces for a limited time',
      ctaPrimary: 'Shop Now',
      ctaSecondary: 'View Collection',
      image: img2,
      bgColor: 'bg-gradient-to-r from-primary to-primary-light',
    },
    {
      id: 3,
      title: 'Winter Essentials',
      subtitle: 'Stay warm in style this winter',
      ctaPrimary: 'Shop Now',
      ctaSecondary: 'Browse Coats',
      image: img3,
      bgColor: 'bg-gradient-to-r from-primary-dark to-primary',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[90vh] max-h-[800px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${slide.bgColor} ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="container mx-auto  relative z-20">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {slide.ctaPrimary}
                    <HiOutlineArrowNarrowRight className="ml-2 text-primary" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (slide.ctaSecondary === 'New Arrivals') {
                        navigate('/new-arrivals');
                      } else if (slide.ctaSecondary === 'View Collection') {
                        navigate('/view-collection');
                      } else if (slide.ctaSecondary === 'Browse Coats') {
                        navigate('/browse-coats');
                      }
                    }}
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    {slide.ctaSecondary}
                  </button>
                </div>
              </div>
            </div>

            {/* Background image with proper sizing */}
            <div className="absolute inset-0 z-10">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover object-center"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    height: '100%',
                    maxWidth: 'none',
                    maxHeight: 'none',
                  }}
                  loading="eager"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <FiArrowLeft size={24} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <FiArrowRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-primary w-6 shadow-md'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-primary transition-all duration-5000 ease-linear"
          style={{
            width: isAutoPlaying ? '100%' : '0%',
            animation: isAutoPlaying ? 'progress 5s linear' : 'none',
          }}
          key={currentSlide}
        />
      </div>
    </div>
  );
}

export default HeroBanner;

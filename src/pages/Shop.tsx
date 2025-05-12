import { FaAngleDown, FaStar } from 'react-icons/fa6';

import { IoSearchOutline, IoClose } from 'react-icons/io5';
import { ChangeEvent, useCallback, useEffect, useState, useRef } from 'react';
import { CiFilter } from 'react-icons/ci';

import { Link } from 'react-router-dom';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

import ReactSlider from 'react-slider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Skeleton from 'react-loading-skeleton';
import { fetchCategories } from '@/features/Products/categorySlice';
import {
  searchProducts,
  fetchRecommendedProducts,
  fetchWishlistProducts,
} from '@/features/Products/ProductSlice';
import ProductSkeleton from '@/components/home/ProductSkeleton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import ProductCard from '@/components/home/ProductCard';
import HSInput from '@/components/form/HSInput';
import Button from '@/components/form/Button';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Product, Category } from '@/types/Product';

function ImageSlider({ products }: { products: Product[] }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      navigation
      pagination={{ clickable: true }}
      loop
      className="w-full h-80"
    >
      {products.map((product) => (
        <SwiperSlide
          className="w-full h-full rounded-lg overflow-hidden"
          key={crypto.randomUUID()}
        >
          <div className="w-full h-[90%] bg-sliderBg flex flex-col items-center p-2 gap-2">
            <div className="w-full h-[60%] rounded-md overflow-hidden">
              <img
                src={product.image}
                className="w-full h-full"
                alt="productImage"
              />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <h1 className="font-semibold text-lg">{product.name}</h1>
              <Button title="Try now" />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function Shop() {
  const dispatch = useAppDispatch();
  const { allProducts, recommendedProducts, isLoading, total } = useAppSelector(
    (state) => state.products
  );

  const { token } = useAppSelector((state) => state.signIn);
  const allCategories: Category[] = useAppSelector(
    (state) => state.categories.categories
  );
  const categoryLoading = useAppSelector((state) => state.categories.isLoading);
  const [ratings, setRatings] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleFilterMenu, setToggleFilterMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [sortDirection, setSortDirection] = useState('desc');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const priceRangeRef = useRef(priceRange);
  const searchQueryRef = useRef(searchQuery);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    priceRangeRef.current = priceRange;
  }, [priceRange]);

  const handlePriceInputUpperChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      return;
    }

    const int = parseInt(e.target.value, 10);

    if (int < 0 || int > 100000) {
      return;
    }

    setPriceRange([priceRange[0], int]);
  };

  const handlePriceInputLowerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      return;
    }

    const int = parseInt(e.target.value, 10);

    if (int < 0 || int > 100000) {
      return;
    }

    setPriceRange([int, priceRange[1]]);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCategories([...categories, parseInt(e.target.value, 10)]);
    } else {
      setCategories(
        categories.filter(
          (category) => category !== parseInt(e.target.value, 10)
        )
      );
    }
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setRatings([...ratings, parseInt(e.target.value, 10)]);
    } else {
      setRatings(
        ratings.filter((rating) => rating !== parseInt(e.target.value, 10))
      );
    }
  };

  const handlePageChangeBack = () => {
    if (page === 1) {
      return;
    }

    setPage(page - 1);
  };

  const handlePageChangeForward = () => {
    if (page === Math.ceil(total / 9)) {
      return;
    }

    setPage(page + 1);
  };

  const resetFilters = () => {
    setCategories([]);
    setRatings([]);
    setPriceRange([0, 100000]);
  };

  const handleSearch = useCallback(() => {
    const searchParams = {
      keyword: searchQueryRef.current,
      category: categories,
      rating: ratings,
      page,
      sort: sortDirection,
      minPrice: priceRangeRef.current[0],
      maxPrice: priceRangeRef.current[1],
    };
    dispatch(searchProducts(searchParams));
  }, [categories, ratings, page, sortDirection, dispatch]);

  useEffect(() => {
    handleSearch();
  }, [categories, ratings, page, sortDirection, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    dispatch(searchProducts({}));
    dispatch(fetchCategories());
    dispatch(fetchRecommendedProducts());
    dispatch(fetchWishlistProducts(token));
  }, [dispatch, token]);
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {toggleFilterMenu && (
        <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
          <div className="flex flex-col w-[90%] gap-4 border border-grayLight p-4 rounded-lg bg-white">
            <div className="flex items-center w-full justify-between pb-4 border-b border-grayLight">
              <h3>Filters</h3>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-primary cursor-pointer border-none outline-none flex items-center justify-center"
                  onClick={resetFilters}
                >
                  Clear All
                </button>
                <IoClose
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setToggleFilterMenu(false)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center w-full justify-between">
                <h3 className="font-semibold">Price Range</h3>
                <FaAngleDown size={15} color="black" />
              </div>
              <div className="flex items-center w-full justify-between">
                <div className="flex gap-1 items-center rounded-md bg-grayLight p-1">
                  <img src="/dollar.png" width="15" height="15" alt="dollar" />
                  <input
                    type="text"
                    className="outline-none border-none max-w-12 text-sm bg-transparent"
                    value={priceRange[0]}
                    onChange={handlePriceInputLowerChange}
                    onBlur={handleSearch}
                  />
                </div>
                <h3>to</h3>
                <div className="flex gap-1 items-center rounded-md bg-grayLight p-1">
                  <img src="/dollar.png" width="15" height="15" alt="dollar" />
                  <input
                    type="text"
                    className="outline-none border-none max-w-12 text-sm bg-transparent"
                    value={priceRange[1]}
                    onChange={handlePriceInputUpperChange}
                    onBlur={handleSearch}
                  />
                </div>
              </div>
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling
                minDistance={100}
                onChange={(range) => setPriceRange(range)}
                min={0}
                max={100000}
                step={100}
                onAfterChange={handleSearch}
                value={priceRange}
              />
            </div>
            <div className="flex flex-col w-full gap-4 pb-4 border-b border-grayLight">
              <div className="flex items-center w-full justify-between">
                <h3 className="font-semibold">Categories</h3>
                <FaAngleDown size={15} color="black" />
              </div>
              <div className="flex w-full flex-col h-40 overflow-y-auto">
                {categoryLoading && (
                  <Skeleton
                    count={5}
                    width="100%"
                    height={7}
                    baseColor="#F3F4F6"
                    highlightColor="#E0E0E0"
                  />
                )}
                {!categoryLoading &&
                  allCategories.map((category) => (
                    <div
                      className="flex items-center gap-2"
                      key={crypto.randomUUID()}
                    >
                      <input
                        type="checkbox"
                        className="focus:bg-primary"
                        checked={categories.includes(category.id)}
                        value={category.id}
                        onChange={handleCategoryChange}
                      />
                      <h4>{category.name}</h4>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="flex items-center w-full justify-between">
                <h3 className="font-semibold">Rating</h3>
                <FaAngleDown size={15} color="black" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ratings.includes(5)}
                    className="text-primary"
                    value={5}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(4)}
                    value={4}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(3)}
                    value={3}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(2)}
                    value={2}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(1)}
                    value={1}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <h1>
        <Link to="/" className="text-linkGrey">
          Home
        </Link>{' '}
        &gt; Shop
      </h1>
      <div className="flex gap-8">
        <div className="lg:flex flex-col xs:hidden w-1/5">
          <div className="flex flex-col w-full gap-4 border border-grayLight p-4 rounded-lg">
            <div className="flex items-center w-full justify-between pb-4 border-b border-grayLight">
              <h3>Filters</h3>
              <button
                type="button"
                className="text-primary cursor-pointer border-none outline-none flex items-center justify-center"
                onClick={resetFilters}
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center w-full justify-between">
                <h3 className="font-semibold">Price Range</h3>
                <FaAngleDown size={15} color="black" />
              </div>
              <div className="flex items-center w-full justify-between">
                <div className="flex gap-1 items-center rounded-md bg-grayLight p-1">
                  <img src="/dollar.png" width="15" height="15" alt="dollar" />
                  <input
                    type="text"
                    className="outline-none border-none max-w-12 text-sm bg-transparent"
                    value={priceRange[0]}
                    onChange={handlePriceInputLowerChange}
                    onBlur={handleSearch}
                  />
                </div>
                <h3>to</h3>
                <div className="flex gap-1 items-center rounded-md bg-grayLight p-1">
                  <img src="/dollar.png" width="15" height="15" alt="dollar" />
                  <input
                    type="text"
                    className="outline-none border-none max-w-12 text-sm bg-transparent"
                    value={priceRange[1]}
                    onChange={handlePriceInputUpperChange}
                    onBlur={handleSearch}
                  />
                </div>
              </div>
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                pearling
                minDistance={100}
                onChange={(range) => setPriceRange(range)}
                min={0}
                max={100000}
                step={100}
                onAfterChange={handleSearch}
                value={priceRange}
              />
            </div>
            <div className="flex flex-col w-full gap-4 pb-4 border-b border-grayLight">
              <div className="flex items-center w-full justify-between">
                <h3 className="font-semibold">Categories</h3>
                <FaAngleDown size={15} color="black" />
              </div>
              <div className="flex w-full flex-col h-40 overflow-y-auto">
                {categoryLoading && (
                  <Skeleton
                    count={5}
                    width="100%"
                    height={7}
                    baseColor="#F3F4F6"
                    highlightColor="#E0E0E0"
                  />
                )}
                {!categoryLoading &&
                  allCategories.map((category) => (
                    <div
                      className="flex items-center gap-2"
                      key={crypto.randomUUID()}
                    >
                      <input
                        type="checkbox"
                        checked={categories.includes(category.id)}
                        className="focus:bg-primary"
                        value={category.id}
                        onChange={handleCategoryChange}
                      />
                      <h4>{category.name}</h4>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="flex items-center w-full justify-between">
                <h3 className="font-semibold">Rating</h3>
                <FaAngleDown size={15} color="black" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(5)}
                    value={5}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(4)}
                    value={4}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(3)}
                    value={3}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(2)}
                    value={2}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="text-primary"
                    checked={ratings.includes(1)}
                    value={1}
                    onChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1">
                    <FaStar color="#F3C63F" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                    <FaStar color="#DEE1E6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-4 mt-8 flex-col">
            {recommendedProducts.length > 0 && <h3>Recommended?</h3>}
            {recommendedProducts.length > 0 && (
              <ImageSlider products={recommendedProducts} />
            )}
          </div>
        </div>
        <div className="flex flex-col xs:w-full lg:w-[75%]">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="w-[90%] flex items-center">
              <HSInput
                type="input"
                icon={<IoSearchOutline size={20} />}
                text="text"
                placeholder="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              title="Search"
              onClick={handleSearch}
              styles="xs:hidden lg:flex mt-2"
            />
            <Button
              title=""
              icon={<IoSearchOutline size={20} />}
              onClick={handleSearch}
              styles="xs:flex lg:hidden mt-2"
            />
          </div>
          <div className="xs:flex lg:hidden pl-2 py-2 mt-4 items-center justify-start gap-2 rounded-lg w-full bg-grayLight">
            <CiFilter
              title="filter"
              size={20}
              onClick={() => setToggleFilterMenu(true)}
              className="cursor-pointer"
            />
            <h3>Filter</h3>
          </div>
          <div className="flex flex-col w-full mt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Product Results</h2>
                <h5 className="text-sm font-light">{allProducts.length}</h5>
              </div>
              <div className="flex items-center gap-2">
                <h2>Sort by</h2>
                <select
                  className="bg-transparent text-primary"
                  onChange={(e) => setSortDirection(e.target.value)}
                >
                  <option defaultChecked value="desc">
                    Last posted
                  </option>
                  <option value="asc">First posted</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 w-full mt-6">
              {isLoading && <ProductSkeleton cards={6} />}
              {!isLoading && allProducts.length === 0 && (
                <h2>No results found</h2>
              )}
              {!isLoading &&
                allProducts.map((product) => (
                  <div className="xs:w-full lg:w-60" key={crypto.randomUUID()}>
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
          {!isLoading && (
            <div className="flex items-center xs:justify-center lg:justify-end gap-1 mt-8">
              <IoIosArrowBack
                size={17}
                color="#9095A1"
                className="cursor-pointer"
                onClick={handlePageChangeBack}
              />
              <div className="flex gap-1 items-center">
                {Array.from({ length: Math.ceil(total / 9) }, (_, i) => (
                  <button
                    type="button"
                    className={`outline-none flex items-center justify-center w-8 h-8 rounded-full ${page === i + 1 ? 'text-primary border border-primary' : 'text-linkGrey'} cursor-pointer`}
                    onClick={() => setPage(i + 1)}
                    key={crypto.randomUUID()}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <IoIosArrowForward
                title="forward"
                size={17}
                color="#9095A1"
                className="cursor-pointer"
                onClick={handlePageChangeForward}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;

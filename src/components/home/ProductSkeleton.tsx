import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductSkeleton = ({ cards }: { cards: number }) => {
  return Array(cards)
    .fill(0)
    .map(() => (
      <div
        className="flex flex-col items-center justify-between rounded-lg bg-white xs:w-full lg:w-60 h-60 p-2"
        key={crypto.randomUUID()}
      >
        <div className="w-full flex flex-col items-center">
          <div className="w-full h-[100px]">
            <Skeleton
              width="100%"
              height="100%"
              baseColor="#F3F4F6"
              highlightColor="#E0E0E0"
            />
          </div>
          <div className="flex flex-col w-full mt-4">
            <Skeleton
              width="100%"
              height={7}
              baseColor="#F3F4F6"
              highlightColor="#E0E0E0"
            />
            <Skeleton
              width="100%"
              height={7}
              baseColor="#F3F4F6"
              highlightColor="#E0E0E0"
              className="mt-2"
            />
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <Skeleton
            width={80}
            height={40}
            baseColor="#F3F4F6"
            highlightColor="#E0E0E0"
          />
          <Skeleton
            width={40}
            height={40}
            baseColor="#F3F4F6"
            highlightColor="#E0E0E0"
          />
        </div>
      </div>
    ));
};

export default ProductSkeleton;

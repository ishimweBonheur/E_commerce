import Order from '@/interfaces/order';
import ElipsisIcon from './ElipsisIcon';
import NavigationIcon from './NavigationIcon';

interface PageProps {
  orders: Order[];
  currentPage: number;
  ordersPerPage: number;
  paginate: (page: number) => void;
}
export default function Pagination({
  orders,
  currentPage,
  ordersPerPage,
  paginate,
}: PageProps) {
  const pages: number[] = Array.from(
    { length: orders.length / ordersPerPage },
    (_, index) => index
  );

  return (
    <div className="flex justify-end mt-4">
      <nav>
        <ul className="flex gap-2 items-center">
          {currentPage > 2 && (
            <NavigationIcon
              direction="previous"
              onClick={() => paginate(currentPage - 1)}
            />
          )}
          {pages
            .slice(
              currentPage === 1 ? currentPage - 1 : currentPage - 2,
              currentPage === 1 ? currentPage + 2 : currentPage + 1
            )
            .map((item) => (
              <li key={item} className="mx-1">
                <button
                  type="button"
                  onClick={() => paginate(item + 1)}
                  className={`px-3 py-1 rounded-full ${currentPage === item + 1 ? 'border border-primary text-gray-500' : 'border-none'}`}
                >
                  {item + 1}
                </button>
              </li>
            ))}
          {pages.slice(currentPage + 1).length > 0 && <ElipsisIcon />}
          {pages
            .slice(currentPage + 1)
            .slice(-2)
            .map((item) => (
              <li key={item} className="mx-1">
                <button
                  type="button"
                  onClick={() => paginate(item + 1)}
                  className={`px-3 py-1 rounded-full ${currentPage === item + 1 ? 'border border-primary text-gray-500' : 'border-none'}`}
                >
                  {item + 1}
                </button>
              </li>
            ))}
          {currentPage < pages.length && (
            <NavigationIcon
              direction="next"
              onClick={() => paginate(currentPage + 1)}
            />
          )}
        </ul>
      </nav>
    </div>
  );
}

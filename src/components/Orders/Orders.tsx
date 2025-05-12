/* eslint-disable import/prefer-default-export */
import { useState } from 'react';
import WebFont from 'webfontloader';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectOrders, cancelOrder } from '@/features/Orders/ordersSlice';
import { RootState } from '@/app/store';
import Order from '@/interfaces/order';
import Table from './Table';
import Pagination from './Pagination';
import FilterBar from './FilterBar';
import OrderDetailsModal from './OrderDetailsModal';

WebFont.load({
  google: {
    families: ['Manrope:400,500,600,700,800'],
  },
});

export function Orders() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state: RootState) =>
    selectOrders(state)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [selected, setSelected] = useState(-1);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleFilter = (status: string) => {
    setFilterStatus(status);
  };

  const filteredOrders = orders.filter(
    (order: Order) => filterStatus === 'All' || order.status === filterStatus
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      if (!aValue || !bValue) {
        return 0;
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const search = (text: string) => {
    const query = text.trim().toLowerCase();
    const results = sortedOrders.filter(
      (order) =>
        order.id.toString().includes(query) ||
        order.trackingNumber.toLowerCase().includes(query) ||
        order.paymentInfo?.toLowerCase().includes(query) ||
        order.updatedAt.toLowerCase().includes(query)
    );
    setSearchMode(true);
    setSearchResults(results);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const displayOrders = searchMode ? searchResults : sortedOrders;
  const currentOrders = displayOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-5 bg-gray-100 max-w-screen-xl">
      <div className="flex gap-4 items-center py-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          type="button"
          className="capitalize text-primary border border-primary py-1 px-4 rounded"
        >
          add order
        </button>
      </div>
      <FilterBar orders={orders} handleFilter={handleFilter} search={search} />
      <div className="bg-white flex flex-col gap-4 pb-8">
        <Table
          orders={currentOrders}
          handleSort={handleSort}
          select={(id: number) => setSelected(id)}
          cancel={(id: number) => dispatch(cancelOrder(id))}
        />
        <Pagination
          orders={filteredOrders}
          ordersPerPage={ordersPerPage}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      {selected >= 0 && (
        <div className="fixed top-0 z-50 bg-opacity-50 bg-black left-0 w-screen h-screen flex items-center justify-center">
          <OrderDetailsModal
            close={() => setSelected(-1)}
            order={orders.find((order) => order.id === selected) as Order}
          />
        </div>
      )}
    </div>
  );
}

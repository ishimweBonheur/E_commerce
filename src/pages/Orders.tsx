import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { fetchOrders } from '@/features/Orders/ordersSlice';
import { Orders as OrdersComponent } from '@/components/Orders/Orders';

export default function Orders() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <OrdersComponent />;
}

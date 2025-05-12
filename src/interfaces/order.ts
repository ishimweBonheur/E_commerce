interface DeliveryInfo {
  address: string;
  city: string;
  zip: string;
}

export interface Order {
  id: number;
  totalAmount: number;
  country: string;
  status: string;
  couponCode?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  deliveryInfo: DeliveryInfo;
  paymentInfo: string | null;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
  paid: boolean;
  orderDetails: OrderDetail[];
}

interface OrderDetail {
  id: number;
  quantity: number;
  price: number;
}

export default Order;

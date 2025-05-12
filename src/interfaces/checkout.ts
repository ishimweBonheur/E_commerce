interface DeliveryInfo {
  address: string;
  city: string;
  zip: string;
}

export interface Checkout {
  deliveryInfo: DeliveryInfo;
  couponCode: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  msg: string;
  order: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      googleId: string | null;
      facebookId: string | null;
      picture: string;
      provider: string | null;
      isVerified: boolean;
      status: string;
      twoFactorCode: string | null;
      createdAt: string;
      updatedAt: string;
    };
    totalAmount: number;
    status: string;
    deliveryInfo: {
      address: string;
      city: string;
      zip: string;
    };
    country: string;
    trackingNumber: string;
    orderDetails: {
      product: {
        id: number;
        name: string;
        image: string;
        gallery: string[];
        shortDesc: string;
        longDesc: string;
        quantity: number;
        regularPrice: number;
        salesPrice: number;
        tags: string[];
        type: string;
        isAvailable: boolean;
        isFeatured: boolean;
        averageRating: number;
        createdAt: string;
        updatedAt: string;
      };
      quantity: number;
      price: number;
      id: number;
    }[];
    paymentInfo: null;
    paid: boolean;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
  trackingNumber: string;
}

interface Cart {
  id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
  };
  product: {
    id: number;
    name: string;
    image: string;
    quantity: number;
    regularPrice: number;
    salesPrice: number;
  };
}

export default Cart;

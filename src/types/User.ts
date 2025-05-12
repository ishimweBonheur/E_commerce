interface Role {
  id: number;
  name: string;
  permissions: string[];
}

interface Order {
  id: number;
  orderNumber: string;
  orderStatus: string;
  orderTotal: number;
  orderItems: string[];
}

export default interface User {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  userType: Role;

  orders: Order[];

  googleId: string;

  facebookId: string;

  picture: string;

  provider: string;

  isVerified: boolean;

  status: 'active' | 'inactive';
}

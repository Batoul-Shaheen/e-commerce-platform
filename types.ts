export namespace NSUser {
  export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    phone: string;
  }

  export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }
  export interface Order {
    // orderId: number
    orderDate: Date;
    status: string;
    city: string;
    country: string;
    phone: string;
    userId: number;
    orderItems: { productId: number; quantity: number }[];
  }

  export interface OrderItem {
    quantity: number;
    productId: number;
  }
}

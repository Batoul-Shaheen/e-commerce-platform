export namespace NSUser {
  export enum Type {
    user = 'User',
    admin = 'Admin'
  }
  export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    phone: string;
    type: Type;
  }

  export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }

  export interface Category {
    name: string;
    products: Product[];
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

  export interface ShoppingCart{
    id :number;
  }
}


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
    categoryName: string;
  }
  export interface Order {
    orderId: number
    orderDate: string;
    status: "Pending" | "Canceled" | "Done";
    city: string;
    country: string;
    phone: string;
  }
  export interface ShoppingCart{
    id :number;
    userId:number
  }
}


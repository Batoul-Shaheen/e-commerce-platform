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
    orderId: number
    orderDate: Date;
    status: "Pending" | "Canceled" | "Done";
    city: string;
    country: string;
    phone: string;
  }

<<<<<<< HEAD
  export interface ShoppingCart{
    id :number;
  }
=======
>>>>>>> 038aff9f72db4ea018aacd03a162bba6cc090cfd
}


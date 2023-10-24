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

<<<<<<< HEAD
=======
  export interface Role {
    id: number;
    name: string;
    permissions: number[];
  }
  
  export interface Permission {
    id: number;
    name: string;
  }

  export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryName: string ;
  }

>>>>>>> 2b10fa985c170a53b6e1a11f7264e84de65168b8
  export interface Category {
    name: string;
    products: Product[];
  }

<<<<<<< HEAD
  export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryName: string;
  }
=======
>>>>>>> 2b10fa985c170a53b6e1a11f7264e84de65168b8
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


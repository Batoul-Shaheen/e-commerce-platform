export namespace NSUser{

    export interface User{
        id: number;
        username: string;
        password:string;
        email:string;
    }
 
    export interface Product{
        id:number,
        name: string,
        description?: string,
        price : number ,
        quantity: number,
    }
}
import { Order } from "../DB/entities/Order.entity.js";
import { NSUser } from "../types.js";
import dataSource from "../DB/dataSource.js";

const CreateOrder = (payload: NSUser.Order) => {
    return dataSource.manager.transaction(async (transaction) => {
      const newOrder = Order.create({
        ...payload,
      });
      await transaction.save(newOrder);
      return newOrder;
    });
  };
  

const getordersById = async (id: number) => {
    try {
      const order = await Order.findOne({ where: { id } });
      return order;
    } catch (error) {
      console.log(error);
    }
  };

//   export function getOrdersForUser(userId: number): Promise<Order[]> {
//     const repository = TypeORM.getRepository(Order);
//     const orders = await repository.find({ where: { userId } });
//     return orders;
//   }

 
// async function fetchUserAndProducts(id: number, id: number[]): Promise<{ user: User; products: Product[] }> {
//  const user = await User.findOne({ where: { id } });
//  const products = await Product.findOne({ _id: { $in: id } });

//  if (!user) {
//     throw new Error('User not found');
//  }

//  if (products.length !== id.length) {
//     throw new Error('Some products not found');
//  }

//  return { user, products };
// }

  export {getordersById, CreateOrder};
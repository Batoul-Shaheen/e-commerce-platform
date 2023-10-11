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


  export {getordersById, CreateOrder};
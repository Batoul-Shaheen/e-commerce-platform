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


export { CreateOrder };
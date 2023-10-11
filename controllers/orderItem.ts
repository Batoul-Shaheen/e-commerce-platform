import { NSUser } from "../types.js";
import dataSource from "../DB/dataSource.js";
import { OrderItem } from "../DB/entities/OrderItem.entity.js";

const insertOrderItem = (payload: NSUser.OrderItem) => {
  return dataSource.manager.transaction(async (transaction) => {
    const newOrderItem = OrderItem.create({
      ...payload,
    });
    await transaction.save(newOrderItem);
  });
};

export { insertOrderItem };


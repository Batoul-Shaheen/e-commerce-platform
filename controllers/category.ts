import dataSource from "../DB/dataSource.js";
import { Category } from "../DB/entities/Category.entity.js";
import { NSUser } from "../types.js";

const getCategoryByName = async (name: string) => {
  try {
    const category = await Category.findOne({ where: { name } });
    return category;
  } catch (error) {
    console.log(error);
  }
};

<<<<<<< HEAD
const insertCategory = async (payload: NSUser.Category) => {
  return dataSource.manager.transaction(async (transaction) => {
    const newCategory = Category.create({
      ...payload
    });
    await transaction.save(newCategory);
  });
}
=======
  const insertCategory = async (payload: NSUser.Category) => {
    return dataSource.manager.transaction(async (transaction) => {
      const newCategory = Category.create({
        ...payload
      });
      await transaction.save(newCategory);
    });
  }
>>>>>>> 2b10fa985c170a53b6e1a11f7264e84de65168b8

export { getCategoryByName, insertCategory };
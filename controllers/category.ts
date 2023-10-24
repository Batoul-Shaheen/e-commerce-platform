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

  const insertCategory = async (payload: NSUser.Category) => {
    return dataSource.manager.transaction(async (transaction) => {
      const newCategory = Category.create({
        ...payload
      });
      await transaction.save(newCategory);
    });
  }



  export {getCategoryByName, insertCategory};
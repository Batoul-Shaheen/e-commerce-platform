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
    try {
        const category = Category.create({
            ...payload,
        });
        await category.save();
        return category;
    } catch (error) {
        console.log(error);
    }
  };



  export {getCategoryByName, insertCategory};
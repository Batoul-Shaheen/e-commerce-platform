import dataSource from "../DB/dataSource.js";
import { Product } from "../DB/entities/Product.entity.js";
import { NSUser } from "../types.js";

const insertProduct = (payload: NSUser.Product) => {
    return dataSource.manager.transaction(async (transaction) => {
      const newProduct = Product.create({
        ...payload,
        })
      await transaction.save(newProduct);
    });
  };


//   const getproductsByCategory = async (category: string) => {
//     try {
//       const product = await Product.find({ where: { category } });
//       return product;
//     } catch (error) {
//       console.log(error);
//     }
//   };

  const getProductsById = async (id: number) => {
    try {
      const product = await Product.findOne({ where: { id } });
      return product;
    } catch (error) {
      console.log(error);
    }
  };
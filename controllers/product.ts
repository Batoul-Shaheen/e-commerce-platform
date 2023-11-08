import dataSource from "../DB/dataSource.js";
import { Product } from "../DB/entities/Product.entity.js";
import { NSUser } from "../types.js";
import { uploadFile } from "../S3.js";

const insertProduct = (payload: NSUser.Product,imageFile: Express.Multer.File) => {
  return dataSource.manager.transaction(async (transaction) => {

    const image = await uploadFile(imageFile)
    const newProduct = Product.create({
      ...payload,
      image: image.Location
    })
    await transaction.save(newProduct);
  });
};


const getProductsById = async (id: number) => {
  try {
    const product = await Product.findOne({ where: { id } });
    return product;
  } catch (error) {
    console.log(error);
  }
};

export { insertProduct, getProductsById}
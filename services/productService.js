import { Http } from "../constants/config.js";
import Product from "../models/productModel.js";

class ProductServices extends Http {
  constructor() {
    super("products");
  }
  insertProduct = async (name, cate_id, price, detail, image, quantity) => {
    const product = new Product(
      name,
      cate_id,
      price,
      detail,
      image,
      quantity,
      0
    );
    const res = await super.post(product, true);
  };
  updateProduct = async (id, data) => {
    const res = super.update(id, data);
    return res;
  };
  getProduct = async (id = null) => {
    const res = await super.get(id);
    return res;
  };
  getProductQuery = async (query) => {
    const res = await super.query(query, false);
    return res;
  };
  sortProduct = async () => {
    const res = await super.get();
    const productsWithTotalSales = res.map((product) => ({
      ...product,
      totalSales: product.price * product.selled,
    }));
    // Sắp xếp mảng theo tổng tiền bán được giảm dần
    const sortedProducts = productsWithTotalSales.sort(
      (a, b) => b.totalSales - a.totalSales
    );

    return sortedProducts;
  };
  getProductSearch = async (search) => {
    const res = await super.performSearch(search);
    return res;
  };
  removeProduct = (id) => {
    const res = super.remove(id, true);
    return res;
  };
}

export default ProductServices;

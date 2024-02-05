import { Http } from "../constants/config.js";
import ShopCart from "../models/shopcartModel.js";

class ShopCartService extends Http {
  constructor() {
    super("shop-cart");
  }
  insert = async (idProduct, amount) => {
    const shopCart = new ShopCart(idProduct, amount);
    const res = await super.post(shopCart, "Thêm thành công");
    console.log(res);
    return res;
  };
  getAll = async () => {
    const res = await super.get();
    return res;
  };
  remove =async (id) => {
    const res = await super.remove(id);
    return res;
  };
}

export default ShopCartService;

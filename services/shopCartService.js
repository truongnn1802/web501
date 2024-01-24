import { showToast } from "../app.js";
import { getData, postData, removeData } from "../constants/FirebaseContants.js";
import ShopCart from "../models/shopcartModel.js";

class ShopCartService {
  constructor() {
    this.collectionName = "shopCart";
  }
  insertShopCart = (idProduct,amount) => {
    const shopCart = new ShopCart(null, idProduct,amount);
    const res = postData(this.collectionName, shopCart,showToast("Thêm thành công"));
    return res;
  };
  getShopCart = async () => {
    const res = await getData(this.collectionName);
    return res;
  };
  removeShopCart = (id) => {
    const res = removeData(this.collectionName,id)
    return res
  }
}

export default ShopCartService;

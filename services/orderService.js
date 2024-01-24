import { showToast } from "../app.js";
import {
  filterData,
  getData,
  postData,
  removeData,
} from "../constants/FirebaseContants.js";
import Order from "../models/orderModel.js";

class OrderServices {
  constructor() {
    this.collectionName = "order";
  }
  insertProduct = async (
    customer_name,
    customer_address,
    customer_phone,
    status
  ) => {
    const order = new Order(
      null,
      customer_name,
      customer_address,
      customer_phone,
      new Date().toLocaleString(),
      status
    );
    const res = postData(this.collectionName, order, () => {
      document.querySelector(
        "body"
      ).innerHTML = `<div class="success-container">
      <h1>Đã Mua Hàng Thành Công!</h1>
      <p>Cảm ơn bạn đã mua hàng của chúng tôi. Đơn hàng của bạn đã được xác nhận.</p>
      <p>Bạn sẽ nhận được nhận đơn hàng trong thời gian sớm nhất.</p>
      <a href="index.html">Quay lại Trang Chủ</a>
    </div>`;
    });
    console.log(res);
    return res;
  };
  getProducts = async (id = null) => {
    return id
      ? await getData(this.collectionName + "/" + id)
      : await getData(this.collectionName);
  };
  getProductCate = async (valueName) => {
    const res = await filterData(this.collectionName, "cate_id", valueName);
    return res;
  };
  removeProduct = (id) => {
    const res = removeData(this.collectionName, id);
    return res;
  };
}

export default OrderServices;

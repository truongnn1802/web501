
import { Http } from "../constants/config.js";
import Order from "../models/orderModel.js";

class OrderServices extends Http{
  constructor() {
    super("order")
  }
  insert = async (
    customer_id,
    customer_name,
    customer_address,
    customer_phone,
    status
  ) => {
    console.log(customer_id);
    const order = new Order(
      customer_id,
      customer_name,
      customer_address,
      customer_phone,
      new Date().toLocaleString(),
      status
    );
    const res =await super.post( order, true, () => {
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
  update = async (id,data)=>{
    const res = await super.update(id,{...data,status:'complete'})
    return res
  }
  query = async (query) => {
    const res = await super.query(query, false);
    return res;
  };
  removeProduct = (id) => {
    const res = removeData(this.collectionName, id);
    return res;
  };
}

export default OrderServices;

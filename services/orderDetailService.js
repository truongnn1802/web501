import { Http } from "../constants/config.js";
import OrderDetail from "../models/orderDetailModel.js";

class OrderDetailServices extends Http{
  constructor() {
    super("order_detail")
  }
  insert = async (order_id, product_id,customer_id, quantity) => {
    const orderDetail = new OrderDetail(
      order_id,
      product_id,
      customer_id,
      quantity
    );
    const res = await super.post( orderDetail);
    return res;
  };
  getOrderDetails = async (orderId) => {
    const res = await super.query({order_id:orderId});
    return res;
  };
  remove = (id) => {
    const res = super.remove(id);
    return res;
  };
}

export default OrderDetailServices;

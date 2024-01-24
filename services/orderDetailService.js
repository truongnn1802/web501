import {
  filterData,
  getData,
  postData,
  removeData,
  sortData,
  uppdateData,
} from "../constants/FirebaseContants.js";
import OrderDetail from "../models/orderDetailModel copy.js";

class OrderDetailServices {
  constructor() {
    this.collectionName = "order_detail";
  }
  insertOrderDetail = async (order_id, product_id, quantity) => {
    const orderDetail = new OrderDetail(
      null,
      order_id,
      product_id,
      quantity
    );
    const res = postData(this.collectionName, orderDetail);
    return res;
  };
  getOrderDetails = async (valueName,fieldName="order_id",) => {
    const res = await filterData(this.collectionName, fieldName, valueName);
    return res;
  };
  getOrderDetailSort = async (fieldName,startAt=null,endAt=null) => {
    const res = await sortData(this.collectionName, fieldName,startAt,endAt);
    return res;
  };
  removeOrderDetail = (id) => {
    const res = removeData(this.collectionName, id);
    return res;
  };
}

export default OrderDetailServices;

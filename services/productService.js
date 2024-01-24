import {
  filterData,
  getData,
  postData,
  removeData,
  sortData,
  uppdateData,
} from "../constants/FirebaseContants.js";
import Product from "../models/productModel.js";

class ProductServices {
  constructor() {
    this.collectionName = "products";
  }
  insertProduct = async (name, cate_id, price, detail, image, quantity) => {
    const product = new Product(
      null,
      name,
      cate_id,
      price,
      detail,
      image,
      quantity,
      0
    );
    const res = postData(this.collectionName, product);
    return res;
  };
  updateProduct = async (id,data) => {
    console.log(data);
    const res = uppdateData(this.collectionName + '/' + id, data);
    return res;
  };
  getProduct = async (id = null) => {
    return id
      ? await getData(this.collectionName + "/" + id)
      : await getData(this.collectionName);
  };
  getProductCate = async (valueName,fieldName="cate_id",) => {
    const res = await filterData(this.collectionName, fieldName, valueName);
    return res;
  };
  getProductSort = async (fieldName,startAt=null,endAt=null) => {
    const res = await sortData(this.collectionName, fieldName,startAt,endAt);
    return res;
  };
  removeProduct = (id) => {
    const res = removeData(this.collectionName, id);
    return res;
  };
}

export default ProductServices;

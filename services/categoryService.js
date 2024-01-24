import { getData, postData, removeData } from "../constants/FirebaseContants.js";
import Category from "../models/categoryModel.js";

class CategoryService {
  constructor() {
    this.collectionName = "categories";
  }
  insertCategory = (name) => {
    const category = new Category(null, name);
    const res = postData(this.collectionName, category);
    return res;
  };
  getAllCategory = async () => {
    const res = await getData(this.collectionName);
    return res;
  };
  removeCategory = (id) => {
    const res = removeData(this.collectionName,id)
    return res
  }
}

export default CategoryService;

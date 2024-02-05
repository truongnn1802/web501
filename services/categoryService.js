import { Http } from "../constants/config.js";
import Category from "../models/categoryModel.js";

class CategoryService extends Http {
  constructor() {
    super("categories");
  }
  insert = async (name) => {
    const category = new Category(name);
    await super.post(category, true);
  };
  getAll = async () => {
    const res = await super.get();
    return res;
  };
  remove = async (id) => {
    const res = await super.remove(id, true);
    return res;
  };
}

export default CategoryService;


import { Http } from "../constants/config.js";
import Account from "../models/accountModel.js";

class AccoountServices extends Http{
  constructor() {
    super("account")
  }
  insert = async (
    username,
    password
  ) => {
    const account = new Account(
      username,
      password,
      'user'
    );
    const res =await super.post( account, true);
    console.log(res);
    return res;
  };
  update = async (id,data)=>{
    const res = await super.update(id)
    return res
  }
  query = async (query) => {
    const res = await super.query(query, false);
    return res;
  };
  remove = (id) => {
    const res = removeData(this.collectionName, id);
    return res;
  };
}

export default AccoountServices;

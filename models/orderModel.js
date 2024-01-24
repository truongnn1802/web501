export default class OrderModel {
    constructor(idModel,customer_name,customer_address,customer_phone,date_order,bill){
        this.idModel = idModel
        this.customer_name = customer_name
        this.customer_address = customer_address
        this.customer_phone = customer_phone
        this.date_order = date_order
        this.bill = bill
    }
}
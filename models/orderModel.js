export default class OrderModel {
    constructor(customer_id,customer_name,customer_address,customer_phone,date_order,status){
        this.customer_id = customer_id
        this.customer_name = customer_name
        this.customer_address = customer_address
        this.customer_phone = customer_phone
        this.date_order = date_order
        this.status = status
    }
}
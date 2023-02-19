import * as React from 'react';
import * as mock from "../file_managament/Controller";
import {create} from "../api/order_controller";
import {Order} from "../file_managament/orders/order";

const CreateOrderBtn = () => {

    function createOrder(order: Order):void {
        console.log("creating order...", order);
        create(order);
        console.log("Order created.")
    }
    return <button onClick={()=>createOrder(mock.mockOrder1)}></button>
}

export default CreateOrderBtn;
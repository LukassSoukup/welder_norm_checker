import * as React from 'react';
import {OrderCreateForm} from "./GUI/OrderCreateForm";
import {OrderList} from "./GUI/OrderList";
import {EmployeeList} from "./GUI/EmployeeList";
import {EmployeeCreateForm} from "./GUI/EmployeeCreateForm";

const App = () => (
    <div>
        <EmployeeCreateForm/>
        <EmployeeList/>
        <OrderCreateForm/>
        <OrderList/>
    </div>
)

export default App;
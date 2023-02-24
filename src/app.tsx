import * as React from 'react';
import {OrderCreateForm} from "./GUI/OrderCreateForm";
import {OrderList} from "./GUI/OrderList";

const App = () => (
    <div>
        <OrderCreateForm/>
        <OrderList/>
    </div>
)

export default App;
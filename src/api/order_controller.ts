import {loadFile, loadFiles, createFile} from "../file_managament/Utils/file_manager";
import {ORDER_FILE_PATH} from "../file_managament/constants/file_paths";
import * as Path from "path";
import {Order} from "../file_managament/orders/order";

async function list() {
    return await loadFiles(ORDER_FILE_PATH);
}

function create(order:Order): void {
    createFile(Path.join(ORDER_FILE_PATH, order.getOrderNumber), JSON.stringify(order));
}
export {list, create}
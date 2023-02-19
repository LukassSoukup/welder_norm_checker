import {Order} from "./orders/order";
import {Product} from "./orders/product";
const mockProduct1 = new Product("AAB-10-0650-0-A", 25, "");
const mockProduct2 = new Product("BPD-2-0164-0-0", 9, "Verkleidungkonsol - BI.3 S235JR +1 Muster");
const mockProduct3 = new Product("BPD-W-6351-0-A", 4, "Aufnahme Ansaugschlauch +1 Muster");

const mockOrder1 = new Order("BE059640", "31.01.2023", [mockProduct1], 30, false);
const mockOrder2 = new Order("BE059692", "03.02.2023", [mockProduct2, mockProduct3], 45, false);

export {
    mockProduct1,
    mockProduct2,
    mockProduct3,
    mockOrder1,
    mockOrder2
}
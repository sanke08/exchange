"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderBook_1 = require("./orderBook");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, quantity, type } = req.body;
    console.log(price, quantity, type);
    yield fillOrder({ price, quantity, type });
    res.json({ bookWithQuantity: orderBook_1.bookWithQuantity, orderBook: orderBook_1.orderBook });
}));
const fillOrder = ({ price, quantity, type }) => __awaiter(void 0, void 0, void 0, function* () {
    let executedQuantity = 0;
    if (type === "buy") {
        if (orderBook_1.orderBook.sell.length === 0) {
            console.log("enetred to buy");
            return orderBook_1.orderBook.buy.push({
                price,
                quantity: quantity,
                id: Math.floor(Math.random() * 100000)
            });
        }
        orderBook_1.orderBook.sell.sort((a, b) => a.price - b.price).forEach((order) => {
            console.log("enetred buy loop");
            if (order.price <= price && order.quantity > 0) {
                const filled = Math.min(quantity, order.quantity);
                order.quantity -= filled;
                orderBook_1.bookWithQuantity.sell[order.price] = orderBook_1.bookWithQuantity.sell[order.price] - filled;
                executedQuantity += filled;
                quantity -= filled;
                if (order.quantity === 0) {
                    orderBook_1.orderBook.sell.splice(orderBook_1.orderBook.sell.indexOf(order), 1);
                }
            }
            if (quantity !== 0) {
                console.log("enetred sell loop if quantity !==0");
                orderBook_1.orderBook.buy.push({
                    price,
                    quantity: quantity - executedQuantity,
                    id: Math.floor(Math.random() * 100000)
                });
                console.log(orderBook_1.orderBook);
                orderBook_1.bookWithQuantity.buy[price] = (orderBook_1.bookWithQuantity.buy[price] || 0) + quantity - executedQuantity;
            }
        });
    }
    else {
        if (orderBook_1.orderBook.buy.length === 0) {
            console.log("enetred to sell");
            return orderBook_1.orderBook.sell.push({
                price,
                quantity: quantity,
                id: Math.floor(Math.random() * 100000)
            });
        }
        orderBook_1.orderBook.buy.sort((a, b) => a.price - b.price).forEach(order => {
            console.log("enetred sell loop");
            if (order.price >= price && quantity != 0) {
                const filled = Math.min(order.quantity, quantity);
                order.quantity -= filled;
                orderBook_1.bookWithQuantity.buy[price] = orderBook_1.bookWithQuantity.buy[price] - filled;
                executedQuantity += filled;
                quantity -= filled;
                if (order.quantity === 0) {
                    orderBook_1.orderBook.buy.splice(orderBook_1.orderBook.buy.indexOf(order), 1);
                }
            }
            if (quantity !== 0) {
                console.log("enetred buy loop if quantity !==0");
                orderBook_1.orderBook.sell.push({
                    price,
                    quantity: quantity,
                    id: Math.floor(Math.random() * 100000)
                });
                orderBook_1.bookWithQuantity.sell[price] = (orderBook_1.bookWithQuantity.sell[price] || 0) + quantity - executedQuantity;
            }
        });
    }
});
app.listen(8000);

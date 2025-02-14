import express from "express"
import { bookWithQuantity, orderBook } from "./types/orderBook"


const app = express();
app.use(express.json());



app.post("/api/orders", async (req, res) => {

    const { price, quantity, type }: any | null = req.body

    console.log(price, quantity, type)

    await fillOrder({ price, quantity, type })

    res.json({ bookWithQuantity, orderBook })

})



const fillOrder = async ({ price, quantity, type }: { price: number, quantity: number, type: "buy" | "sell" }) => {
    let executedQuantity: number = 0

    if (type === "buy") {
        if (orderBook.sell.length === 0) {
            console.log("enetred to buy")
            return orderBook.buy.push({
                price,
                quantity: quantity,
                id: Math.floor(Math.random() * 100000)
            })
        }
        orderBook.sell.sort((a, b) => a.price - b.price).forEach((order) => {
            console.log("enetred buy loop")
            if (order.price <= price && order.quantity > 0) {
                const filled = Math.min(quantity, order.quantity)
                order.quantity -= filled

                bookWithQuantity.sell[order.price] = bookWithQuantity.sell[order.price] - filled

                executedQuantity += filled
                quantity -= filled

                if (order.quantity === 0) {
                    orderBook.sell.splice(orderBook.sell.indexOf(order), 1)
                }

            }

            if (quantity !== 0) {

                console.log("enetred sell loop if quantity !==0")
                orderBook.buy.push({
                    price,
                    quantity: quantity - executedQuantity,
                    id: Math.floor(Math.random() * 100000)
                })
                console.log(orderBook)
                bookWithQuantity.buy[price] = (bookWithQuantity.buy[price] || 0) + quantity - executedQuantity
            }
        })
    } else {
        if (orderBook.buy.length === 0) {
            console.log("enetred to sell")
            return orderBook.sell.push({
                price,
                quantity: quantity,
                id: Math.floor(Math.random() * 100000)
            })
        }
        orderBook.buy.sort((a, b) => a.price - b.price).forEach(order => {
            console.log("enetred sell loop")
            if (order.price >= price && quantity != 0) {
                const filled = Math.min(order.quantity, quantity)
                order.quantity -= filled

                bookWithQuantity.buy[price] = bookWithQuantity.buy[price] - filled

                executedQuantity += filled
                quantity -= filled

                if (order.quantity === 0) {
                    orderBook.buy.splice(orderBook.buy.indexOf(order), 1)
                }
            }
            if (quantity !== 0) {
                console.log("enetred buy loop if quantity !==0")
                orderBook.sell.push({
                    price,
                    quantity: quantity,
                    id: Math.floor(Math.random() * 100000)
                })
                bookWithQuantity.sell[price] = (bookWithQuantity.sell[price] || 0) + quantity - executedQuantity
            }

        })
    }
}




app.listen(8000)
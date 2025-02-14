export type Order = {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: "buy" | "sell";
    userId: string;
}

// export type Fill= {
//     price: string;
//     qty: number;
//     tradeId: number;
//     otherUserId: string;
//     markerOrderId: string;
// }


export class OrderBook {
    buy: Order[]
    sell: Order[]

    lastTradeId: number
    currentPrice: number

    constructor(buy: Order[], sell: Order[], lastTradeId: number, currentPrice: number) {
        this.buy = buy.sort((a, b) => a.price - b.price);
        this.sell = sell;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }

    addOrder(order: Order) {
        if (order.side === "buy") {
            this.handleBuy(order)
        } else {

        }
    }

    handleBuy(order: Order): { executedQuantity: number } {
        let executedQuantity = 0
        this.sell.forEach((o: Order) => {
            if (o.price <= order.price) {
                const filledQuantity = Math.min(o.quantity, order.quantity)
                executedQuantity += filledQuantity

                o.quantity -= filledQuantity

                if (o.quantity === 0) {
                    this.sell.splice(this.sell.indexOf(o, 1))
                }
                order.quantity -= filledQuantity
                if (order.quantity !== 0) {
                    this.buy.push(order)
                }
            }
        })
        return { executedQuantity }
    }

    handleSell(order: Order): { executedQuantity: number } {
        let executedQuantity = 0

        this.buy.forEach((o: Order) => {
            if (o.price >= order.price) {
                const filledQuantity = Math.min(o.quantity, order.quantity)
                executedQuantity += filledQuantity

                o.quantity -= executedQuantity

                if (o.quantity === 0) {
                    this.buy.splice(this.buy.indexOf(o, 1))
                }
                order.quantity -= filledQuantity

                if (order.quantity !== 0) {
                    this.sell.push(order)
                }
            }
        })
        return { executedQuantity }
    }
}
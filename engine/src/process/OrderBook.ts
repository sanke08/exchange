import { Fill, Order } from "../types";

export class OrderBook {
    buy: Order[] = []
    sell: Order[] = []
    tradeAsset: string;
    priceAsset: string = "INR";
    lastTradeId: number;
    currentPrice: number;

    constructor(tradeAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.buy = bids
        this.sell = asks
        this.tradeAsset = tradeAsset
        this.lastTradeId = lastTradeId
        this.currentPrice = currentPrice
    }

    ticker() {
        return `${this.tradeAsset}_${this.priceAsset}`
    }
    getSnapshot() {
        return {
            buy: this.buy,
            sell: this.sell,
            tradeAsset: this.tradeAsset,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice
        }
    }

    addOrder(order: Order) {
        if (order.side === "buy") {
            const { executedQuantity, fills } = this.matchBuys(order)
            order.filled = executedQuantity

            if (executedQuantity === order.quantity) {
                return { executedQuantity, fills }
            }

            this.buy.push(order)

            return { executedQuantity, fills }

        } else {

            const { executedQuantity, fills } = this.matchSelles(order)
            order.filled = executedQuantity
            if (executedQuantity === order.quantity) {
                return { executedQuantity, fills }
            }

            this.sell.push(order)

            return { executedQuantity, fills }
        }
    }


    matchBuys(order: Order) {

        let executedQuantity = 0
        const fills: Fill[] = []

        this.sell.forEach((sellOrder) => {
            if (sellOrder.price <= order.price && executedQuantity < order.quantity) {
                const filledQuantity = Math.min(sellOrder.quantity, order.quantity - executedQuantity)
                executedQuantity += filledQuantity
                sellOrder.filled += filledQuantity

                fills.push({
                    marketOrderId: sellOrder.orderId,
                    otherUserId: sellOrder.userId,
                    price: sellOrder.price,
                    quantity: filledQuantity,
                    tradeId: this.lastTradeId++
                })
            }
        })

        for (let i = 0; i < this.sell.length; i++) {
            if (this.sell[i].filled === this.sell[i].quantity) {
                this.sell.splice(i, 1)
                i--
            }
        }


        if (executedQuantity !== order.quantity) {
            this.buy.push(order)
        }

        return { executedQuantity, fills }

    }

    matchSelles(order: Order) {
        let executedQuantity = 0

        const fills: Fill[] = []

        this.buy.forEach((buyOrder) => {
            if (buyOrder.price >= order.price && executedQuantity < order.quantity) {
                const filledQuantity = Math.min(buyOrder.quantity, order.quantity - executedQuantity)
                executedQuantity += filledQuantity
                buyOrder.filled += filledQuantity
                fills.push({
                    marketOrderId: buyOrder.orderId,
                    otherUserId: buyOrder.userId,
                    price: buyOrder.price,
                    quantity: filledQuantity,
                    tradeId: this.lastTradeId++
                })
            }
        })

        for (let i = 0; i < this.buy.length; i++) {
            if (this.buy[i].filled === this.buy[i].quantity) {
                this.buy.splice(i, 1)
                i--
            }
        }
        if (executedQuantity !== order.quantity) {
            this.sell.push(order)
        }

        return { executedQuantity, fills }
    }

    getMyOrder(userId: string) {
        const buys = this.buy.filter((buyOrder) => buyOrder.userId === userId)
        const sells = this.sell.filter((sellOrder) => sellOrder.userId === userId)
        return [buys, sells]
    }

    cancelBuy(orderId: string) {
        const index = this.buy.findIndex((x) => x.orderId === orderId)
        if (index !== -1) {
            const price = this.buy[index].price
            this.buy.splice(index, 1)
            return price
        } else {
            return null
        }
    }

    cancelSell(orderId: string) {
        const index = this.sell.findIndex((x) => x.orderId === orderId)
        if (index !== -1) {
            const price = this.sell[index].price
            this.sell.splice(index, 1)
            return price
        } else {
            return null
        }
    }
}
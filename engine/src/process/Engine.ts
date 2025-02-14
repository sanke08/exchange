import { OrderBook } from "../process/OrderBook"
import { RedisManager } from "../RedisManager"
import { CREATE_ORDER, Fill, MessageFromApi, Order, TRADE_ADDED } from "../types"


interface UserBalence {
    [key: string]: {
        available: number
        locked: number
    }
}



export class Engine {

    private orderBooks: OrderBook[] = []
    private balances: Map<string, UserBalence> = new Map()


    process({ message, clientId }: { message: MessageFromApi, clientId: string }) {
        switch (message.type) {
            case CREATE_ORDER:
                try {

                } catch (error) {

                }
        }
    }

    createOrder(market: string, price: number, quantity: number, side: "buy" | "sell", userId: string) {

        const orderBook = this.orderBooks.find(o => o.ticker() === market)

        if (!orderBook) {
            throw new Error("No orderbook found");
        }

        const tradeAsset = market.split("_")[0];
        const priceAsset = market.split("_")[1];


        this.checkAndLockFunds(tradeAsset, priceAsset, side, userId, price, quantity)

        const order: Order = {
            price: price,
            filled: 0,
            orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            quantity: quantity,
            side: side,
            userId: userId
        }

        const { executedQuantity, fills } = orderBook.addOrder(order)

        this.updateBalance(tradeAsset, priceAsset, side, userId, fills);
        this.createDBTrades(fills, market, userId)


    }

    checkAndLockFunds(tradeAsset: string, priceAsset: string, side: "buy" | "sell", userId: string, price: number, quantity: number) {

        const userBalence = this.balances.get(userId)!
        const cost = Number(quantity) * Number(price)

        if (side === "buy") {
            if ((userBalence[priceAsset].available || 0) < cost) {
                throw new Error("Insufficient funds");
            }
            userBalence[priceAsset].available -= cost
            userBalence[priceAsset].locked += cost
        } else {
            if ((userBalence[tradeAsset].available || 0) < quantity) {
                throw new Error("Insufficient quantity to sell");
            }
            userBalence[tradeAsset].available -= quantity
            userBalence[tradeAsset].locked += quantity
        }
    }

    updateBalance(tradeAsset: string, priceAsset: string, side: "buy" | "sell", userId: string, fills: Fill[]) {
        if (side === "buy") {
            fills.forEach(fill => {
                const myBalaence = this.balances.get(userId)
                const sellerBalance = this.balances.get(fill.otherUserId)

                if (myBalaence && sellerBalance) {
                    sellerBalance[tradeAsset].locked -= fill.quantity
                    sellerBalance[priceAsset].available += (fill.quantity * fill.price)

                    myBalaence[priceAsset].locked -= fill.quantity * fill.price
                    myBalaence[tradeAsset].available += fill.quantity
                }
            })
        } else {
            fills.forEach(fill => {
                const myBalence = this.balances.get(userId)
                const buyerBalance = this.balances.get(fill.otherUserId)

                if (myBalence && buyerBalance) {
                    myBalence[tradeAsset].locked -= fill.quantity
                    myBalence[priceAsset].available += fill.quantity * fill.price

                    buyerBalance[tradeAsset].available += fill.quantity
                    buyerBalance[priceAsset].locked -= fill.quantity * fill.price
                }
            })
        }
    }

    createDBTrades(fills: Fill[], market: string, userId: string) {
        fills.forEach(fill => {
            RedisManager.getInstance().pushMessage({
                type: TRADE_ADDED,
                data: {
                    market,
                    id: fill.tradeId.toString(),
                    price: fill.price,
                    quantity: fill.quantity.toString(),
                    priceQuantity: fill.quantity * fill.price,
                    timeStamp: Date.now()
                }
            })
        })
    }

}
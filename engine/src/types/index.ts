export const TRADE_ADDED = "TRADE_ADDED"
export const ORDER_UPDATE = "ORDER_UPDATE"


export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"



export type MessageFromApi = {
    type: typeof CREATE_ORDER
    data: {
        price: number
        quantity: number
        side: "buy" | "sell"
        userId: string
    }
}
    |
{
    type: typeof CANCEL_ORDER
    data: {
        orderId: string
    }
}


export type Order = {
    price: number
    quantity: number
    side: "buy" | "sell"
    userId: string
    orderId: string
    filled: number
}


export type Fill= {
    price: number
    quantity: number
    tradeId: number
    otherUserId: string
    marketOrderId: string
}
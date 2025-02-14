export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";




export type MessageToEngine = {
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
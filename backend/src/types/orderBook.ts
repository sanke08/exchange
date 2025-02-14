
interface OrderBook {
    buy: Array<{ id: number, price: number, quantity: number }>,
    sell: Array<{ id: number, price: number, quantity: number }>,
}

export const orderBook: OrderBook = {
    buy: [],
    sell: []
}


export const bookWithQuantity: {sell: {[price: number]: number}; buy: {[price: number]: number}} = {
    sell: {},
    buy: {}
}
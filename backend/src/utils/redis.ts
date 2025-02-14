import { createClient, RedisClientType } from "redis"


let publisher: RedisClientType | void
let client: RedisClientType | void

export const getClient = () => {
    if (!client) {
        client = createClient()
        client.connect()
    }
    return client
}

export const getPublisher = () => {
    if (!publisher) {
        publisher = createClient()
        publisher.connect()
    }
    return publisher
}
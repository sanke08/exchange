import { createClient, RedisClientType } from "redis";
import { MessageToEngine } from "./types";

export class RedisManager {
    private client: RedisClientType
    private publisher: RedisClientType
    private static instance: RedisManager

    private constructor() {
        this.client = createClient()
        this.client.connect()

        this.publisher = createClient()
        this.publisher.connect()
    }

    public static getInstance(): RedisManager {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    public sendAndWait(message: MessageToEngine) {
        return new Promise((resolve) => {
            const id = this.getRandomId()
            this.client.subscribe(id, (message) => {
                this.client.unsubscribe(id)
                resolve(JSON.parse(message))
            })
            this.publisher.lPush("message", JSON.stringify({ clientId: id, message }))
        })
    }

    public getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }


}
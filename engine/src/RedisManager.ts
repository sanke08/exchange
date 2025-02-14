import { createClient, RedisClientType } from "redis";

export class RedisManager {
    private client: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient()
        this.client.connect()
    }

    public static getInstance() {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    public pushMessage(message: {}) {
        this.client.lPush("db_processor", JSON.stringify(message))
    }

    public publishMessage(channel: string, message: string) {
        this.client.publish(channel, JSON.stringify(message))
    }

    public sendToApi(channelId: string, message: string) {
        this.client.publish(channelId, JSON.stringify(message))
    }

}
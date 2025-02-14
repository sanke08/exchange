import { createClient } from "redis"

const redisClient = createClient()


const main=async()=>{
    await redisClient.connect()
    while (true) {
        const response = await redisClient.rPop("messages")
        if(response){
            // handleOrder(JSON.parse(response))
        }
    }

}
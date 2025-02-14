import { createClient } from "redis"
import { Engine } from "./process/Engine"

const main = async () => {
    const engine = new Engine()
    const client = createClient()
    await client.connect()

    while (true) {
        const res = await client.rPop("messages")
        if(res){
            engine.process(JSON.parse(res))
        }
    }

}
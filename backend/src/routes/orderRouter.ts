import { Router } from "express"
import { getClient, getPublisher } from "../utils/redis";

export const orderRoute = Router()


const getRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


orderRoute.post("/", async (req, res) => {

    const message = { type: "CREATE_ORDER", data: { ...req.body } }
    const response = await new Promise((resolve) => {
        const id = getRandomId()
        getClient().subscribe(id, (message) => {
            getClient().unsubscribe(id)
            resolve(JSON.parse(message))
        })
        getPublisher().lPush("messages", JSON.stringify({ clientId: id, message }))
    })

    res.json(response)

})
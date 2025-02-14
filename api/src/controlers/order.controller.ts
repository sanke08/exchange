import { Request, Response } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER } from "../types";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { price, quantity, side, userId } = req.body()

        const response = await RedisManager.getInstance().sendAndWait({
            type: CREATE_ORDER,
            data: {
                price,
                quantity,
                side,
                userId
            }
        })

        res.status(200).json(response)


    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
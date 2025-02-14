import { Router } from "express";
import { createOrder } from "../controlers/order.controller";

const router = Router();

router.post("/", createOrder);


export const orderRouter = router;
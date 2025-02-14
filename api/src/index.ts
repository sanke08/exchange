import express from "express"
import { orderRouter } from "./routes/order.route";

const app = express();
app.use(express.json());

app.use("/api/v1/order", orderRouter);

app.listen(8800, () => {
    console.log("Server is running on port 3000");
});
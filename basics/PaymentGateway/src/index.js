import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import "dotenv/config";

const app = express();

app.use(express.json());

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const __filename = fileURLToPath(import.meta.url); // current file path from c: (eg, C:\Users\Yadnesh\OneDrive\Desktop\codes\express-backend\basics\ServerSentEvent\src\index.js)
const __dirname = path.dirname(__filename); // current directory path from c: (eg, C:\Users\Yadnesh\OneDrive\Desktop\codes\express-backend\basics\ServerSentEvent\src)

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "success.html"));
});

app.get("/cancel", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "cancle.html"));
});

app.post("/checkout", async (req, res) => {
    try {
        const { quantity } = req.body;
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Premium Plan",
                        },
                        unit_amount: 10000,
                    },
                    quantity: quantity,
                },
            ],
        });
        // console.log(session.url);
        res.json({ url: session.url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

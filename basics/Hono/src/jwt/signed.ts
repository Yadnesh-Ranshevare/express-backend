import type { Context } from "hono";
import { sign } from "hono/jwt";

export const signed = async (c: Context) => {
    const payload = {
        sub: "user123",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };

    const secret = "mySecretKey";

    const token = await sign(payload, secret);

    return c.json({ token });
};

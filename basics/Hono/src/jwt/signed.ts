import type { Context } from "hono";
import { sign } from "hono/jwt";

export const signed = async (c: Context) => {

    const secret_key = "my-secret-key";
    const payload = {
        sub: "user123",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };

    const token = await sign(payload, secret_key);
    return c.json({token});
}
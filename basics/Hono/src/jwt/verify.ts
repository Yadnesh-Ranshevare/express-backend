import type { Context } from "hono";
import { decode, verify } from "hono/jwt";

export const verifyToken = async (c: Context) => {
    const token = c.req.param("token");

    if (!token) return c.json({ error: "No token provided" });

    const secretKey = "mySecretKey";

    const decodedPayload = await verify(token, secretKey, 'HS256')

    return c.json({ decodedPayload });
};

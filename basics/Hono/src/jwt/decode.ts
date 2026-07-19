import type { Context } from "hono";
import { verify } from "hono/jwt";

export const decodeToken = async (c: Context) => {
    const token = c.req.param("token");

    if (!token) return c.json({ error: "No token provided" });

    const secret_key = "my-secret-key";

    const payload = await verify(token, secret_key, "HS256");

    return c.json({ payload });
};

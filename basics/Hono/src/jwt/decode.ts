import type { Context } from "hono";
import { decode } from "hono/jwt";

export const decodeToken = async (c: Context) => {
    const token = c.req.param("token");

    if (!token) return c.json({ error: "No token provided" });

    const { header, payload } = await decode(token);

    return c.json({ header, payload });
};

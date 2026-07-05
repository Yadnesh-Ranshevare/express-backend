import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export const set = (c: Context) => {
    setCookie(c, "Cookie_name", "Cookie_value", { secure: true, httpOnly: true });
    return c.html("<h1>Cookie is set</h1>");
};

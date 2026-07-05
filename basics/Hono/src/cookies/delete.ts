import type { Context } from "hono";
import { deleteCookie } from "hono/cookie";

export const del = (c: Context) => {
    deleteCookie(c, "Cookie_name");
    return c.html("<h1>Cookie is deleted</h1>");
};

import type { Context } from "hono";
import { getCookie } from "hono/cookie";

export const getOne = (c: Context) => {
    const cookie = getCookie(c, "Cookie_name");
    return c.html(`<h1>Cookie is ${cookie}</h1>`);
};

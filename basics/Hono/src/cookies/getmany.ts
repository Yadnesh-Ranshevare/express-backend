import type { Context } from "hono";
import { getCookie } from "hono/cookie";

export const getmany = (c: Context) => {
    const cookie = getCookie(c);
    return c.html(`<h1>Cookie is ${cookie}</h1>`);
};

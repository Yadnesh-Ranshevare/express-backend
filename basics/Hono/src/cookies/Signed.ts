import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";

export const setSigned = async (c: Context) => {
    const secret: string = "my-secret";
    await setSignedCookie(c, "Cookie_name", "Cookie_value", secret);
    return c.html(`<h1>Cookie is set</h1>`);
};

export const getSigned = async (c: Context) => {
    const secret: string = "my-secret";
    const cookie = await getSignedCookie(c, secret, "Cookie_name");
    return c.html(`<h1>Cookie is ${cookie}</h1>`);
};

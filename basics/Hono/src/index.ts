import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { deleteCookie, getCookie, getSignedCookie, setCookie, setSignedCookie, generateCookie, generateSignedCookie } from "hono/cookie";
import { set } from "./cookies/set.js";
import { getOne } from "./cookies/getone.js";
import { getmany } from "./cookies/getmany.js";
import { del } from "./cookies/delete.js";
import { getSigned, setSigned } from "./cookies/Signed.js";
import { decode, sign, verify } from "hono/jwt";

const app = new Hono();

app.get("/", (c) => {
    c.status(201);
    return c.html("<h1>Your post is created!</h1>");
});

app.get("/set-cookie", set);

app.get("/get-cookie", getOne);

app.get("/delete-cookie", del);

app.get("/all-cookies", getmany);

app.get("/set-signed-cookie", setSigned);

app.get("/get-signed-cookie", getSigned);

app.get("/jwt-sign", async (c) => {

    const secret_key = "my-secret-key";
    const payload = {
        sub: "user123",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };

    const token = await sign(payload, secret_key);
    return c.json({token});
});

app.get("/jwt-verify/:token", async (c) => {
    const token = c.req.param("token");
    const secret_key = "my-secret-key";
    const payload = await verify(token, secret_key, "HS256");
    return c.json({payload});
})

app.get("/jwt-decode/:token", async (c) => {
    const token = c.req.param("token");
    const secret_key = "my-secret-key";
    const {header,payload} = await decode(token);
    return c.json({header,payload});
})

serve(
    {
        fetch: app.fetch,
        port: 8787,
    },
    (info) => {
        console.log(`Listening on http://localhost:${info.port}`);
    }
);

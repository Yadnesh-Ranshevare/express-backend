import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { set } from "./cookies/set.js";
import { getOne } from "./cookies/getone.js";
import { getmany } from "./cookies/getmany.js";
import { del } from "./cookies/delete.js";
import { getSigned, setSigned } from "./cookies/Signed.js";
import { signed } from "./jwt/signed.js";
import { verifyToken } from "./jwt/verify.js";
import { decodeToken } from "./jwt/decode.js";
import { proxy } from "hono/proxy";

const app = new Hono();

app.get("/", (c) => {
    c.status(201);
    return c.html("<h1>Your post is created!</h1>");
});

// cookies

app.get("/set-cookie", set);
app.get("/get-cookie", getOne);
app.get("/delete-cookie", del);
app.get("/all-cookies", getmany);
app.get("/set-signed-cookie", setSigned);
app.get("/get-signed-cookie", getSigned);

// JWT
app.get("/jwt-sign", signed);
app.get("/jwt-verify/:token", verifyToken)
app.get("/jwt-decode/:token", decodeToken)

//Proxy
app.get('/proxy/user', (c) => {
  return proxy(`https://jsonplaceholder.typicode.com/users`)
})


function customFetch(url: string) {
  return fetch(url)
}

serve(
    {
        fetch: app.fetch,
        port: 8787,
    },
    (info) => {
        console.log(`Listening on http://localhost:${info.port}`);
    }
);

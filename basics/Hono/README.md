# Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Setup Hono Server](#setup-hono-server)
4. [Context object in Hono](#context-object-in-hono)
5. [Cookies in Hono](#cookies-in-hono)


---
# Introduction
Hono is a lightweight, high-performance web framework for JavaScript and TypeScript. It uses the standard Web APIs (Request, Response, fetch) instead of Node-specific APIs, making it portable across many runtimes.

### Why Hono exists
Traditional frameworks like Express were built specifically for Node.js. Today, applications often run on edge and serverless platforms such as Cloudflare Workers, Vercel Edge Functions, Deno Deploy, or Bun. Hono provides one API that works across all of them.

### Features
Feature | What it means | 
--- | ---
Very fast | Minimal overhead
Tiny size | Small bundle footprint
TypeScript-first | Excellent type safety
Edge-ready | Works well on serverless/edge platforms
Express-like API | Easy to learn if you know Express

### Hono Vs Express

Express | Hono
--- | ---
Node-focused | Works on Node + Edge  
Larger ecosystem | Smaller but growing ecosystem
More overhead | Very lightweight
Common for traditional servers | Excellent for serverless APIs

[Go to Top](#content)

---
# Installation
to install hono run the following command
```bash
npm create hono@latest my-app
```
Then you will be asked which template you would like to use. Let's select nodejs for this example.

```
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
    cloudflare-workers
    deno
    fastly
    nextjs
❯   nodejs
    vercel
````

The template will be pulled into `my-app`, so go to it and install the dependencies.
```bash
cd my-app
npm i
```
Once the package installation is complete, run the following command to start up a local server.
```
npm run dev
```
> To learn about other template visit [Hono/Getting-started official docs](https://hono.dev/docs/getting-started/basic)


### Note:
If your installed Hono project is not present at the root level then after installation `tsconfig.json` might throw an error
```
The common source directory of 'tsconfig.json' is './src'. The 'rootDir' setting must be explicitly set to this or another path to adjust your output's file layout.
  Visit https://aka.ms/ts6 for migration information.
```
This error clearly say to set the root directory explicitly, 

Therefore to solve this error just add following line in `tsconfig.json` and save the file
```json
"compilerOptions" : {
    "rootDir": "./src"
}
```
> error will not resolve until you save the file

[Go to Top](#content)

---
# Setup Hono Server
> Depending on the template you have chosen at the time of installation the code to setup the server changes,  visit [official docs](https://hono.dev/docs/getting-started/basic) to learn how to setup for your template  

Hono syntax is mostly similar to express, so make sure you know about express

code:
```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");   // will send text response
});

serve(app);
```

to run stat server 
```bash
npm run dev
```

now visit or perform GET api call:
```
http://localhost:3000/
```
you'll see `Hello Hono!` text

> Hono by default run on port 3000

###  html response 
```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.html("<h1>Hello Hono!</h1>");  // will send html response
});

serve(app);
```
### JSON response
```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.json({message: "Hello Hono!"});  // will send json response
});

serve(app);
```

### Changing port number
You can specify the `port` number with the port option.
```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

serve({
    fetch: app.fetch,
    port: 8787,     // provide the port number
});
```
now your server is running on port `8787`

### Log the console once the server start
```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

serve(
    {
        fetch: app.fetch,
        port: 8787,
    },
    (info) => {     // info contains the information about the server
        console.log(`Listening on http://localhost:${info.port}`);
    }
);
```
now once you start the server on console you'll see:
```
Listening on http://localhost:8787
```

### Similar to GET you can use other REST API methods
GET
```ts
app.get("/get", (c)=>{...})
```
POST
```ts
app.post("/post", (c)=>{...})
```
PUT
```ts
app.put("/put", (c)=>{...})
```
DELETE
```ts
app.delete("/delete", (c)=>{...})
```
> Although the setup code changes from template to template the pat remain same for all of the template


[Go to Top](#content)

---
# Context object in Hono

If you look at our api
```ts
app.get("/", (c) => {   // what is c here?
    return c.text("Hello Hono!");
});
```
`c` parameter inside the api callback is what we called context object

When someone makes a request to /, Hono automatically creates a Context object and passes it to your handler.

Think of it as Hono's equivalent of Express's `req` and `res` combined into a single object.

### What's inside `c` ?
The Context contains everything related to the current HTTP request and response.

it includes things like:
- Request (`c.req`)
- Methods to send responses (`c.text()`, `c.json()`, `c.html()`)
- Headers
- Cookies
- Environment variables
- Execution context (on some platforms)


### Accessing the request
```ts
app.get("/user/:id", (c) => {
    const id = c.req.param("id")

    return c.text(id)
})
```
request is:
```
GET /user/42
```
then
```ts
id = "42"
```
### Query parameters
```ts
app.get("/search", (c) => {
    const q = c.req.query("q")

    return c.text(q)
})
```
request is:
```
GET /search?q=hono
```
then:
```ts
q = "hono"
```

### JSON body
```ts
app.post("/users", async (c) => {
    const body = await c.req.json()

    return c.json(body)
})
```
If the client sends:
```json
{
  "name": "Yadnesh"
}
```
You can access it as:
```ts
body.name
```
### Sending responses
Text:
```ts
return c.text("Hello")
```
JSON:
```ts
return c.json({ message: "Hello" })
```
HTML:
```ts
return c.html("<h1>Hello</h1>")
```
Status code with JSON:
```ts
return c.json(
    { error: "Not found" },
    404
)
```
Status code without JSON:
```ts
app.post('/posts', (c) => {
  // Set HTTP status code
  c.status(201)
  return c.text('Your post is created!')    // you can use c.text, c.html or c.json
})
```


[Go to Top](#content)

---
# Cookies in Hono
hono provide the inbuilt helper  for cookies
### 1. set cookies
basic
```ts
import { setCookie } from "hono/cookie";

app.get("/set-cookie", (c) => {
    setCookie(c, "Cookie_name", "Cookie_value");
    return c.html("<h1>Cookie is set</h1>");
});
```
with option:
```ts
import { setCookie } from "hono/cookie";

app.get("/set-cookie", (c) => {
    setCookie(c, "Cookie_name", "Cookie_value", { secure: true, httpOnly: true });
    return c.html("<h1>Cookie is set</h1>");
});
```

### 2. get single cookies
```ts
import { getCookie } from "hono/cookie";

app.get("/get-cookie", (c) => {
    const cookie = getCookie(c, "Cookie_name");     // pass c with "cookie_name"
    return c.html(`<h1>Cookie is ${cookie}</h1>`);  // output will be cookie value
});
```
### 3. get all available cookies
```ts
import { getCookie } from "hono/cookie";

app.get("/get-cookie", (c) => {
    const cookie = getCookie(c);    // only pass c
    return c.json(cookies);     // output will be json {"cookie1":"value1", "cookie2":"value2", "cookie3":"value3"}
});
```
### 4. delete cookies
```ts
import { deleteCookie } from "hono/cookie";

app.get("/delete-cookie", (c) => {
    deleteCookie(c, "Cookie_name");
    return c.html("<h1>Cookie is deleted</h1>");
});
```

### 5. Signed cookies
Signed cookies are cookies that include a cryptographic signature to detect tampering.

A signed cookie does not hide the data. It only proves that the data hasn't been modified by the client.

>- Signed cookie → Data is readable but protected against modification.
>- Encrypted cookie → Data is hidden from the client.

set cookies:
```ts
import { setSignedCookie } from "hono/cookie";

app.get("/set-signed-cookie", async(c) => {
    const secret:string = "my-secret"; 

    await setSignedCookie(c, "Cookie_name", "Cookie_value", secret);

    return c.html(`<h1>Cookie is set</h1>`); 
});
```
the actual cookies set into the browser:
```
Cookie_value.bAbRD3Dw2Fl8viuFrsAWHPek0ekpHZwGNNr96APRBok%3D
```
get cookies
```ts
import { setSignedCookie } from "hono/cookie";

app.get("/get-signed-cookie", async(c) => {
    const secret:string = "my-secret";

    const cookie = await getSignedCookie(c, secret, "Cookie_name",);

    return c.html(`<h1>Cookie is ${cookie}</h1>`); 
});
```
> if you try to modify the cookies in browser then getSignedCookie will return undefined

[Go to Top](#content)

---
# JWT in Hono
### 1. signed
This function generates a JWT token by encoding a payload and signing it using the specified algorithm and secret.
```ts
sign(
  payload: unknown,
  secret: string,
  alg?: 'HS256';    // HS256 is default value

): Promise<string>;
```

code
```ts
app.get("/jwt-sign", async (c) => {
    const secret_key = "my-secret-key";

    const payload = {
        sub: "user123",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };

    const token = await sign(payload, secret_key);  //alg will be HS526 (default)

    return c.json({token});
});
```
output:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzgzMjY0NTE1fQ.L3stRQCDngzE4P2PMlQx5ErBRrzE1HYwLwpAykNEsxE"
}
```
### 2. Verify
This function checks if a JWT token is genuine and still valid. It ensures the token hasn't been altered 
```ts
app.get("/jwt-verify/:token", async (c) => {
    const token = c.req.param("token");

    const secret_key = "my-secret-key";

    const payload = await verify(token, secret_key, "HS256");   // HS256 is encryption algorithm

    return c.json({payload});
})
```
output:
```json
{
    "payload": {
        "sub": "user123",
        "role": "admin",
        "exp": 1783264515
    }
}
```

### 3. decode
This function decodes a JWT token without performing signature verification. It extracts and returns the header and payload from the token.
```ts
app.get("/jwt-decode/:token", async (c) => {
    const token = c.req.param("token");
    
    const {header,payload} = await decode(token);

    return c.json({header,payload});
})
```
Output:
```json
{
    "header": {
        "alg": "HS256",
        "typ": "JWT"
    },
    "payload": {
        "sub": "user123",
        "role": "admin",
        "exp": 1783264515
    }
}
```

[Go to Top](#content)

---
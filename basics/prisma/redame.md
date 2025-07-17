# Content
1. [Introduction](#introduction)
2. [Initialization](#initialization)
3. [Connecting Prisma With Mongodb](#connecting-prisma-with-mongodb)
4. [Install Prisma Client](#install-prisma-client)
5. [CURD operation](#curd-operation)


# Introduction
**Prisma is an open-source Node.js and TypeScript ORM (Object-Relational Mapping) tool that helps you interact with databases more easily and safely.**

### What Prisma Does:
1. Maps database tables to JavaScript/TypeScript objects
You work with objects instead of writing SQL queries.

2. Auto-generates type-safe queries
Helps avoid runtime bugs by catching errors at compile time.

3. Provides an easy way to manage database schema (tables, columns)
You define your tables in a .prisma schema file.

### Installation
```bash
npm i -D prisma 
```
[Go To Top](#content)

---


# Initialization
```bash
npm prisma init
```

this will create the two new files i.e, `prisma/schema.prisma` and `.env`

1. `prisma/schema.prisma`
```prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Note: your code editor theme will not work on `.prisma` file 

2. `.env`

```env
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following `prisma+postgres` URL is similar to the URL produced by running a local Prisma Postgres 
# server with the `prisma dev` CLI command, when not choosing any non-default ports or settings. The API key, unlike the 
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ"
```
[Go To Top](#content)

---

# Connecting Prisma With Mongodb
1. change the database url from `.env` file
```env
DATABASE_URL="your-mongodb-url"
```
2. change the `db.provider` from the file `prisma/schema.prisma`
```prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mongodb"       // add mongodb as provider for connecting with mongodb
  url      = env("DATABASE_URL")
}
```
3. configure your Database schema in `prisma/schema.prisma` file
```prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mongodb"      
  url      = env("DATABASE_URL")
}


// user schema
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  name String? 
  email String @unique
  password String
  posts Post[]
}

// post schema
model Post {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  slug String
  title String
  body String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String @db.ObjectId
}
```
[click here to learn more about schema](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)


[Go To Top](#content)

---
# Install Prisma Client

- Prisma Client is an auto-generated JavaScript/TypeScript library that lets you interact with your database using simple JS code instead of writing raw SQL or complex MongoDB queries.

- It’s created by Prisma based on your data model (schema.prisma).

To get started with Prisma Client, you need to install the `@prisma/client` package:

```bash
npm install @prisma/client
```

Then, run `prisma generate` which reads your Prisma schema and generates the Prisma Client.
```bash
npx prisma generate
```

Whenever you update your Prisma schema, you will need to run the `prisma db push` command to create new indexes and regenerate Prisma Client.

**Note: in `prisma/schema.prisma` you can define where you can generate the client while will generate the client at designated location by default the location is set to `node_modules/@prisma/client`**

```prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"      // give the path to generate the client here 
}
```

### now you can import the prisma client 
1. if the generator is present at custom location
```js
import { PrismaClient } from "./generated/prisma/index.js"  // make sure to use proper path to index.js in generated code
const prisma = new PrismaClient()
```
2. if generator is at `node_modules/@prisma/client` (default location)
```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
```

### Best practices for importing the prisma client
- from above example we can see that we need two lines to use prisma properly
- one line for importing the prisma client
- second line for accessing `prisma` from the prisma client
- Therefor instead of writing this two line every time we want to use `prisma` which is hard to understand we create new file `prisma/index.js`
```js
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export default prisma
```
- now every time we want to use `prisma` we can import them from this file which can be easy to understand

[Go To Top](#content)

---
# CURD operation

[To learn more about CURD operation](https://www.prisma.io/docs/orm/prisma-client/queries/crud)

[Go To Top](#content)

---
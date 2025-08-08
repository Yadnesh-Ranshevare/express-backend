# Content
1. [Introduction](#introduction)
2. [Initialization](#initialization)
3. [Connecting Prisma With Mongodb](#connecting-prisma-with-mongodb)
4. [Install Prisma Client](#install-prisma-client)
5. [CURD operation](#curd-operation)
6. [Select Felid](#select-fields)
7. [Filtration and Sorting](#filtering-and-sorting)

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
npx prisma init
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

For relational databases, use db push command to push the example schema to your own database
```bash
npx prisma db push
```


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
- [create](#1-create)
- [Read](#2-read)
- [Update](#3-update)
- [Delete](#4-delete)

## 1. create
- creating a single record
```ts
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})
```

- Create multiple records
```ts
const createMany = await prisma.user.createMany({
  data: [
    { name: 'Bob', email: 'bob@prisma.io' },
    { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
    { name: 'Yewande', email: 'yewande@prisma.io' },
    { name: 'Angelique', email: 'angelique@prisma.io' },
  ],
  skipDuplicates: true, // Skip 'Bobo'
})
```

> Note skipDuplicates is not supported when using MongoDB, SQLServer, or SQLite.

- createManyAndReturn
```ts
const users = await prisma.user.createManyAndReturn({
  data: [
    { name: 'Alice', email: 'alice@prisma.io' },
    { name: 'Bob', email: 'bob@prisma.io' },
  ],
})
```

## 2. Read

- Get all records
```ts
const users = await prisma.user.findMany()
```
- Get the first record that matches a specific criteria
```ts
// By ID
const user = await prisma.user.findFirst({
  where: {
    id: '60d5922d00581b8f0062e3a8',
  },
})
```

- Get the all the record that matches a specific criteria
```ts
const users = await prisma.user.findMany({
  where: {
    id: '60d5922d00581b8f0062e3a8',
  },
})
```


- Get record by ID or unique identifier / findUnique()

>The following queries return a single record (findUnique()) by unique identifier or ID:
```ts
// By unique identifier
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io',
  },
})

// By ID
const user = await prisma.user.findUnique({
  where: {
    id: 99,
  },
})
```
## 3. Update
- Update a single record
```ts
const updateUser = await prisma.user.update({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
```
- Update multiple records
```ts
const updateUser = await prisma.user.updateMany({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
```
- Update and return multiple records
```ts
const updateUser = await prisma.user.updateManyAndReturn({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
```
- Update or create records
```ts
const upsertUser = await prisma.user.upsert({
  where: {
    email: 'viola@prisma.io',
  },
  update: {
    name: 'Viola the Magnificent',
  },
  create: {
    email: 'viola@prisma.io',
    name: 'Viola the Magnificent',
  },
})
```

## 4. Delete
- Delete a single record
```ts
const deleteUser = await prisma.user.delete({
  where: {
    email: 'bert@prisma.io',
  },
})
```
- Delete multiple records
```ts
const deleteUser = await prisma.user.deleteMany({
  where: {
    isVerified: false,
  },
})
```
- Delete all records
```ts
const deleteUsers = await prisma.user.deleteMany({})
```


[Go To Top](#content)

---
# Select fields
By default, when a query returns records (as opposed to a count), the result includes:

- All scalar fields of a model (including enums)
- No relations defined on a model

As an example, consider this schema:
```js
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  published Boolean  @default(false)
  title     String  
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

enum Role {
  USER
  ADMIN
}
```
A query to the `User` model will include the `id`, `email`, `name` and `role` fields (because these are scalar fields), but not the `posts` field (because that's a relation field):
```js
const users = await prisma.user.findFirst()
```
Result
```js
{
  id: 42,
  name: "Sabelle",
  email: "sabelle@prisma.io",
  role: "ADMIN"
}
```
If you want to customize the result and have a different combination of fields returned, you can:

- **Use `select` to return specific fields. You can also use a nested select by selecting relation fields.**
- **Use `omit` to exclude specific fields from the result. omit can be seen as the "opposite" to select.**
- **Use `include` to additionally include relations.**


### Select specific fields
Use select to return a subset of fields instead of all fields. The following example returns the email and name fields only:
```js
const user = await prisma.user.findFirst({
  select: {
    email: true,
    name: true,
  },
})
```
Result
```js
{
  name: "Alice",
  email: "alice@prisma.io",
}
```
### Return nested objects by selecting relation fields
You can also return relations by nesting select multiple times on relation fields.

The following query uses a nested select to select each user's name and the title of each related post:
```js
const usersWithPostTitles = await prisma.user.findFirst({
  select: {
    name: true,
    posts: {
      select: { title: true },
    },
  },
})
```
Result
```js
{
  "name":"Sabelle",
  "posts":[
    { "title":"Getting started with Azure Functions" },
    { "title":"All about databases" }
  ]
}
```

### using include to add relation
The following query uses `select` within an `include`, and returns all user fields and each post's `title` field:
```js
const usersWithPostTitles = await prisma.user.findFirst({
  include: {
    posts: {
      select: { title: true },
    },
  },
})
```
Result
```js
{
  id: 9
  name: "Sabelle",
  email: "sabelle@prisma.io",
  password: "mySecretPassword42",
  role: "USER",
  coinflips: [],
  posts:[
    { title:"Getting started with Azure Functions" },
    { title:"All about databases" }
  ]
}
```

### Omit specific fields
There may be situations when you want to return most fields of a model, excluding only a small subset. A common example for this is when you query a `User` but want to exclude the `password` field for security reasons.

In these cases, you can use `omit`, which can be seen as the counterpart to `select`:

```js
const users = await prisma.user.findFirst({
  omit: {
    password: true
  }
})
```
Result
```js
{
  id: 9
  name: "Sabelle",
  email: "sabelle@prisma.io",
  profileViews: 90,
  role: "USER",
  coinflips: [],
}
```
[Go To Top](#content)

---
# Filtering and Sorting
Prisma Client supports filtering with the where query option, and sorting with the orderBy query option.

**Returns all User records with an email address that ends with `prisma.io` and**
```js
const result = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
    }
  }
})
```

**Returns all User records with at least one published post (a relation query)**
```js
const result = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true,    
      },
    },
  }
})
```
[click here to learn about more filter operators](https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators)


### Sorting
Use `orderBy` to sort a list of records or a nested list of records by a particular field or set of fields. For example, the following query returns all `User` records sorted by `role` and `name`, and each user's posts sorted by `title`:
```js
const usersWithPosts = await prisma.user.findMany({
  orderBy: [
    {
      role: 'desc',
    },
    {
      name: 'desc',
    },
  ],
  include: {
    posts: {
      orderBy: {
        title: 'desc',
      },
      select: {
        title: true,
      },
    },
  },
})
```
### Sort by relation
```js
const posts = await prisma.post.findMany({
  orderBy: {
    author: {
      email: 'asc',
    },
  },
})
```


[Go To Top](#content)

---

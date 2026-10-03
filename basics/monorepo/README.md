# Content

1. [Introduction](#introduction)
2. [Turborepo](#turborepo)
3. [Understand the folder and file structure of the Turborepo](#understand-the-folder-and-file-structure-of-the-turborepo)
4. [How to Create a new App ](#how-to-create-a-new-app)
5. [How to create a new package](#how-to-create-a-new-package)
6. [How does packages communicate with app](#how-does-packages-communicate-with-app)

[Acknowledgment](#acknowledgment)

---

# Introduction
A monorepo (monolithic repository) is a software-development approach where you keep multiple applications/packages/projects inside a single Git repository.

### Monorepo vs Polyrepos
Polyrepo is a software development approach where each project or application is stored and managed in its own separate Git repository.

**Example:**
```
GitHub
├── company-frontend
├── company-admin
├── company-backend
├── company-ui
└── company-database
```
Each project has its own repository.

**With monorepo:**
```
GitHub
└── company-platform
    ├── apps/
    │   ├── frontend
    │   ├── admin
    │   └── backend
    └── packages/
        ├── ui
        ├── database
        └── auth
```
One repository contains everything.

### Monorepo Vs Polyrepo

| **Monorepo**                                          | **Polyrepo**                                           |
| ----------------------------------------------------- | ------------------------------------------------------ |
| Multiple projects in **one repository**               | Each project has its **own repository**                |
| One GitHub repo                                       | Multiple GitHub repos                                  |
| Easy to share code                                    | Sharing code requires packages/libraries               |
| Centralized management                                | Each project is managed separately                     |
| Example: `company/` contains frontend, backend, admin | Example: `frontend-repo`, `backend-repo`, `admin-repo` |
| **One big repo**                                  | **Multiple repos**                           |


### Why use a monorepo?
The biggest advantage is sharing code easily.

For example, you have a Button component:
```
packages/ui/
└── Button.tsx
```
Your applications can all use it:

```
apps/web       → @company/ui
apps/admin     → @company/ui
apps/mobile    → @company/ui
```
Change the Button once → every application can use the updated version.

### Tools commonly used
You don't need a special tool to make a monorepo. But tools make managing one much easier.

1. **Turborepo**

    Vercel's Turborepo is very popular with JavaScript/TypeScript monorepos.
    > [Checkout official doc](https://turborepo.dev/)
2. **Nx**

    Nx is another major monorepo/build-system option.
    > [Checkout official doc](https://nx.dev/)

[Go To Top](#content)

---
# Turborepo
Turborepo is a build system for JavaScript/TypeScript monorepos build by vercel. It helps you manage multiple apps and shared packages inside one repository efficiently.

### what does Turborepo actually do?
Suppose you run:
```
turbo build
```
You have:
```
web      → build
admin    → build
api      → build
```
Turborepo figures out what needs to be built, in what order, and what can be skipped or run in parallel.

### One command for the whole repository
Without a build system, you might have to do:
```
cd apps/web
npm run build

cd ../admin
npm run build

cd ../api
npm run build
```
With Turborepo:
```
turbo build
```
Similarly:
```
turbo dev
turbo lint
turbo test
```
### Turborepo Vs Monorepo

| **Monorepo**                                               | **Turborepo**                                             |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| A **way of organizing** your code                          | A **tool** for managing that code                         |
| Keeps multiple projects in **one repository**              | Helps run/manage those projects **efficiently**           |
| Example: Website + Backend + Admin in one repo             | Example: Build Website + Backend together                 |
| It's a **concept/structure**                               | It's a **software tool**                                  |
| Doesn't automatically provide caching or task optimization | Provides **caching, parallel execution, task management** |
| You can use it **without Turborepo**                       | Usually used **with a monorepo**                          |
| Think: **"Where do I keep my projects?"**                  | Think: **"How do I efficiently manage these projects?"**  |
| **One big folder/repository**                          |  **Manager for that folder/repository**                 |

### Installation

```bash
npx create-turbo@latest     # npm
# Or
bunx create-turbo@latest    # bun
```

This will create a basic turborepo project for you

> Checkout [official doc](https://turborepo.dev/docs/getting-started/installation) to know more

[Go To Top](#content)

---

# Understand the folder and file structure of the Turborepo

default Turborepo monorepo structure roughly like this:
```
my-turborepo/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── docs/
│       ├── app/
│       ├── package.json
│       └── ...
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   │
│   ├── eslint-config/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── typescript-config/
│       ├── package.json
│       └── ...
│
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```
> The important thing to understand is that Turborepo itself isn't a framework that dictates exactly how your application folders must look. It's a build/orchestration layer for a monorepo.

Lets look at some of the most important files:

### 1. `apps/`
This is generally where your deployable applications live.

For example:
```
apps/
├── web/
├── admin/
└── api/
```

### 2. `packages/`
`packages/` contains shared code.

These aren't necessarily applications.

They're libraries/configurations that multiple apps can consume.

For example:

- Suppose you have:

    ```
    apps/
    ├── web/
    └── admin/
    ```
- Both need the same Button component therefore, instead of doing:
    ```
    apps/web/components/Button.tsx
    apps/admin/components/Button.tsx
    ```
- you can create:
    ```
    packages/
    └── ui/
        ├── src/
        │   └── button.tsx
        └── package.json
    ```
- Then both applications can use the same components:
    ```js
    import { Button } from "@repo/ui/button";
    ```

similarly you can configure database that is multiple applications can use the same database layer:
```
                 database
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
         web       api      admin
```
### 3. Root `package.json`
Present at the root:
```
my-turborepo/
└── package.json
```
This controls the whole monorepo.

For example:
```json
{
  "name": "my-turborepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "check-types": "turbo run check-types"
  },
  "devDependencies": {
    "turbo": "^2.x"
  }
}
```
Notice something important:
```
turbo run build
```
at the root can effectively trigger builds across your apps/packages through Turbo.


### 4. turbo.json
This is the brain of Turborepo's task orchestration.

Suppose your repo is:
```
my-project/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   └── ui/
│
├── package.json
└── turbo.json
```
And:
```
web → uses ui
api → doesn't use ui
```


**Without `turbo.json`**
- Turbo doesn't know the rules you want for your tasks.
- You could manually do:

    ```bash
    cd packages/ui
    pnpm build

    cd ../../apps/web
    pnpm build

    cd ../api
    pnpm build
    ```
- But that's exactly the kind of coordination Turbo is supposed to handle.

**`turbo.json` tells Turbo the rules**

For example:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```
The important part is:
```json
"dependsOn": ["^build"]
```
The `^` means:
>Before running this package's build, run build on its dependencies.

So if:
```
web → Depends on → ui
```
Therefore:
```
turbo build
```
effectively does:
```
1. Build ui
       ↓
2. Build web
```
While `api` can build independently:
```
        ┌── ui ──→ web
turbo ──┤
        └── api
```
Turbo can run independent work in parallel.





[Go To Top](#content)

---
# How to Create a new App 
Turborepo itself doesn't create the app framework for you. You create something like a Next.js, React, Vite, or Expo app inside `apps/`, and Turborepo manages it as a workspace.

### 1. Create the app

From the root of your Turborepo navigate the app folder:
```bash
cd app
```
here you can create your new app
```bash
npx create-next-app@latest admin
# or
bunx create-next-app@latest admin
```

this creates:
```
my-turborepo/
└── apps/
    ├── web/          ← existing app
    └── admin/        ← new app
```
### 2. The important part: `package.json`
Your new app gets its own `package.json`:
```json
// ./my-turborepo/app/admin/package.json
{
  "name": "admin",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "...",
    "react": "...",
    "react-dom": "..."
  }
}
```
This is what makes `admin` an independent workspace/app inside the monorepo.

### 3. Run the new app
your `apps/admin/package.json` has a dev script
```json
{
  "name": "admin",
  "scripts": {
    "dev": "next dev"
  }
}
```
now you can `cd` into this app and execute this `dev` script:
```bash
cd apps/admin
```
```bash
bun run dev
# or 
npm run dev
```

you also have `package.json` at the root which can run this app for you
```json
// ./my-turborepo/package.json
{
    "name": "monorepo",
    "private": true,
    "scripts": {
        "build": "turbo run build",
        "dev": "turbo run dev",
    }
}
```

now run the `dev` script
```bash
npm run dev
# or
bun run dev
```
this will run all the app present in your monorepo

to run a specific app
```bash
npm run --filter newapp dev
# or
bun --filter newapp dev
```
here `newapp` is the name of your app present inside your `package.json`


[Go To Top](#content)

---
# How to create a new package
In a Turborepo, creating a package is basically creating a new folder under `packages/` and giving it its own `package.json`.

Suppose your repo looks like:

```
my-turborepo/
├── apps/
│   ├── web/
│   └── docs/
│
├── packages/
│   ├── ui/
│   └── config/
│
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```
### 1. Create the package folder
For example, let's create a `utils` package:
```bash
mkdir packages/utils
```
Now you have:
```
packages/
├── ui/
├── config/
└── utils/
```
### 2. Create package.json
Inside `packages/utils/package.json`:
```json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./*": "./src/*.ts"
  }
}
```
Now create:
```
packages/utils/
├── package.json
└── src/
    └── index.ts
```
For example:
```js
// packages/utils/src/index.ts

export function add(a: number, b: number) {
  return a + b;
}
```
This `add` is your new package you can use into another app
### 3. Use the package from an app
Suppose you want to use `@repo/utils` inside `apps/web`.

Add it to `apps/web/package.json`:
```json
{
  "dependencies": {
    "@repo/utils": "workspace:*"
  }
}
```
Then run:
```bash
npm inatsll
# or
bun install
```
Now you can import it:
```js
import { add } from "@repo/utils/index"
```

[Go To Top](#content)

---

# How does packages communicate with app
They communicate through normal package imports. Turborepo itself doesn't create some special communication system.

>idea is a package is basically a reusable npm package that happens to live inside your monorepo.

### For example:
```
my-project/
│
├── apps/
│   └── web/
│       ├── app/
│       └── package.json
│
└── packages/
    └── ui/
        ├── src/
        │   ├── button.tsx
        │   └── input.tsx
        └── package.json
```
1. **Give the package a name**
    - `packages/ui/package.json:`

        ```json
        {
          "name": "@repo/ui",
          "version": "0.0.0"
        }
        ```
    - Now `@repo/ui` is the package's name.

2. **Export it from the package**
    - For example:

        ```
        packages/ui/
        └── src/
            └── button.tsx
        ```
        ```jsx
        export function Button() {
            return (
                <button>Click me</button>
            )
        }
        ```
    - Then expose it through the package's exports.
    - For example, `packages/ui/package.json` might contain:
        ```json
        {
          "name": "@repo/ui",
          "exports": {
            "./button": "./src/button.tsx"
          }
        }
        ```
    - to expose everything write this in `packages/ui/package.json`:
        ```json
        {
          "name": "@repo/ui",
          "exports": {
            "./*": "./src/*.tsx"
          }
        }
        ```
        > It means allow consumers of this package to import files from `src/`, and map the import name to the corresponding `.tsx` file.
        >- that is, if you do:
        >
        >    ```js
        >    import { Button } from "@repo/ui/button"
        >    ```
        >- Node/bundler sees:
        >
        >    ```
        >    @repo/ui/button
        >           │
        >           │ *
        >           ↓
        >    ./src/button.tsx
        >    ```
        >- So:
        >   ```
        >   @repo/ui/button
        >           ↓
        >   packages/ui/src/button.tsx
        >   ```
3. **declares the package as a dependency inside your app**
    - `apps/web/package.json:`

        ```json
        {
          "dependencies": {
            "@repo/ui": "workspace:*"
          }
        }
        ```
    - The important part is:
        ```json
        "@repo/ui": "workspace:*"
        ```
    - This means:\
    "I want to use the `@repo/ui` package from current workspace (monorepo)."
    - install the dependencies
        ```bash
        npm install
        # Or
        bun install
        ```
    - Now your package manager (`bun`, for example) links them together.
    - Conceptually:
        ```
        apps/web
           │
           │ depends on
           ↓
        packages/ui
        ```
    - Now you can:
        ```js
        import { Button } from "@repo/ui/button"
        ```

    

[Go To Top](#content)

---

# Acknowledgment

- A blog to understand the monorepo: https://monorepo.tools/
- [Chai aur Code](https://www.youtube.com/@chaiaurcode): turborepo one shot video
- official website: https://turborepo.dev/
- docs: https://turborepo.dev/docs
---
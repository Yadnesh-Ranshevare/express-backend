# Content

1. [Introduction](#introduction)
2. [Turborepo](#turborepo)

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
| 🗂️ **One big repo**                                  | 🗂️🗂️🗂️ **Multiple repos**                           |


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



[Go To Top](#content)

---
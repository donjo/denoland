---
description: Scaffold a new Deno project with modern best practices
argument-hint: "[project-name]"
---

# Initialize a New Deno Project

You are helping the user create a new Deno project. Guide them through the setup process, explaining each step along the way.

## Step 1: Understand What They Want to Build

If the user didn't specify a project type, ask them using AskUserQuestion:

**Question:** "What type of Deno project would you like to create?"

**Options:**
1. **Fresh web app** - Full-stack web application with Fresh framework (recommended for web apps)
2. **CLI tool** - Command-line application
3. **Library** - Reusable package to publish on JSR
4. **API server** - Backend API without frontend

## Step 2: Get Project Details

If not provided in `$ARGUMENTS`, ask for:
- **Project name** - Will be used as the folder name

## Step 3: Create the Project

Based on their choice, follow the appropriate setup:

### For Fresh Web App

```bash
deno run -Ar jsr:@fresh/init $PROJECT_NAME
cd $PROJECT_NAME
```

Explain what Fresh created:
- `deno.json` - Project configuration and dependencies
- `main.ts` - Entry point that starts the server
- `fresh.gen.ts` - Auto-generated manifest (don't edit manually)
- `routes/` - Pages and API routes (file-based routing)
- `islands/` - Interactive components that get JavaScript on the client
- `components/` - Server-only components (no JavaScript shipped)
- `static/` - Static assets like images, CSS

**Important:** Fresh uses Vite for development. The dev server runs at `http://localhost:5173` (NOT port 8000).

### For CLI Tool

Create these files:

**deno.json:**
```json
{
  "name": "$PROJECT_NAME",
  "version": "0.1.0",
  "exports": "./main.ts",
  "tasks": {
    "dev": "deno run --allow-all main.ts",
    "compile": "deno compile --allow-all -o $PROJECT_NAME main.ts"
  },
  "imports": {
    "@std/cli": "jsr:@std/cli@^1",
    "@std/fmt": "jsr:@std/fmt@^1"
  }
}
```

**main.ts:**
```typescript
import { parseArgs } from "@std/cli/parse-args";
import { bold, green } from "@std/fmt/colors";

const args = parseArgs(Deno.args, {
  boolean: ["help", "version"],
  alias: { h: "help", v: "version" },
});

if (args.help) {
  console.log(`
${bold("$PROJECT_NAME")} - A Deno CLI tool

${bold("USAGE:")}
  $PROJECT_NAME [OPTIONS]

${bold("OPTIONS:")}
  -h, --help     Show this help message
  -v, --version  Show version
`);
  Deno.exit(0);
}

if (args.version) {
  console.log("$PROJECT_NAME v0.1.0");
  Deno.exit(0);
}

console.log(green("Hello from $PROJECT_NAME"));
```

### For Library

Create these files:

**deno.json:**
```json
{
  "name": "@username/$PROJECT_NAME",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "test": "deno test",
    "check": "deno check mod.ts",
    "publish": "deno publish"
  }
}
```

**mod.ts:**
```typescript
/**
 * $PROJECT_NAME - A Deno library
 *
 * @module
 */

/**
 * Example function - replace with your library's functionality
 *
 * @param name The name to greet
 * @returns A greeting message
 *
 * @example
 * ```ts
 * import { greet } from "@username/$PROJECT_NAME";
 * console.log(greet("World")); // "Hello, World"
 * ```
 */
export function greet(name: string): string {
  return `Hello, ${name}`;
}
```

**mod_test.ts:**
```typescript
import { assertEquals } from "jsr:@std/assert";
import { greet } from "./mod.ts";

Deno.test("greet returns correct message", () => {
  assertEquals(greet("World"), "Hello, World");
});
```

Remind them to:
- Replace `@username` with their JSR username
- Run `deno publish` to publish to JSR

### For API Server

Create these files:

**deno.json:**
```json
{
  "tasks": {
    "dev": "deno run --watch --allow-net main.ts",
    "start": "deno run --allow-net main.ts"
  },
  "imports": {
    "@std/http": "jsr:@std/http@^1"
  }
}
```

**main.ts:**
```typescript
import { serve } from "@std/http";

const handler = (request: Request): Response => {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    return new Response("Welcome to the API", {
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (url.pathname === "/api/hello") {
    return Response.json({ message: "Hello from Deno" });
  }

  return new Response("Not Found", { status: 404 });
};

console.log("Server running at http://localhost:8000");
serve(handler, { port: 8000 });
```

## Step 4: Run Initial Setup

After creating files:

```bash
cd $PROJECT_NAME
deno install          # Install dependencies
deno fmt              # Format the code
deno lint             # Check for issues
```

## Step 5: Explain Next Steps

Tell the user:

1. **Start developing:**
   - Fresh: `deno task dev` (runs at http://127.0.0.1:5173/)
   - CLI: `deno task dev`
   - Library: `deno test`
   - API: `deno task dev`

2. **Useful commands:**
   - `deno fmt` - Format code
   - `deno lint` - Check for issues
   - `deno test` - Run tests
   - `deno add jsr:@std/...` - Add packages

3. **When ready to deploy:**
   - `deno task build` (for Fresh)
   - `deno deploy --prod`

## Important Notes

- Always use `jsr:` imports for Deno packages
- Never suggest `https://deno.land/x/` - it's deprecated
- Encourage running `deno fmt` and `deno lint` regularly
- Projects are configured for Deno Deploy compatibility

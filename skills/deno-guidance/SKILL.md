---
name: deno-guidance
description: Core Deno development best practices, JSR package management, and deployment workflows
---

# Deno Development Guidance

This skill provides foundational knowledge for building modern Deno applications. Apply these practices whenever working in a Deno project (identified by the presence of `deno.json`).

## Package Management Priority

When adding dependencies, follow this priority order:

1. **JSR packages (`jsr:`)** - Preferred for Deno-native packages
   - Better TypeScript support (types are built-in)
   - Faster to resolve and install
   - Example: `jsr:@std/http`, `jsr:@fresh/core`

2. **npm packages (`npm:`)** - Fully supported, use when no JSR alternative exists
   - Deno has full npm compatibility
   - Example: `npm:express`, `npm:zod`

3. **AVOID: `https://deno.land/x/`** - Deprecated registry
   - This is the old package registry
   - Many LLMs incorrectly default to this
   - Always use `jsr:` instead

### Standard Library

The Deno standard library lives at `@std/` on JSR:

```typescript
import { serve } from "jsr:@std/http";
import { join } from "jsr:@std/path";
import { assertEquals } from "jsr:@std/assert";
```

Never use `https://deno.land/std/` - always use `jsr:@std/*`.

## Understanding Deno

Reference: https://docs.deno.com/runtime/fundamentals/

Key concepts:
- **Native TypeScript** - No build step needed, Deno runs TypeScript directly
- **Explicit permissions** - Use flags like `--allow-net`, `--allow-read`, `--allow-env`
- **deno.json** - The config file (similar to package.json but simpler)
- **Import maps** - Define import aliases in deno.json's `imports` field

## Workflow Best Practices

### After Making Code Changes

Run these commands regularly, especially after significant changes:

```bash
deno fmt          # Format all files
deno lint         # Check for issues
deno test         # Run tests
```

### Package Management

```bash
deno add jsr:@std/http    # Add a package
deno install              # Install all dependencies
deno upgrade              # Update packages to latest
```

### Configuration

In `deno.json`, you can exclude directories from formatting/linting:

```json
{
  "fmt": {
    "exclude": ["build/", "node_modules/"]
  },
  "lint": {
    "exclude": ["build/", "node_modules/"]
  }
}
```

## Deno Deploy Workflow

Reference: https://docs.deno.com/deploy/
CLI Reference: https://docs.deno.com/runtime/reference/cli/deploy/

Deno Deploy is the recommended deployment platform for Deno applications.

### Deployment Commands

```bash
deno deploy create --org my-org    # Create a new app
deno deploy env add KEY "value"    # Add environment variable
deno deploy env load .env.prod     # Load env vars from file
deno deploy --prod                 # Deploy to production
```

### Pre-Deployment Checklist

1. Run `deno fmt` and `deno lint`
2. Run `deno test` to verify everything works
3. For Fresh apps: Run `deno task build`
4. Deploy with `deno deploy --prod`

### Edge Runtime Limitations

Deno Deploy runs on the edge (globally distributed). Be aware:
- No persistent filesystem (use KV or external storage)
- Limited APIs compared to local Deno
- Environment variables must be set via `deno deploy env`

## Documentation Resources

When you need more information:

- **`deno doc <package>`** - Generate docs for any JSR or npm package locally
- **https://docs.deno.com** - Official Deno documentation
- **https://jsr.io** - Package registry with built-in documentation
- **https://fresh.deno.dev/docs** - Fresh framework documentation

## Quick Reference: Deno CLI Commands

| Command | Purpose |
|---------|---------|
| `deno run file.ts` | Run a TypeScript/JavaScript file |
| `deno task <name>` | Run a task from deno.json |
| `deno fmt` | Format code |
| `deno lint` | Lint code |
| `deno test` | Run tests |
| `deno add <pkg>` | Add a package |
| `deno install` | Install dependencies |
| `deno upgrade` | Update packages |
| `deno doc <pkg>` | View package documentation |
| `deno deploy --prod` | Deploy to Deno Deploy |

---
name: deno-deploy
description: Deno Deploy deployment workflows - use when user says "deploy to deno deploy", "push to deno deploy", "ship to deno deploy", or asks about deploying Deno apps to Deno Deploy
---

# Deno Deploy

This skill provides guidance for deploying applications to Deno Deploy.

## IMPORTANT: Use `deno deploy`, NOT `deployctl`

**Always use the `deno deploy` command.** Do NOT use `deployctl`.

- `deployctl` is for Deno Deploy Classic (deprecated)
- `deno deploy` is the modern, integrated command built into the Deno CLI
- If you find yourself reaching for `deployctl`, stop and use `deno deploy` instead

## Authentication

The first time you run `deno deploy`, it will open a browser for authentication:

```bash
deno deploy
# Opens: https://console.deno.com/auth?code=XXXX-XXXX
```

- Complete authentication in your browser
- Credentials are stored in your system keyring
- You only need to authenticate once

## Creating an App

Before your first deployment, create an app:

```bash
deno deploy create --org <organization-name>
```

This opens a browser to create the app in the Deno Deploy console. The app name becomes your URL: `<app-name>.deno.dev`

## Deploying

### Production Deployment

```bash
deno deploy --prod
```

### Preview Deployment

```bash
deno deploy
```

Preview deployments create a unique URL for testing without affecting production.

### Targeting Specific Apps

```bash
deno deploy --org my-org --app my-app --prod
```

### Specifying an Entrypoint

If Deno Deploy can't find your main file:

```bash
deno deploy --entrypoint main.ts --prod
```

Or add to `deno.json`:

```json
{
  "deploy": {
    "entrypoint": "main.ts"
  }
}
```

## Static Site Deployment

For static sites (Lume, Vite builds, etc.), you have two options:

### Option 1: Direct Directory Deployment

Point Deno Deploy at your built directory. Configure in `deno.json`:

```json
{
  "deploy": {
    "entrypoint": "main.ts",
    "include": ["_site"]
  }
}
```

### Option 2: Custom Server Wrapper

Only needed if you want custom routing, headers, or logic:

```typescript
// serve.ts
import { serveDir } from "jsr:@std/http/file-server";

Deno.serve((req) =>
  serveDir(req, {
    fsRoot: "_site",
    quiet: true,
  })
);
```

Then deploy with:

```bash
deno deploy --entrypoint serve.ts --prod
```

## Environment Variables

### Add a Variable

```bash
deno deploy env add DATABASE_URL "postgres://..."
```

### List Variables

```bash
deno deploy env list
```

### Delete a Variable

```bash
deno deploy env delete DATABASE_URL
```

### Load from .env File

```bash
deno deploy env load .env.production
```

### Control Variable Contexts

Variables can apply to different environments:

```bash
# Set which contexts a variable applies to
deno deploy env update-contexts API_KEY Production Preview
```

Available contexts: `Production`, `Preview`, `Local`, `Build`

## Viewing Logs

### Stream Live Logs

```bash
deno deploy logs
```

### Filter by Date Range

```bash
deno deploy logs --start 2026-01-15 --end 2026-01-16
```

## Cloud Integrations

### AWS Integration

```bash
deno deploy setup-aws --org my-org --app my-app
```

### GCP Integration

```bash
deno deploy setup-gcp --org my-org --app my-app
```

## Fresh Framework Deployment

Fresh apps require a build step before deployment:

```bash
deno task build
deno deploy --prod
```

## Command Reference

| Command | Purpose |
|---------|---------|
| `deno deploy --prod` | Production deployment |
| `deno deploy` | Preview deployment |
| `deno deploy create --org <name>` | Create new app |
| `deno deploy env add <var> <value>` | Add environment variable |
| `deno deploy env list` | List environment variables |
| `deno deploy env delete <var>` | Delete environment variable |
| `deno deploy env load <file>` | Load vars from .env file |
| `deno deploy env update-contexts <var> [contexts]` | Set variable contexts |
| `deno deploy logs` | View deployment logs |
| `deno deploy setup-aws` | Configure AWS integration |
| `deno deploy setup-gcp` | Configure GCP integration |

## Common Issues

### "No organization was selected"

Run `deno deploy create --org <name>` to set up your organization and app first.

### "No entrypoint found"

Specify your entry file:

```bash
deno deploy --entrypoint main.ts --prod
```

Or add to `deno.json`:

```json
{
  "deploy": {
    "entrypoint": "main.ts"
  }
}
```

### Fresh "Build required" Error

Fresh 2.0 requires building before deployment:

```bash
deno task build
deno deploy --prod
```

### Environment Variable Errors

Check what's currently set:

```bash
deno deploy env list
```

Add missing variables:

```bash
deno deploy env add MISSING_VAR "value"
```

## Edge Runtime Notes

Deno Deploy runs on the edge (globally distributed). Keep in mind:

- **No persistent filesystem** - Use Deno KV for storage
- **Environment variables** - Must be set via `deno deploy env`, not .env files at runtime
- **Global distribution** - Code runs at the edge closest to users
- **Cold starts** - First request after idle may be slightly slower

## Documentation

- Official docs: https://docs.deno.com/deploy/
- CLI reference: https://docs.deno.com/runtime/reference/cli/deploy/

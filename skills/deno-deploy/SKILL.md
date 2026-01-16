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

**Important - Browser Device Authorization Flow:**
- The CLI opens your browser and waits for you to complete authentication
- You MUST complete the authorization in your browser before the CLI can continue
- The CLI will NOT proceed automatically - it waits until you finish
- Credentials are stored in your system keyring after successful auth

**For Claude:** When running `deno deploy` commands, prompt the user:
> "Please complete the authorization in your browser, then let me know when you're done."

## First-Time Setup & Organization

### Finding Your Organization Name

The Deno Deploy CLI requires an organization context for most operations. To find your org name:

1. Visit https://console.deno.com
2. Your org is in the URL: `console.deno.com/orgs/YOUR-ORG-NAME`

**Note:** Commands like `deno deploy orgs` and `deno deploy switch` require an existing org context to work - this is a CLI limitation. Always find your org name from the console URL first.

### Setting Up Your First App

**Before creating:** Check if an app already exists by looking for a `deploy` key in deno.json:

```bash
cat deno.json | grep -A5 '"deploy"'
```

If no deploy config exists, create an app:

```bash
deno deploy create --org your-org-name
```

This opens a browser to create the app. **Important:**
- Complete the app creation in your browser
- The CLI waits until you finish - it won't proceed automatically
- The app name becomes your URL: `<app-name>.deno.dev`

**For Claude:** Prompt the user:
> "Please complete the app creation in your browser, then let me know when done."

**Verifying Success:** The CLI output may not clearly indicate success. After the user confirms completion, verify by checking deno.json:

```bash
cat deno.json | grep -A5 '"deploy"'
```

You should see output like:
```json
"deploy": {
  "org": "your-org-name",
  "app": "your-app-name"
}
```

If the `deploy` key exists with `org` and `app` values, the app was created successfully.

## Creating an App

Before your first deployment, create an app:

```bash
deno deploy create --org <organization-name>
```

This opens a browser to create the app in the Deno Deploy console. The app name becomes your URL: `<app-name>.deno.dev`

**Note:** The `create` command does NOT accept `--prod`. Use `--prod` only with `deno deploy` (the deploy command itself).

## Interactive Commands (Run in User's Terminal)

Some `deno deploy` commands are interactive and cannot be run through Claude's Bash tool. For these, ask the user to run them in their own terminal:

### Switching Organizations/Apps

```bash
deno deploy switch
```

This opens an interactive menu to select org and app. **Claude cannot run this** - ask the user:

> "Please run `deno deploy switch` in your terminal to select your organization and app. Let me know when you've completed the selection."

### Alternative: Use Explicit Flags

Instead of interactive selection, specify org/app directly:

```bash
deno deploy --org your-org-name --app your-app-name --prod
```

This bypasses the interactive flow and works through Claude.

## Deploying

### Production Deployment

```bash
deno deploy --prod
```

**Verifying Deployment Success:** The CLI output can be verbose. Look for these indicators of success:
- A URL containing `.deno.dev` or `.deno.net` - this is your live deployment
- A console URL like `https://console.deno.com/<org>/<app>/builds/<id>`
- The command exits with code 0 (no error)

After deployment, confirm success by extracting the production URL from the output. The format is typically:
`https://<app-name>.<org>.deno.net` or `https://<app-name>.deno.dev`

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

This error occurs because the CLI needs an organization context. Unfortunately, commands like `deno deploy orgs` also fail without this context.

**Solution:**

1. **Find your org name manually:** Visit https://console.deno.com - your org is in the URL path (e.g., `console.deno.com/orgs/donjo` means org is `donjo`)

2. **Specify org explicitly:**
   ```bash
   deno deploy --org your-org-name --prod
   ```

3. **Or create an app with org:**
   ```bash
   deno deploy create --org your-org-name
   # Complete the browser flow when prompted
   ```

**For Claude:** When you see this error, ask the user:
> "What is your Deno Deploy organization name? You can find it by visiting console.deno.com - look at the URL, it will be something like `console.deno.com/orgs/your-org-name`."

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

---
description: Deploy your Deno app to Deno Deploy
argument-hint: "[--prod]"
---

# Deploy to Deno Deploy

You are helping the user deploy their Deno application to Deno Deploy. Guide them through the process step by step.

Reference: https://docs.deno.com/deploy/
CLI Reference: https://docs.deno.com/runtime/reference/cli/deploy/

## Step 1: Check Project Readiness

First, verify the project is ready for deployment:

```bash
# Check for a deno.json
ls deno.json

# Run linting and formatting
deno fmt --check
deno lint

# Run tests if they exist
deno test
```

If this is a Fresh project, also run:
```bash
deno task build
```

Explain any issues found and help fix them before proceeding.

## Step 2: Check Authentication

The user needs to be logged in to Deno Deploy:

```bash
deno deploy
```

If not authenticated, this will prompt them to log in via browser. Explain that:
- They'll be redirected to their browser to authenticate
- Credentials are stored securely in the system keyring
- They only need to do this once

## Step 3: Determine Deployment Type

Ask if `$ARGUMENTS` doesn't specify:

**Question:** "How would you like to deploy?"

**Options:**
1. **Production deployment** (`--prod`) - Deploy to your production URL
2. **Preview deployment** - Create a preview URL for testing first

## Step 4: Check for Existing App

Look for deployment configuration:

```bash
# Check if there's an existing deployctl.json or .deno-deploy
ls -la
```

If this is a first deployment, help them create an app:

```bash
deno deploy create --org <organization-name>
```

Explain:
- Organization is their Deno Deploy account/team
- App name will be used in the URL: `<app-name>.deno.dev`

## Step 5: Handle Environment Variables

Check if the project uses environment variables:

```bash
# Look for .env files or Deno.env usage
grep -r "Deno.env" --include="*.ts" --include="*.tsx" . 2>/dev/null | head -5
ls .env* 2>/dev/null
```

If environment variables are needed, explain how to set them:

```bash
# Add individual variables
deno deploy env add DATABASE_URL "postgres://..."
deno deploy env add API_KEY "secret-key"

# Or load from a .env file
deno deploy env load .env.production
```

**Important security note:** Never commit `.env` files with secrets to git. Use `.env.example` for documentation.

## Step 6: Deploy

### For Fresh Projects

```bash
# Build first (required for Fresh 2.0)
deno task build

# Deploy to production
deno deploy --prod
```

### For Other Projects

```bash
# Deploy to production
deno deploy --prod

# Or preview deployment
deno deploy
```

### With Specific Options

```bash
# Specify organization and app
deno deploy --org my-org --app my-app --prod

# Deploy a specific entry point
deno deploy --entrypoint main.ts --prod
```

## Step 7: Verify Deployment

After deployment succeeds:

1. **Check the URL** - The CLI will output the deployment URL
2. **Test the live site** - Open the URL in a browser
3. **Check logs if needed:**
   ```bash
   deno deploy logs
   ```

## Common Issues and Solutions

### "No entrypoint found"

The CLI couldn't find your main file. Specify it:
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

### "Build required"

For Fresh projects, you must build before deploying:
```bash
deno task build
deno deploy --prod
```

### Environment Variable Errors

If the app crashes due to missing env vars:
```bash
# Check what's set
deno deploy env list

# Add missing variables
deno deploy env add MISSING_VAR "value"
```

### Permission Errors

Deno Deploy has some limitations compared to local Deno:
- No filesystem access (use Deno KV or external storage)
- Limited APIs
- Can't spawn subprocesses

If the app uses these features, explain alternatives.

## Edge Runtime Considerations

Remind users about Deno Deploy's edge runtime:

1. **No persistent filesystem** - Use Deno KV for storage:
   ```typescript
   const kv = await Deno.openKv();
   await kv.set(["key"], "value");
   ```

2. **Environment variables** - Must be set via CLI, not `.env` files

3. **Global distribution** - Code runs at the edge closest to users

4. **Cold starts** - First request may be slightly slower

## Deployment Commands Reference

| Command | Purpose |
|---------|---------|
| `deno deploy` | Preview deployment |
| `deno deploy --prod` | Production deployment |
| `deno deploy create` | Create a new app |
| `deno deploy env add` | Add environment variable |
| `deno deploy env load` | Load env vars from file |
| `deno deploy env list` | List environment variables |
| `deno deploy logs` | View deployment logs |

## After Deployment

Suggest next steps:
1. Set up a custom domain (via Deno Deploy dashboard)
2. Configure GitHub integration for automatic deploys
3. Set up preview deployments for pull requests

---
description: Deploy your Deno app to Deno Deploy
argument-hint: "[--prod]"
---

# Deploy to Deno Deploy

Use `deno deploy` command (NOT deployctl - that's for deprecated Deno Deploy Classic).

## Quick Reference

| Command | Purpose |
|---------|---------|
| `deno deploy --prod` | Production deployment |
| `deno deploy` | Preview deployment |
| `deno deploy create --org <name>` | Create new app |
| `deno deploy env add <var> <value>` | Add environment variable |
| `deno deploy env list` | List environment variables |
| `deno deploy env load <file>` | Load vars from .env file |
| `deno deploy logs` | View deployment logs |

## Finding Your Organization Name

Visit https://console.deno.com - your org is in the URL path (e.g., `console.deno.com/orgs/your-org-name`).

## Workflow

**IMPORTANT: Before deploying, check if an app already exists:**

```bash
# Check deno.json for existing deploy config
cat deno.json | grep -A5 '"deploy"'
```

If there's NO `"deploy"` key in deno.json, you must create an app first:

1. **Create app (first time only):** Run `deno deploy create --org <name>`
   - This opens a browser - complete the app creation there
   - Tell user: "Please complete the app creation in your browser, then let me know when done"
   - **Verify success:** After completion, check that `deno.json` now has a `"deploy"` section with `"org"` and `"app"` keys
2. **Fresh app?** Run `deno task build` first
3. **Deploy:** Run `deno deploy --prod`

**Note:** The `create` command does NOT accept `--prod`. Use `--prod` only with `deno deploy` (the deploy command).

## Common Flags

- `--prod` - Deploy to production (default is preview)
- `--org <name>` - Target specific organization
- `--app <name>` - Target specific app
- `--entrypoint <file>` - Specify entry file

See the deno-deploy skill for detailed guidance on authentication, environment variables, static sites, and troubleshooting.

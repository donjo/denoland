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

## Workflow

1. **First time?** Run `deno deploy create --org <name>` to create your app
2. **Fresh app?** Run `deno task build` first
3. **Deploy:** Run `deno deploy --prod`

## Common Flags

- `--prod` - Deploy to production (default is preview)
- `--org <name>` - Target specific organization
- `--app <name>` - Target specific app
- `--entrypoint <file>` - Specify entry file

See the deno-deploy skill for detailed guidance on authentication, environment variables, static sites, and troubleshooting.

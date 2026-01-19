---
description: Deploy your Deno app to Deno Deploy
argument-hint: "[--prod]"
---

# Deploy to Deno Deploy

Use `deno deploy` command (NOT deployctl - that's for deprecated Deno Deploy Classic).

## Step 0: Locate the App Directory

**FIRST**, determine where the Deno app is located:

```bash
# Check if deno.json exists in current directory
if [ -f "deno.json" ] || [ -f "deno.jsonc" ]; then
  echo "APP_DIR: $(pwd)"
else
  # Look for deno.json in immediate subdirectories
  find . -maxdepth 2 -name "deno.json" -o -name "deno.jsonc" 2>/dev/null | head -5
fi
```

**Decision:**
- If `deno.json` is in the current directory → use current directory
- If `deno.json` found in a subdirectory → use that subdirectory (if multiple, ask user which one)
- If no `deno.json` found → ask user where their app is located

**All subsequent commands should run from the app directory.** Use absolute paths or `cd` to the app directory first.

## Pre-Flight Checks (RUN THESE AFTER LOCATING APP)

**CRITICAL: Run these checks BEFORE attempting any `deno deploy` commands.** Many deploy commands fail without an org context, and you cannot discover orgs via CLI without one already set.

Run these from the app directory:

```bash
# Check 1: Deno version (must be >= 2.4.2)
deno --version | head -1

# Check 2: Does a deploy config with org exist?
grep -E '"org"|"app"' deno.json deno.jsonc 2>/dev/null || echo "NO_DEPLOY_CONFIG"

# Check 3: Detect framework for build requirements
if [ -d "islands" ] || [ -f "fresh.config.ts" ]; then echo "FRESH"; \
elif [ -f "astro.config.mjs" ] || [ -f "astro.config.ts" ]; then echo "ASTRO"; \
elif [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then echo "NEXTJS"; \
elif [ -f "nuxt.config.ts" ]; then echo "NUXT"; \
elif [ -f "remix.config.js" ]; then echo "REMIX"; \
elif [ -f "svelte.config.js" ]; then echo "SVELTEKIT"; \
elif [ -f "_config.ts" ] && grep -q "lume" _config.ts 2>/dev/null; then echo "LUME"; \
else echo "UNKNOWN_OR_CUSTOM"; fi
```

## State-Based Workflow

### If `deploy.org` AND `deploy.app` exist in config:
1. Build if needed (see Framework Build Commands below)
2. Deploy: `deno deploy --prod`

### If NO org/app config exists:

⚠️ **ASK THE USER FOR THEIR ORG NAME FIRST** - Do NOT run `deno deploy` or `deno deploy orgs` - they will fail without org context.

Ask the user:
> "What is your Deno Deploy organization name? You can find it by visiting https://console.deno.com - look at the URL, it will be something like `console.deno.com/YOUR-ORG-NAME`. (For personal accounts, this is usually your username.)"

Once you have the org name:
1. Warn the user: "I'm going to create the app now. **A browser window will open** - please complete the app creation there."
2. Run the command yourself: `deno deploy create --org <ORG_NAME>`
3. The command will wait for browser completion, then auto-deploy

After the command completes, verify:
```bash
grep -E '"org"|"app"' deno.json deno.jsonc
```

## Framework Build Commands

| Framework | Detection | Build Command |
|-----------|-----------|---------------|
| Fresh | `islands/` dir or `fresh.config.ts` | `deno task build` |
| Astro | `astro.config.*` | `npm run build` or `deno task build` |
| Next.js | `next.config.*` | `npm run build` |
| Nuxt | `nuxt.config.ts` | `npm run build` |
| Remix | `remix.config.js` | `npm run build` |
| SvelteKit | `svelte.config.js` | `npm run build` |
| Lume | `_config.ts` with lume import | `deno task build` |
| Custom/None | - | Check for `build` task in deno.json |

## Quick Reference

| Command | Purpose |
|---------|---------|
| `deno deploy --prod` | Production deployment |
| `deno deploy` | Preview deployment |
| `deno deploy create --org <name>` | Create new app (⚠️ opens browser) |
| `deno deploy env add <var> <value>` | Add environment variable |
| `deno deploy env list` | List environment variables |
| `deno deploy env load <file>` | Load vars from .env file |
| `deno deploy logs` | View deployment logs |

## Common Flags

- `--prod` - Deploy to production (default is preview)
- `--org <name>` - Target specific organization (avoids interactive prompt)
- `--app <name>` - Target specific app (avoids interactive prompt)
- `--entrypoint <file>` - Specify entry file
- `--allow-node-modules` - Include node_modules (needed for some npm frameworks)

## Finding Your Organization Name

Visit https://console.deno.com - your org is in the URL path (e.g., `console.deno.com/your-org-name`).

See the deno-deploy skill for detailed guidance on authentication, CI/CD tokens, environment variables, static sites, and troubleshooting.

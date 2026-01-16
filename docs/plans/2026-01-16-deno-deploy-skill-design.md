# Deno Deploy Skill Redesign

## Problem

The current `deno-deploy` command has discoverability and content issues:

1. **Not auto-triggered** - When users say "deploy to deno deploy", Claude falls back to `deployctl` instead of loading the skill
2. **Wrong tool referenced** - Claude defaults to `deployctl` (Deno Deploy Classic, deprecated) instead of `deno deploy`
3. **Old config file references** - Mentions `deployctl.json` which is no longer used
4. **Requires fully qualified name** - Must use `denoland:deno-deploy` instead of just the command

## Solution

Create a two-part system: a skill for automatic recognition + a command for explicit invocation.

### File 1: `skills/deno-deploy/SKILL.md` (new)

**Frontmatter:**
```yaml
name: deno-deploy
description: Deno Deploy deployment workflows - use when user says "deploy to deno deploy", "push to deno deploy", or asks about deploying Deno apps to Deno Deploy
```

**Content sections:**

1. **Warning box** - Prominently state: use `deno deploy`, NOT `deployctl`
   - `deployctl` is for Deno Deploy Classic (deprecated)
   - This prevents Claude's training data from overriding

2. **Core deployment workflow**
   - `deno deploy --prod` - production deployment
   - `deno deploy` - preview deployment
   - `--org <name>` and `--app <name>` flags
   - `--entrypoint <file>` for specifying entry file
   - Authentication flow (browser-based, opens URL)

3. **App creation**
   - `deno deploy create --org <name>`
   - Organization selection on first deploy

4. **Environment variables**
   - `deno deploy env add <var> <value>`
   - `deno deploy env list`
   - `deno deploy env delete <var>`
   - `deno deploy env load <file>` - load from .env file
   - `deno deploy env update-contexts <var> [contexts...]` - Production, Preview, Local, Build

5. **Logs and debugging**
   - `deno deploy logs`
   - `--start` and `--end` flags for date filtering

6. **Static site deployment**
   - Option 1: Point at built directory directly
   - Option 2: Custom serve.ts wrapper (only if custom routing/headers needed)

7. **Cloud integrations** (brief)
   - `deno deploy setup-aws --org <name> --app <name>`
   - `deno deploy setup-gcp --org <name> --app <name>`

8. **Configuration in deno.json**
   - Modern config uses `deploy` key in deno.json
   - No `deployctl.json` or `.deno-deploy` files

9. **Common issues and solutions**
   - "No organization selected" - run `deno deploy create` first
   - "No entrypoint found" - use `--entrypoint` or add to deno.json
   - Fresh apps need `deno task build` first

**Not included:**
- Sandbox commands (`deno deploy sandbox`) - separate ecosystem, future skill

### File 2: `commands/deno-deploy.md` (update)

Simplified to be a quick reference that works with the skill:

```markdown
---
description: Deploy your Deno app to Deno Deploy
argument-hint: "[--prod]"
---

# Deploy to Deno Deploy

Use `deno deploy` command (NOT deployctl).

## Quick Reference

| Command | Purpose |
|---------|---------|
| `deno deploy --prod` | Production deployment |
| `deno deploy` | Preview deployment |
| `deno deploy create` | Create new app |
| `deno deploy env add` | Add environment variable |
| `deno deploy env list` | List environment variables |
| `deno deploy env load` | Load vars from .env file |
| `deno deploy logs` | View deployment logs |

See the deno-deploy skill for detailed guidance.
```

### File 3: `skills/deno-guidance/SKILL.md` (update)

Remove lines 85-113 (the "Deno Deploy Workflow" section) and replace with:

```markdown
## Deployment

For deploying to Deno Deploy, see the dedicated deno-deploy skill.
Quick command: `deno deploy --prod`
```

## Implementation Order

1. Create `skills/deno-deploy/SKILL.md` with full content
2. Update `commands/deno-deploy.md` to simplified version
3. Update `skills/deno-guidance/SKILL.md` to remove deployment section
4. Test by saying "deploy to deno deploy" in a Deno project

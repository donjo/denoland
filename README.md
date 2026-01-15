# Denoland Plugin for Claude Code

A Claude Code plugin for building modern Deno applications with Fresh, JSR, and Deno Deploy.

## What This Plugin Does

This plugin teaches Claude modern Deno development practices:

- **Prefer JSR over deno.land/x** - The deprecated registry that many LLMs default to
- **Use Deno's built-in tools** - `deno fmt`, `deno lint`, `deno test`, `deno doc`
- **Fresh framework patterns** - Island architecture, Preact, Tailwind
- **Deno Deploy workflow** - The `deno deploy` CLI for deployment
- **Sandbox SDK** - Safe execution of untrusted code

## Installation

```bash
# In Claude Code
/plugin install denoland
```

Or link locally for development:
```bash
/plugin link /path/to/denoland
```

## What's Included

### Skills (Automatic Knowledge)

Skills are applied automatically when Claude detects you're working in a Deno project.

| Skill | Purpose |
|-------|---------|
| `deno-guidance` | Core best practices, JSR packages, Deno CLI workflow |
| `deno-frontend` | Fresh framework, Preact components, Tailwind CSS |
| `deno-sandbox` | Sandbox SDK for safe code execution |

### Commands

| Command | Purpose |
|---------|---------|
| `/deno-init` | Scaffold a new Deno project (Fresh, CLI, library, or API) |
| `/deno-deploy` | Deploy your app to Deno Deploy |

### Agent

| Agent | Purpose |
|-------|---------|
| `deno-expert` | Specialized helper for Deno questions, code review, and debugging |

## Key Features

### JSR Package Priority

This plugin ensures Claude recommends the right package sources:

```typescript
// Preferred - JSR packages
import { serve } from "jsr:@std/http";

// Also good - npm packages (when no JSR alternative)
import express from "npm:express";

// Avoid - deprecated registry
import { serve } from "https://deno.land/std/http/server.ts"; // DON'T USE
```

### Deno CLI Workflow

The plugin encourages using Deno's built-in tools:

```bash
deno fmt          # Format code
deno lint         # Lint for issues
deno test         # Run tests
deno doc <pkg>    # View package docs
deno add <pkg>    # Add dependencies
deno deploy       # Deploy to Deno Deploy
```

### Fresh Development

Proper Fresh patterns with island architecture:

```bash
deno run -Ar jsr:@fresh/init    # Create project
deno task start                  # Development
deno task build                  # Production build
deno deploy --prod               # Deploy
```

## Documentation Resources

- [Deno Documentation](https://docs.deno.com)
- [Deno Fundamentals](https://docs.deno.com/runtime/fundamentals/)
- [Fresh Documentation](https://fresh.deno.dev/docs)
- [JSR Registry](https://jsr.io)
- [Deno Deploy](https://docs.deno.com/deploy/)
- [Deno Sandboxes](https://deno.com/deploy/sandboxes)

## Contributing

This plugin is open source. Contributions welcome!

## License

MIT

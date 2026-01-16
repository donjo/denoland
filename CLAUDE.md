# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code plugin that teaches Claude modern Deno development practices. The plugin enforces JSR-first package management, Fresh framework patterns, and Deno Deploy workflows.

## Plugin Architecture

```
denoland/
├── .claude-plugin/
│   ├── plugin.json         # Plugin manifest (name, version, description)
│   └── marketplace.json    # Distribution metadata for plugin marketplace
├── skills/                 # Automatic knowledge applied to Deno projects
│   ├── deno-guidance/      # Core best practices, JSR, CLI workflow
│   ├── deno-deploy/        # Deno Deploy deployment workflows
│   ├── deno-frontend/      # Fresh framework, Preact, Tailwind
│   └── deno-sandbox/       # Sandbox SDK for code execution
├── agents/
│   └── deno-expert.md      # Specialized agent for Deno questions
├── commands/               # User-invocable slash commands
│   ├── deno-init.md        # /deno-init - project scaffolding
│   └── deno-deploy.md      # /deno-deploy - deployment workflow
└── hooks/
    ├── hooks.json          # Hook configuration
    └── detect-deno.sh      # Detects deno.json and shows guidance
```

## File Formats

**Skills (SKILL.md):** YAML frontmatter with `name` and `description`, followed by markdown content with examples and best practices.

**Agents (.md):** YAML frontmatter with `name`, `description`, `tools`, `model`, and `color`, followed by behavior instructions.

**Commands (.md):** YAML frontmatter with `description` and `argument-hint`, followed by step-by-step guidance for Claude to follow.

**Hooks (hooks.json):** JSON defining when shell scripts run (e.g., SessionStart triggers detect-deno.sh).

## Key Plugin Principles

1. **JSR over deno.land/x** - Always recommend `jsr:` imports; `deno.land/x` is deprecated
2. **npm: as fallback** - Use `npm:` packages when no JSR alternative exists
3. **Built-in tools** - Encourage `deno fmt`, `deno lint`, `deno test`, `deno doc`
4. **Fresh patterns** - Island architecture with small, serializable-prop islands

## Testing the Plugin

```bash
# Link locally for development
claude plugin link /path/to/denoland

# Verify hook detection works
cd /some/deno/project  # Must have deno.json
# Start Claude Code - should see detection message

# Test commands
/deno-init
/deno-deploy
```

## Versioning Guidelines

This plugin uses semantic versioning (MAJOR.MINOR.PATCH). Version must be updated in **both** files:
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

### When to Bump Versions

**PATCH (0.2.0 → 0.2.1):**
- Fix typos or errors in skill content
- Clarify existing documentation
- Fix broken examples or commands
- Small improvements that don't add new capabilities

**MINOR (0.2.0 → 0.3.0):**
- Add a new skill
- Add a new command
- Add a new agent
- Significant content additions to existing skills
- New hooks or hook behaviors

**MAJOR (0.x.x → 1.0.0):**
- Breaking changes to skill/command interfaces
- Remove or rename existing skills/commands
- Fundamental changes to plugin behavior
- When the plugin is considered stable and production-ready

### Version Bump Checklist

1. Update version in `.claude-plugin/plugin.json`
2. Update version in `.claude-plugin/marketplace.json`
3. Commit with message describing the changes
4. Push to origin

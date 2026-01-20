---
description: Toggle dev mode to capture tool usage patterns for analysis
argument-hint: "[on|off|status]"
---

# Deno Dev Mode Toggle

You are helping the user toggle "dev mode" which captures tool calls and user prompts to JSONL files for later analysis of patterns and failures.

## Storage Location

All logs are stored in: `~/.claude/denoland-dev-logs/`

**Files:**
- `.enabled` - Marker file (presence means dev mode is on)
- `tool-uses.jsonl` - One JSON object per tool call
- `user-prompts.jsonl` - One JSON object per user message

## Handle the Command

Check what argument was provided in `$ARGUMENTS`:

### If argument is "on"

1. Create the log directory if it doesn't exist:
   ```bash
   mkdir -p ~/.claude/denoland-dev-logs
   ```

2. Create the enabled marker file:
   ```bash
   touch ~/.claude/denoland-dev-logs/.enabled
   ```

3. Tell the user:
   > Dev mode is now **enabled**.
   >
   > Tool calls and user prompts will be captured to:
   > - `~/.claude/denoland-dev-logs/tool-uses.jsonl`
   > - `~/.claude/denoland-dev-logs/user-prompts.jsonl`
   >
   > Run `/deno-dev-mode off` to stop capturing.

### If argument is "off"

1. Remove the enabled marker file:
   ```bash
   rm -f ~/.claude/denoland-dev-logs/.enabled
   ```

2. Tell the user:
   > Dev mode is now **disabled**.
   >
   > Logging has stopped. Existing log files are preserved at:
   > `~/.claude/denoland-dev-logs/`

### If argument is "status" or empty

1. Check if the marker file exists:
   ```bash
   ls -la ~/.claude/denoland-dev-logs/.enabled 2>/dev/null
   ```

2. If the file exists, tell the user:
   > Dev mode is currently **enabled**.
   >
   > Logs are being written to `~/.claude/denoland-dev-logs/`

3. If the file doesn't exist, tell the user:
   > Dev mode is currently **disabled**.
   >
   > Run `/deno-dev-mode on` to start capturing tool usage patterns.

4. Optionally show log file sizes if they exist:
   ```bash
   ls -lh ~/.claude/denoland-dev-logs/*.jsonl 2>/dev/null
   ```

### If argument is something else

Tell the user:
> Unknown argument. Usage:
> - `/deno-dev-mode on` - Enable logging
> - `/deno-dev-mode off` - Disable logging
> - `/deno-dev-mode status` - Check current state

## What Gets Captured

**Tool uses (`tool-uses.jsonl`):**
```json
{
  "timestamp": "2026-01-20T14:30:00.000Z",
  "sessionId": "abc123",
  "tool": "Bash",
  "input": {"command": "deno run main.ts"},
  "output": {"stdout": "...", "stderr": "..."},
  "success": false,
  "error": "Process exited with code 1"
}
```

**User prompts (`user-prompts.jsonl`):**
```json
{
  "timestamp": "2026-01-20T14:30:05.000Z",
  "sessionId": "abc123",
  "prompt": "That's wrong, try src/utils.ts instead",
  "promptLength": 38
}
```

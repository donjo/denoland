/**
 * capture-tool-use.ts
 *
 * This hook runs after every tool call in Claude Code.
 * When dev mode is enabled, it captures tool usage data to a JSONL file
 * for later analysis of failure patterns and usage patterns.
 *
 * Environment variables available from Claude Code:
 * - TOOL_NAME: The name of the tool that was called
 * - TOOL_INPUT: JSON string of the tool's input parameters
 * - TOOL_OUTPUT: JSON string of the tool's output
 * - TOOL_USE_ERROR: Error message if the tool failed (undefined if successful)
 * - CLAUDE_SESSION_ID: Unique identifier for the current session
 */

// Helper function to check if a file or directory exists
async function exists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

// Main function that runs the capture logic
async function main() {
  // Get the home directory and construct paths
  const home = Deno.env.get("HOME");
  if (!home) {
    // No home directory, can't proceed - just continue silently
    console.log(JSON.stringify({ continue: true, suppressOutput: true }));
    Deno.exit(0);
  }

  const logDir = `${home}/.claude/denoland-dev-logs`;
  const enabledFile = `${logDir}/.enabled`;

  // Check if dev mode is enabled by looking for the marker file
  if (!await exists(enabledFile)) {
    // Dev mode not enabled - continue without capturing
    console.log(JSON.stringify({ continue: true, suppressOutput: true }));
    Deno.exit(0);
  }

  // Dev mode is enabled - capture the tool usage data

  // Safely parse JSON from environment variables
  let toolInput = {};
  let toolOutput = {};

  try {
    const inputStr = Deno.env.get("TOOL_INPUT");
    if (inputStr) {
      toolInput = JSON.parse(inputStr);
    }
  } catch {
    // If parsing fails, store the raw string
    toolInput = { raw: Deno.env.get("TOOL_INPUT") || "" };
  }

  try {
    const outputStr = Deno.env.get("TOOL_OUTPUT");
    if (outputStr) {
      toolOutput = JSON.parse(outputStr);
    }
  } catch {
    // If parsing fails, store the raw string
    toolOutput = { raw: Deno.env.get("TOOL_OUTPUT") || "" };
  }

  // Build the log record
  const record = {
    timestamp: new Date().toISOString(),
    sessionId: Deno.env.get("CLAUDE_SESSION_ID") || "unknown",
    tool: Deno.env.get("TOOL_NAME") || "unknown",
    input: toolInput,
    output: toolOutput,
    success: !Deno.env.get("TOOL_USE_ERROR"),
    error: Deno.env.get("TOOL_USE_ERROR") || null,
  };

  // Append to the log file
  const logPath = `${logDir}/tool-uses.jsonl`;

  try {
    await Deno.writeTextFile(logPath, JSON.stringify(record) + "\n", { append: true });
  } catch (err) {
    // If we can't write to the log, that's okay - don't break the user's workflow
    // Just log to stderr for debugging if needed
    console.error(`Failed to write tool log: ${err}`);
  }

  // Always continue the tool execution
  console.log(JSON.stringify({ continue: true, suppressOutput: true }));
}

// Run the main function
main();

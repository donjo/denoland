/**
 * capture-tool-use.ts
 *
 * This hook runs after every tool call in Claude Code (PostToolUse event).
 * When dev mode is enabled, it captures tool usage data to a JSONL file
 * for later analysis of failure patterns and usage patterns.
 *
 * Data is received via stdin as JSON with the following structure:
 * {
 *   "session_id": "abc123",
 *   "tool_name": "Bash",
 *   "tool_input": { ... },
 *   "tool_response": { ... },
 *   "tool_use_id": "toolu_01ABC123..."
 * }
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

// Helper function to read all data from stdin
async function readStdin(): Promise<string> {
  const decoder = new TextDecoder();
  const chunks: string[] = [];

  for await (const chunk of Deno.stdin.readable) {
    chunks.push(decoder.decode(chunk));
  }

  return chunks.join("");
}

// Define the expected structure of hook input data
interface HookInput {
  session_id?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_response?: Record<string, unknown>;
  tool_use_id?: string;
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

  // Dev mode is enabled - read and capture the tool usage data from stdin
  let hookData: HookInput = {};

  try {
    const stdinContent = await readStdin();
    if (stdinContent.trim()) {
      hookData = JSON.parse(stdinContent);
    }
  } catch {
    // If parsing fails, log with empty data
    hookData = {};
  }

  // Build the log record from the parsed stdin data
  const record = {
    timestamp: new Date().toISOString(),
    sessionId: hookData.session_id || "unknown",
    tool: hookData.tool_name || "unknown",
    toolUseId: hookData.tool_use_id || null,
    input: hookData.tool_input || {},
    output: hookData.tool_response || {},
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

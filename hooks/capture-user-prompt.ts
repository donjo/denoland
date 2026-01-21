/**
 * capture-user-prompt.ts
 *
 * This hook runs when the user submits a message to Claude Code (UserPromptSubmit event).
 * When dev mode is enabled, it captures user prompts to a JSONL file
 * for later analysis of conversation patterns and failure indicators.
 *
 * Data is received via stdin as JSON with the following structure:
 * {
 *   "session_id": "abc123",
 *   "prompt": "The user's message text",
 *   "cwd": "/current/working/directory"
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
  prompt?: string;
  cwd?: string;
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

  // Dev mode is enabled - read and capture the user prompt data from stdin
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

  const prompt = hookData.prompt || "";

  // Build the log record from the parsed stdin data
  const record = {
    timestamp: new Date().toISOString(),
    sessionId: hookData.session_id || "unknown",
    cwd: hookData.cwd || null,
    prompt: prompt,
    promptLength: prompt.length,
  };

  // Append to the log file
  const logPath = `${logDir}/user-prompts.jsonl`;

  try {
    await Deno.writeTextFile(logPath, JSON.stringify(record) + "\n", { append: true });
  } catch (err) {
    // If we can't write to the log, that's okay - don't break the user's workflow
    // Just log to stderr for debugging if needed
    console.error(`Failed to write prompt log: ${err}`);
  }

  // Always continue the prompt submission
  console.log(JSON.stringify({ continue: true, suppressOutput: true }));
}

// Run the main function
main();

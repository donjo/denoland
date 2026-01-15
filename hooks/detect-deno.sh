#!/bin/bash

# Check if deno.json exists in the current directory
if [ -f "deno.json" ] || [ -f "deno.jsonc" ]; then
  echo "Deno project detected. Applying Deno best practices:"
  echo ""
  echo "• Use jsr: for packages (e.g., jsr:@std/http), not deno.land/x"
  echo "• Run deno fmt and deno lint after changes"
  echo "• Use deno doc <package> to view package documentation"
  echo "• For deployment, deno deploy --prod is available (or use GitHub integration)"
  echo ""
  echo "Available commands: /deno-init, /deno-deploy"
fi

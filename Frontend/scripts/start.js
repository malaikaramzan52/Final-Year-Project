const fs = require("fs");
const path = require("path");

// Normalize cwd to canonical filesystem path to avoid ESLint plugin conflicts
// caused by mixed path casing (e.g., Frontend vs frontend on Windows).
const cwd = process.cwd();
const canonicalCwd = fs.realpathSync.native
  ? fs.realpathSync.native(cwd)
  : fs.realpathSync(cwd);

if (canonicalCwd && canonicalCwd !== cwd) {
  process.chdir(canonicalCwd);
}

// Start CRA after cwd normalization.
require(path.join(process.cwd(), "node_modules", "react-scripts", "scripts", "start"));

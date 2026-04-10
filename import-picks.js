/**
 * import-picks.js
 * ================================================
 * Reads the Masters Pool Excel roster file and
 * regenerates the POOL_PARTICIPANTS block inside
 * pool-config.js.
 *
 * Usage:
 *   node import-picks.js "Wegman Masters Challenge Team Rosters 2026.xlsx"
 *
 * Or just:
 *   node import-picks.js
 * (will use the first .xlsx file found in this directory)
 *
 * Requires: npm install xlsx
 * ================================================
 */

const XLSX   = require("xlsx");
const fs     = require("fs");
const path   = require("path");

// ─── Config ────────────────────────────────────────────────────────────────────
// Column headers in the Excel file (case-insensitive match)
const NAME_COL      = "name";
const PLAYER_COLS   = ["player 1", "player 2", "player 3", "player 4", "player 5", "player 6"];
const ALTERNATE_COL = "alternate"; // read but not used in picks; stored as comment

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Split "First [Middle] Last" into { firstName, lastName }.
 * The LAST word becomes lastName; everything before it is firstName.
 * Examples:
 *   "Jon Rahm"        → { firstName: "Jon",      lastName: "Rahm" }
 *   "Min Woo Lee"     → { firstName: "Min Woo",  lastName: "Lee" }
 *   "Bryson DeChambeau" → { firstName: "Bryson", lastName: "DeChambeau" }
 */
function splitName(fullName) {
  if (!fullName || typeof fullName !== "string") return null;
  const parts = fullName.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const lastName  = parts[parts.length - 1];
  const firstName = parts.slice(0, parts.length - 1).join(" ");
  return { firstName, lastName };
}

/** Normalise a header string for matching */
function normalise(s) {
  return String(s ?? "").trim().toLowerCase();
}

/** Escape a string for embedding in a JS file */
function jsStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// ─── Find the Excel file ────────────────────────────────────────────────────────
let xlsxPath = process.argv[2];

if (!xlsxPath) {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".xlsx"));
  if (files.length === 0) {
    console.error("❌  No .xlsx file found. Place the Excel file in this folder and re-run.");
    process.exit(1);
  }
  xlsxPath = files[0];
  console.log(`📂  Using: ${xlsxPath}`);
}

xlsxPath = path.resolve(__dirname, xlsxPath);

// ─── Read Excel ────────────────────────────────────────────────────────────────
const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];

// Read as array of arrays first so we can find the real header row
const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

if (rawRows.length === 0) {
  console.error("❌  Sheet appears empty.");
  process.exit(1);
}

// Find the header row — it's the first row that contains "name" (case-insensitive)
let headerRowIdx = rawRows.findIndex(row =>
  row.some(cell => normalise(String(cell)) === "name")
);

if (headerRowIdx === -1) {
  console.error('❌  Could not find a header row containing "Name". Check the Excel file.');
  process.exit(1);
}

console.log(`📋  Found header row at row ${headerRowIdx + 1}: ${rawRows[headerRowIdx].join(" | ")}`);

const headers    = rawRows[headerRowIdx].map(h => normalise(String(h)));
const dataRows   = rawRows.slice(headerRowIdx + 1);

// Convert to objects using the detected headers
const normalisedRows = dataRows.map(row => {
  const out = {};
  headers.forEach((h, i) => { out[h] = row[i] ?? ""; });
  return out;
}).filter(row => String(row[NAME_COL] ?? "").trim() !== "");

// Check headers
const sampleHeaders = Object.keys(normalisedRows[0]);
console.log(`\nDetected columns: ${sampleHeaders.join(" | ")}\n`);

const missingCols = PLAYER_COLS.filter(c => !sampleHeaders.includes(c));
if (missingCols.length > 0) {
  console.warn(`⚠️  Could not find columns: ${missingCols.join(", ")}`);
  console.warn("   Double-check the column headers in your Excel file match exactly.");
}

// ─── Build participants ────────────────────────────────────────────────────────
const participants = [];
const warnings     = [];

for (const [i, row] of normalisedRows.entries()) {
  const rawName = String(row[NAME_COL] ?? "").trim();
  if (!rawName) continue; // skip blank rows

  const picks = [];
  for (const col of PLAYER_COLS) {
    const raw = String(row[col] ?? "").trim();
    if (!raw) {
      warnings.push(`Row ${i + 2} (${rawName}): missing pick for column "${col}"`);
      continue;
    }
    const parsed = splitName(raw);
    if (parsed) picks.push(parsed);
  }

  const altRaw = String(row[ALTERNATE_COL] ?? "").trim();
  const alt    = altRaw ? splitName(altRaw) : null;

  participants.push({ name: rawName, picks, alternate: alt });
}

console.log(`✅  Parsed ${participants.length} participants.`);
if (warnings.length) {
  console.warn("\n⚠️  Warnings:");
  warnings.forEach(w => console.warn("   " + w));
}

// ─── Generate JS block ─────────────────────────────────────────────────────────
function renderPick(p) {
  return `      { firstName: "${jsStr(p.firstName)}", lastName: "${jsStr(p.lastName)}" }`;
}

const participantBlocks = participants.map(p => {
  const picksStr = p.picks.map(renderPick).join(",\n");
  const altComment = p.alternate
    ? `\n    // Alternate (use if a pick WDs): ${p.alternate.firstName} ${p.alternate.lastName}`
    : "";
  return `  {\n    name: "${jsStr(p.name)}",${altComment}\n    picks: [\n${picksStr},\n    ],\n  }`;
});

const newBlock =
`const POOL_PARTICIPANTS = [\n` +
participantBlocks.join(",\n") +
`\n];\n`;

// ─── Patch pool-config.js ──────────────────────────────────────────────────────
const configPath = path.join(__dirname, "pool-config.js");

if (!fs.existsSync(configPath)) {
  console.error(`❌  pool-config.js not found at ${configPath}`);
  process.exit(1);
}

let config = fs.readFileSync(configPath, "utf8");

// Replace the POOL_PARTICIPANTS = [...]; block
const pattern = /const POOL_PARTICIPANTS\s*=\s*\[[\s\S]*?\];/m;

if (!pattern.test(config)) {
  console.error("❌  Could not find POOL_PARTICIPANTS = [...] in pool-config.js");
  process.exit(1);
}

config = config.replace(pattern, newBlock.trimEnd());

// Back up the old file first
const backupPath = configPath + ".bak";
fs.copyFileSync(configPath, backupPath);
console.log(`\n💾  Backed up old config to pool-config.js.bak`);

fs.writeFileSync(configPath, config, "utf8");
console.log(`✅  pool-config.js updated with ${participants.length} participants!\n`);

// ─── Preview ───────────────────────────────────────────────────────────────────
console.log("── First 3 participants ──────────────────────────────");
for (const p of participants.slice(0, 3)) {
  console.log(`  ${p.name}:`);
  p.picks.forEach(pick => console.log(`    • ${pick.firstName} ${pick.lastName}`));
  if (p.alternate) console.log(`    ↳ Alt: ${p.alternate.firstName} ${p.alternate.lastName}`);
}
console.log("─────────────────────────────────────────────────────");
console.log("\n🏌️  Done! Refresh your scoreboard to see the updated pool.\n");

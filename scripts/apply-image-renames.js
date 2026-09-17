#!/usr/bin/env node
// Applies rename-map.json: git mv each file, then rewrite references in source files.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'rename-map.json'), 'utf8'));

const SOURCE_DIRS = ['app', 'components', 'views', 'js', 'styles'];
const SOURCE_EXT = new Set(['.html', '.js', '.css', '.scss', '.json']);
const EXCLUDE_DIR_NAMES = new Set(['_build', 'assets 2', 'images 2']);

function walk(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, onFile);
    else if (entry.isFile()) onFile(full);
  }
}

function collectSourceFiles() {
  const files = [];
  for (const rel of SOURCE_DIRS) {
    const dir = path.join(ROOT, rel);
    if (!fs.existsSync(dir)) continue;
    walk(dir, (full) => {
      if (SOURCE_EXT.has(path.extname(full).toLowerCase())) files.push(full);
    });
  }
  return files;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. git mv every mapped file.
let moved = 0;
for (const [from, to] of Object.entries(map)) {
  const fromAbs = path.join(ROOT, from);
  const toAbs = path.join(ROOT, to);
  if (!fs.existsSync(fromAbs)) {
    console.warn(`SKIP (missing source): ${from}`);
    continue;
  }
  fs.mkdirSync(path.dirname(toAbs), { recursive: true });
  execFileSync('git', ['mv', fromAbs, toAbs], { cwd: ROOT });
  moved++;
}
console.log(`git mv completed for ${moved}/${Object.keys(map).length} files.`);

// 2. Rewrite references: replace the OLD FULL RELATIVE PATH with the new one.
// Matching on the full path (not bare basename) avoids corrupting unrelated files that
// happen to share a generic basename (e.g. "0.png" reused across different projects).
const sourceFiles = collectSourceFiles();
const renames = Object.entries(map).map(([from, to]) => ({ from, to }));

let filesChanged = 0;
let replacements = 0;
for (const file of sourceFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changedHere = 0;
  for (const { from, to } of renames) {
    if (from === to) continue;
    const re = new RegExp(escapeRegExp(from), 'g');
    const matches = content.match(re);
    if (matches) {
      content = content.replace(re, to);
      changedHere += matches.length;
    }
  }
  if (changedHere > 0) {
    fs.writeFileSync(file, content);
    filesChanged++;
    replacements += changedHere;
  }
}
console.log(`Rewrote ${replacements} references across ${filesChanged} source files.`);

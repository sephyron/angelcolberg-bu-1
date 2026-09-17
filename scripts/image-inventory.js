#!/usr/bin/env node
// Walks images/ and assets/prototypes/, records sizes, and finds source references.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SCAN_DIRS = ['images', path.join('assets', 'prototypes')];
const EXCLUDE_DIR_NAMES = new Set(['_build', 'assets 2', 'images 2']);
const IMAGE_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.mp4', '.pdf', '.psd', '.sketch'
]);

const SOURCE_DIRS = ['app', 'components', 'views', 'js', 'styles'];
const SOURCE_EXT = new Set(['.html', '.js', '.css', '.scss', '.json']);
// Prototypes are self-contained demos: an image counts as referenced if used
// anywhere inside its own prototype folder, not just the main portfolio source.
const PROTOTYPES_ROOT = path.join('assets', 'prototypes');

function walk(dir, onFile) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, onFile);
    } else if (entry.isFile()) {
      onFile(full);
    }
  }
}

function collectImages() {
  const images = [];
  for (const rel of SCAN_DIRS) {
    const dir = path.join(ROOT, rel);
    if (!fs.existsSync(dir)) continue;
    walk(dir, (full) => {
      const ext = path.extname(full).toLowerCase();
      if (!IMAGE_EXT.has(ext)) return;
      const stat = fs.statSync(full);
      images.push({
        path: path.relative(ROOT, full),
        ext,
        sizeBytes: stat.size,
      });
    });
  }
  return images;
}

function collectSourceFiles(dirsRelToRoot, baseDir) {
  const files = [];
  for (const rel of dirsRelToRoot) {
    const dir = path.join(baseDir, rel);
    if (!fs.existsSync(dir)) continue;
    walk(dir, (full) => {
      const ext = path.extname(full).toLowerCase();
      if (!SOURCE_EXT.has(ext)) return;
      files.push(full);
    });
  }
  return files;
}

function buildSourceIndex(sourceFiles) {
  return sourceFiles.map((full) => ({
    path: path.relative(ROOT, full),
    content: fs.readFileSync(full, 'utf8'),
  }));
}

function findReferences(image, sourceIndex) {
  const base = path.basename(image.path);
  const baseNoExt = base.slice(0, -image.ext.length);
  const refs = [];
  for (const src of sourceIndex) {
    if (src.content.includes(base) || (baseNoExt.length > 2 && src.content.includes(baseNoExt))) {
      refs.push(src.path);
    }
  }
  return refs;
}

// Returns the prototype folder name (e.g. "fi-gps-1") an image path belongs to, or null.
function prototypeOf(imagePath) {
  if (!imagePath.startsWith(PROTOTYPES_ROOT + path.sep)) return null;
  return imagePath.slice((PROTOTYPES_ROOT + path.sep).length).split(path.sep)[0];
}

function main() {
  const images = collectImages();
  const mainSourceFiles = collectSourceFiles(SOURCE_DIRS, ROOT);
  const mainSourceIndex = buildSourceIndex(mainSourceFiles);

  // Cache one source index per prototype folder, built on first use.
  const prototypeIndexCache = new Map();
  function prototypeSourceIndex(protoName) {
    if (!prototypeIndexCache.has(protoName)) {
      const protoDir = path.join(ROOT, PROTOTYPES_ROOT, protoName);
      const files = collectSourceFiles(['.'], protoDir);
      prototypeIndexCache.set(protoName, buildSourceIndex(files));
    }
    return prototypeIndexCache.get(protoName);
  }

  let totalBytes = 0;
  const report = images.map((img) => {
    totalBytes += img.sizeBytes;
    const proto = prototypeOf(img.path);
    const scope = proto ? 'prototype' : 'main-portfolio';
    const referencingFiles = proto
      ? findReferences(img, prototypeSourceIndex(proto))
      : findReferences(img, mainSourceIndex);
    return {
      path: img.path,
      ext: img.ext,
      sizeBytes: img.sizeBytes,
      scope,
      referenced: referencingFiles.length > 0,
      referencingFiles,
    };
  });

  const outPath = path.join(ROOT, 'image-inventory.json');
  fs.writeFileSync(outPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalFiles: report.length,
    totalBytes,
    files: report,
  }, null, 2));

  const unreferenced = report.filter((r) => !r.referenced);
  console.log(`Scanned ${report.length} image files (${(totalBytes / 1024 / 1024).toFixed(1)} MB total).`);
  console.log(`Unreferenced: ${unreferenced.length}`);
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
}

main();

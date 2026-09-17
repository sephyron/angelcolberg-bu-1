#!/usr/bin/env node
// Proposes kebab-case renames for images/logo, images/projects, images/pdf, and
// images/videos. Renames ALL files (referenced or not) — nothing is deleted or
// archived, only renamed. Deterministic rules; no visual inspection of image content.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const inventory = JSON.parse(fs.readFileSync(path.join(ROOT, 'image-inventory.json'), 'utf8'));

const TARGET_PREFIXES = ['images/logo', 'images/projects', 'images/pdf', 'images/videos'];

// Hand-picked clearer names for the small, flat pdf/videos folders where an
// algorithmic slug wouldn't add much meaning beyond what's already there.
const MANUAL_OVERRIDES = {
  'images/pdf/NextGenIntranetApproach_final.pdf': 'images/pdf/ngi-intranet-approach.pdf',
  'images/pdf/gps-visualdesign.pdf': 'images/pdf/gps-visual-design.pdf',
  'images/pdf/mockups-msit.pdf': 'images/pdf/msit-mockups.pdf',
  'images/pdf/msw_module_guide.pdf': 'images/pdf/msw-module-guide.pdf',
  'images/pdf/msw_style_guide.pdf': 'images/pdf/msw-style-guide.pdf',
  'images/pdf/msw_wireframes.pdf': 'images/pdf/msw-wireframes.pdf',
  'images/videos/Home_HI.mp4': 'images/videos/home-hero-hi.mp4',
  'images/videos/Home_LO.mp4': 'images/videos/home-hero-lo.mp4',
  'images/videos/microtalk.mp4': 'images/videos/ngi-microtalk-demo.mp4',
};

function slugify(str) {
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Finder duplicate suffix ("copy", "copy 2", ...) becomes a meaningful "-alt-N" marker instead of being discarded.
    .replace(/\s*copy\s*(\d*)/gi, (_, n) => (n ? `-alt-${n}` : '-alt'))
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9.@-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function proposeName(relPath) {
  if (MANUAL_OVERRIDES[relPath]) return MANUAL_OVERRIDES[relPath];

  const dir = path.dirname(relPath);
  const ext = path.extname(relPath);
  const base = path.basename(relPath, ext);

  // images/projects/<project>/... -> project slug is the folder name.
  // images/logo and images/pdf/videos files already carry their own identifying name; don't force a prefix.
  const parts = dir.split('/');
  let project = null;
  if (parts[0] === 'images' && parts[1] === 'projects' && parts.length >= 3) {
    project = parts[2];
  }

  let slugBase = slugify(base);

  if (/^\d+$/.test(base) && project) {
    // Purely numeric basenames (e.g. "0", "1", "12") -> project-screen-##
    const num = String(parseInt(base, 10)).padStart(2, '0');
    slugBase = `${project}-screen-${num}`;
  } else if (project && !slugBase.startsWith(slugify(project))) {
    slugBase = `${slugify(project)}-${slugBase}`;
  }

  const newBase = slugBase || 'file';
  return path.join(dir, newBase + ext.toLowerCase());
}

// Disambiguates a proposed name against ones already used in the same directory
// (e.g. "0.png" and "00.png" would otherwise both become "...-screen-00").
function dedupe(proposed, usedNames) {
  if (!usedNames.has(proposed)) return proposed;
  const ext = path.extname(proposed);
  const dir = path.dirname(proposed);
  const base = path.basename(proposed, ext);
  let n = 2;
  let candidate;
  do {
    candidate = path.join(dir, `${base}-alt-${n}${ext}`);
    n++;
  } while (usedNames.has(candidate));
  return candidate;
}

const candidates = inventory.files.filter((f) =>
  TARGET_PREFIXES.some((p) => f.path.startsWith(p + '/') || f.path === p)
);

// Reserve names for files that already match the naming convention first, so a
// file needing an actual rename never bumps an already-correct file off its name.
const usedNames = new Set();
const alreadyConformant = [];
const needsRename = [];
for (const f of candidates) {
  const proposed = proposeName(f.path);
  if (proposed === f.path) {
    alreadyConformant.push(f.path);
  } else {
    needsRename.push(f);
  }
}
for (const p of alreadyConformant) usedNames.add(p);

const map = {};
for (const f of needsRename) {
  const proposed = dedupe(proposeName(f.path), usedNames);
  usedNames.add(proposed);
  map[f.path] = proposed;
}

fs.writeFileSync(path.join(ROOT, 'rename-map.json'), JSON.stringify(map, null, 2));
console.log(`Proposed ${Object.keys(map).length} renames out of ${candidates.length} candidate files.`);
console.log('Wrote rename-map.json');

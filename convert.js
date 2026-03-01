#!/usr/bin/env node
// convert.js — reads ARC_Raiders_Workshop_Upgrades.xlsx and regenerates data.js
//
// One-time setup:  npm install xlsx
// Run after each Excel update:  node convert.js

const XLSX = require('xlsx');
const fs   = require('fs');

const wb = XLSX.readFile('ARC_Raiders_Workshop_Upgrades.xlsx');

// ── Workshop Upgrades ─────────────────────────────────

const ws = wb.Sheets['Workshop Upgrades'];

const STATION_IDS = {
  'Explosive Station': 'explosive',
  'Gear Bench':        'gear',
  'Gunsmith':          'gunsmith',
  'Medical Lab':       'medical',
  'Refiner':           'refiner',
  'Utility Station':   'utility',
};

// Data rows 4–51; column A is merged per station (value only in first row)
const benchMap = {};
let station = null;

for (let row = 4; row <= 51; row++) {
  if (ws[`A${row}`]?.v) station = ws[`A${row}`].v;
  if (!station) continue;

  const id = STATION_IDS[station];
  if (!id) continue;

  const levelStr = ws[`B${row}`]?.v;
  const name     = ws[`C${row}`]?.v;
  const qty      = ws[`D${row}`]?.v;
  if (!levelStr || !name || !qty) continue;

  const levelNum = parseInt(levelStr.match(/\d+/)?.[0]);
  if (!levelNum) continue;

  const inv = ws[`E${row}`]?.v ?? 0;

  if (!benchMap[id]) benchMap[id] = { id, name: station, levels: {} };
  if (!benchMap[id].levels[levelNum]) benchMap[id].levels[levelNum] = { level: levelNum, items: [] };

  const item = { name, qty };
  if (inv > 0) item.inv = inv;
  benchMap[id].levels[levelNum].items.push(item);
}

const BENCH_ORDER = ['explosive', 'gear', 'gunsmith', 'medical', 'refiner', 'utility'];
const BENCHES = BENCH_ORDER.map(id => ({
  ...benchMap[id],
  levels: Object.values(benchMap[id].levels).sort((a, b) => a.level - b.level),
}));

// ── Scrappy the Rooster ───────────────────────────────

const ss = wb.Sheets['Scrappy the Rooster'];

const LEVEL_NAMES = {
  1: 'Fledgling',
  2: 'Forager',
  3: 'Scavenger',
  4: 'Treasure Hunter',
  5: 'Master Hoarder',
};

// Data rows 4–13; column A is merged per level group
const scrappyMap = {};
let lvlNum = null;

for (let row = 4; row <= 13; row++) {
  if (ss[`A${row}`]?.v) {
    const match = ss[`A${row}`].v.match(/Level (\d+)/);
    if (match) {
      lvlNum = parseInt(match[1]);
      scrappyMap[lvlNum] = { level: lvlNum, name: LEVEL_NAMES[lvlNum], items: [] };
    }
  }
  if (!lvlNum) continue;

  const matVal = ss[`B${row}`]?.v;
  const qty    = ss[`C${row}`]?.v;

  // Level 1 has no items — B holds the note text, C is empty
  if (!qty) {
    if (matVal && lvlNum === 1) {
      scrappyMap[1].note = matVal.endsWith('.') ? matVal : matVal + '.';
    }
    continue;
  }

  const inv  = ss[`D${row}`]?.v ?? 0;
  const item = { name: matVal, qty };
  if (inv > 0) item.inv = inv;
  scrappyMap[lvlNum].items.push(item);
}

const SCRAPPY = Object.values(scrappyMap).sort((a, b) => a.level - b.level);

// ── Code generation ───────────────────────────────────

function itemStr(item) {
  const parts = [`name: '${item.name}'`, `qty: ${item.qty}`];
  if (item.inv) parts.push(`inv: ${item.inv}`);
  return `{ ${parts.join(', ')} }`;
}

function benchesCode(benches) {
  return 'const BENCHES = [\n' + benches.map(bench => {
    const levels = bench.levels.map(lvl => {
      const items = lvl.items.map(i => `        ${itemStr(i)},`).join('\n');
      return `      { level: ${lvl.level}, items: [\n${items}\n      ]},`;
    }).join('\n');
    return `  {\n    id: '${bench.id}',\n    name: '${bench.name}',\n    levels: [\n${levels}\n    ],\n  },`;
  }).join('\n') + '\n];\n';
}

function scrappyCode(scrappy) {
  return 'const SCRAPPY = [\n' + scrappy.map(lvl => {
    if (lvl.note) {
      return `  {\n    level: ${lvl.level},\n    name: '${lvl.name}',\n    items: [],\n    note: '${lvl.note}',\n  },`;
    }
    const items = lvl.items.map(i => `      ${itemStr(i)},`).join('\n');
    return `  {\n    level: ${lvl.level},\n    name: '${lvl.name}',\n    items: [\n${items}\n    ],\n  },`;
  }).join('\n') + '\n];\n';
}

// ── Write data.js (preserve BLUEPRINTS as-is) ─────────

const existing      = fs.readFileSync('data.js', 'utf8');
const blueprintsIdx = existing.indexOf('\nconst BLUEPRINTS');
const blueprints    = blueprintsIdx >= 0 ? existing.slice(blueprintsIdx) : '';

fs.writeFileSync('data.js', benchesCode(BENCHES) + '\n' + scrappyCode(SCRAPPY) + blueprints);
console.log('✓ data.js updated from Excel');

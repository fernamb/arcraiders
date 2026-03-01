const BENCH_ICONS = {
  explosive:  '💥',
  gear:       '⚙️',
  gunsmith:   '🔫',
  medical:    '🩺',
  refiner:    '🔥',
  utility:    '🔌',
  scrappy:    '🐓',
};

let currentTab = 'summary';

// ── Calculations ──────────────────────────────────────

function stillRequired(qty, inv) {
  return Math.max(0, qty * 2 - (inv || 0));
}

function getStats(levels) {
  let total = 0, done = 0;
  for (const lvl of levels) {
    for (const item of lvl.items) {
      total++;
      if (stillRequired(item.qty, item.inv) === 0) done++;
    }
  }
  const pct = total > 0 ? Math.round((done / total) * 100) : 100;
  return { total, done, pct };
}

// ── Tab switching ─────────────────────────────────────

function setTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  renderContent();
}

// ── HTML helpers ──────────────────────────────────────

function progressRingHTML(pct, size = 'lg') {
  const complete = pct === 100;
  return `
    <div class="ring-wrap ${size}">
      <svg class="progress-ring" viewBox="0 0 36 36">
        <path class="ring-bg"   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        <path class="ring-fill${complete ? ' complete' : ''}" stroke-dasharray="${pct}, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      </svg>
      <span class="ring-pct${complete ? ' complete' : ''}">${pct}%</span>
    </div>`;
}

function itemRowsHTML(items) {
  return items.map(item => {
    const have   = item.inv || 0;
    const needed = stillRequired(item.qty, item.inv);
    return `<tr class="${needed === 0 ? 'done' : 'needed'}">
      <td>${item.name}</td>
      <td class="center">${item.qty}</td>
      <td class="center">${have}</td>
      <td class="center still-req">${needed === 0 ? '&#10003;' : needed}</td>
    </tr>`;
  }).join('');
}

function tableHTML(items) {
  return `<table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="center">Need (each)</th>
        <th class="center">Have</th>
        <th class="center">Still Required</th>
      </tr>
    </thead>
    <tbody>${itemRowsHTML(items)}</tbody>
  </table>`;
}

function benchHeroHTML(name, icon, stats) {
  return `
    <div class="bench-hero">
      <div class="bench-hero-left">
        <span class="bench-hero-icon">${icon}</span>
        <div>
          <h2>${name}</h2>
          <span class="bench-count">${stats.done} / ${stats.total} items complete</span>
        </div>
      </div>
      ${progressRingHTML(stats.pct, 'sm')}
    </div>`;
}

// ── What to farm next ─────────────────────────────────

function getFarmNext(limit = 6) {
  const needed = [];
  for (const bench of BENCHES) {
    for (const lvl of bench.levels) {
      for (const item of lvl.items) {
        const still = stillRequired(item.qty, item.inv);
        if (still > 0) needed.push({ name: item.name, bench: bench.name, benchId: bench.id, icon: BENCH_ICONS[bench.id], still, total: item.qty * 2, have: item.inv || 0 });
      }
    }
  }
  for (const lvl of SCRAPPY) {
    for (const item of lvl.items) {
      const still = stillRequired(item.qty, item.inv);
      if (still > 0) needed.push({ name: item.name, bench: 'Scrappy', benchId: 'scrappy', icon: BENCH_ICONS.scrappy, still, total: item.qty * 2, have: item.inv || 0 });
    }
  }
  return needed.sort((a, b) => a.still - b.still).slice(0, limit);
}

function renderFarmNext() {
  const items = getFarmNext();
  if (items.length === 0) {
    return `<div class="farm-all-done">All items collected! 🎉</div>`;
  }
  const cards = items.map(item => `
    <div class="farm-card" onclick="setTab('${item.benchId}')">
      <div class="farm-card-top">
        <span class="farm-icon">${item.icon}</span>
        <span class="farm-bench">${item.bench}</span>
      </div>
      <div class="farm-name">${item.name}</div>
      <div class="farm-stats">
        <span class="farm-have">${item.have} / ${item.total}</span>
        <span class="farm-needed">need ${item.still}</span>
      </div>
    </div>`).join('');
  return `
    <div class="section-label">What to Grip Up Next</div>
    <div class="farm-grid">${cards}</div>`;
}

// ── Render functions ──────────────────────────────────

function renderSummary() {
  const items = [
    ...BENCHES.map(b => ({ id: b.id, name: b.name, levels: b.levels })),
    { id: 'scrappy', name: 'Scrappy the Rooster', levels: SCRAPPY },
  ];

  const cards = items.map(item => {
    const { total, done, pct } = getStats(item.levels);
    return `<div class="summary-card" onclick="setTab('${item.id}')">
      ${progressRingHTML(pct, 'lg')}
      <div class="card-name">
        <span class="card-icon">${BENCH_ICONS[item.id] || ''}</span>${item.name}
      </div>
      <div class="card-count">${done} / ${total} items</div>
    </div>`;
  });

  const bpTotal = BLUEPRINTS.reduce((sum, cat) => sum + cat.items.length, 0);
  const bpHave  = BLUEPRINTS.reduce((sum, cat) => sum + cat.items.filter(i => i.inv > 0).length, 0);
  const bpPct   = bpTotal > 0 ? Math.round((bpHave / bpTotal) * 100) : 0;
  cards.push(`<div class="summary-card" onclick="setTab('blueprints')">
      ${progressRingHTML(bpPct, 'lg')}
      <div class="card-name">
        <span class="card-icon">📋</span>Blueprints
      </div>
      <div class="card-count">${bpHave} / ${bpTotal} unlocked</div>
    </div>`);

  const benchSections = BENCHES.map(bench => {
    const stats  = getStats(bench.levels);
    const levels = bench.levels.map(lvl => `
      <div class="level-section level-${lvl.level}">
        <h3>Level ${lvl.level}</h3>
        ${tableHTML(lvl.items)}
      </div>`).join('');
    return `
      ${benchHeroHTML(bench.name, BENCH_ICONS[bench.id] || '', stats)}
      ${levels}`;
  }).join('');

  const scrappyStats  = getStats(SCRAPPY);
  const scrappyLevels = SCRAPPY.map(lvl => {
    if (lvl.items.length === 0) {
      return `<div class="level-section level-${lvl.level}">
        <h3>Level ${lvl.level} – ${lvl.name}</h3>
        <p class="note">${lvl.note}</p>
      </div>`;
    }
    return `<div class="level-section level-${lvl.level}">
      <h3>Level ${lvl.level} – ${lvl.name}</h3>
      ${tableHTML(lvl.items)}
    </div>`;
  }).join('');

  const bpCategories = BLUEPRINTS.map(cat => {
    const rows = cat.items.map(item => {
      const qty    = item.inv || 0;
      const cls    = qty > 0 ? 'done' : 'needed';
      return `<tr class="${cls}">
        <td>${item.name}</td>
        <td class="center still-req">${qty > 0 ? '&#10003;' : '—'}</td>
      </tr>`;
    }).join('');
    return `
      <div class="level-section">
        <h3>${cat.category}</h3>
        <table>
          <thead><tr><th>Blueprint</th><th class="center">Inventory</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');

  return `
    <div class="bench-header"><h2>Overview</h2></div>
    <div class="section-label">All Stations</div>
    <div class="summary-grid">${cards.join('')}</div>
    ${renderFarmNext()}
    ${benchSections}
    ${benchHeroHTML('Scrappy the Rooster', BENCH_ICONS.scrappy, scrappyStats)}
    ${scrappyLevels}
    <div class="bench-hero">
      <div class="bench-hero-left">
        <span class="bench-hero-icon">📋</span>
        <div>
          <h2>Blueprint Tracker</h2>
          <span class="bench-count">${bpHave} / ${bpTotal} blueprints unlocked</span>
        </div>
      </div>
      ${progressRingHTML(bpPct, 'sm')}
    </div>
    ${bpCategories}`;
}

function renderBench(bench) {
  const stats  = getStats(bench.levels);
  const levels = bench.levels.map(lvl => `
    <div class="level-section level-${lvl.level}">
      <h3>Level ${lvl.level}</h3>
      ${tableHTML(lvl.items)}
    </div>`).join('');

  return `
    ${benchHeroHTML(bench.name, BENCH_ICONS[bench.id] || '', stats)}
    ${levels}`;
}

function renderScrappy() {
  const stats  = getStats(SCRAPPY);
  const levels = SCRAPPY.map(lvl => {
    if (lvl.items.length === 0) {
      return `<div class="level-section level-${lvl.level}">
        <h3>Level ${lvl.level} – ${lvl.name}</h3>
        <p class="note">${lvl.note}</p>
      </div>`;
    }
    return `<div class="level-section level-${lvl.level}">
      <h3>Level ${lvl.level} – ${lvl.name}</h3>
      ${tableHTML(lvl.items)}
    </div>`;
  }).join('');

  return `
    ${benchHeroHTML('Scrappy the Rooster', BENCH_ICONS.scrappy, stats)}
    ${levels}`;
}

function renderBlueprints() {
  const total = BLUEPRINTS.reduce((sum, cat) => sum + cat.items.length, 0);
  const have  = BLUEPRINTS.reduce((sum, cat) => sum + cat.items.filter(i => i.inv > 0).length, 0);
  const pct   = total > 0 ? Math.round((have / total) * 100) : 0;

  const categories = BLUEPRINTS.map(cat => {
    const rows = cat.items.map(item => {
      const qty    = item.inv || 0;
      const cls    = qty > 0 ? 'done' : 'needed';
      const marker = qty > 0 ? '&#10003;' : '—';
      return `<tr class="${cls}">
        <td>${item.name}</td>
        <td class="center still-req">${qty}</td>
      </tr>`;
    }).join('');

    return `
      <div class="level-section">
        <h3>${cat.category}</h3>
        <table>
          <thead>
            <tr>
              <th>Blueprint</th>
              <th class="center">Inventory</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');

  return `
    <div class="bench-hero">
      <div class="bench-hero-left">
        <span class="bench-hero-icon">📋</span>
        <div>
          <h2>Blueprint Tracker</h2>
          <span class="bench-count">${have} / ${total} blueprints unlocked</span>
        </div>
      </div>
      ${progressRingHTML(pct, 'sm')}
    </div>
    ${categories}`;
}

function renderComingSoon() {
  return `
    <div class="bench-header"><h2>Coming Soon!</h2></div>
    <div class="coming-soon">
      <ul>
        <li>Blueprint inventory</li>
        <li>Expedition progress</li>
        <li>Skill tree recommendations</li>
      </ul>
    </div>`;
}

function renderIllNature() {
  return `
    <div class="bench-header"><h2>Ill Nature</h2></div>
    <div class="rat-stage">
      <div class="rat-emoji">🐀</div>
      <p class="rat-label">Ill Nature</p>
    </div>`;
}

function renderContent() {
  const main = document.getElementById('content');
  if      (currentTab === 'summary')     main.innerHTML = renderSummary();
  else if (currentTab === 'scrappy')     main.innerHTML = renderScrappy();
  else if (currentTab === 'blueprints')  main.innerHTML = renderBlueprints();
  else if (currentTab === 'coming-soon') main.innerHTML = renderComingSoon();
  else if (currentTab === 'ill-nature')  main.innerHTML = renderIllNature();
  else {
    const bench = BENCHES.find(b => b.id === currentTab);
    main.innerHTML = bench ? renderBench(bench) : '';
  }
}

// ── Init ──────────────────────────────────────────────

function buildTabs() {
  const tabs = [
    { id: 'summary',     label: 'Overview' },
    ...BENCHES.map(b => ({ id: b.id, label: b.name })),
    { id: 'scrappy',     label: 'Scrappy' },
    { id: 'blueprints',  label: 'Blueprints' },
    { id: 'coming-soon', label: 'Coming Soon!' },
    { id: 'ill-nature',  label: 'Ill Nature' },
  ];
  document.getElementById('tabs').innerHTML = tabs
    .map(t => `<button class="tab-btn${t.id === currentTab ? ' active' : ''}" data-tab="${t.id}" onclick="setTab(this.dataset.tab)">${t.label}</button>`)
    .join('');
}

buildTabs();
renderContent();

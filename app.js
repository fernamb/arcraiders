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

  return `
    <div class="bench-header"><h2>Overview</h2></div>
    <div class="summary-grid">${cards.join('')}</div>`;
}

function renderBench(bench) {
  const stats  = getStats(bench.levels);
  const levels = bench.levels.map(lvl => `
    <div class="level-section">
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
      return `<div class="level-section">
        <h3>Level ${lvl.level} – ${lvl.name}</h3>
        <p class="note">${lvl.note}</p>
      </div>`;
    }
    return `<div class="level-section">
      <h3>Level ${lvl.level} – ${lvl.name}</h3>
      ${tableHTML(lvl.items)}
    </div>`;
  }).join('');

  return `
    ${benchHeroHTML('Scrappy the Rooster', BENCH_ICONS.scrappy, stats)}
    ${levels}`;
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
    { id: 'coming-soon', label: 'Coming Soon!' },
    { id: 'ill-nature',  label: 'Ill Nature' },
  ];
  document.getElementById('tabs').innerHTML = tabs
    .map(t => `<button class="tab-btn${t.id === currentTab ? ' active' : ''}" data-tab="${t.id}" onclick="setTab(this.dataset.tab)">${t.label}</button>`)
    .join('');
}

buildTabs();
renderContent();

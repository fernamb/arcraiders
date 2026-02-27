let currentTab = 'summary';

// ── Calculations ──────────────────────────────────────

function stillRequired(qty, inv) {
  return Math.max(0, qty * 2 - (inv || 0));
}

function benchProgress(bench) {
  let total = 0, done = 0;
  for (const lvl of bench.levels) {
    for (const item of lvl.items) {
      total++;
      if (stillRequired(item.qty, item.inv) === 0) done++;
    }
  }
  return total > 0 ? Math.round((done / total) * 100) : 100;
}

function scrappyProgress() {
  let total = 0, done = 0;
  for (const lvl of SCRAPPY) {
    for (const item of lvl.items) {
      total++;
      if (stillRequired(item.qty, item.inv) === 0) done++;
    }
  }
  return total > 0 ? Math.round((done / total) * 100) : 100;
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

function progressBarHTML(pct) {
  return `
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <span class="progress-label">${pct}% complete</span>`;
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

// ── Render functions ──────────────────────────────────

function renderBench(bench) {
  const pct    = benchProgress(bench);
  const levels = bench.levels.map(lvl => `
    <div class="level-section">
      <h3>Level ${lvl.level}</h3>
      ${tableHTML(lvl.items)}
    </div>`).join('');

  return `
    <div class="bench-header">
      <h2>${bench.name}</h2>
      ${progressBarHTML(pct)}
    </div>
    ${levels}`;
}

function renderScrappy() {
  const pct    = scrappyProgress();
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
    <div class="bench-header">
      <h2>Scrappy the Rooster</h2>
      ${progressBarHTML(pct)}
    </div>
    ${levels}`;
}

function renderSummary() {
  const cards = BENCHES.map(bench => {
    const pct = benchProgress(bench);
    return `<div class="summary-card" onclick="setTab('${bench.id}')">
      <h3>${bench.name}</h3>
      ${progressBarHTML(pct)}
    </div>`;
  });

  const scrappyPct = scrappyProgress();
  cards.push(`<div class="summary-card" onclick="setTab('scrappy')">
    <h3>Scrappy the Rooster</h3>
    ${progressBarHTML(scrappyPct)}
  </div>`);

  return `
    <div class="bench-header"><h2>Summary</h2></div>
    <div class="summary-grid">${cards.join('')}</div>`;
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
  if (currentTab === 'summary') {
    main.innerHTML = renderSummary();
  } else if (currentTab === 'scrappy') {
    main.innerHTML = renderScrappy();
  } else if (currentTab === 'coming-soon') {
    main.innerHTML = renderComingSoon();
  } else if (currentTab === 'ill-nature') {
    main.innerHTML = renderIllNature();
  } else {
    const bench = BENCHES.find(b => b.id === currentTab);
    main.innerHTML = bench ? renderBench(bench) : '';
  }
}

// ── Init ──────────────────────────────────────────────

function buildTabs() {
  const tabs = [
    { id: 'summary',    label: 'Summary' },
    ...BENCHES.map(b => ({ id: b.id, label: b.name })),
    { id: 'scrappy',    label: 'Scrappy' },
    { id: 'coming-soon', label: 'Coming Soon!' },
    { id: 'ill-nature',  label: 'Ill Nature' },
  ];
  document.getElementById('tabs').innerHTML = tabs
    .map(t => `<button class="tab-btn${t.id === currentTab ? ' active' : ''}" data-tab="${t.id}" onclick="setTab(this.dataset.tab)">${t.label}</button>`)
    .join('');
}

buildTabs();
renderContent();

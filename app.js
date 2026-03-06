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

function simpleTableHTML(items) {
  return `<table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="center">Qty</th>
      </tr>
    </thead>
    <tbody>${items.map(item => `<tr>
      <td>${item.name}</td>
      <td class="center">${item.qty}</td>
    </tr>`).join('')}</tbody>
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
    return `<div class="summary-card" onclick="setTab('benches-scrappy')">
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

function renderBenchesScrappy() {
  const benchSections = BENCHES.map(bench => {
    const levels = bench.levels.map(lvl => `
      <div class="level-section level-${lvl.level}">
        <h3>Level ${lvl.level}</h3>
        ${simpleTableHTML(lvl.items)}
      </div>`).join('');
    return `
      <div class="bench-hero">
        <div class="bench-hero-left">
          <span class="bench-hero-icon">${BENCH_ICONS[bench.id] || ''}</span>
          <div><h2>${bench.name}</h2></div>
        </div>
      </div>
      ${levels}`;
  }).join('');

  const scrappyLevels = SCRAPPY.filter(lvl => lvl.items.length > 0).map(lvl => `
    <div class="level-section level-${lvl.level}">
      <h3>Level ${lvl.level} – ${lvl.name}</h3>
      ${simpleTableHTML(lvl.items)}
    </div>`).join('');

  return `
    ${benchSections}
    <div class="bench-hero">
      <div class="bench-hero-left">
        <span class="bench-hero-icon">${BENCH_ICONS.scrappy}</span>
        <div><h2>Scrappy the Rooster</h2></div>
      </div>
    </div>
    ${scrappyLevels}`;
}

function renderExpedition() {
  const phases = EXPEDITION.map(phase => {
    let body;
    if (phase.items.length > 0) {
      body = simpleTableHTML(phase.items);
    } else if (phase.load) {
      const rows = phase.load.map(l => `<tr>
        <td>${l.category}</td>
        <td class="center">${l.value.toLocaleString()} coins</td>
      </tr>`).join('');
      body = `<table>
        <thead><tr><th>Category</th><th class="center">Value Required</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    } else {
      body = '';
    }
    return `
      <div class="level-section">
        <h3>Phase ${phase.phase} – ${phase.name}</h3>
        <p class="note">${phase.desc}</p>
        ${body}
      </div>`;
  }).join('');

  return `
    <div class="bench-hero">
      <div class="bench-hero-left">
        <span class="bench-hero-icon">🚐</span>
        <div><h2>Expedition 3</h2></div>
      </div>
    </div>
    ${phases}`;
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
    </div>

    <div class="level-section">
      <h3>A Brief History of Rats</h3>
      <p class="note">
        Rats have walked alongside humanity for over 10,000 years — uninvited, unwelcome, and absolutely unbothered.
        Originating in Asia, the brown rat (<em>Rattus norvegicus</em>) spread across the globe by hitching rides on trade ships,
        colonising every continent except Antarctica. They were central to the Black Death, as fleas on rats carried the bubonic plague
        that wiped out roughly a third of Europe's population in the 14th century. Despite this, rats proved invaluable to modern science —
        the lab rat has been instrumental in nearly every major medical breakthrough of the last century.
        They are highly intelligent, capable of empathy, and have been trained to detect landmines and tuberculosis.
        Nature's great survivors. Opportunists. Everywhere you don't want them to be.
        In street culture, "rat" took on a second meaning — someone who talks when they shouldn't.
        The history below honours that tradition.
      </p>
    </div>

    <div class="level-section">
      <h3>Top 10 Street & Hip-Hop Snitches</h3>

      <div class="snitch-list">

        <div class="snitch-entry">
          <div class="snitch-name">1. Tekashi 6ix9ine (Daniel Hernandez)</div>
          <ul>
            <li>Cooperated fully with federal prosecutors against his Nine Trey Gangsta Bloods associates in 2019.</li>
            <li>Testified against Shottie, Mel Murda, and others — named names on the stand with zero hesitation.</li>
            <li>Got time served. Immediately went back to social media to antagonise the same streets. The audacity.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">2. Alpo Martinez</div>
          <ul>
            <li>Harlem drug kingpin and childhood friend of Rich Porter — who he later robbed and murdered.</li>
            <li>Cooperated with federal authorities in the early 90s, giving up associates to reduce his sentence.</li>
            <li>Released, relocated, and then shot dead in Harlem in October 2021. The streets remembered.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">3. Nicky Barnes</div>
          <ul>
            <li>"Mr. Untouchable" — Harlem heroin kingpin who once appeared on the cover of the New York Times Magazine.</li>
            <li>After being betrayed by his own crew, he flipped on everyone and entered WITSEC in 1983.</li>
            <li>Cooperated for years from witness protection, helping the feds dismantle the Council drug organisation.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">4. Frank Lucas</div>
          <ul>
            <li>Organised the "Blue Magic" heroin pipeline direct from Southeast Asia, built a Harlem empire.</li>
            <li>After his 1975 conviction, cooperated extensively with the DEA — gave up over 100 corrupt cops and dealers.</li>
            <li>His cooperation earned him a drastically reduced sentence. His story was later glorified in <em>American Gangster</em>.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">5. Haitian Jack (Jacques Agnant)</div>
          <ul>
            <li>Prominent figure in New York nightlife and street circles, connected to the music industry in the early 90s.</li>
            <li>Tupac Shakur accused him of setting up the 1994 Quad Studios robbery and cooperating with prosecutors.</li>
            <li>Widely believed in hip-hop circles to have been working with the feds. Case files partially support it.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">6. Jimmy "Henchman" Rosemond</div>
          <ul>
            <li>Music industry manager who worked with Game, Ja Rule, and others — and ran a significant drug operation.</li>
            <li>After his 2012 conviction, became a federal informant providing information on associates and rivals.</li>
            <li>Sentenced to life but his cooperation was well documented by those he gave up.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">7. Zip (Roland Martin)</div>
          <ul>
            <li>Close associate and right-hand man of Alpo Martinez in the DC and Harlem drug trade.</li>
            <li>Cooperated with federal authorities, corroborating testimony against members of their network.</li>
            <li>In the street code, cooperating while your co-defendants do time is a cardinal sin. Zip did exactly that.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">8. Fat Cat Nichols (Lorenzo Nichols)</div>
          <ul>
            <li>Powerful Queens drug lord in the 80s whose organisation ran South Jamaica with an iron grip.</li>
            <li>Eventually cooperated with federal authorities to reduce his sentence after multiple convictions.</li>
            <li>His crew had murdered a corrections officer — cooperation was the only card he had left to play.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">9. Freeway Ricky Ross</div>
          <ul>
            <li>Built one of the largest crack cocaine empires in LA history during the 1980s, moving hundreds of millions.</li>
            <li>Cooperated with authorities after his 1996 conviction to reduce a life sentence — named associates and suppliers.</li>
            <li>Later became a public figure, but the streets never forgot how the sentence got knocked down.</li>
          </ul>
        </div>

        <div class="snitch-entry">
          <div class="snitch-name">10. Henry Hill</div>
          <ul>
            <li>Half-Irish, half-Sicilian mob associate with the Lucchese family — ran drugs, hijackings, and point-shaving schemes.</li>
            <li>Turned FBI informant in 1980, putting away Jimmy Burke, Paul Vario, and dozens of others.</li>
            <li>Entered witness protection, then blew his cover so many times they eventually cut him loose. His life became <em>Goodfellas</em>.</li>
          </ul>
        </div>

      </div>
    </div>`;
}

function renderContent() {
  const main = document.getElementById('content');
  if      (currentTab === 'summary')         main.innerHTML = renderSummary();
  else if (currentTab === 'benches-scrappy') main.innerHTML = renderBenchesScrappy();
  else if (currentTab === 'blueprints')      main.innerHTML = renderBlueprints();
  else if (currentTab === 'expedition')      main.innerHTML = renderExpedition();
  else if (currentTab === 'ill-nature')      main.innerHTML = renderIllNature();
}

// ── Init ──────────────────────────────────────────────

function buildTabs() {
  const tabs = [
    { id: 'summary',         label: 'Overview' },
    { id: 'benches-scrappy', label: 'Benches & Scrappy' },
    { id: 'blueprints',      label: 'Blueprints' },
    { id: 'expedition',      label: 'Expedition' },
    { id: 'ill-nature',      label: 'Ill Nature' },
  ];
  document.getElementById('tabs').innerHTML = tabs
    .map(t => `<button class="tab-btn${t.id === currentTab ? ' active' : ''}" data-tab="${t.id}" onclick="setTab(this.dataset.tab)">${t.label}</button>`)
    .join('');
}

buildTabs();
renderContent();

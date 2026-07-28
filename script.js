const APP_URL = 'https://vaibhav-gee.projects.earthengine.app/view/pune-data-explorer';
const REPOSITORY_URL = '';
const CSV_URL = './data/Pune_Landsat_Annual_NDVI_MNDWI_NDBI_1989_2025.csv';
const REQUIRED_HEADERS = ['year', 'image_count', 'NDVI', 'MNDWI', 'NDBI'];
const INDEX_CONFIG = {
  NDVI: { color: '#0c922c', card: 'ndvi' },
  MNDWI: { color: '#08306b', card: 'mndwi' },
  NDBI: { color: '#800026', card: 'ndbi' }
};
let annualData = [];
let indexChart;

function validUrl(value) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function setStatus(message = '') { document.querySelector('#data-status').textContent = message; }
function format(value, digits = 4) { return Number.isFinite(value) ? new Intl.NumberFormat('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value) : 'No data'; }
function formatSigned(value, digits = 4) { return Number.isFinite(value) ? `${value > 0 ? '+' : ''}${format(value, digits)}` : 'No data'; }
function formatPercent(value) { return Number.isFinite(value) ? `${value > 0 ? '+' : ''}${format(value, 2)}%` : 'Unavailable'; }

function configureRepositoryLink() {
  if (!validUrl(REPOSITORY_URL)) return;
  const link = document.querySelector('#repository-link');
  link.href = REPOSITORY_URL;
  document.querySelector('#repository-slot').hidden = false;
  document.querySelector('.repo-placeholder').hidden = true;
}

function validRowsFor(index) { return annualData.filter((row) => Number.isFinite(row[index])); }
function linearFit(rows, index) {
  const count = rows.length;
  const meanX = rows.reduce((sum, row) => sum + row.year, 0) / count;
  const meanY = rows.reduce((sum, row) => sum + row[index], 0) / count;
  const denominator = rows.reduce((sum, row) => sum + (row.year - meanX) ** 2, 0);
  const slope = denominator ? rows.reduce((sum, row) => sum + (row.year - meanX) * (row[index] - meanY), 0) / denominator : 0;
  return { slope, values: annualData.map((row) => Number.isFinite(row[index]) ? meanY + slope * (row.year - meanX) : null) };
}

function renderChangeCards() {
  const target = document.querySelector('#change-cards');
  target.replaceChildren();
  Object.keys(INDEX_CONFIG).forEach((index) => {
    const rows = validRowsFor(index);
    if (!rows.length) return;
    const first = rows[0]; const last = rows.at(-1); const absolute = last[index] - first[index];
    const percentage = first[index] === 0 ? null : (absolute / Math.abs(first[index])) * 100;
    const direction = absolute > 0 ? 'Up' : absolute < 0 ? 'Down' : 'No change';
    const card = document.createElement('article'); card.className = `change-card ${INDEX_CONFIG[index].card}`;
    card.innerHTML = `<h3>${index}</h3><span class="change-direction">${direction}</span><dl><div><dt>First year</dt><dd>${first.year}: ${format(first[index])}</dd></div><div><dt>Latest year</dt><dd>${last.year}: ${format(last[index])}</dd></div><div><dt>Absolute change</dt><dd>${formatSigned(absolute)}</dd></div><div><dt>Percent change</dt><dd>${formatPercent(percentage)}</dd></div></dl>`;
    target.append(card);
  });
}

function renderAnnualTable() {
  const body = document.querySelector('#annual-table tbody'); body.replaceChildren();
  annualData.forEach((row) => {
    const tr = document.createElement('tr');
    [row.year, row.image_count, format(row.NDVI), format(row.MNDWI), format(row.NDBI)].forEach((value) => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
    body.append(tr);
  });
}

function renderTrendSummary() {
  const phrases = Object.keys(INDEX_CONFIG).map((index) => {
    const rows = validRowsFor(index); const first = rows[0]; const last = rows.at(-1); const change = last[index] - first[index];
    const direction = change > 0 ? 'increased' : change < 0 ? 'decreased' : 'did not change';
    return `${index} ${direction} from ${format(first[index])} in ${first.year} to ${format(last[index])} in ${last.year}`;
  });
  document.querySelector('#trend-summary').textContent = `Across the available annual values, ${phrases.join('; ')}. This statement describes the calculated first-to-latest values in the supplied CSV and does not establish causes for the observed changes.`;
}

function renderChart() {
  if (indexChart || !annualData.length) return;
  const datasets = Object.entries(INDEX_CONFIG).flatMap(([index, config]) => {
    const fit = linearFit(validRowsFor(index), index);
    return [
      { label: index, data: annualData.map((row) => row[index]), borderColor: config.color, backgroundColor: config.color, borderWidth: 3, pointRadius: 2, pointHoverRadius: 5, spanGaps: false, tension: .12 },
      { label: `${index} linear fit`, data: fit.values, borderColor: config.color, borderDash: [7, 5], borderWidth: 2, pointRadius: 0, spanGaps: false, tension: 0 }
    ];
  });
  indexChart = new Chart(document.querySelector('#index-chart'), { type: 'line', data: { labels: annualData.map((row) => String(row.year)), datasets }, options: { responsive: true, maintainAspectRatio: false, animation: { duration: 180 }, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { font: { family: 'IBM Plex Mono', size: 11 }, boxWidth: 24 } }, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${format(context.raw)}` } } }, scales: { x: { title: { display: true, text: 'Year', font: { family: 'IBM Plex Mono', weight: '600' } }, ticks: { font: { family: 'IBM Plex Mono' }, maxRotation: 0, autoSkipPadding: 12 }, grid: { color: '#ded7c9' } }, y: { title: { display: true, text: 'Annual mean index value', font: { family: 'IBM Plex Mono', weight: '600' } }, ticks: { font: { family: 'IBM Plex Mono' } }, grid: { color: '#ded7c9' } } } } });
}

function setVideoYear(video, card, firstYear, lastYear) {
  const frame = Math.floor(video.currentTime * 2);
  const year = Math.min(lastYear, Math.max(firstYear, firstYear + frame));
  card.querySelector('.year-counter').textContent = String(year);
  card.querySelector('.year-overlay').textContent = String(year);
}

function setupVideos(firstYear, lastYear) {
  const expectedDuration = (lastYear - firstYear + 1) / 2;
  document.querySelectorAll('.video-card').forEach((card) => {
    const video = card.querySelector('video');
    const update = () => setVideoYear(video, card, firstYear, lastYear);
    ['loadedmetadata', 'timeupdate', 'seeked', 'ended'].forEach((event) => video.addEventListener(event, update));
    video.addEventListener('loadedmetadata', () => {
      if (Math.abs(video.duration - expectedDuration) > .1) setStatus(`Animation duration check: ${card.dataset.index} is ${video.duration.toFixed(2)} seconds; expected ${expectedDuration.toFixed(2)} seconds from the CSV range.`);
    });
    update();
  });
}

async function loadAnnualData() {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error(`CSV request returned ${response.status}`);
    const parsed = Papa.parse(await response.text(), { header: true, skipEmptyLines: true, dynamicTyping: false });
    const fields = parsed.meta.fields || [];
    if (REQUIRED_HEADERS.some((header) => !fields.includes(header))) throw new Error('The historical CSV does not contain the required columns.');
    annualData = parsed.data.map((row) => ({ year: Number(row.year), image_count: Number(row.image_count), NDVI: Number(row.NDVI), MNDWI: Number(row.MNDWI), NDBI: Number(row.NDBI) })).filter((row) => Number.isFinite(row.year) && Number.isFinite(row.image_count)).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, ['NDVI', 'MNDWI', 'NDBI'].includes(key) && !Number.isFinite(value) ? null : value]))).sort((a, b) => a.year - b.year);
    if (!annualData.length) throw new Error('The historical CSV has no valid year rows.');
    const firstYear = annualData[0].year; const lastYear = annualData.at(-1).year;
    document.querySelector('#year-range').textContent = `${firstYear}–${lastYear}`;
    renderChangeCards(); renderAnnualTable(); renderTrendSummary(); renderChart(); setupVideos(firstYear, lastYear); setStatus();
  } catch (error) {
    setStatus(`Unable to load the annual index data: ${error.message}`);
    document.querySelector('#year-range').textContent = 'Unavailable';
    document.querySelector('#trend-summary').textContent = 'The annual CSV could not be loaded.';
  }
}

configureRepositoryLink(); loadAnnualData();

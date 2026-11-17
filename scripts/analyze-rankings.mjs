import fs from 'fs';
import path from 'path';

const downloadsDir = 'C:\\Users\\User\\Downloads';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content) {
  const lines = content.replace(/\r/g, '').split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

const files = fs.readdirSync(downloadsDir).filter(f => f.startsWith('eudossier.eu-organic.Positions-') && f.endsWith('.csv'));

const allRecords = [];
const countrySummary = {};

for (const file of files) {
  const country = file.split('-')[2];
  const fullPath = path.join(downloadsDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const rows = parseCSV(content);
  rows.forEach(r => {
    r.Country = country.toUpperCase();
    r.SourceFile = file;
  });
  allRecords.push(...rows);
  countrySummary[country.toUpperCase()] = {
    file,
    count: rows.length,
    keywords: rows.map(r => r.Keyword)
  };
}

console.log(`Loaded ${allRecords.length} total keyword positions across ${files.length} country markets.\n`);

// Detailed Analysis
const parsedRecords = allRecords.map(r => ({
  keyword: r.Keyword,
  position: parseInt(r.Position, 10) || 999,
  prevPosition: parseInt(r['Previous position'], 10) || null,
  volume: parseInt(r['Search Volume'], 10) || 0,
  difficulty: parseInt(r['Keyword Difficulty'], 10) || 0,
  cpc: parseFloat(r.CPC) || 0,
  traffic: parseFloat(r.Traffic) || 0,
  trafficCost: parseFloat(r['Traffic Cost']) || 0,
  url: r.URL,
  country: r.Country,
  intent: r['Keyword Intents'] || '',
  features: r['SERP Features by Keyword'] || '',
  posType: r['Position Type'] || ''
}));

// Sort by position ascending
parsedRecords.sort((a, b) => a.position - b.position);

// Write consolidated JSON & CSV for reporting
fs.writeFileSync('scripts/rankings_consolidated.json', JSON.stringify(parsedRecords, null, 2), 'utf8');

const csvHeaders = ['Country', 'Position', 'Previous Position', 'Keyword', 'Search Volume', 'Keyword Difficulty', 'CPC', 'Traffic', 'URL', 'Keyword Intent', 'SERP Features'];
const csvLines = [csvHeaders.join(',')];
parsedRecords.forEach(r => {
  const row = [
    r.country,
    r.position,
    r.prevPosition || '',
    `"${r.keyword.replace(/"/g, '""')}"`,
    r.volume,
    r.difficulty,
    r.cpc,
    r.traffic,
    `"${r.url}"`,
    `"${(r.intent || '').replace(/"/g, '""')}"`,
    `"${(r.features || '').replace(/"/g, '""')}"`
  ];
  csvLines.push(row.join(','));
});
fs.writeFileSync('rankings_consolidated.csv', csvLines.join('\n'), 'utf8');
console.log('Saved rankings_consolidated.csv with', parsedRecords.length, 'entries.');

console.log('--- SUMMARY STATS ---');
console.log('Total Rankings:', parsedRecords.length);
console.log('Top 3 (Pos 1-3):', parsedRecords.filter(r => r.position <= 3).length);
console.log('Top 10 (Pos 1-10 / Page 1):', parsedRecords.filter(r => r.position <= 10).length);
console.log('Striking Distance (Pos 11-30 / Page 2-3):', parsedRecords.filter(r => r.position > 10 && r.position <= 30).length);
console.log('Opportunity (Pos 31-100):', parsedRecords.filter(r => r.position > 30).length);

console.log('\n--- TOP 25 BEST RANKING KEYWORDS ---');
parsedRecords.slice(0, 25).forEach(r => {
  const change = r.prevPosition ? (r.prevPosition - r.position) : 0;
  const changeStr = change > 0 ? `+${change}` : change < 0 ? `${change}` : '=';
  console.log(`[#${r.position} (${changeStr})] [${r.country}] "${r.keyword}" | Vol: ${r.volume} | KD: ${r.difficulty} | URL: ${r.url}`);
});

console.log('\n--- BY COUNTRY BREAKDOWN ---');
const byCountry = {};
parsedRecords.forEach(r => {
  if (!byCountry[r.country]) byCountry[r.country] = { total: 0, top10: 0, top30: 0, totalVol: 0 };
  byCountry[r.country].total++;
  if (r.position <= 10) byCountry[r.country].top10++;
  if (r.position <= 30) byCountry[r.country].top30++;
  byCountry[r.country].totalVol += r.volume;
});
console.table(byCountry);

console.log('\n--- BY PAGE / PRODUCT URL BREAKDOWN ---');
const byUrl = {};
parsedRecords.forEach(r => {
  const u = r.url || 'Unknown';
  if (!byUrl[u]) byUrl[u] = { count: 0, bestPos: 999, topKeywords: [], totalVol: 0 };
  byUrl[u].count++;
  if (r.position < byUrl[u].bestPos) byUrl[u].bestPos = r.position;
  byUrl[u].totalVol += r.volume;
  if (byUrl[u].topKeywords.length < 3) byUrl[u].topKeywords.push(`${r.keyword} (#${r.position}, ${r.country})`);
});
console.table(Object.entries(byUrl).map(([url, d]) => ({
  url: url.replace('https://www.eudossier.eu', ''),
  keywords: d.count,
  bestPos: d.bestPos,
  totalVol: d.totalVol,
  sample: d.topKeywords.join('; ')
})).sort((a,b) => a.bestPos - b.bestPos));

// One-time generator: pull lawyer offices from OpenStreetMap for every city
// and write a static JSON the API serves instantly (no slow runtime calls).
// Run: node scripts/fetchLawyers.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CITY_COORDS = {
  Lahore: [31.5204, 74.3587], Karachi: [24.8607, 67.0011], Islamabad: [33.6844, 73.0479],
  Peshawar: [34.0151, 71.5249], Quetta: [30.1798, 66.975], Faisalabad: [31.4504, 73.135],
  Multan: [30.1575, 71.5249], Rawalpindi: [33.5651, 73.0169], Gujranwala: [32.1877, 74.1945],
  Sialkot: [32.4945, 74.5229],
};
const ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

function guessSpecialty(name = '') {
  const n = name.toLowerCase();
  if (/family|divorce|khula|nikah|custody|matrimon/.test(n)) return 'Family Law';
  if (/criminal|penal|fir|bail/.test(n)) return 'Criminal Law';
  if (/property|land|revenue|estate|rent|tenant/.test(n)) return 'Property Law';
  if (/cyber|digital|peca|it /.test(n)) return 'Cyber Crime';
  if (/labour|labor|employment|industrial|wage/.test(n)) return 'Labour Law';
  if (/constitution|writ|fundamental|human right/.test(n)) return 'Constitutional Law';
  if (/tax|revenue/.test(n)) return 'Property Law';
  return 'General Practice';
}

async function fetchCity(city, [lat, lon]) {
  const q = `[out:json][timeout:60];(` +
    `node["office"="lawyer"](around:25000,${lat},${lon});` +
    `way["office"="lawyer"](around:25000,${lat},${lon});` +
    `node["amenity"="lawyer"](around:25000,${lat},${lon});` +
    `);out center 120;`;
  for (const ep of ENDPOINTS) {
    try {
      const r = await fetch(ep, { method: 'POST', headers: { 'User-Agent': 'KanoonAI/1.0' }, body: 'data=' + encodeURIComponent(q) });
      if (!r.ok) continue;
      const d = await r.json();
      const list = (d.elements || [])
        .filter((e) => e.tags?.name)
        .map((e) => {
          const t = e.tags;
          const addr = [t['addr:street'], t['addr:suburb'], t['addr:city'] || city].filter(Boolean).join(', ');
          return {
            id: `${e.type}/${e.id}`,
            name: t.name,
            specialty: guessSpecialty(t.name),
            address: addr || `${city}, Pakistan`,
            phone: t.phone || t['contact:phone'] || 'N/A',
            website: t.website || t['contact:website'] || '',
            lat: e.lat ?? e.center?.lat,
            lon: e.lon ?? e.center?.lon,
            source: 'osm',
          };
        });
      return list;
    } catch { /* try next endpoint */ }
  }
  return [];
}

const out = {};
for (const [city, coords] of Object.entries(CITY_COORDS)) {
  process.stdout.write(`Fetching ${city}... `);
  const list = await fetchCity(city, coords);
  out[city] = list;
  console.log(`${list.length} offices`);
}

const dest = path.join(__dirname, '..', 'api', 'lawyers-data.json');
fs.writeFileSync(dest, JSON.stringify(out));
console.log(`\nSaved ${dest} (${Object.values(out).reduce((a, b) => a + b.length, 0)} total offices)`);

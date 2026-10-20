const MAPS = 'AIzaSyBSWw0FdWE2JGHK2jDzTf8K9-_YnHsUK7M';
const q = 'Criminal Law lawyer in Lahore, Pakistan';

const r1 = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&key=${MAPS}`);
const d1 = await r1.json();
console.log('MAPS legacy ->', d1.status, '|', d1.error_message || 'ok', '| results:', d1.results?.length ?? 0);
if (d1.results?.[0]) console.log('   sample:', d1.results[0].name, '|', d1.results[0].formatted_address);

const r2 = await fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': MAPS, 'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating' },
  body: JSON.stringify({ textQuery: q }),
});
const d2 = await r2.json();
console.log('PLACES new ->', r2.status, '|', d2.error ? d2.error.status + ': ' + d2.error.message : ('results: ' + (d2.places?.length ?? 0)));
if (d2.places?.[0]) console.log('   sample:', d2.places[0].displayName?.text, '|', d2.places[0].formattedAddress);

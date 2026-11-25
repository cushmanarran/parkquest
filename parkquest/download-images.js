// Run once in VS Code terminal: node download-images.js
const fs = require('fs');
const path = require('path');

const PARK_WIKI_PAGES = {
  acadia: 'Acadia_National_Park',
  americansamoa: 'National_Park_of_American_Samoa',
  arches: 'Arches_National_Park',
  badlands: 'Badlands_National_Park',
  bigbend: 'Big_Bend_National_Park',
  biscayne: 'Biscayne_National_Park',
  blackcanyon: 'Black_Canyon_of_the_Gunnison_National_Park',
  brycecanyon: 'Bryce_Canyon_National_Park',
  canyonlands: 'Canyonlands_National_Park',
  capitolreef: 'Capitol_Reef_National_Park',
  carlsbadcaverns: 'Carlsbad_Caverns_National_Park',
  channelislands: 'Channel_Islands_National_Park',
  chiricahua: 'Chiricahua_National_Monument',
  congaree: 'Congaree_National_Park',
  craterlake: 'Crater_Lake_National_Park',
  cuyahogavalley: 'Cuyahoga_Valley_National_Park',
  deathvalley: 'Death_Valley_National_Park',
  denali: 'Denali_National_Park_and_Preserve',
  drytortugas: 'Dry_Tortugas_National_Park',
  everglades: 'Everglades_National_Park',
  gatesofthearctic: 'Gates_of_the_Arctic_National_Park_and_Preserve',
  gatewayarch: 'Gateway_Arch_National_Park',
  glacier: 'Glacier_National_Park_(U.S.)',
  glacierbay: 'Glacier_Bay_National_Park_and_Preserve',
  grandcanyon: 'Grand_Canyon_National_Park',
  grandteton: 'Grand_Teton_National_Park',
  greatbasin: 'Great_Basin_National_Park',
  greatsanddunes: 'Great_Sand_Dunes_National_Park_and_Preserve',
  greatsmokymountains: 'Great_Smoky_Mountains_National_Park',
  guadalupemountains: 'Guadalupe_Mountains_National_Park',
  haleakala: 'Haleakalā_National_Park',
  hawaiivolcanoes: 'Hawaiʻi_Volcanoes_National_Park',
  hotsprings: 'Hot_Springs_National_Park',
  indianadunes: 'Indiana_Dunes_National_Park',
  isleroyale: 'Isle_Royale_National_Park',
  joshuatree: 'Joshua_Tree_National_Park',
  katmai: 'Katmai_National_Park_and_Preserve',
  kenaifjords: 'Kenai_Fjords_National_Park',
  kingscanyon: 'Kings_Canyon_National_Park',
  kobukvalley: 'Kobuk_Valley_National_Park',
  lakeclark: 'Lake_Clark_National_Park_and_Preserve',
  lassenvolcanic: 'Lassen_Volcanic_National_Park',
  mammothcave: 'Mammoth_Cave_National_Park',
  mesaverde: 'Mesa_Verde_National_Park',
  mountrainier: 'Mount_Rainier_National_Park',
  newrivergorge: 'New_River_Gorge_National_Park_and_Preserve',
  northcascades: 'North_Cascades_National_Park',
  olympic: 'Olympic_National_Park',
  petrifiedforest: 'Petrified_Forest_National_Park',
  pinnacles: 'Pinnacles_National_Park',
  redwood: 'Redwood_National_and_State_Parks',
  rockymountain: 'Rocky_Mountain_National_Park',
  saguaro: 'Saguaro_National_Park',
  sequoia: 'Sequoia_National_Park',
  shenandoah: 'Shenandoah_National_Park',
  theodoreroosevelt: 'Theodore_Roosevelt_National_Park',
  virginislands: 'Virgin_Islands_National_Park',
  voyageurs: 'Voyageurs_National_Park',
  whitesands: 'White_Sands_National_Park',
  windcave: 'Wind_Cave_National_Park',
  wrangellstelias: 'Wrangell–St._Elias_National_Park_and_Preserve',
  yellowstone: 'Yellowstone_National_Park',
  yosemite: 'Yosemite_National_Park',
  zion: 'Zion_National_Park'
};

async function downloadAll() {
  const outDir = path.join(__dirname, 'images');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const headers = {
    'User-Agent': 'ParkQuestFieldGuide/1.0 (https://github.com/parkquest-demo; parkquest-demo@gmail.com)'
  };

  for (const [id, pageTitle] of Object.entries(PARK_WIKI_PAGES)) {
    const filePath = path.join(outDir, `${id}.jpg`);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`⏭️  Already have images/${id}.jpg`);
      continue;
    }

    try {
      await sleep(2500); // Polite 2.5s pause to avoid Wikimedia 429 rate limits
      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
      const res = await fetch(apiUrl, { headers });
      if (!res.ok) {
        console.log(`⚠️ HTTP ${res.status} for ${id}, waiting 6s...`);
        await sleep(6000);
        continue;
      }

      const data = await res.json();
      // Use Wikimedia's exact pre-rendered thumbnail URL directly (prevents HTTP 400 resize errors)
      const imgUrl = data.thumbnail?.source || data.originalimage?.source;

      if (!imgUrl) {
        console.log(`⚠️ No image found for ${id}`);
        continue;
      }

      await sleep(1000);
      const imgRes = await fetch(imgUrl, { headers });
      if (!imgRes.ok) {
        console.log(`⚠️ Image download HTTP ${imgRes.status} for ${id}`);
        continue;
      }

      const buffer = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Saved images/${id}.jpg`);
    } catch (err) {
      console.log(`❌ Failed ${id}:`, err.message);
    }
  }
  console.log('\n🎉 Done! Check your images/ folder.');
}

downloadAll();
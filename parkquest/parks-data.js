// =========================================================
// ALL 64 U.S. NATIONAL PARKS, BIOME SVGs & 256 QUESTS
// =========================================================

const BIOME_STYLES = {
  mountain: {
    gradient: 'from-[#1B4332] via-[#2D6A4F] to-[#40916C]',
    patchBg: 'bg-gradient-to-br from-[#2D6A4F] to-[#1B4332]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><path d="M0 115 Q 70 40, 155 95 T 310 65 T 400 95 L 400 140 L 0 140 Z" fill="#081c15"/><path d="M0 128 Q 115 62, 215 108 T 400 85 L 400 140 L 0 140 Z" fill="#1b4332"/><circle cx="325" cy="34" r="16" fill="#fefae0" opacity="0.75"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><path d="M12 58 L32 24 L46 44 L56 28 L68 58 Z" fill="#52B788"/><path d="M10 62 Q40 52 70 62" stroke="#D8F3DC" stroke-width="3" fill="none"/><circle cx="56" cy="20" r="6" fill="#FDE68A"/></svg>`
  },
  glacier: {
    gradient: 'from-[#1e3a5f] via-[#2b5876] to-[#4e7988]',
    patchBg: 'bg-gradient-to-br from-[#1E3A5F] to-[#0F172A]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><polygon points="20,140 105,22 175,90 250,18 350,140" fill="#f8fafc"/><polygon points="0,140 75,65 155,140" fill="#0f172a"/><circle cx="330" cy="32" r="14" fill="#fde68a" opacity="0.8"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><polygon points="14,60 32,22 46,42 56,24 68,60" fill="#E2E8F0"/><polygon points="26,34 32,22 38,34" fill="#38BDF8"/><circle cx="58" cy="20" r="5" fill="#FBBF24"/></svg>`
  },
  canyon: {
    gradient: 'from-[#7f1d1d] via-[#b45309] to-[#d97706]',
    patchBg: 'bg-gradient-to-br from-[#B45309] to-[#7C2D12]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><polygon points="0,42 95,42 140,115 245,115 290,48 400,48 400,140 0,140" fill="#450a0a"/><polygon points="0,70 80,70 130,125 255,125 305,75 400,75 400,140 0,140" fill="#7c2d12"/><circle cx="200" cy="34" r="16" fill="#fde047" opacity="0.8"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><polygon points="10,28 28,28 36,56 44,56 52,28 70,28 70,62 10,62" fill="#F97316"/><circle cx="40" cy="22" r="7" fill="#FDE047"/></svg>`
  },
  desert: {
    gradient: 'from-[#9a3412] via-[#c2410c] to-[#ca8a04]',
    patchBg: 'bg-gradient-to-br from-[#C2410C] to-[#7C2D12]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><path d="M0 105 Q120 65 240 105 T400 95 L400 140 L0 140 Z" fill="#451a03"/><circle cx="310" cy="38" r="18" fill="#fef08a" opacity="0.85"/><rect x="85" y="55" width="8" height="45" rx="4" fill="#14532d"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><path d="M10 58 Q32 34 54 58 T72 54 L72 64 L10 64 Z" fill="#FDBA74"/><circle cx="54" cy="24" r="8" fill="#FDE047"/><rect x="24" y="34" width="6" height="24" rx="3" fill="#4ADE80"/></svg>`
  },
  coastal: {
    gradient: 'from-[#064e3b] via-[#0f766e] to-[#0284c7]',
    patchBg: 'bg-gradient-to-br from-[#0F766E] to-[#042F2E]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><path d="M0 95 Q100 75 200 95 T400 90 L400 140 L0 140 Z" fill="#0c4a6e"/><polygon points="40,105 90,45 135,105" fill="#064e3b"/><circle cx="320" cy="34" r="16" fill="#fef08a" opacity="0.8"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><path d="M12 52 Q26 44 40 52 T68 52" stroke="#38BDF8" stroke-width="4" fill="none"/><path d="M16 60 Q30 52 44 60 T66 60" stroke="#7DD3FC" stroke-width="3" fill="none"/><circle cx="40" cy="28" r="10" fill="#FBBF24"/></svg>`
  },
  volcanic: {
    gradient: 'from-[#7c2d12] via-[#991b1b] to-[#d97706]',
    patchBg: 'bg-gradient-to-br from-[#991B1B] to-[#450A0A]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><polygon points="90,140 185,35 215,35 310,140" fill="#1c1917"/><path d="M190 35 Q200 10 212 35" fill="#fb923c"/><circle cx="325" cy="32" r="14" fill="#fde047" opacity="0.75"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><polygon points="14,60 34,26 46,26 66,60" fill="#44403C"/><path d="M35 26 Q40 12 45 26" fill="#F97316"/><ellipse cx="40" cy="60" rx="22" ry="5" fill="#FACC15"/></svg>`
  },
  cave: {
    gradient: 'from-[#312e81] via-[#3730a3] to-[#0f766e]',
    patchBg: 'bg-gradient-to-br from-[#3730A3] to-[#1E1B4B]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><path d="M0 0 L400 0 L400 140 L320 140 Q200 35 80 140 L0 140 Z" fill="#0f172a"/><polygon points="140,22 148,55 156,22" fill="#94a3b8"/><polygon points="240,24 248,60 256,24" fill="#94a3b8"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><path d="M14 62 Q40 16 66 62 Z" fill="#6366F1"/><polygon points="30,34 34,48 38,34" fill="#E0E7FF"/><polygon points="44,32 48,50 52,32" fill="#E0E7FF"/></svg>`
  },
  forest: {
    gradient: 'from-[#14532d] via-[#166534] to-[#0f766e]',
    patchBg: 'bg-gradient-to-br from-[#166534] to-[#052E16]',
    heroSvg: `<svg viewBox="0 0 400 140" class="w-full h-full object-cover opacity-35"><polygon points="60,140 85,30 110,140" fill="#052e16"/><polygon points="160,140 190,20 220,140" fill="#052e16"/><polygon points="280,140 308,35 336,140" fill="#052e16"/></svg>`,
    patchSvg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><polygon points="40,14 24,42 33,42 20,62 60,62 47,42 56,42" fill="#34D399"/><rect x="37" y="60" width="6" height="8" fill="#FEF3C7"/></svg>`
  }
};

const RAW_64_PARKS = [
  {
    id: 'acadia', name: 'Acadia', shortName: 'Acadia', state: 'ME', region: 'Southeast & Caribbean', biome: 'coastal',
    tagline: 'Granite headland peaks, crashing Atlantic surf & historic carriage roads on Mount Desert Island.',
    elevation: '1,530 ft (Cadillac Mtn)', acreage: '49,075 acres', coords: '44.3386° N, 68.2733° W',
    landmark: 'Jordan Pond House Lawn & Path', permitNotice: 'Cadillac Summit Road vehicle reservation required May–October; park pass required.',
    safetyAlert: 'Coastal Surf & Peregrine Closures: Stay back from wet dark rocks near Thunder Hole; obey cliff nesting signs.',
    triviaQ: 'Why is Cadillac Mountain in Acadia famous among U.S. coastal peaks?',
    triviaOpts: ['It is the highest point along the North Atlantic seaboard and among the first places in the U.S. to see sunrise', 'It is an active basalt shield volcano', 'It sits entirely below sea level at high tide'],
    triviaAns: 0, triviaHint: 'Coastal Geography Hint: Rising 1,530 feet right beside the Gulf of Maine, it greets dawn before almost anywhere else in the U.S.!',
    stewardRule: 'Stayed on durable granite and gravel carriage roads without disturbing fragile subalpine summit plants'
  },
  {
    id: 'americansamoa', name: 'American Samoa', shortName: 'American Samoa', state: 'AS', region: 'Alaska & Pacific', biome: 'coastal',
    tagline: 'Paleotropical rainforests, volcanic sea cliffs & vibrant Indo-Pacific coral reefs.',
    elevation: '3,170 ft (Lata Mtn)', acreage: '8,257 acres', coords: '14.2583° S, 170.6833° W',
    landmark: 'Pago Pago Visitor Center Plaza', permitNotice: 'No park entrance fee; respect village Faʻa Sāmoa customs and request permission before entering village lands.',
    safetyAlert: 'Tropical Heat & Reef Protection: Never stand on or touch live coral; stay hydrated in high humidity.',
    triviaQ: 'Which rare pollinating mammal—with a wingspan up to 3 feet—is protected inside National Park of American Samoa?',
    triviaOpts: ['The Samoan Flying Fox (fruit bat)', 'The Arctic Lemming', 'The California Condor'],
    triviaAns: 0, triviaHint: 'Island Ecology Hint: Unlike mainland bats, these large diurnal fruit bats pollinate native rainforest trees!',
    stewardRule: 'Practiced reef-safe snorkeling and respected local Samoan village land stewardship traditions'
  },
  {
    id: 'arches', name: 'Arches', shortName: 'Arches', state: 'UT', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Over 2,000 natural Entrada Sandstone arches, balanced rocks & red-rock fins.',
    elevation: '5,653 ft (Elephant Butte)', acreage: '76,679 acres', coords: '38.7331° N, 109.5925° W',
    landmark: 'Windows Section Paved Overlook', permitNotice: 'Timed-entry ticket required April–October alongside standard park entrance pass.',
    safetyAlert: 'Extreme Heat & Cryptobiotic Soil: Carry 1 gallon of water per person; never walk on arches or dark biological soil crust.',
    triviaQ: 'How did Arches National Park’s 2,000+ sandstone arches form?',
    triviaOpts: ['Underground salt beds shifted, fracturing sandstone into fins that eroded via water and freeze-thaw cycles', 'Ancient sea turtles carved tunnels through soft mud', 'Meteor impacts punched circular holes through granite'],
    triviaAns: 0, triviaHint: 'Geology Hint: A 300-million-year-old Paradox Formation salt layer buckled beneath Entrada Sandstone!',
    stewardRule: 'Stayed strictly on designated trails and slickrock—never stepped on living cryptobiotic soil crusts'
  },
  {
    id: 'badlands', name: 'Badlands', shortName: 'Badlands', state: 'SD', region: 'Midwest', biome: 'canyon',
    tagline: 'Layered Oligocene buttes, mixed-grass prairies, bighorn sheep & ancient mammal fossils.',
    elevation: '3,340 ft (Red Shirt Table)', acreage: '242,756 acres', coords: '43.8554° N, 102.3397° W',
    landmark: 'Ben Reifel Visitor Center Plaza', permitNotice: 'Standard park pass required; Loop Road open year-round weather permitting.',
    safetyAlert: 'Prairie Rattlesnake & Loose Silt Hazard: Watch where you place hands/feet; never remove fossils (strictly illegal under 36 CFR).',
    triviaQ: 'If you discover a prehistoric fossil bone eroding out of a Badlands hillside, what is the law?',
    triviaOpts: ['Leave it undisturbed in place, note the GPS location, and report it to a Park Ranger', 'Take it home as a souvenir if it is smaller than your hand', 'Dig it out with a pocket knife'],
    triviaAns: 0, triviaHint: '36 CFR & PRPA Hint: Fossils lose scientific context if moved—rangers document and excavate them properly!',
    stewardRule: 'Left all rocks, minerals, and fossils completely untouched in place and kept 25+ yards from bison and bighorn sheep'
  },
  {
    id: 'bigbend', name: 'Big Bend', shortName: 'Big Bend', state: 'TX', region: 'Southwest & Mountain', biome: 'desert',
    tagline: 'Chihuahuan Desert expanses, Chisos Mountain sky islands & towering Rio Grande canyons.',
    elevation: '7,832 ft (Emory Peak)', acreage: '801,163 acres', coords: '29.2498° N, 103.2502° W',
    landmark: 'Panther Junction Visitor Center Plaza', permitNotice: 'Standard park pass required; Ross Maxwell Scenic Drive and river corridors have zero cell signal.',
    safetyAlert: 'Extreme Desert Heat & Black Bear Advisory: Avoid low-elevation hikes after 10 AM in summer; store all food in bear boxes.',
    triviaQ: 'Big Bend encompasses three distinct ecosystems in one park. Which three are they?',
    triviaOpts: ['Chihuahuan Desert, Chisos Mountains, and the Rio Grande riparian corridor', 'Arctic tundra, boreal taiga, and kelp forest', 'Everglades sawgrass, mangrove swamp, and coral reef'],
    triviaAns: 0, triviaHint: 'Biogeography Hint: From river canyons at 1,800 ft up to pine-oak peaks at 7,800 ft!',
    stewardRule: 'Carried ample water, packed out all trash, and used bear-proof food storage lockers at picnic areas'
  },
  {
    id: 'biscayne', name: 'Biscayne', shortName: 'Biscayne', state: 'FL', region: 'Southeast & Caribbean', biome: 'coastal',
    tagline: '95% underwater marine sanctuary of turquoise bay waters, emerald keys & living coral reefs.',
    elevation: '10 ft (Elliott Key)', acreage: '172,971 acres', coords: '25.4900° N, 80.3347° W',
    landmark: 'Dante Fascell Visitor Center Boardwalk', permitNotice: 'Mainland visitor center is free; reaching islands and reefs requires boat, kayak, or guided concession tour.',
    safetyAlert: 'Boating & Marine Protection: Use mooring buoys—never drop anchor on seagrass beds or coral reefs.',
    triviaQ: 'Approximately what percentage of Biscayne National Park lies beneath the surface of the water?',
    triviaOpts: ['95% underwater', '15% underwater', '50% underwater'],
    triviaAns: 0, triviaHint: 'Marine Park Hint: Nearly the entire park protects Biscayne Bay and the northern Florida Reef Tract!',
    stewardRule: 'Protected coastal mangroves and seagrass beds by keeping watercraft in marked channels'
  },
  {
    id: 'blackcanyon', name: 'Black Canyon of the Gunnison', shortName: 'Black Canyon', state: 'CO', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Sheer 2,000-foot Precambrian gneiss cliffs painted with dramatic pegmatite dikes.',
    elevation: '8,289 ft (High Point)', acreage: '30,750 acres', coords: '38.5754° N, 107.7416° W',
    landmark: 'Gunnison Point Guardrail Overlook', permitNotice: 'Standard park pass required; North Rim Road closes in winter snow.',
    safetyAlert: 'Extreme Drop-Off Hazard: Stay strictly behind fenced overlook guardrails; inner-canyon routes require backcountry permits.',
    triviaQ: 'Why is the Black Canyon of the Gunnison named "Black Canyon"?',
    triviaOpts: ['Its walls are so steep and narrow that parts of the gorge receive only 33 minutes of sunlight per day', 'The river water is dyed black by coal seams', 'It was formed by a recent black basalt lava flow'],
    triviaAns: 0, triviaHint: 'Canyon Proportions Hint: At The Narrows, the rim is only 1,100 feet wide while dropping 1,750 feet straight down!',
    stewardRule: 'Remained safely behind all rim guardrails and never threw stones over canyon walls'
  },
  {
    id: 'brycecanyon', name: 'Bryce Canyon', shortName: 'Bryce Canyon', state: 'UT', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'World’s largest concentration of crimson limestone hoodoos crowning the Paunsaugunt Plateau.',
    elevation: '9,115 ft (Rainbow Point)', acreage: '35,835 acres', coords: '37.6283° N, 112.1677° W',
    landmark: 'Sunrise Point Paved Rim Overlook', permitNotice: 'Standard park pass required; free seasonal park shuttle operates April–October.',
    safetyAlert: 'High Elevation & Rim Edge Safety: Overlooks sit above 8,000 ft; stay on paved rim paths and watch for afternoon lightning.',
    triviaQ: 'What geological process carves Bryce Canyon’s iconic spire-shaped "hoodoos"?',
    triviaOpts: ['Frost wedging—water seeps into limestone cracks and expands by 9% when freezing over 200 nights a year', 'Ocean waves crashing against the plateau', 'Windblown sandblasting alone'],
    triviaAns: 0, triviaHint: 'Freeze-Thaw Hint: High elevation brings warm sunny days and sub-freezing nights!',
    stewardRule: 'Stayed on designated rim paths and never climbed on fragile Claron Formation hoodoos'
  },
  {
    id: 'canyonlands', name: 'Canyonlands', shortName: 'Canyonlands', state: 'UT', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Vast mesa-and-butte wilderness carved by the confluence of the Green and Colorado Rivers.',
    elevation: '7,120 ft (Cathedral Point)', acreage: '337,598 acres', coords: '38.4598° N, 109.8213° W',
    landmark: 'Grand View Point Paved Overlook', permitNotice: 'Standard park pass required; 4WD backcountry roads (White Rim) require advance permits.',
    safetyAlert: 'Cliff Edge & Remote Desert Exposure: No water is available at Island in the Sky overlooks; stay behind guardrails.',
    triviaQ: 'Which two major rivers carve through Canyonlands and meet inside the park?',
    triviaOpts: ['The Green River and the Colorado River', 'The Snake River and the Columbia River', 'The Rio Grande and the Pecos River'],
    triviaAns: 0, triviaHint: 'Confluence Hint: Their junction divides the park into Island in the Sky, The Needles, and The Maze!',
    stewardRule: 'Protected desert potholes (tinajas) and biological soil crust by staying strictly on marked trails'
  },
  {
    id: 'capitolreef', name: 'Capitol Reef', shortName: 'Capitol Reef', state: 'UT', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'The 100-mile Waterpocket Fold monocline, historic Fruita orchards & towering sandstone domes.',
    elevation: '8,960 ft (Meeks Mesa)', acreage: '241,904 acres', coords: '38.2917° N, 111.2615° W',
    landmark: 'Fruita Visitor Center & Gifford House Plaza', permitNotice: 'Highway 24 through Fruita is free; Scenic Drive south of Fruita requires park pass.',
    safetyAlert: 'Flash Flood & Petroglyph Protection: Never touch Fremont petroglyph panels (36 CFR § 2.1); check weather before slot canyons.',
    triviaQ: 'What is the "Waterpocket Fold" that defines Capitol Reef National Park?',
    triviaOpts: ['A 100-mile wrinkle (monocline) in Earth’s crust uplifted 50–70 million years ago', 'A chain of active mud volcanoes', 'A glacial moraine left by Ice Age sheets'],
    triviaAns: 0, triviaHint: 'Geology Hint: Earthen layers tilted steeply on one side while remaining horizontal on the other!',
    stewardRule: 'Admired ancient Fremont rock art strictly from wooden boardwalks without touching sandstone walls'
  },
  {
    id: 'carlsbadcaverns', name: 'Carlsbad Caverns', shortName: 'Carlsbad Caverns', state: 'NM', region: 'Southwest & Mountain', biome: 'cave',
    tagline: 'Colossal subterranean limestone chambers, delicate speleothems & dusk Brazilian free-tailed bat flights.',
    elevation: '6,520 ft (Guadalupe Ridge)', acreage: '46,766 acres', coords: '32.1753° N, 104.4439° W',
    landmark: 'Visitor Center & Bat Flight Amphitheater', permitNotice: 'Timed-entry reservation required to enter the cavern alongside standard park pass.',
    safetyAlert: 'White-Nose Syndrome & Speleothem Rule: Never touch cave formations (skin oils stop mineral growth); sanitize shoes if visiting other caves.',
    triviaQ: 'How were Carlsbad Caverns’ gigantic underground chambers dissolved out of Permian reef limestone?',
    triviaOpts: ['Sulfuric acid rising from deep oil and gas deposits dissolved the rock from below', 'An underground lava river melted the limestone', 'Surface rainwater dissolved it in just 500 years'],
    triviaAns: 0, triviaHint: 'Speleogenesis Hint: Hydrogen sulfide gas mixed with oxygenated groundwater to form strong sulfuric acid!',
    stewardRule: 'Kept hands off all cave formations and silenced electronics during the evening bat flight program'
  },
  {
    id: 'channelislands', name: 'Channel Islands', shortName: 'Channel Islands', state: 'CA', region: 'West', biome: 'coastal',
    tagline: 'Five windswept Pacific islands harboring endemic island foxes, sea caves & kelp forests.',
    elevation: '2,450 ft (Santa Cruz Island)', acreage: '249,561 acres', coords: '34.2442° N, 119.2662° W',
    landmark: 'Ventura Harbor Visitor Center & Pier', permitNotice: 'Mainland visitor center is free; island access requires authorized concession boat or plane tickets.',
    safetyAlert: 'Ocean Crossing & Wildlife Buffer: Pack all food in sealed containers (island foxes are curious); stay back from sea cliffs.',
    triviaQ: 'Why is Channel Islands often called "North America’s Galápagos"?',
    triviaOpts: ['Long isolation allowed over 145 unique endemic species—like the Island Fox—to evolve nowhere else on Earth', 'It sits directly on the equator', 'It is the largest desert sand dune field in California'],
    triviaAns: 0, triviaHint: 'Island Evolution Hint: Rising sea levels separated the islands from the mainland thousands of years ago!',
    stewardRule: 'Packed out 100% of trash from island trails and never fed endemic Channel Island foxes'
  },
  {
    id: 'chiricahua', name: 'Chiricahua', shortName: 'Chiricahua', state: 'AZ', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Towering rhyolite hoodoo pinnacles, balanced rocks & Madrean Sky Island biodiversity.',
    elevation: '7,310 ft (Sugarloaf Mtn)', acreage: '12,025 acres', coords: '32.0056° N, 109.3568° W',
    landmark: 'Massai Point Paved Overlook Plaza', permitNotice: 'Designated a U.S. National Park in 2026! Check seasonal shuttle schedule along Bonita Canyon Drive.',
    safetyAlert: 'Narrow Canyon Road & Rim Guardrails: Stay on designated Massai Point paths and watch for coatis and black bears.',
    triviaQ: 'What ancient catastrophic event created the raw volcanic rock that eroded into Chiricahua’s "Wonderland of Rocks"?',
    triviaOpts: ['The massive Turkey Creek Caldera eruption 27 million years ago deposited 2,000 feet of hot rhyolitic ash', 'Continental glaciers bulldozed granite boulders from Canada', 'An ancient inland ocean deposited coral reefs'],
    triviaAns: 0, triviaHint: 'Volcanic Geology Hint: Welded volcanic tuff cooled, fractured vertically, and eroded into balanced pinnacles!',
    stewardRule: 'Stayed on maintained Sky Island trails and respected historic Civilian Conservation Corps stonework'
  },
  {
    id: 'congaree', name: 'Congaree', shortName: 'Congaree', state: 'SC', region: 'Southeast & Caribbean', biome: 'forest',
    tagline: 'North America’s largest intact old-growth bottomland hardwood forest & champion cypress trees.',
    elevation: '150 ft (Floodplain)', acreage: '26,693 acres', coords: '33.8303° N, 80.8242° W',
    landmark: 'Harry Hampton Visitor Center Boardwalk', permitNotice: 'Free park admission; check flood gauge status before hiking lower floodplain trails.',
    safetyAlert: 'Floodplain Boardwalk & Mosquito/Tick Advisory: Stay on the 2.4-mile elevated Boardwalk Loop when river levels rise.',
    triviaQ: 'Why do bald cypress trees in Congaree grow woody projections called "knees" above the swamp floor?',
    triviaOpts: ['They help stabilize the massive trees in soft, saturated floodplain soils', 'They are hollow chimneys used by beavers', 'They trap falling acorns for winter storage'],
    triviaAns: 0, triviaHint: 'Bottomland Ecology Hint: Periodic floods bring nutrient-rich sediment while demanding strong structural roots!',
    stewardRule: 'Remained on the elevated wooden boardwalk to prevent soil compaction around ancient champion roots'
  },
  {
    id: 'craterlake', name: 'Crater Lake', shortName: 'Crater Lake', state: 'OR', region: 'West', biome: 'volcanic',
    tagline: 'Deepest lake in the United States, filling the rain-and-snow-fed caldera of Mount Mazama.',
    elevation: '8,929 ft (Mount Scott)', acreage: '183,224 acres', coords: '42.9114° N, 122.1481° W',
    landmark: 'Rim Village Paved Promenade', permitNotice: 'Standard park pass required; North Entrance and East Rim Drive close under heavy snow until early summer.',
    safetyAlert: 'Caldera Rim Drop-Off & Deep Snow: Stay behind stone rim walls; snowbanks can overhang steep cliffs through June.',
    triviaQ: 'What gives Crater Lake its extraordinarily pure, intense cobalt-blue color?',
    triviaOpts: ['It has no inlet streams or rivers—100% of its water comes from pure rain and snowmelt, reaching 1,943 feet deep', 'Blue glacial flour from active ice sheets', 'Dissolved copper minerals from hot springs'],
    triviaAns: 0, triviaHint: 'Limnology Hint: With zero sediment entering from streams, deep clear water absorbs red wavelengths and scatters pure blue!',
    stewardRule: 'Stayed behind Rim Village stone walls and packed out all trash in subalpine conditions'
  },
  {
    id: 'cuyahogavalley', name: 'Cuyahoga Valley', shortName: 'Cuyahoga Valley', state: 'OH', region: 'Midwest', biome: 'forest',
    tagline: 'Lush Ohio & Erie Canal Towpath, Brandywine Falls boardwalk & Beaver Marsh wildlife.',
    elevation: '1,164 ft (Brush Rd)', acreage: '32,572 acres', coords: '41.2808° N, 81.5678° W',
    landmark: 'Boston Mill Visitor Center Plaza', permitNotice: 'Free park admission; scenic railroad tickets sold separately.',
    safetyAlert: 'Gorge Boardwalk & Towpath Etiquette: Stay on the Brandywine Falls wooden boardwalk; keep right and announce passes on the Towpath.',
    triviaQ: 'How did the historic Ohio & Erie Canal Towpath shape Cuyahoga Valley’s conservation story?',
    triviaOpts: ['Once a vital 1800s canal route, it was restored into a continuous greenway connecting people and wildlife habitats', 'It was built as a high-speed bullet train corridor', 'It is a natural limestone cave tunnel'],
    triviaAns: 0, triviaHint: 'Heritage Hint: Mules once walked the "towpath" pulling canal boats between Lake Erie and the Ohio River!',
    stewardRule: 'Yielded safely on the multi-use Towpath Trail and stayed on boardwalks above Brandywine Gorge'
  },
  {
    id: 'deathvalley', name: 'Death Valley', shortName: 'Death Valley', state: 'CA / NV', region: 'West', biome: 'desert',
    tagline: 'Lowest, hottest, and driest basin in North America—salt flats, singing dunes & Badwater Basin.',
    elevation: '-282 ft (Badwater Basin)', acreage: '3,408,395 acres', coords: '36.4614° N, 116.8656° W',
    landmark: 'Furnace Creek Visitor Center & Badwater Boardwalk', permitNotice: 'Standard park pass required; largest National Park in the contiguous United States.',
    safetyAlert: 'Extreme Heat Warning: Summer temperatures exceed 120°F; do not hike after 10 AM in hot months and stay on paved roads.',
    triviaQ: 'How low is Badwater Basin in Death Valley relative to sea level?',
    triviaOpts: ['282 feet (86 meters) below sea level—the lowest point in North America', '1,200 feet above sea level', 'Exactly at sea level'],
    triviaAns: 0, triviaHint: 'Topography Hint: Look high up the cliff behind Badwater parking lot to see the "Sea Level" sign!',
    stewardRule: 'Carried emergency drinking water and stayed on established salt-flat pathways'
  },
  {
    id: 'denali', name: 'Denali', shortName: 'Denali', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: 'Six million acres of subarctic taiga, alpine tundra & North America’s 20,310-foot summit.',
    elevation: '20,310 ft (Denali)', acreage: '4,740,911 acres', coords: '63.7284° N, 148.8866° W',
    landmark: 'Denali Visitor Center Plaza', permitNotice: 'Park road beyond Mile 15 requires transit/tour bus reservation; park entrance pass required.',
    safetyAlert: 'Subarctic Wildlife Rules (36 CFR § 2.2): Keep 300 yards from grizzly bears and 25 yards from caribou, moose, and Dall sheep.',
    triviaQ: 'Why do trees disappear above roughly 2,500 feet elevation in Denali National Park?',
    triviaOpts: ['Subarctic latitude creates a low treeline where taiga forest transitions into open alpine tundra', 'Volcanic ash prevents roots from growing', 'Beavers harvest every tree above 2,500 feet'],
    triviaAns: 0, triviaHint: 'Subarctic Ecology Hint: At 63° North latitude, permafrost and short summers limit tall spruce to valley bottoms!',
    stewardRule: 'Maintained 300 yards from bears and stored all scented items in bear-resistant containers'
  },
  {
    id: 'drytortugas', name: 'Dry Tortugas', shortName: 'Dry Tortugas', state: 'FL', region: 'Southeast & Caribbean', biome: 'coastal',
    tagline: 'Remote 19th-century Fort Jefferson surrounded by turquoise Gulf waters & coral reefs 70 miles west of Key West.',
    elevation: '10 ft (Garden Key)', acreage: '64,701 acres', coords: '24.6285° N, 82.8732° W',
    landmark: 'Garden Key Dock & Fort Jefferson Courtyard', permitNotice: 'Accessible only by authorized ferry, seaplane, or private boat; book months in advance.',
    safetyAlert: 'Zero Fresh Water & Bird Nesting Closures: Bring all drinking water; Bush Key closes seasonally for nesting sooty terns.',
    triviaQ: 'Why did Spanish explorer Ponce de León name these islands "Las Tortugas" (The Turtles) in 1513, and why was "Dry" added later?',
    triviaOpts: ['For abundant sea turtles, plus "Dry" to warn mariners that the islands have no fresh drinking water', 'Because giant desert tortoises live in the fort moat', 'Because it never rains in the Florida Keys'],
    triviaAns: 0, triviaHint: 'Maritime History Hint: Fresh water was a life-or-death detail on 16th-century nautical charts!',
    stewardRule: 'Packed out all waste from Garden Key and gave nesting seabirds and sea turtles wide berth'
  },
  {
    id: 'everglades', name: 'Everglades', shortName: 'Everglades', state: 'FL', region: 'Southeast & Caribbean', biome: 'coastal',
    tagline: 'Subtropical "River of Grass" where alligators, manatees, roseate spoonbills & mangroves thrive.',
    elevation: '8 ft (Rock Reef Pass)', acreage: '1,508,939 acres', coords: '25.3917° N, 80.5831° W',
    landmark: 'Anhinga Trail Wooden Boardwalk', permitNotice: 'Standard park pass required; Shark Valley tram tours and Flamingo boat tours book early in winter.',
    safetyAlert: 'Alligator & Crocodile Safety: Keep at least 15–20 feet back from water edges and never feed wildlife.',
    triviaQ: 'Why is the Everglades famously called the "River of Grass"?',
    triviaOpts: ['A vast, shallow sheet of fresh water flows slowly southward from Lake Okeechobee through dense sawgrass marshes', 'It is the fastest whitewater rafting river in Florida', 'It is a dry prairie with no standing water'],
    triviaAns: 0, triviaHint: 'Hydrology Hint: Less than a foot deep in places, this 50-mile-wide sheet flow sustains South Florida!',
    stewardRule: 'Stayed on the Anhinga Trail boardwalk and kept safe distance from basking alligators'
  },
  {
    id: 'gatesofthearctic', name: 'Gates of the Arctic', shortName: 'Gates of the Arctic', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: 'Entirely north of the Arctic Circle—roadless Brooks Range peaks, wild rivers & caribou migrations.',
    elevation: '8,510 ft (Mt. Igikpak)', acreage: '7,523,897 acres', coords: '66.9154° N, 151.5226° W',
    landmark: 'Arctic Interagency Visitor Center (Coldfoot)', permitNotice: 'Free admission; zero roads, trails, or cell service inside park—requires bush plane charter or expert backcountry self-sufficiency.',
    safetyAlert: 'Extreme Wilderness Remoteness: Carry satellite SOS beacon, bear-resistant canisters, and cold-water immersion gear.',
    triviaQ: 'What makes Gates of the Arctic unique among all U.S. National Parks?',
    triviaOpts: ['It lies 100% north of the Arctic Circle and contains zero roads, zero maintained trails, and zero campgrounds', 'It is the smallest park in the United States', 'It has a tropical palm beach'],
    triviaAns: 0, triviaHint: 'Arctic Wilderness Hint: Larger than Belgium, yet preserved purely as a trailless wilderness!',
    stewardRule: 'Practiced strict Arctic Leave No Trace by packing out all waste and using Bear-Resistant Food Containers'
  },
  {
    id: 'gatewayarch', name: 'Gateway Arch', shortName: 'Gateway Arch', state: 'MO', region: 'Midwest', biome: 'mountain',
    tagline: 'Eero Saarinen’s 630-foot stainless steel catenary arch honoring westward history along the Mississippi.',
    elevation: '630 ft (Arch Apex)', acreage: '193 acres', coords: '38.6247° N, 90.1848° W',
    landmark: 'Gateway Arch Museum Entrance Plaza', permitNotice: 'Grounds and museum are free; Tram Ride to the Top requires timed ticket.',
    safetyAlert: 'Urban Park & Riverfront Safety: Use marked pedestrian crossings and stay behind riverfront floodwall railings.',
    triviaQ: 'What geometric curve gives the Gateway Arch its iconic strength and graceful shape?',
    triviaOpts: ['An inverted weighted catenary curve—630 feet tall and 630 feet wide at its base', 'A half-circle semicircle', 'A parabolic pyramid'],
    triviaAns: 0, triviaHint: 'Architecture Hint: Hang a chain from two points—flip that natural gravity curve upside down!',
    stewardRule: 'Stayed on paved park pathways and disposed of all litter in riverfront recycling stations'
  },
  {
    id: 'glacier', name: 'Glacier', shortName: 'Glacier', state: 'MT', region: 'Southwest & Mountain', biome: 'glacier',
    tagline: 'Crown of the Continent—carved glacial horns, turquoise alpine lakes & Going-to-the-Sun Road.',
    elevation: '10,466 ft (Mt. Cleveland)', acreage: '1,013,126 acres', coords: '48.6967° N, 113.7183° W',
    landmark: 'Logan Pass Visitor Center Plaza', permitNotice: 'Vehicle reservation required for Going-to-the-Sun Road corridor in peak summer; standard park pass required.',
    safetyAlert: 'Grizzly & Black Bear Country: Carry bear spray, hike in groups, and stay 100 yards from bears.',
    triviaQ: 'What triple hydrological divide sits inside Glacier National Park?',
    triviaOpts: ['Triple Divide Peak, where snowmelt flows to the Pacific Ocean, Atlantic Ocean (Gulf of Mexico), and Hudson Bay', 'The meeting point of three active volcanoes', 'A desert basin where water never reaches any ocean'],
    triviaAns: 0, triviaHint: 'Watershed Hint: One drop of rain can head toward three different oceans!',
    stewardRule: 'Stayed on boardwalks at Logan Pass to protect delicate alpine wildflowers and kept 100+ yards from bears'
  },
  {
    id: 'glacierbay', name: 'Glacier Bay', shortName: 'Glacier Bay', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: 'Tidewater glaciers calving into fjords, humpback whales, sea otters & Tlingit homeland.',
    elevation: '15,300 ft (Mt. Fairweather)', acreage: '3,223,384 acres', coords: '58.4561° N, 135.8842° W',
    landmark: 'Bartlett Cove Visitor Center & Dock', permitNotice: 'Accessible by plane or ferry to Gustavus, or cruise/tour vessel; free admission.',
    safetyAlert: 'Cold Water & Marine Mammal Distance: Maintain required vessel distances from humpback whales and harbor seals.',
    triviaQ: 'How rapidly did the glacier filling Glacier Bay retreat after Captain George Vancouver mapped it in 1794?',
    triviaOpts: ['Over 60 miles in roughly 200 years—one of the fastest documented glacial retreats in history', 'Less than 10 feet total', 'It froze all the way to Seattle'],
    triviaAns: 0, triviaHint: 'Glaciology Hint: In 1794, the bay was a solid wall of ice 4,000 feet thick!',
    stewardRule: 'Observed marine wildlife from shore/vessel decks without disturbing hauled-out seals'
  },
  {
    id: 'grandcanyon', name: 'Grand Canyon', shortName: 'Grand Canyon', state: 'AZ', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Two billion years of Colorado River geologic strata carved across a mile-deep gorge.',
    elevation: '6,804 ft (South Rim)', acreage: '1,201,647 acres', coords: '36.0619° N, 112.1076° W',
    landmark: 'Mather Point Guardrail Plaza', permitNotice: 'Standard park pass required; free shuttle buses serve Hermit Road seasonally.',
    safetyAlert: 'Rim Edge & Heat Advisory: Stay behind guardrails at overlooks; never climb over rim walls for photos.',
    triviaQ: 'Which layer of rock sits right at the top edge of the Grand Canyon’s South Rim where you stand?',
    triviaOpts: ['Vishnu Basement Rocks (1.7 billion years old)', 'Kaibab Limestone (270 million years old, formed under an ancient shallow sea)', 'Tapeats Sandstone'],
    triviaAns: 1, triviaHint: 'Trail of Time Hint: Look for marine brachiopod and sponge fossils embedded in the creamy top rim rock!',
    stewardRule: 'Remained behind all canyon rim guardrails and never fed rock squirrels or ravens'
  },
  {
    id: 'grandteton', name: 'Grand Teton', shortName: 'Grand Teton', state: 'WY', region: 'Southwest & Mountain', biome: 'glacier',
    tagline: 'Jagged fault-block Teton Range rising abruptly 7,000 feet above Jackson Hole & Jenny Lake.',
    elevation: '13,775 ft (Grand Teton)', acreage: '310,044 acres', coords: '43.7517° N, 110.7224° W',
    landmark: 'Jenny Lake Visitor Plaza & Overlook', permitNotice: 'Standard park pass required; Jenny Lake shuttle boat tickets available at dock.',
    safetyAlert: 'Grizzly Bear & Moose Advisory: Moose can be aggressive—stay 25+ yards from moose/elk and 100+ yards from bears.',
    triviaQ: 'Why do the Teton peaks rise so dramatically straight up from the valley floor without foothills?',
    triviaOpts: ['They are a young fault-block mountain range uplifted along the Teton Fault while Jackson Hole dropped down', 'They are the ruins of a giant brick pyramid', 'Wind piled sand into 13,000-foot peaks'],
    triviaAns: 0, triviaHint: 'Tectonics Hint: Earthquakes along the active Teton Fault lifted the mountains skyward over the last 10 million years!',
    stewardRule: 'Stored all food in bear boxes and kept 100 yards from bears and 25 yards from moose'
  },
  {
    id: 'greatbasin', name: 'Great Basin', shortName: 'Great Basin', state: 'NV', region: 'West', biome: 'mountain',
    tagline: 'Ancient 4,000-year-old Bristlecone Pines, marble Lehman Caves & International Dark Sky vistas.',
    elevation: '13,063 ft (Wheeler Peak)', acreage: '77,180 acres', coords: '39.0058° N, 114.2197° W',
    landmark: 'Lehman Caves Visitor Center Plaza', permitNotice: 'Park admission is free; Lehman Caves guided tours require advance reservation.',
    safetyAlert: 'High Elevation & Cave Rules: Wheeler Peak Scenic Drive climbs above 10,000 ft; never touch cave formations.',
    triviaQ: 'What makes the Great Basin hydrologically unique in North America?',
    triviaOpts: ['Every drop of rain or snowmelt inside it evaporates or sinks underground—none ever reaches an ocean', 'It drains directly into the Mississippi River', 'It is covered by a freshwater sea'],
    triviaAns: 0, triviaHint: 'Endorheic Basin Hint: Mountains on both east and west trap all runoff inside the basin!',
    stewardRule: 'Protected ancient Bristlecone Pines by staying on marked trails and never peeling bark or deadwood'
  },
  {
    id: 'greatsanddunes', name: 'Great Sand Dunes', shortName: 'Great Sand Dunes', state: 'CO', region: 'Southwest & Mountain', biome: 'desert',
    tagline: 'North America’s tallest sand dunes (750 ft) backed by snow-dusted Sangre de Cristo peaks.',
    elevation: '13,604 ft (Tijeras Peak)', acreage: '149,028 acres', coords: '37.7329° N, 105.5125° W',
    landmark: 'Visitor Center Dune Overlook Deck', permitNotice: 'Standard park pass required; Medano Pass Primitive Road requires high-clearance 4WD.',
    safetyAlert: 'Hot Sand & Afternoon Lightning: Sand reaches 150°F on summer afternoons; descend dunes before thunderstorms.',
    triviaQ: 'How did 750-foot sand dunes pile up at the base of the Sangre de Cristo Mountains?',
    triviaOpts: ['Prevailing southwest winds blow sand across the San Luis Valley until storm winds off the peaks push it back into towering dunes', 'Trucks hauled sand from California beaches', 'A glacier dumped pure beach sand'],
    triviaAns: 0, triviaHint: 'Aeolian Physics Hint: Opposing wind currents trap sand in a natural pocket against the mountain wall!',
    stewardRule: 'Packed out all trash from the dunefield and respected seasonal snowy plover nesting closures'
  },
  {
    id: 'greatsmokymountains', name: 'Great Smoky Mountains', shortName: 'Smokies', state: 'TN / NC', region: 'Southeast & Caribbean', biome: 'mountain',
    tagline: 'Ancient mist-shrouded ridges, synchronous fireflies, 30+ salamander species & pioneer homesteads.',
    elevation: '6,643 ft (Kuwohi)', acreage: '522,427 acres', coords: '35.5629° N, 83.4985° W',
    landmark: 'Kuwohi Observation Tower Plaza', permitNotice: 'Parking tag required for stops >15 mins; no timed-entry reservation needed.',
    safetyAlert: 'Active Bear Advisory in Cades Cove: Maintain 50 yards (150 ft) distance. Never approach wildlife.',
    triviaQ: 'Great Smoky Mountains National Park is world-famous as the "Salamander Capital of the World." How do most lungless salamanders here breathe?',
    triviaOpts: ['Through specialized gills hidden under their front legs', 'Directly through their moist skin and the lining of their mouths', 'By surfacing at mountain trout streams every 10 minutes'],
    triviaAns: 1, triviaHint: 'Interpretive Hint: Keep creek rocks undisturbed and hands free of bug spray—their skin absorbs everything!',
    stewardRule: 'Stored all food in bear-proof lockers and left creek rocks undisturbed to protect salamander habitat'
  },
  {
    id: 'guadalupemountains', name: 'Guadalupe Mountains', shortName: 'Guadalupe Mtns', state: 'TX', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'World’s best-preserved Permian fossil reef, McKittrick Canyon maples & the top of Texas.',
    elevation: '8,751 ft (Guadalupe Peak)', acreage: '86,367 acres', coords: '31.8913° N, 104.8606° W',
    landmark: 'Pine Springs Visitor Center Plaza', permitNotice: 'Standard park pass required; zero fuel or lodging inside park boundaries.',
    safetyAlert: 'High Wind & Steep Trail Advisory: Gusts frequently exceed 60 mph; carry extra water and sun protection.',
    triviaQ: 'What were the rugged limestone cliffs of Guadalupe Mountains 265 million years ago?',
    triviaOpts: ['The Capitan Reef—a massive marine reef teeming with sponges and algae beneath a tropical Permian sea', 'A chain of snow-covered volcanoes', 'A freshwater lake delta'],
    triviaAns: 0, triviaHint: 'Paleontology Hint: Tectonic uplift raised an entire ancient ocean reef 8,751 feet into the Texas sky!',
    stewardRule: 'Stayed on established trails and left all marine reef fossils untouched in place'
  },
  {
    id: 'haleakala', name: 'Haleakalā', shortName: 'Haleakalā', state: 'HI', region: 'Alaska & Pacific', biome: 'volcanic',
    tagline: '10,023-foot Maui shield volcano crater, rare silverswords & lush Kīpahulu bamboo waterfalls.',
    elevation: '10,023 ft (Puʻu ʻUlaʻula)', acreage: '33,265 acres', coords: '20.7145° N, 156.2533° W',
    landmark: 'Haleakalā Visitor Center Overlook', permitNotice: 'Sunrise vehicle reservation required 3:00–7:00 AM; standard park pass required.',
    safetyAlert: 'High-Altitude Cold & Nēnē Goose Protection: Summit temperatures drop near freezing; drive slowly for endangered Nēnē geese.',
    triviaQ: 'How long can the endangered Haleakalā Silversword plant live in the volcanic cinder before blooming once and dying?',
    triviaOpts: ['20 to 90 years', 'Just 2 weeks', '500 years'],
    triviaAns: 0, triviaHint: 'Botany Hint: It stores energy for decades in silvery dagger-shaped leaves before sending up a 6-foot flower stalk!',
    stewardRule: 'Stayed strictly on marked crater paths so fragile silversword roots were never crushed'
  },
  {
    id: 'hawaiivolcanoes', name: 'Hawaiʻi Volcanoes', shortName: 'Hawaiʻi Volcanoes', state: 'HI', region: 'Alaska & Pacific', biome: 'volcanic',
    tagline: 'Active Kīlauea and Mauna Loa shield volcanoes, Thurston Lava Tube & sacred Pele landscapes.',
    elevation: '13,681 ft (Mauna Loa)', acreage: '354,461 acres', coords: '19.4194° N, 155.2885° W',
    landmark: 'Kīlauea Visitor Center & Crater Rim Path', permitNotice: 'Standard park pass required; check live USGS volcanic gas and road status before arrival.',
    safetyAlert: 'Volcanic Gas & Unstable Cliff Edge Hazard: Stay strictly behind all crater barriers; volcanic glass (Pele’s hair) and SO₂ fumes can be hazardous.',
    triviaQ: 'What type of broad, gently sloping volcanoes make up Hawaiʻi Volcanoes National Park?',
    triviaOpts: ['Shield volcanoes built layer by layer from fluid basaltic lava flows', 'Explosive ash stratovolcanoes', 'Limestone sinkholes'],
    triviaAns: 0, triviaHint: 'Volcanology Hint: Named because their wide profile resembles a warrior’s shield resting on the ocean floor!',
    stewardRule: 'Obeyed every volcanic hazard barricade and never removed lava rocks from the island'
  },
  {
    id: 'hotsprings', name: 'Hot Springs', shortName: 'Hot Springs', state: 'AR', region: 'Southeast & Caribbean', biome: 'mountain',
    tagline: 'Ancient 143°F thermal springs, historic Bathhouse Row architecture & Ouachita Mountain trails.',
    elevation: '1,405 ft (Music Mtn)', acreage: '5,554 acres', coords: '34.5117° N, 93.0535° W',
    landmark: 'Fordyce Bathhouse Visitor Center Plaza', permitNotice: 'Park grounds and Fordyce museum are free; soaking at historic bathhouses requires spa reservations.',
    safetyAlert: 'Scalding Water Warning: Natural spring water emerges at 143°F (62°C)—never place hands in open thermal display fountains.',
    triviaQ: 'How long does rainwater take to percolate deep into the Ouachita rocks, heat up, and rise back to Hot Springs’ thermal fountains?',
    triviaOpts: ['Roughly 4,000 years', 'About 24 hours', '10 million years'],
    triviaAns: 0, triviaHint: 'Geothermal Hint: Carbon-14 dating shows the water fell as rain before the Egyptian pyramids were built!',
    stewardRule: 'Filled reusable bottles at cool public spring jugs without touching 143°F thermal display basins'
  },
  {
    id: 'indianadunes', name: 'Indiana Dunes', shortName: 'Indiana Dunes', state: 'IN', region: 'Midwest', biome: 'coastal',
    tagline: '15 miles of Lake Michigan shoreline, towering singing sands, bogs & extraordinary plant diversity.',
    elevation: '792 ft (Moraine Crest)', acreage: '15,349 acres', coords: '41.6533° N, 87.0524° W',
    landmark: 'Indiana Dunes Visitor Center & West Beach', permitNotice: 'Standard park pass required; South Shore Line train stops right near park trails.',
    safetyAlert: 'Rip Current & Dune Collapse Hazard: Check Lake Michigan wave flags; never dig deep tunnels into sand dunes.',
    triviaQ: 'Why does Indiana Dunes rank among the top U.S. National Parks for vascular plant biodiversity despite its compact size?',
    triviaOpts: ['Glacial retreat created a patchwork of beaches, dunes, bogs, savannas, and forests where northern and southern species meet', 'It is heated by underground geysers', 'Tropical ocean currents warm Lake Michigan'],
    triviaAns: 0, triviaHint: 'Ecological Succession Hint: Henry Cowles pioneered modern ecology right here studying plant succession across the dunes!',
    stewardRule: 'Stayed on boardwalks across fragile foredunes to prevent wind erosion and blowouts'
  },
  {
    id: 'isleroyale', name: 'Isle Royale', shortName: 'Isle Royale', state: 'MI', region: 'Midwest', biome: 'coastal',
    tagline: 'Roadless Lake Superior island wilderness famous for wolves, moose & shipwrecks.',
    elevation: '1,394 ft (Mount Desor)', acreage: '571,790 acres', coords: '47.9959° N, 89.1526° W',
    landmark: 'Rock Harbor Visitor Center & Dock', permitNotice: 'Open mid-April through October only; accessible solely by ferry, seaplane, or private boat.',
    safetyAlert: 'Cold Lake Superior Water & Wildlife: Water averages 38–45°F year-round; maintain 25+ yards from moose.',
    triviaQ: 'What famous ecological research project has run continuously on Isle Royale since 1958?',
    triviaOpts: ['The world’s longest-running predator-prey study tracking the dynamic balance between gray wolves and moose', 'Deep-sea hydrothermal vent drilling', 'Desert tortoise radio tracking'],
    triviaAns: 0, triviaHint: 'Population Ecology Hint: An isolated island ecosystem makes it possible to count every wolf and moose each winter!',
    stewardRule: 'Cleaned boots before boarding the ferry to prevent invasive species from reaching the island'
  },
  {
    id: 'joshuatree', name: 'Joshua Tree', shortName: 'Joshua Tree', state: 'CA', region: 'West', biome: 'desert',
    tagline: 'Where the Mojave and Colorado Deserts meet—twisted yuccas, monzogranite boulders & starry skies.',
    elevation: '5,814 ft (Quail Mtn)', acreage: '795,156 acres', coords: '33.8734° N, 115.9010° W',
    landmark: 'Cholla Cactus Garden Boardwalk', permitNotice: 'Standard park pass required; zero water available inside most of the park.',
    safetyAlert: 'Cholla Spine & Heat Advisory: Stay strictly on the wooden boardwalk at Cholla Cactus Garden; carry 1+ gallon of water.',
    triviaQ: 'What kind of plant is a Joshua tree actually classified as?',
    triviaOpts: ['A tree-like yucca (Yucca brevifolia) pollinated exclusively by the tiny yucca moth', 'An oak tree that adapted to sand', 'A type of saguaro cactus'],
    triviaAns: 0, triviaHint: 'Mutualism Hint: Without the yucca moth carrying pollen from flower to flower, Joshua trees cannot produce seeds!',
    stewardRule: 'Stayed on established desert trails and never carved or climbed on fragile Joshua trees'
  },
  {
    id: 'katmai', name: 'Katmai', shortName: 'Katmai', state: 'AK', region: 'Alaska & Pacific', biome: 'volcanic',
    tagline: 'Brooks Falls brown bears fishing for sockeye salmon & the volcanic Valley of Ten Thousand Smokes.',
    elevation: '7,606 ft (Mount Denison)', acreage: '4,093,077 acres', coords: '58.5978° N, 154.6938° W',
    landmark: 'Brooks Camp Riffles Viewing Platform', permitNotice: 'Free park admission; accessible almost exclusively by floatplane or boat from King Salmon.',
    safetyAlert: 'Mandatory Bear Etiquette (36 CFR § 2.2): Attend Bear School on arrival; stay on elevated boardwalks and keep 50+ yards from bears.',
    triviaQ: 'Why do dozens of huge brown bears gather at Brooks Falls in Katmai every July and September?',
    triviaOpts: ['Sockeye salmon leap up the 6-foot waterfall to spawn upstream, providing concentrated high-fat nutrition before hibernation', 'Thermal hot springs warm the waterfall in winter', 'Rangers feed them salmon from boats'],
    triviaAns: 0, triviaHint: 'Wildlife Ecology Hint: A single salmon run fuels a 1,000-pound bear for months of winter dormancy!',
    stewardRule: 'Completed Bear School orientation and observed bears strictly from elevated viewing platforms'
  },
  {
    id: 'kenaifjords', name: 'Kenai Fjords', shortName: 'Kenai Fjords', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: 'Massive Harding Icefield outflow glaciers, Exit Glacier trails & sea-otter-filled coastal fjords.',
    elevation: '6,450 ft (Harding Icefield)', acreage: '669,984 acres', coords: '60.1806° N, 149.6508° W',
    landmark: 'Exit Glacier Nature Center Plaza', permitNotice: 'Free park admission; fjord boat cruises depart from Seward Harbor.',
    safetyAlert: 'Glacial Toe Hazard: Never cross barrier ropes to approach Exit Glacier’s ice wall—falling ice chunks are lethal.',
    triviaQ: 'What massive Ice Age remnant feeds nearly 40 glaciers flowing down into Kenai Fjords?',
    triviaOpts: ['The 700-square-mile Harding Icefield, receiving over 400 inches of snow annually', 'An underground hot spring reservoir', 'Sea ice drifting down from the Bering Strait'],
    triviaAns: 0, triviaHint: 'Glaciology Hint: It is one of only four remaining icefields in the United States!',
    stewardRule: 'Respected all glacier terminus barrier ropes and stayed on maintained trails'
  },
  {
    id: 'kingscanyon', name: 'Kings Canyon', shortName: 'Kings Canyon', state: 'CA', region: 'West', biome: 'forest',
    tagline: 'General Grant Tree ("Nation’s Christmas Tree") & one of North America’s deepest glacially carved canyons.',
    elevation: '14,248 ft (North Palisade)', acreage: '461,901 acres', coords: '36.7481° N, 118.9711° W',
    landmark: 'General Grant Grove Paved Loop', permitNotice: 'Joint park pass covers both Kings Canyon and neighboring Sequoia National Park; Highway 180 to Cedar Grove closes in winter.',
    safetyAlert: 'Giant Sequoia Root Protection & Black Bears: Stay on paved trails around Grant Grove; store all food in bear lockers.',
    triviaQ: 'Which famous tree in Kings Canyon was proclaimed the "Nation’s Christmas Tree" by President Calvin Coolidge in 1926?',
    triviaOpts: ['The General Grant Tree, measuring nearly 40 feet wide at its base', 'The Lone Cypress of Monterey', 'Old Methuselah Bristlecone'],
    triviaAns: 0, triviaHint: 'Giant Sequoia Hint: Standing 268 feet tall in Grant Grove, it is one of the largest living organisms on Earth!',
    stewardRule: 'Walked exclusively on fenced paths in Grant Grove to protect shallow Giant Sequoia roots'
  },
  {
    id: 'kobukvalley', name: 'Kobuk Valley', shortName: 'Kobuk Valley', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: '25-square-mile Great Kobuk Sand Dunes inside the Arctic Circle & Western Arctic caribou crossings.',
    elevation: '4,760 ft (Mt. Angayukaqsraq)', acreage: '1,750,717 acres', coords: '66.8989° N, 162.5967° W',
    landmark: 'Northwest Arctic Heritage Center (Kotzebue)', permitNotice: 'Free admission; zero roads into the park—accessible by chartered bush plane or boat along the Kobuk River.',
    safetyAlert: 'Remote Arctic Backcountry: Carry satellite communication, bear canisters, and hypothermia protection.',
    triviaQ: 'How did 100-foot-tall active sand dunes form 35 miles north of the Arctic Circle in Kobuk Valley?',
    triviaOpts: ['Pleistocene glaciers ground rock into fine sand and silt that wind swept into the Kobuk River valley', 'Tropical ocean currents deposited beach sand', 'Volcanic ash erupted last century'],
    triviaAns: 0, triviaHint: 'Glacial Outwash Hint: Ancient glacial grinding plus strong valley winds built Arctic dunes!',
    stewardRule: 'Practiced zero-trace Arctic travel and respected Iñupiat subsistence fishing camps along the Kobuk River'
  },
  {
    id: 'lakeclark', name: 'Lake Clark', shortName: 'Lake Clark', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: 'Turquoise glacier-fed Lake Clark, two active volcanoes, brown bears & sockeye salmon headwaters.',
    elevation: '10,197 ft (Mount Redoubt)', acreage: '4,030,015 acres', coords: '60.2008° N, 154.3219° W',
    landmark: 'Port Alsworth Visitor Center Plaza', permitNotice: 'Free park admission; no road system connects to the park—accessible by small bush plane from Anchorage.',
    safetyAlert: 'Bear Safety & Cold Lakes: Keep 50+ yards from coastal brown bears and wear life jackets on cold glacial waters.',
    triviaQ: 'Why is Lake Clark’s water a striking milky turquoise color?',
    triviaOpts: ['Fine glacial silt ("rock flour") suspended in snowmelt scatters blue-green sunlight', 'Green algae blooms year-round', 'Blue limestone boulders line the shore'],
    triviaAns: 0, triviaHint: 'Glacial Hydrology Hint: Grinding glaciers pulverize mountain bedrock into microscopic powder!',
    stewardRule: 'Stored all food in bear-resistant containers and followed ranger bear-viewing guidelines'
  },
  {
    id: 'lassenvolcanic', name: 'Lassen Volcanic', shortName: 'Lassen Volcanic', state: 'CA', region: 'West', biome: 'volcanic',
    tagline: 'All four volcano types in one park—steaming Bumpass Hell hydrothermal basin & Lassen Peak.',
    elevation: '10,457 ft (Lassen Peak)', acreage: '106,589 acres', coords: '40.4922° N, 121.5050° W',
    landmark: 'Kohm Yah-mah-nee Visitor Center Plaza', permitNotice: 'Standard park pass required; main park highway closes under deep snow from November to June.',
    safetyAlert: 'Boiling Hydrothermal Crusts (36 CFR § 2.1): Stay strictly on wooden boardwalks at Bumpass Hell—thin ground covers boiling mud.',
    triviaQ: 'Lassen Volcanic is one of the few places on Earth featuring all four types of volcanoes. Which four are they?',
    triviaOpts: ['Plug dome, shield, cinder cone, and stratovolcano', 'Geyser, sinkhole, glacier, and mesa', 'Atoll, caldera, canyon, and fjord'],
    triviaAns: 0, triviaHint: 'Volcanology Hint: Lassen Peak itself is one of the largest plug dome volcanoes in the world!',
    stewardRule: 'Stayed strictly on wooden boardwalks across hydrothermal areas to prevent thermal burns and crust damage'
  },
  {
    id: 'mammothcave', name: 'Mammoth Cave', shortName: 'Mammoth Cave', state: 'KY', region: 'Southeast & Caribbean', biome: 'cave',
    tagline: 'World’s longest known cave system—over 426 miles of surveyed subterranean passages & Green River hills.',
    elevation: '920 ft (Plateau Ridge)', acreage: '54,016 acres', coords: '37.1870° N, 86.1005° W',
    landmark: 'Mammoth Cave Visitor Center Plaza', permitNotice: 'Surface trails are free; all underground cave tours require advance timed tickets.',
    safetyAlert: 'White-Nose Syndrome Biosecurity: Walk across decontamination mats after cave tours; never touch cave walls.',
    triviaQ: 'How many miles of interconnected underground passages have been mapped inside Mammoth Cave so far?',
    triviaOpts: ['Over 426 miles—making it by far the longest known cave system on Earth', '12 miles', '85 miles'],
    triviaAns: 0, triviaHint: 'Karst Geology Hint: A sandstone caprock shields the soluble limestone beneath, preserving miles of ancient river tunnels!',
    stewardRule: 'Cleaned footwear on biosecurity mats to protect hibernating bats from White-Nose Syndrome'
  },
  {
    id: 'mesaverde', name: 'Mesa Verde', shortName: 'Mesa Verde', state: 'CO', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Over 600 remarkably preserved Ancestral Puebloan cliff dwellings built into sandstone alcoves.',
    elevation: '8,572 ft (Park Point)', acreage: '52,485 acres', coords: '37.1838° N, 108.4887° W',
    landmark: 'Spruce Tree Terrace & Overlook', permitNotice: 'Standard park pass required; ranger-guided tours into Cliff Palace and Balcony House require timed tickets.',
    safetyAlert: 'Cultural Heritage Protection (36 CFR § 2.1): Never lean on, sit on, or touch ancient sandstone walls or artifacts.',
    triviaQ: 'For roughly how long did Ancestral Pueblo people live on the mesa tops and in the cliff dwellings of Mesa Verde?',
    triviaOpts: ['Over 700 years (from around 550 CE to 1300 CE)', 'Just 15 years', '5,000 years'],
    triviaAns: 0, triviaHint: 'Archaeology Hint: Generations farmed corn, beans, and squash on the mesa top before building stone villages in canyon alcoves!',
    stewardRule: 'Protected 800-year-old Ancestral Pueblo architecture by keeping hands off masonry walls and artifacts'
  },
  {
    id: 'mountrainier', name: 'Mount Rainier', shortName: 'Mount Rainier', state: 'WA', region: 'West', biome: 'glacier',
    tagline: '14,411-foot glaciated Cascade stratovolcano encircled by subalpine wildflower meadows at Paradise.',
    elevation: '14,411 ft (Columbia Crest)', acreage: '236,381 acres', coords: '46.7865° N, 121.7351° W',
    landmark: 'Paradise Henry M. Jackson Visitor Plaza', permitNotice: 'Timed-entry corridor reservations required in summer peak hours alongside standard park pass.',
    safetyAlert: 'Meadow Protection & Sudden Mountain Weather: Stay strictly on paved/gravel trails at Paradise—stepping on heather kills years of growth.',
    triviaQ: 'How many major named glaciers cloak the flanks of Mount Rainier?',
    triviaOpts: ['29 major glaciers—the largest single-peak glacial system in the contiguous United States', '2 small ice patches', 'Zero glaciers'],
    triviaAns: 0, triviaHint: 'Glaciology Hint: Moist Pacific storms dump over 600 inches of snow at Paradise in an average winter!',
    stewardRule: 'Stayed strictly on paved pathways through Paradise meadows so delicate lupine and avalanche lilies thrive'
  },
  {
    id: 'newrivergorge', name: 'New River Gorge', shortName: 'New River Gorge', state: 'WV', region: 'Southeast & Caribbean', biome: 'mountain',
    tagline: 'Ancient Appalachian river canyon, iconic 3,000-foot steel arch bridge & world-class sandstone cliffs.',
    elevation: '3,260 ft (Swallow Rock)', acreage: '7,021 acres', coords: '38.0684° N, 81.0777° W',
    landmark: 'Canyon Rim Visitor Center Boardwalk', permitNotice: 'Free park admission year-round.',
    safetyAlert: 'Gorge Rim & Cliff Safety: Stay behind wooden boardwalk railings at Canyon Rim Overlook; watch for copperheads on warm rocks.',
    triviaQ: 'Despite its name, what do geologists say about the true age of the New River?',
    triviaOpts: ['It is one of the oldest rivers in North America—cutting across the Appalachian Mountains for tens of millions of years', 'It was dug by engineers in 1977', 'It formed during the last Ice Age 5,000 years ago'],
    triviaAns: 0, triviaHint: 'Geomorphology Hint: The river was already flowing northward before the modern Appalachian ridges rose around it!',
    stewardRule: 'Remained behind Canyon Rim boardwalk railings and packed out all trash from overlook trails'
  },
  {
    id: 'northcascades', name: 'North Cascades', shortName: 'North Cascades', state: 'WA', region: 'West', biome: 'glacier',
    tagline: 'Rugged "American Alps" holding over 300 glaciers, jagged peaks & turquoise Diablo Lake.',
    elevation: '9,220 ft (Goode Mountain)', acreage: '504,781 acres', coords: '48.7117° N, 121.2069° W',
    landmark: 'Diablo Lake Paved Overlook', permitNotice: 'Free park admission; Highway 20 (North Cascades Highway) closes in winter due to avalanche hazard.',
    safetyAlert: 'Steep Alpine Terrain & Weather: Carry extra layers even in July; stay behind overlook walls at Diablo Lake.',
    triviaQ: 'How many glaciers exist inside North Cascades National Park Complex?',
    triviaOpts: ['Over 300 glaciers—more than half of all glaciers in the contiguous United States', '5 glaciers', 'None'],
    triviaAns: 0, triviaHint: 'Alpine Climate Hint: Heavy Pacific snowfall and steep north-facing cirques sustain hundreds of glaciers!',
    stewardRule: 'Stayed on established overlook walkways and packed out every wrapper and fruit peel'
  },
  {
    id: 'olympic', name: 'Olympic', shortName: 'Olympic', state: 'WA', region: 'West', biome: 'forest',
    tagline: 'Glacier-capped peaks, moss-draped temperate rainforests & wild Pacific tidepools.',
    elevation: '7,980 ft (Mt. Olympus)', acreage: '922,651 acres', coords: '47.8609° N, 123.9348° W',
    landmark: 'Hoh Rain Forest Trailhead Plaza', permitNotice: 'Standard park pass required; check coastal tide charts before visiting beach trails.',
    safetyAlert: 'Wildlife & Sneaker Wave Advisory: Keep 50+ yards from Roosevelt elk; never turn your back on Pacific surf.',
    triviaQ: 'The lush clubmosses and ferns draping Bigleaf Maples in the Hoh Rain Forest are "epiphytes." What does that mean?',
    triviaOpts: ['They are parasites that drain sap and kill the host tree', 'They grow harmlessly upon other plants for physical support, drawing moisture and nutrients from rain and mist', 'They only grow underwater during winter river floods'],
    triviaAns: 1, triviaHint: 'Canopy Hint: With 140+ inches of annual rain, air plants get everything they need right from the humid fog!',
    stewardRule: 'Stayed on designated rainforest paths and kept 50+ yards from Roosevelt elk herds'
  },
  {
    id: 'petrifiedforest', name: 'Petrified Forest', shortName: 'Petrified Forest', state: 'AZ', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: '225-million-year-old rainbow quartz-crystal logs, Painted Desert badlands & Route 66 history.',
    elevation: '6,235 ft (Pilot Rock)', acreage: '221,390 acres', coords: '35.0657° N, 109.7815° W',
    landmark: 'Painted Desert Visitor Center Plaza', permitNotice: 'Standard park pass required; park gates close at sunset.',
    safetyAlert: 'Federal Fossil Protection (36 CFR § 2.1): Removing even a tiny pebble of petrified wood is a federal offense.',
    triviaQ: 'What mineral replaced the wood cells of Triassic trees to create Petrified Forest’s rainbow colors?',
    triviaOpts: ['Silica (quartz) stained with trace iron, manganese, and carbon', 'Pure solid gold', 'Frozen glacial ice'],
    triviaAns: 0, triviaHint: 'Mineralogy Hint: Volcanic ash dissolved in groundwater and crystallized into colorful quartz inside buried logs!',
    stewardRule: 'Left 100% of petrified wood and painted badland stones untouched for future generations'
  },
  {
    id: 'pinnacles', name: 'Pinnacles', shortName: 'Pinnacles', state: 'CA', region: 'West', biome: 'canyon',
    tagline: 'Ancient volcanic spires displaced 195 miles along the San Andreas Fault, talus caves & California condors.',
    elevation: '3,304 ft (North Chalone Peak)', acreage: '26,686 acres', coords: '36.4906° N, 121.1825° W',
    landmark: 'Bear Gulch Visitor Center Plaza', permitNotice: 'Standard park pass required; East and West entrances do not connect by road inside the park.',
    safetyAlert: 'Talus Cave Bat Closures & Heat: Bring a flashlight for open talus caves; check seasonal Townsend’s big-eared bat closures.',
    triviaQ: 'How did Pinnacles’ volcanic rocks end up 195 miles northwest of the volcano that originally erupted them?',
    triviaOpts: ['Tectonic movement along the San Andreas Fault sliced the volcano in half and carried Pinnacles northward over 23 million years', 'Giant floods rolled the mountains across California', 'Early settlers moved the boulders'],
    triviaAns: 0, triviaHint: 'Plate Tectonics Hint: The matching half of the Neenach Volcano still sits near Lancaster in Southern California!',
    stewardRule: 'Respected seasonal bat maternity cave closures and observed soaring condors from marked trails'
  },
  {
    id: 'redwood', name: 'Redwood', shortName: 'Redwood', state: 'CA', region: 'West', biome: 'forest',
    tagline: 'Earth’s tallest living trees—370-foot coastal redwoods shrouded in Pacific fog & Roosevelt elk meadows.',
    elevation: '3,260 ft (Coyote Peak)', acreage: '138,999 acres', coords: '41.3724° N, 124.0318° W',
    landmark: 'Kuchel Visitor Center & Lady Bird Johnson Grove', permitNotice: 'Park admission is free; Fern Canyon requires seasonal parking permits.',
    safetyAlert: 'Elk Buffer & Falling Limb Caution: Stay 50+ yards from Roosevelt elk; avoid old-growth groves during high windstorms.',
    triviaQ: 'How do 350-foot coastal redwoods get enough water all the way up to their highest needles during dry California summers?',
    triviaOpts: ['Their needles absorb summer coastal fog directly from the air—accounting for up to 40% of their moisture', 'They pump saltwater straight from the Pacific Ocean', 'They shed all their needles every June'],
    triviaAns: 0, triviaHint: 'Fog Drip Hint: Coastal redwoods create their own rainstorm underneath the canopy as fog condenses on needles!',
    stewardRule: 'Stayed on established redwood paths to prevent compacting shallow root mats'
  },
  {
    id: 'rockymountain', name: 'Rocky Mountain', shortName: 'Rocky Mountain', state: 'CO', region: 'Southwest & Mountain', biome: 'glacier',
    tagline: 'Towering 14,259-foot Longs Peak, Trail Ridge Road above treeline & bugling autumn elk herds.',
    elevation: '14,259 ft (Longs Peak)', acreage: '265,807 acres', coords: '40.3428° N, 105.6836° W',
    landmark: 'Alpine Visitor Center Plaza (11,796 ft)', permitNotice: 'Timed-entry permit required May–October alongside standard park pass; Trail Ridge Road closes in winter.',
    safetyAlert: 'Altitude & Afternoon Lightning: Above treeline (11,500 ft), descend immediately if thunderheads build.',
    triviaQ: 'What distinction does Trail Ridge Road in Rocky Mountain National Park hold?',
    triviaOpts: ['It is the highest continuous paved highway in the United States, cresting at 12,183 feet across alpine tundra', 'It is the lowest underwater tunnel in Colorado', 'It is an unpaved mule track'],
    triviaAns: 0, triviaHint: 'Alpine Tundra Hint: Over 11 miles of the highway travel above treeline in an Arctic-like climate!',
    stewardRule: 'Stayed strictly on tundra boardwalks—alpine cushion plants take decades to recover from a single footprint'
  },
  {
    id: 'saguaro', name: 'Saguaro', shortName: 'Saguaro', state: 'AZ', region: 'Southwest & Mountain', biome: 'desert',
    tagline: 'Iconic giant saguaro cactus forests flanking Tucson in the lush Sonoran Desert.',
    elevation: '8,666 ft (Mica Mountain)', acreage: '92,867 acres', coords: '32.1799° N, 110.7372° W',
    landmark: 'Rincon Mountain Visitor Center Cactus Garden', permitNotice: 'Standard park pass covers both Rincon Mountain (East) and Tucson Mountain (West) districts.',
    safetyAlert: 'Desert Heat & Spine Caution: Never touch or lean against saguaros; carry ample water and sun protection.',
    triviaQ: 'Roughly how old is a wild saguaro cactus before it grows its very first side arm?',
    triviaOpts: ['50 to 75 years old', '2 years old', '500 years old'],
    triviaAns: 0, triviaHint: 'Sonoran Desert Hint: Saguaros grow only an inch or two in their first decade, living up to 200 years!',
    stewardRule: 'Stayed on designated desert paths and never disturbed nurse trees sheltering young saguaros'
  },
  {
    id: 'sequoia', name: 'Sequoia', shortName: 'Sequoia', state: 'CA', region: 'West', biome: 'forest',
    tagline: 'General Sherman Tree (largest tree by volume on Earth), Moro Rock & High Sierra granite peaks.',
    elevation: '14,505 ft (Mount Whitney)', acreage: '404,063 acres', coords: '36.5817° N, 118.7514° W',
    landmark: 'General Sherman Tree Paved Plaza', permitNotice: 'Joint park pass covers Sequoia and Kings Canyon; free summer shuttle serves Giant Forest.',
    safetyAlert: 'Black Bear Food Storage & Snow: Store all scented items in bear lockers; snow chains may be required October–May.',
    triviaQ: 'Why is the General Sherman Tree in Sequoia National Park the largest living single-stem tree on Earth?',
    triviaOpts: ['By total trunk volume—over 52,500 cubic feet of wood, weighing roughly 1,385 tons', 'Because it is the tallest tree at 500 feet', 'Because its branches span 2 miles'],
    triviaAns: 0, triviaHint: 'Forestry Hint: While coast redwoods grow taller, Giant Sequoias keep massive trunk girth high into the crown!',
    stewardRule: 'Remained on fenced paths around the General Sherman Tree and stored all food in bear lockers'
  },
  {
    id: 'shenandoah', name: 'Shenandoah', shortName: 'Shenandoah', state: 'VA', region: 'Southeast & Caribbean', biome: 'mountain',
    tagline: '105-mile Skyline Drive cresting the Blue Ridge Mountains, cascading hollows & autumn foliage.',
    elevation: '4,051 ft (Hawksbill)', acreage: '199,223 acres', coords: '38.5222° N, 78.4358° W',
    landmark: 'Big Meadows Byrd Visitor Center Plaza', permitNotice: 'Standard park pass required; Skyline Drive has 75 scenic pullouts.',
    safetyAlert: 'Roadway Pullout & Bear Safety: Pull completely off Skyline Drive pavement before checking your phone; keep 50+ yards from black bears.',
    triviaQ: 'Which famous 2,190-mile footpath runs right alongside Skyline Drive for over 100 miles through Shenandoah?',
    triviaOpts: ['The Appalachian Trail', 'The Pacific Crest Trail', 'The Continental Divide Trail'],
    triviaAns: 0, triviaHint: 'Long-Distance Trail Hint: White blazes mark the footpath from Georgia to Maine right through the Blue Ridge!',
    stewardRule: 'Pulled completely into paved overlooks before viewing maps and kept 50+ yards from bears and deer'
  },
  {
    id: 'theodoreroosevelt', name: 'Theodore Roosevelt', shortName: 'T. Roosevelt', state: 'ND', region: 'Midwest', biome: 'canyon',
    tagline: 'Colorful Little Missouri Badlands, wild horses, bison herds & Roosevelt’s Elkhorn Ranch.',
    elevation: '2,865 ft (Peck Hill)', acreage: '70,447 acres', coords: '46.9154° N, 103.5244° W',
    landmark: 'Painted Canyon Visitor Center Overlook', permitNotice: 'Standard park pass covers South Unit, North Unit, and Elkhorn Ranch.',
    safetyAlert: 'Wild Bison & Feral Horse Buffer: Stay at least 25 yards from bison, wild horses, and prairie dog towns.',
    triviaQ: 'How did Theodore Roosevelt’s 1880s ranching days in the Dakota Badlands shape American conservation?',
    triviaOpts: ['Seeing bison and grasslands vanish inspired him as President to protect 230 million acres of public lands and 5 National Parks', 'He built a paved interstate through the Little Missouri River', 'He introduced penguins to North Dakota'],
    triviaAns: 0, triviaHint: 'Conservation History Hint: Roosevelt famously said he would never have become President without his time in North Dakota!',
    stewardRule: 'Maintained 25+ yards from bison and wild horses and never fed prairie dogs'
  },
  {
    id: 'virginislands', name: 'Virgin Islands', shortName: 'Virgin Islands', state: 'VI', region: 'Southeast & Caribbean', biome: 'coastal',
    tagline: 'White-sand Trunk Bay beaches, coral reef snorkel trails & historic Taino petroglyphs on St. John.',
    elevation: '1,277 ft (Bordeaux Mtn)', acreage: '15,052 acres', coords: '18.3382° N, 64.7932° W',
    landmark: 'Cruz Bay Visitor Center Plaza', permitNotice: 'Park trails are free; Trunk Bay beach charges a modest amenity fee.',
    safetyAlert: 'Reef-Safe Sunscreen & Coral Protection: Use non-nano mineral sunscreen and never stand on coral reefs.',
    triviaQ: 'What unique educational feature awaits snorkelers just offshore at Trunk Bay in Virgin Islands National Park?',
    triviaOpts: ['A 225-yard underwater snorkel trail with submerged plaques identifying brain coral, sea fans, and reef fish', 'A sunken Roman galleon', 'An underwater glass subway'],
    triviaAns: 0, triviaHint: 'Marine Education Hint: Follow the underwater markers while floating safely above the coral!',
    stewardRule: 'Used reef-safe mineral sunscreen and floated cleanly above coral formations'
  },
  {
    id: 'voyageurs', name: 'Voyageurs', shortName: 'Voyageurs', state: 'MN', region: 'Midwest', biome: 'coastal',
    tagline: 'Interconnected boreal lakes, ancient Canadian Shield granite & historic fur-trade canoe routes.',
    elevation: '1,400 ft (Sullivan Bay)', acreage: '218,222 acres', coords: '48.5983° N, 93.2611° W',
    landmark: 'Rainy Lake Visitor Center Deck', permitNotice: 'Free park admission; 40% of the park is water—exploring islands requires boat, kayak, or ranger tour.',
    safetyAlert: 'Cold Boreal Water & Life Jacket Rule: Always wear a U.S. Coast Guard-approved PFD on large windswept lakes.',
    triviaQ: 'Who were the "voyageurs" for whom this Minnesota water-based park is named?',
    triviaOpts: ['French-Canadian canoe paddlers who transported furs and trade goods across these interconnected border lakes in the 1700s–1800s', '19th-century steam locomotive engineers', 'Arctic hot-air balloon pilots'],
    triviaAns: 0, triviaHint: 'Fur Trade History Hint: Birchbark freight canoes carried 3,000 pounds of cargo along the U.S.–Canada border!',
    stewardRule: 'Wore life jackets on open water and cleaned watercraft to stop aquatic invasive species'
  },
  {
    id: 'whitesands', name: 'White Sands', shortName: 'White Sands', state: 'NM', region: 'Southwest & Mountain', biome: 'desert',
    tagline: 'World’s largest gypsum dunefield—275 square miles of dazzling snow-white wave-like dunes.',
    elevation: '4,235 ft (Dune Crest)', acreage: '146,344 acres', coords: '32.7797° N, 106.1717° W',
    landmark: 'Interdune Boardwalk Accessible Trail', permitNotice: 'Standard park pass required; Dunes Drive closes briefly during occasional White Sands Missile Range tests.',
    safetyAlert: 'Disorientation & UV Glare Hazard: White dunes look identical in every direction—stay within sight of trail markers and carry water.',
    triviaQ: 'Why does the white sand at White Sands National Park feel cool to bare feet even on hot summer days?',
    triviaOpts: ['It is made of gypsum crystals rather than quartz—gypsum does not absorb solar heat easily and reflects sunlight', 'Underground ice pipes cool the desert floor', 'It is made of crushed sea salt'],
    triviaAns: 0, triviaHint: 'Mineralogy Hint: Gypsum normally dissolves in water, but the closed Tularosa Basin traps it into gleaming dunes!',
    stewardRule: 'Followed numbered dune trail markers and packed out all trash from the gypsum dunes'
  },
  {
    id: 'windcave', name: 'Wind Cave', shortName: 'Wind Cave', state: 'SD', region: 'Midwest', biome: 'cave',
    tagline: 'Rare honeycomb "boxwork" calcite formations & rolling Black Hills mixed-grass prairie above.',
    elevation: '5,013 ft (Rankin Ridge)', acreage: '33,970 acres', coords: '43.5578° N, 103.4789° W',
    landmark: 'Wind Cave Visitor Center & Natural Entrance', permitNotice: 'Surface trails are free; ranger-led underground cave tours require timed tickets.',
    safetyAlert: 'Cave Biosecurity & Bison Distance: Never touch boxwork formations; keep 25+ yards from bison and elk on surface trails.',
    triviaQ: 'Why does air rush forcefully in or out of Wind Cave’s natural opening?',
    triviaOpts: ['Barometric pressure changes outside equalize with the massive 160+ mile underground cave volume, creating natural "wind"', 'Giant electric ventilation fans run beneath the hills', 'Hot geysers blow steam out the entrance'],
    triviaAns: 0, triviaHint: 'Atmospheric Physics Hint: When a high-pressure weather front arrives outside, the cave inhales!',
    stewardRule: 'Kept hands off delicate calcite boxwork and maintained 25+ yards from prairie bison'
  },
  {
    id: 'wrangellstelias', name: 'Wrangell-St. Elias', shortName: 'Wrangell-St. Elias', state: 'AK', region: 'Alaska & Pacific', biome: 'glacier',
    tagline: 'America’s largest National Park (13.2 million acres)—9 of the 16 highest U.S. peaks & Kennecott mines.',
    elevation: '18,008 ft (Mount Saint Elias)', acreage: '13,175,799 acres', coords: '61.7104° N, 142.9857° W',
    landmark: 'Copper Center Visitor Center Overlook', permitNotice: 'Free park admission; McCarthy Road is a rough 60-mile gravel road—check rental car restrictions.',
    safetyAlert: 'Glacial Rivers & Remote Wilderness: Never attempt to wade swift silt-laden glacial rivers; carry bear canisters.',
    triviaQ: 'How big is Wrangell-St. Elias National Park & Preserve compared to Yellowstone?',
    triviaOpts: ['Over 13.2 million acres—roughly the size of six Yellowstones combined (larger than Switzerland)', 'Half the size of Yellowstone', 'Exactly the same acreage'],
    triviaAns: 0, triviaHint: 'Scale Hint: Where the Wrangell, St. Elias, and Chugach mountain ranges collide in Alaska!',
    stewardRule: 'Respected historic Kennecott mill structures and kept safe distance from glacial rivers and bears'
  },
  {
    id: 'yellowstone', name: 'Yellowstone', shortName: 'Yellowstone', state: 'WY / MT / ID', region: 'Southwest & Mountain', biome: 'volcanic',
    tagline: 'World’s first National Park—supervolcano geysers, prismatic springs & wild bison herds.',
    elevation: '7,875 ft (Avg Plateau)', acreage: '2,219,791 acres', coords: '44.4605° N, 110.8281° W',
    landmark: 'Old Faithful Viewing Boardwalk', permitNotice: 'Standard park pass required; check seasonal road opening dates for North/Northeast entrances.',
    safetyAlert: '36 CFR § 2.1 Thermal Hazard: Stay strictly on wooden boardwalks—thin sinter crust breaks over boiling water.',
    triviaQ: 'What creates the brilliant bands of yellow, orange, and green around Yellowstone’s boiling hot springs?',
    triviaOpts: ['Dissolved copper and sulfur deposits staining the silica sinter', 'Trillions of heat-loving microorganisms (thermophiles) whose pigments shift with water temperature', 'Reflected sunlight bouncing off submerged obsidian crystals'],
    triviaAns: 1, triviaHint: 'Science Hint: The center is too hot for most life (pure deep blue), while cooler outer rings host photosynthetic bacteria!',
    stewardRule: 'Remained strictly on wooden boardwalks in thermal basins and kept 25+ yards from bison and 100+ yards from bears'
  },
  {
    id: 'yosemite', name: 'Yosemite', shortName: 'Yosemite', state: 'CA', region: 'West', biome: 'glacier',
    tagline: 'Towering glacial granite monoliths, thunderous waterfalls & ancient Giant Sequoias.',
    elevation: '3,966 ft (Valley Floor)', acreage: '759,620 acres', coords: '37.7156° N, 119.6770° W',
    landmark: 'Tunnel View Pedestrian Plaza', permitNotice: 'Peak-hours vehicle reservation may be required; check NPS entry calendar before arrival.',
    safetyAlert: 'Peregrine Falcon Nesting Closures active on select cliff faces; stay strictly on Valley boardwalks.',
    triviaQ: 'How did Half Dome get its iconic sheer vertical cliff face on one side and rounded dome on the other?',
    triviaOpts: ['A massive volcanic eruption blew away the western half 10,000 years ago', 'Glaciers sheared away the weaker jointed rock while exfoliation rounded the intact granite', 'Early gold miners quarried the granite face to build San Francisco'],
    triviaAns: 1, triviaHint: 'Geology Hint: Look closely at natural fractures (joints) in granite—glaciers plucked away fractured rock sheets!',
    stewardRule: 'Stayed on elevated meadow boardwalks and used bear-proof food lockers at all trailheads'
  },
  {
    id: 'zion', name: 'Zion', shortName: 'Zion', state: 'UT', region: 'Southwest & Mountain', biome: 'canyon',
    tagline: 'Soaring Navajo Sandstone monoliths, emerald Virgin River cottonwoods & hanging gardens.',
    elevation: '4,000 ft (Canyon Floor)', acreage: '147,242 acres', coords: '37.2002° N, 112.9871° W',
    landmark: 'Zion Visitor Center Courtyard', permitNotice: 'Zion Canyon Scenic Drive requires free shuttle bus most of year; Angels Landing chains require lottery permit.',
    safetyAlert: 'Flash Flood & Rockfall Zone: Check Zion Visitor Center flood rating before entering narrow canyons.',
    triviaQ: 'How do Zion’s famous "Hanging Gardens" survive on sheer vertical desert sandstone walls?',
    triviaOpts: ['Rainwater percolates down through porous Navajo Sandstone until hitting impermeable Kayenta shale, seeping out sideways', 'Morning fog condenses directly onto cactus spines', 'Park rangers irrigate the cliff alcoves via hidden pipes'],
    triviaAns: 0, triviaHint: 'Hydrology Hint: Where porous sandstone meets dense shale rock layers, natural springs weep out along the cliff face!',
    stewardRule: 'Stayed on paved paths without stepping on biological soil crust and checked Virgin River water advisories'
  }
];

// Robust coordinate parser supporting DMS/degrees format ("44.3386° N, 68.2733° W") and decimal ("44.3386, -68.2733")
function parseParkCoords(coordStr) {
  if (!coordStr || typeof coordStr !== 'string') return { lat: 0, lon: 0 };
  const dmsMatch = coordStr.match(/([0-9.]+)\s*°?\s*([NS])\s*,?\s*([0-9.]+)\s*°?\s*([EW])/i);
  if (dmsMatch) {
    const lat = parseFloat(dmsMatch[1]) * (dmsMatch[2].toUpperCase() === 'S' ? -1 : 1);
    const lon = parseFloat(dmsMatch[3]) * (dmsMatch[4].toUpperCase() === 'W' ? -1 : 1);
    return { lat, lon };
  }
  const decMatch = coordStr.match(/([-+]?[0-9.]+)\s*,\s*([-+]?[0-9.]+)/);
  if (decMatch) {
    return { lat: parseFloat(decMatch[1]), lon: parseFloat(decMatch[2]) };
  }
  return { lat: 0, lon: 0 };
}

// Biome-specific safety & naturalist questions for expanded free/premium quests
const BIOME_TRIVIA_BANK = {
  mountain: {
    freeQ: 'When hiking above treeline in alpine terrain, what is the safest rule if afternoon thunderheads build?',
    freeOpts: ['Descend below treeline immediately before lightning arrives', 'Wait on the highest summit for the storm to pass', 'Shelter under the tallest lone pine tree'],
    freeAns: 0,
    freeHint: 'Lightning strikes exposed ridges and tall isolated trees; descend early.',
    premQ: 'Which federal regulation governs staying on established trails and protecting fragile alpine tundra?',
    premOpts: ['36 CFR § 2.1 (Preservation of natural & cultural resources)', 'Maritime Salvage Act of 1912', 'FAA Part 107 Airspace Rule'],
    premAns: 0,
    premHint: '36 CFR § 2.1 protects park flora, geology, and fragile soils.'
  },
  glacier: {
    freeQ: 'What gives glacial meltwater lakes their signature vibrant turquoise color?',
    freeOpts: ['Suspended "rock flour" silt scattering blue-green sunlight', 'Artificial dye added for visibility', 'Tropical coral reefs'],
    freeAns: 0,
    freeHint: 'Glaciers grind bedrock into ultra-fine silt that stays suspended in the water.',
    premQ: 'Why is approaching the edge of a glacier or snowbridge hazardous even in summer?',
    premOpts: ['Hidden crevasses and sudden ice calving can collapse without warning', 'Glacial ice is warmer than river water', 'It attracts sea turtles'],
    premAns: 0,
    premHint: 'Undercut ice and concealed crevasses make glacier edges unpredictable.'
  },
  canyon: {
    freeQ: 'Why should hikers avoid narrow slot canyons if rain is forecast miles away?',
    freeOpts: ['Distant storms can trigger sudden, life-threatening flash floods', 'Sandstone turns into slippery ice', 'Canyons close automatically at 35°F'],
    freeAns: 0,
    freeHint: 'Hard desert rock sheds water rapidly into narrow drainage channels.',
    premQ: 'What is biological soil crust ("cryptobiotic crust") found across canyonlands?',
    premOpts: ['Living cyanobacteria/lichen community that prevents erosion—never step on it', 'A type of fossilized dinosaur bone', 'Dried salt crystals safe to crush'],
    premAns: 0,
    premHint: 'One footprint can destroy decades of slow-growing desert soil crust.'
  },
  desert: {
    freeQ: 'How much water should a desert hiker typically carry per person per day in warm weather?',
    freeOpts: ['At least 1 gallon (4 liters) plus electrolytes', 'Half a cup is plenty', 'Only drink if you feel dizzy'],
    freeAns: 0,
    freeHint: 'Dry desert air evaporates sweat so fast you may not notice dehydration.',
    premQ: 'Why do many desert animals become active mostly at dawn, dusk, or night (crepuscular/nocturnal)?',
    premOpts: ['To conserve water and avoid extreme midday surface heat', 'Because desert plants only grow in moonlight', 'To avoid ocean tides'],
    premAns: 0,
    premHint: 'Avoiding daytime heat dramatically reduces water loss.'
  },
  coastal: {
    freeQ: 'What should you always check before exploring sea caves, tidepools, or coastal headlands?',
    freeOpts: ['Live tide charts and sneaker-wave advisories', 'Only the altitude of nearby mountains', 'Whether snowchains are required'],
    freeAns: 0,
    freeHint: 'Incoming tides can trap visitors quickly along rocky shorelines.',
    premQ: 'What is the proper Leave No Trace etiquette when observing intertidal tidepool creatures?',
    premOpts: ['Look without prying, lifting, or moving organisms from their rocks', 'Collect shells and starfish as souvenirs', 'Pour fresh water into the pools'],
    premAns: 0,
    premHint: '36 CFR prohibits removing or disturbing marine/intertidal life.'
  },
  volcanic: {
    freeQ: 'Why must visitors stay strictly behind barriers near geothermal vents and active volcanic features?',
    freeOpts: ['Thin crust hides boiling water, scalding steam, and toxic volcanic gases', 'The rocks are magnetic and pull phones away', 'Rangers paint the ground wet'],
    freeAns: 0,
    freeHint: 'Hydrothermal crusts can break under a single footstep.',
    premQ: 'What hazardous airborne material is released during volcanic eruptions or near fresh lava flows?',
    premOpts: ['Volcanic gases (SO₂) and microscopic glass shards (Pele’s hair/tephra)', 'Harmless ocean mist', 'Pure helium'],
    premAns: 0,
    premHint: 'Sulfur dioxide and fine volcanic glass irritate lungs and eyes.'
  },
  cave: {
    freeQ: 'Why do National Park caves ask visitors to clean boots/gear before entering?',
    freeOpts: ['To prevent spreading White-Nose Syndrome fungus that harms bats', 'To keep cave floors shiny for photos', 'To reduce cave humidity'],
    freeAns: 0,
    freeHint: 'Decontamination protects vulnerable hibernating bat colonies.',
    premQ: 'Why must you never touch cave formations like stalactites and stalagmites?',
    premOpts: ['Skin oils coat the mineral surface and permanently halt calcite growth', 'They are made of compressed snow', 'Touching them triggers earthquakes'],
    premAns: 0,
    premHint: 'Natural cave formations grow over thousands of years and stain easily.'
  },
  forest: {
    freeQ: 'Why do park regulations prohibit transporting firewood from distant regions into park campgrounds?',
    freeOpts: ['Hidden beetle larvae and tree diseases can devastate native forests', 'Out-of-state wood does not burn', 'It makes campfires too bright'],
    freeAns: 0,
    freeHint: 'Always buy certified local firewood near the park.',
    premQ: 'How do low-intensity natural or prescribed fires benefit many forest National Parks?',
    premOpts: ['They clear dense underbrush, recycle nutrients, and open serotinous cones', 'They permanently sterilize all soil', 'They turn granite into limestone'],
    premAns: 0,
    premHint: 'Many ecosystems like sequoias and ponderosa pines evolved with periodic fire.'
  }
};

// Hydrate all 64 parks with 20 standardized, 36 CFR-compliant quests per park (12 Free + 8 Paid = 1,280 total quests)
const PARKS_DATA = RAW_64_PARKS.map(p => {
  const style = BIOME_STYLES[p.biome] || BIOME_STYLES.mountain;
  const biomeTrivia = BIOME_TRIVIA_BANK[p.biome] || BIOME_TRIVIA_BANK.mountain;
  const parsedCoords = parseParkCoords(p.coords);
  const acreageNum = parseInt((p.acreage || '').replace(/[^0-9]/g, ''), 10) || 50000;
  const geofenceRadius = acreageNum > 500000 ? 15.0 : (acreageNum > 100000 ? 10.0 : 6.0);
  const funnySvg = `<svg viewBox="0 0 200 130" class="w-full h-full bg-[#fef3c7]"><rect width="200" height="130" fill="#fde68a"/><circle cx="100" cy="60" r="34" fill="#f59e0b" opacity="0.35"/><circle cx="88" cy="52" r="5" fill="#1b4332"/><circle cx="112" cy="52" r="5" fill="#1b4332"/><path d="M84 72 Q100 88 116 72" fill="none" stroke="#1b4332" stroke-width="4" stroke-linecap="round"/><text x="100" y="114" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e">SILLY PARK SNAP!</text></svg>`;

  return {
    ...p,
    lat: parsedCoords.lat,
    lon: parsedCoords.lon,
    geofenceRadius,
    conditions: 'Visitor Center open • Check live NPS alerts',
    offlineSize: `${36 + (p.name.length * 2)} MB`,
    waypointsCount: 14 + (p.name.length % 15),
    gradient: style.gradient,
    heroSvg: style.heroSvg,
    patchBg: style.patchBg,
    patchSvg: style.patchSvg,
    quests: [
      // --- 12 FREE QUESTS ---
      {
        id: `${p.id}-gps`,
        type: 'discovery',
        isPremium: false,
        title: `${p.landmark} Check-In`,
        xp: 150,
        difficulty: 'Easy',
        description: `Verify your arrival from the maintained pedestrian plaza or boardwalk at ${p.landmark} in ${p.name} National Park.`,
        coords: p.coords,
        lat: parsedCoords.lat,
        lon: parsedCoords.lon,
        geofenceRadius,
        elevationGain: p.elevation,
        landmark: p.landmark
      },
      {
        id: `${p.id}-photo`,
        type: 'scavenger',
        isPremium: false,
        title: `${p.shortName} Field Landmark & Wildlife Log`,
        xp: 200,
        difficulty: 'Easy',
        description: `Capture a field snapshot of ${p.name}’s signature landscape or wildlife observed safely from a maintained trail or pullout.`,
        presets: [
          {
            id: `${p.id}-landscape`,
            label: `${p.shortName} Signature Vista`,
            caption: `Documented the iconic scenery of ${p.name} (${p.state}) from a designated overlook.`,
            svg: style.heroSvg.replace('opacity-35', 'opacity-100')
          },
          {
            id: `${p.id}-wildlife`,
            label: 'Telephoto Wildlife Observation',
            caption: `Observed native wildlife in ${p.name} using binoculars/zoom from 50+ yards away on a maintained path.`,
            svg: `<svg viewBox="0 0 200 130" class="w-full h-full bg-[#d8f3dc]"><rect width="200" height="130" fill="#b7e4c7"/><path d="M0 95 Q100 75 200 95 L200 130 L0 130 Z" fill="#40916c"/><circle cx="100" cy="65" r="28" fill="none" stroke="#1b4332" stroke-width="3" stroke-dasharray="6 4"/><circle cx="100" cy="65" r="8" fill="#d97706"/></svg>`
          }
        ]
      },
      {
        id: `${p.id}-funny`,
        type: 'funny_photo',
        isPremium: false,
        title: `${p.shortName} Funny Photo Challenge`,
        xp: 175,
        difficulty: 'Fun & Creative',
        description: `Snap a hilarious, lighthearted photo at ${p.name}—try a forced-perspective illusion holding ${p.landmark}, a dramatic ranger hat pose, or a funny squirrel/chipmunk photobomb (from a safe distance)!`,
        presets: [
          {
            id: `${p.id}-funny-perspective`,
            label: 'Forced-Perspective Giant',
            caption: `Posed holding ${p.landmark} in the palm of a hand from the safe overlook in ${p.name}!`,
            svg: funnySvg
          },
          {
            id: `${p.id}-funny-photobomb`,
            label: 'Critter Photobomb Moment',
            caption: `Caught a hilarious zoom-in of local wildlife photobombing our ${p.shortName} selfie from a safe trail pullout!`,
            svg: funnySvg
          }
        ]
      },
      {
        id: `${p.id}-experience`,
        type: 'reflection',
        isPremium: false,
        title: `Describe Your ${p.shortName} Experience`,
        xp: 180,
        difficulty: 'Field Story',
        description: `Write about your personal experience at ${p.name} National Park—what sights, sounds, trails, or unexpected moments made your visit unforgettable?`,
        promptPlaceholder: `Describe your favorite trail, weather, wildlife sighting, or memory in ${p.name}...`
      },
      {
        id: `${p.id}-trivia`,
        type: 'trivia',
        isPremium: false,
        title: `${p.shortName} Ranger Naturalist Riddle`,
        xp: 150,
        difficulty: 'Ranger Riddle',
        description: `Answer an interpretive field question about ${p.name}’s geology, ecology, or heritage.`,
        question: p.triviaQ,
        options: p.triviaOpts,
        correctIndex: p.triviaAns,
        hint: p.triviaHint
      },
      {
        id: `${p.id}-steward`,
        type: 'stewardship',
        isPremium: false,
        title: `${p.shortName} Leave No Trace Pledge`,
        xp: 175,
        difficulty: 'Stewardship',
        description: `Commit to park-specific conservation practices protecting ${p.name}’s ecosystems and cultural resources.`,
        checklist: [
          p.stewardRule,
          'Maintained 100+ yards from bears/wolves and 25+ yards from all other wildlife (36 CFR § 2.2)',
          'Packed out 100% of trash, food scraps, and micro-litter'
        ]
      },
      {
        id: `${p.id}-gps-gateway`,
        type: 'discovery',
        isPremium: false,
        title: `${p.shortName} Visitor Center & Gateway Check-In`,
        xp: 125,
        difficulty: 'Easy',
        description: `Check in near the ${p.name} Visitor Center or main park gateway to verify trail conditions and grab your park map.`,
        coords: p.coords,
        lat: parsedCoords.lat,
        lon: parsedCoords.lon,
        geofenceRadius: geofenceRadius + 3,
        elevationGain: p.elevation,
        landmark: `${p.shortName} Visitor Center`
      },
      {
        id: `${p.id}-photo-flora`,
        type: 'scavenger',
        isPremium: false,
        title: `${p.shortName} Native Flora & Geology Study`,
        xp: 160,
        difficulty: 'Moderate',
        description: `Photograph native plants, lichens, or rock strata in ${p.name} without picking, trampling, or leaving the maintained trail.`,
        presets: [
          {
            id: `${p.id}-flora`,
            label: 'Native Plant / Wildflower',
            caption: `Captured native ${p.biome} flora thriving along a ${p.name} trail.`,
            svg: style.heroSvg.replace('opacity-35', 'opacity-100')
          },
          {
            id: `${p.id}-geology`,
            label: 'Geological Formation',
            caption: `Documented exposed rock layers and natural textures in ${p.name}.`,
            svg: style.heroSvg.replace('opacity-35', 'opacity-100')
          }
        ]
      },
      {
        id: `${p.id}-trivia-safety`,
        type: 'trivia',
        isPremium: false,
        title: `${p.shortName} Biome Safety & Readiness Quiz`,
        xp: 140,
        difficulty: 'Ranger Riddle',
        description: `Test your knowledge of safe backcountry and frontcountry practices in ${p.biome} parks like ${p.name}.`,
        question: biomeTrivia.freeQ,
        options: biomeTrivia.freeOpts,
        correctIndex: biomeTrivia.freeAns,
        hint: biomeTrivia.freeHint
      },
      {
        id: `${p.id}-steward-water`,
        type: 'stewardship',
        isPremium: false,
        title: `${p.shortName} Watershed & Invasive Species Check`,
        xp: 150,
        difficulty: 'Stewardship',
        description: `Protect ${p.name}’s lakes, streams, and native habitats by keeping boots and gear free of invasive seeds.`,
        checklist: [
          'Brushed dirt and plant seeds off hiking boots and trekking poles before hitting the trail',
          'Stayed on durable gravel, rock, or boardwalk surfaces even around muddy puddles',
          'Kept soap, food waste, and sunscreen out of natural streams and lakes'
        ]
      },
      {
        id: `${p.id}-photo-sky`,
        type: 'scavenger',
        isPremium: false,
        title: `${p.shortName} Golden Hour & Horizon Snap`,
        xp: 175,
        difficulty: 'Easy',
        description: `Log a photo of morning mist, dramatic clouds, or golden afternoon light over ${p.name}.`,
        presets: [
          {
            id: `${p.id}-golden`,
            label: 'Golden Hour Horizon',
            caption: `Caught warm golden light sweeping across ${p.name} (${p.state}).`,
            svg: style.heroSvg.replace('opacity-35', 'opacity-100')
          }
        ]
      },
      {
        id: `${p.id}-experience-tips`,
        type: 'reflection',
        isPremium: false,
        title: `${p.shortName} Explorer Tip & Recommendation`,
        xp: 140,
        difficulty: 'Field Story',
        description: `Share your #1 tip for future visitors to ${p.name}—best time of day, parking strategy, or must-see pullout!`,
        promptPlaceholder: `What should first-time visitors to ${p.name} know before they go?`
      },

      // --- 8 PAID / PREMIUM QUESTS ---
      {
        id: `${p.id}-prem-gps-deep`,
        type: 'discovery',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Deep Horizon GPS Expedition`,
        xp: 300,
        difficulty: 'Pro Expedition',
        description: `Unlockable Pro Quest: Complete a deeper backcountry or scenic-corridor GPS check-in within ${p.name}’s core geofence.`,
        coords: p.coords,
        lat: parsedCoords.lat,
        lon: parsedCoords.lon,
        geofenceRadius,
        elevationGain: p.elevation,
        landmark: `${p.landmark} Outer Rim`
      },
      {
        id: `${p.id}-prem-funny-epic`,
        type: 'funny_photo',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Epic Silly Ranger Pose`,
        xp: 275,
        difficulty: 'Pro Comedy',
        description: `Unlockable Pro Quest: Stage the ultimate funny group jump, wind-blown hair portrait, or dramatic "tiny human vs. giant ${p.shortName}" shot!`,
        presets: [
          {
            id: `${p.id}-prem-jump`,
            label: 'Mid-Air Trail Jump',
            caption: `Captured a mid-air celebration jump at ${p.name} without stepping off the trail!`,
            svg: funnySvg
          }
        ]
      },
      {
        id: `${p.id}-prem-photo-pano`,
        type: 'scavenger',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Master Panorama Collector`,
        xp: 300,
        difficulty: 'Pro Field Photo',
        description: `Unlockable Pro Quest: Capture a sweeping wide-angle panorama showcasing ${p.name}’s ${p.elevation} relief.`,
        presets: [
          {
            id: `${p.id}-prem-pano`,
            label: `${p.shortName} 180° Panorama`,
            caption: `Stitched a wide panoramic view across ${p.name} National Park.`,
            svg: style.heroSvg.replace('opacity-35', 'opacity-100')
          }
        ]
      },
      {
        id: `${p.id}-prem-trivia-master`,
        type: 'trivia',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Master Naturalist Exam`,
        xp: 250,
        difficulty: 'Pro Challenge',
        description: `Unlockable Pro Quest: Pass an advanced conservation & CFR regulation exam for ${p.biome} ecosystems.`,
        question: biomeTrivia.premQ,
        options: biomeTrivia.premOpts,
        correctIndex: biomeTrivia.premAns,
        hint: biomeTrivia.premHint
      },
      {
        id: `${p.id}-prem-steward-ambassador`,
        type: 'stewardship',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Conservation Ambassador Oath`,
        xp: 275,
        difficulty: 'Pro Stewardship',
        description: `Unlockable Pro Quest: Go above and beyond by practicing silent-trail etiquette and zero-trace stewardship in ${p.name}.`,
        checklist: [
          'Kept voices low and silenced phone speakers to preserve natural soundscapes',
          'Yielded uphill to hikers and stepped aside safely for pack stock/rangers',
          'Reported any trail hazards or overflowing bins to the nearest visitor center'
        ]
      },
      {
        id: `${p.id}-prem-experience-essay`,
        type: 'reflection',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Full Expedition Journal Entry`,
        xp: 260,
        difficulty: 'Pro Field Story',
        description: `Unlockable Pro Quest: Chronicle your complete ${p.name} journey—weather, wildlife, challenges overcome, and what this park means to you.`,
        promptPlaceholder: `Write a detailed expedition story about your time in ${p.name} National Park...`
      },
      {
        id: `${p.id}-prem-gps-highpoint`,
        type: 'discovery',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} High-Point Elevation Check-In`,
        xp: 325,
        difficulty: 'Pro Summit',
        description: `Unlockable Pro Quest: Verify your GPS position at a premier high-elevation overlook in ${p.name} (${p.elevation}).`,
        coords: p.coords,
        lat: parsedCoords.lat,
        lon: parsedCoords.lon,
        geofenceRadius,
        elevationGain: p.elevation,
        landmark: `${p.shortName} High Overlook`
      },
      {
        id: `${p.id}-prem-photo-darksky`,
        type: 'scavenger',
        isPremium: true,
        price: '$1.99',
        title: `${p.shortName} Twilight & Dark-Sky Study`,
        xp: 300,
        difficulty: 'Pro Night Sky',
        description: `Unlockable Pro Quest: Document dusk, alpenglow, or starry night skies above ${p.name} using red-light-safe stargazing etiquette.`,
        presets: [
          {
            id: `${p.id}-prem-stars`,
            label: 'Alpenglow / Starry Sky',
            caption: `Observed twilight colors and dark skies over ${p.name} using a red headlamp.`,
            svg: style.heroSvg.replace('opacity-35', 'opacity-100')
          }
        ]
      }
    ]
  };
});

// Embroidered Patches (4 Global Honors + 64 Park Completion Patches = 68 Total)
const GLOBAL_BADGES = [
  {
    id: 'badge-first-step',
    category: 'global',
    title: 'Trailhead Pathfinder',
    subtitle: 'First Quest Completed',
    criteria: 'Complete any 1 quest in any of the 64 National Parks.',
    bg: 'bg-gradient-to-br from-[#2D6A4F] to-[#1B4332]',
    check: (state) => state.completedQuests.length >= 1,
    svg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><circle cx="40" cy="40" r="32" fill="#52B788" opacity="0.25"/><polygon points="40,14 48,36 70,40 48,44 40,66 32,44 10,40 32,36" fill="#FBBF24"/><circle cx="40" cy="40" r="6" fill="#1B4332"/></svg>`
  },
  {
    id: 'badge-five-parks',
    category: 'global',
    title: 'America the Beautiful Explorer',
    subtitle: '5 National Parks Visited',
    criteria: 'Complete at least 1 quest in 5 different National Parks.',
    bg: 'bg-gradient-to-br from-[#1E3A5F] to-[#0F172A]',
    check: (state) => PARKS_DATA.filter(p => p.quests.some(q => state.completedQuests.includes(q.id))).length >= 5,
    svg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><circle cx="40" cy="40" r="24" fill="none" stroke="#38BDF8" stroke-width="3"/><polygon points="40,18 45,33 61,33 48,42 53,58 40,48 27,58 32,42 19,33 35,33" fill="#FBBF24"/></svg>`
  },
  {
    id: 'badge-steward',
    category: 'global',
    title: 'Leave No Trace Guardian',
    subtitle: 'Park Conservationist',
    criteria: 'Complete at least 3 Stewardship quests across any parks.',
    bg: 'bg-gradient-to-br from-[#3F6212] to-[#1A2E05]',
    check: (state) => state.completedQuests.filter(id => id.endsWith('-steward')).length >= 3,
    svg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><path d="M40 16 C22 24 22 48 40 64 C58 48 58 24 40 16 Z" fill="#84CC16"/><path d="M40 22 L40 58 M40 36 L30 28 M40 44 L50 36" stroke="#1A2E05" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: 'badge-scholar',
    category: 'global',
    title: 'Field Naturalist Scholar',
    subtitle: 'Interpretive Master',
    criteria: 'Solve at least 4 Ranger Trivia riddles correctly.',
    bg: 'bg-gradient-to-br from-[#D97706] to-[#92400E]',
    check: (state) => state.completedQuests.filter(id => id.endsWith('-trivia')).length >= 4,
    svg: `<svg viewBox="0 0 80 80" class="w-14 h-14"><polygon points="40,14 47,29 64,31 52,43 55,60 40,52 25,60 28,43 16,31 33,29" fill="#FEF08A" stroke="#78350F" stroke-width="2"/></svg>`
  }
];

const PARK_BADGES = PARKS_DATA.map(p => ({
  id: `badge-park-${p.id}`,
  category: 'park',
  parkId: p.id,
  title: `${p.shortName} Ranger Patch`,
  subtitle: `${p.name} (${p.state})`,
  criteria: `Complete all 12 free quests in ${p.name} National Park.`,
  bg: p.patchBg,
  check: (state) => p.quests.filter(q => !q.isPremium).every(q => state.completedQuests.includes(q.id)),
  svg: p.patchSvg
}));

const BADGES_DATA = [...GLOBAL_BADGES, ...PARK_BADGES];

const RANGER_RANKS = [
  { level: 1, title: 'Trailhead Rookie', minXp: 0 },
  { level: 2, title: 'Day-Hike Pathfinder', minXp: 500 },
  { level: 3, title: 'Backcountry Explorer', minXp: 1500 },
  { level: 4, title: 'Summit Scout', minXp: 3500 },
  { level: 5, title: '64-Park Grand Naturalist', minXp: 7500 }
];
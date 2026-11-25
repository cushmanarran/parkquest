// =========================================================
// PARKQUEST CORE APPLICATION LOGIC
// =========================================================

const STORAGE_KEY = 'parkquest_64parks_state_v1';

const DEFAULT_FRIENDS = [];

let appState = {
  termsAccepted: false,
  localGpsOnly: true,
  userGps: null,
  directorySort: 'default',
  userEmail: '',
  userName: '',
  friends: [...DEFAULT_FRIENDS],
  leaderboardTab: 'global',
  unlockedPremiumQuests: [],
  unlockedPremiumParks: [],
  allAccessPro: false,
  activeParkId: 'chiricahua',
  mapSelectedParkId: 'chiricahua',
  mapStatusFilter: 'all',
  mapSearch: '',
  mapFocus: 'all',
  activeFilter: 'all',
  activeView: 'directory',
  directoryRegion: 'All 64 Parks',
  directoryState: 'ALL',
  directoryStatus: 'all',
  directorySearch: '',
  passportFilter: 'all',
  passportSearch: '',
  xp: 0,
  completedQuests: [],
  unlockedBadges: [],
  offlinePacks: [],
  journalEntries: []
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      appState = { ...appState, ...JSON.parse(saved) };
    }
    if ((appState.userEmail || '').toLowerCase() === 'explorer@parkquest.app') {
      appState.userEmail = '';
      if (appState.userName === 'Trailhead Explorer') appState.userName = '';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }
    if (!Array.isArray(appState.friends)) appState.friends = [...DEFAULT_FRIENDS];
    if (!Array.isArray(appState.unlockedPremiumQuests)) appState.unlockedPremiumQuests = [];
    if (!Array.isArray(appState.unlockedPremiumParks)) appState.unlockedPremiumParks = [];
  } catch (e) {
    console.warn('Could not load saved state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

function isUserSignedIn() {
  if (window.ParkQuestCloud && window.ParkQuestCloud.isConfigured()) {
    return Boolean(window.ParkQuestCloud.getCurrentUser());
  }
  return Boolean((appState.userEmail || '').trim());
}

function requireSignInForQuestAction(message) {
  if (isUserSignedIn()) return true;
  showToast(message || 'Please sign in first (free — no payment required) to change quest progress.', 'info');
  openAccountModal();
  return false;
}

function isQuestUnlocked(quest, parkId) {
  if (!quest || !quest.isPremium) return true;
  return Boolean(
    appState.allAccessPro ||
    appState.unlockedPremiumParks.includes(parkId) ||
    appState.unlockedPremiumQuests.includes(quest.id)
  );
}

// ---------------------------------------------------------
// GEODESY, GNSS & GEOFENCING ENGINE (Haversine Calculations)
// ---------------------------------------------------------
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' ||
      typeof lat2 !== 'number' || typeof lon2 !== 'number' ||
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    return { miles: 0, km: 0 };
  }
  const R_MILES = 3958.8; // Mean radius of Earth in miles
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const miles = R_MILES * c;
  const km = miles * 1.609344;
  return { miles, km };
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' ||
      typeof lat2 !== 'number' || typeof lon2 !== 'number' ||
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    return { degrees: 0, direction: 'N' };
  }
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;
  const phi1 = lat1 * toRad;
  const phi2 = lat2 * toRad;
  const dLon = (lon2 - lon1) * toRad;

  const y = Math.sin(dLon) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * toDeg;
  brng = (brng + 360) % 360;

  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const dirIndex = Math.round(brng / 22.5) % 16;
  return { degrees: Math.round(brng), direction: directions[dirIndex] };
}

function formatDistance(miles, km) {
  if (typeof miles !== 'number' || isNaN(miles)) return '--';
  if (miles < 0.1) {
    const feet = Math.round(miles * 5280);
    const meters = Math.round((km || miles * 1.609344) * 1000);
    return `${feet} ft (${meters} m)`;
  }
  if (miles < 10) {
    return `${miles.toFixed(1)} mi (${(km || miles * 1.609344).toFixed(1)} km)`;
  }
  return `${Math.round(miles).toLocaleString()} mi (${Math.round(km || miles * 1.609344).toLocaleString()} km)`;
}

function formatCoordinates(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return '--';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

function requestUserGps(onSuccess, onError) {
  if (!navigator.geolocation) {
    if (onError) onError(new Error('Geolocation not supported by browser'));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      appState.userGps = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy || 15),
        altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
        heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
        isSimulated: false,
        timestamp: new Date().toLocaleTimeString(),
        label: 'Live Device GNSS'
      };
      saveState();
      if (onSuccess) onSuccess(appState.userGps);
    },
    (err) => {
      if (onError) onError(err);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function toggleSortByNearestGps() {
  if (appState.directorySort === 'nearest') {
    appState.directorySort = 'default';
    showToast('Directory sort restored to default order.', 'info');
    renderDirectoryView();
    updateSortNearestButton();
    if (window.lucide) lucide.createIcons();
    return;
  }

  if (!appState.userGps) {
    showToast('Acquiring your GNSS position to sort all 64 National Parks by distance...', 'info');
    requestUserGps(
      (pos) => {
        appState.directorySort = 'nearest';
        saveState();
        renderDirectoryView();
        updateSortNearestButton();
        if (window.lucide) lucide.createIcons();
        showToast('Sorted all 64 National Parks by distance to your current GPS position!', 'success');
      },
      (err) => {
        showToast('Device GPS locked or unavailable. Opening GPS Radar to pick or simulate location.', 'info');
        openGpsCheckerModal();
      }
    );
  } else {
    appState.directorySort = 'nearest';
    saveState();
    renderDirectoryView();
    updateSortNearestButton();
    if (window.lucide) lucide.createIcons();
    showToast('Sorted all 64 National Parks by distance to your GPS position!', 'success');
  }
}

function updateSortNearestButton() {
  const btn = document.getElementById('sort-nearest-gps-btn');
  const label = document.getElementById('sort-nearest-label');
  if (!btn || !label) return;
  if (appState.directorySort === 'nearest') {
    btn.className = 'flex-1 py-2 px-3 rounded-xl bg-amberRust hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs';
    label.textContent = 'Sorted by Nearest ✓';
  } else {
    btn.className = 'flex-1 py-2 px-3 rounded-xl bg-pine/90 hover:bg-pine border border-sage/30 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs';
    label.textContent = 'Sort by Nearest (GPS)';
  }
}

// ---------------------------------------------------------
// STANDALONE GPS LOCATION CHECKER & RADAR MODAL
// ---------------------------------------------------------
function openGpsCheckerModal() {
  const modal = document.getElementById('gps-checker-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  renderGpsCheckerModal();
  if (window.lucide) lucide.createIcons();
}

function closeGpsCheckerModal() {
  const modal = document.getElementById('gps-checker-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function renderGpsCheckerModal() {
  const container = document.getElementById('gps-checker-modal-content');
  const privPill = document.getElementById('modal-privacy-status-pill');
  if (privPill) {
    privPill.textContent = appState.localGpsOnly ? 'Local-Only Mode' : 'Standard GPS Mode';
  }
  if (!container) return;

  // Calculate distances to all 64 parks from current user location (if set)
  let parksWithDistances = [];
  if (appState.userGps) {
    parksWithDistances = PARKS_DATA.map(p => {
      const dist = calculateDistance(appState.userGps.lat, appState.userGps.lon, p.lat, p.lon);
      const bearing = calculateBearing(appState.userGps.lat, appState.userGps.lon, p.lat, p.lon);
      const inGeofence = dist.miles <= (p.geofenceRadius || 8.0);
      return { park: p, dist, bearing, inGeofence };
    }).sort((a, b) => a.dist.miles - b.dist.miles);
  }

  const nearest = parksWithDistances.length > 0 ? parksWithDistances[0] : null;

  container.innerHTML = `
    <!-- GNSS Receiver Status Card -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-parchmentDark shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl ${appState.userGps ? (appState.userGps.isSimulated ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-forest') : 'bg-amber-100 text-amber-700'} flex items-center justify-center">
            <i data-lucide="${appState.userGps ? 'satellite' : 'alert-circle'}" class="w-4 h-4"></i>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slateInk/60">Position Provider</span>
            <h4 class="font-bold text-forest text-sm">${appState.userGps ? appState.userGps.label : 'GNSS Signal Not Acquired'}</h4>
          </div>
        </div>
        <button onclick="acquireModalGps()" class="px-3 py-1.5 rounded-xl bg-forest hover:bg-pine text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
          <i data-lucide="crosshair" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>${appState.userGps ? 'Rescan Device GPS' : 'Acquire Device GPS'}</span>
        </button>
      </div>

      ${appState.userGps ? `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div class="bg-parchment p-2.5 rounded-xl">
            <span class="text-[10px] uppercase font-bold text-slateInk/50 block">Latitude</span>
            <span class="font-mono font-bold text-forest">${appState.userGps.lat.toFixed(5)}°</span>
          </div>
          <div class="bg-parchment p-2.5 rounded-xl">
            <span class="text-[10px] uppercase font-bold text-slateInk/50 block">Longitude</span>
            <span class="font-mono font-bold text-forest">${appState.userGps.lon.toFixed(5)}°</span>
          </div>
          <div class="bg-parchment p-2.5 rounded-xl">
            <span class="text-[10px] uppercase font-bold text-slateInk/50 block">GNSS Accuracy</span>
            <span class="font-semibold text-pine">±${appState.userGps.accuracy} meters</span>
          </div>
          <div class="bg-parchment p-2.5 rounded-xl">
            <span class="text-[10px] uppercase font-bold text-slateInk/50 block">Last Lock</span>
            <span class="font-semibold text-slateInk/70">${appState.userGps.timestamp || 'Just now'}</span>
          </div>
        </div>
      ` : `
        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <i data-lucide="info" class="w-4 h-4 text-amberRust shrink-0 mt-0.5"></i>
          <span>Click <strong>"Acquire Device GPS"</strong> to read your browser coordinates, or choose a simulation preset below to test distances and geofences for any National Park.</span>
        </div>
      `}
    </div>

    <!-- Closest National Park Highlight Card -->
    ${nearest ? `
      <div class="bg-gradient-to-br from-forest to-pine text-white rounded-3xl p-5 shadow-md relative overflow-hidden space-y-3">
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amberRust text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs mb-1">
              <i data-lucide="sparkles" class="w-3 h-3 text-amber-200"></i> Closest National Park to You
            </div>
            <h3 class="font-serif text-2xl font-bold text-white">${nearest.park.name} National Park</h3>
            <p class="text-xs text-emerald-100">${nearest.park.state} • ${nearest.park.region} • ${nearest.park.landmark}</p>
          </div>

          <div class="text-right sm:text-right bg-black/25 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/15">
            <div class="font-serif text-2xl font-bold text-amber-300">${formatDistance(nearest.dist.miles, nearest.dist.km)}</div>
            <div class="text-[10px] text-white/80 font-bold uppercase tracking-wider">Bearing: ${nearest.bearing.degrees}° ${nearest.bearing.direction}</div>
          </div>
        </div>

        <div class="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15 text-xs">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              nearest.inGeofence ? 'bg-emerald-400 text-forest' : 'bg-white/20 text-white'
            }">
              <i data-lucide="${nearest.inGeofence ? 'check-circle-2' : 'map-pin'}" class="w-3.5 h-3.5"></i>
              ${nearest.inGeofence ? `Inside Park Geofence (Within ${nearest.park.geofenceRadius} mi)` : `Outside Geofence (Allowed: within ${nearest.park.geofenceRadius} mi)`}
            </span>
          </div>

          <div class="flex items-center gap-2">
            ${nearest.inGeofence ? `
              <button onclick="enterParkQuests('${nearest.park.id}'); closeGpsCheckerModal(); openQuestModal('${nearest.park.id}-gps');"
                class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-forest font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all">
                <i data-lucide="check-circle-2" class="w-4 h-4"></i> Check In to ${nearest.park.shortName}
              </button>
            ` : ''}
            <button onclick="enterParkQuests('${nearest.park.id}'); closeGpsCheckerModal();"
              class="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all">
              <span>View Park Quests</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Top 5 Closest National Parks List -->
    ${parksWithDistances.length > 1 ? `
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-parchmentDark shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-serif text-sm font-bold text-forest flex items-center gap-1.5">
            <i data-lucide="compass" class="w-4 h-4 text-pine"></i> Top 5 Nearest National Parks
          </h4>
          <span class="text-[11px] text-slateInk/60">Live Haversine Great-Circle Distances</span>
        </div>

        <div class="space-y-2">
          ${parksWithDistances.slice(0, 5).map((item, idx) => `
            <div class="flex items-center justify-between p-2.5 rounded-xl ${idx === 0 ? 'bg-emerald-50/70 border border-sage/40' : 'bg-parchment/60 hover:bg-parchment border border-parchmentDark'} transition-colors text-xs">
              <div class="flex items-center gap-2.5">
                <span class="w-5 h-5 rounded-full ${idx === 0 ? 'bg-pine text-white' : 'bg-forest/10 text-forest'} font-bold text-[10px] flex items-center justify-center shrink-0">
                  ${idx + 1}
                </span>
                <div>
                  <span class="font-bold text-forest">${item.park.name}</span>
                  <span class="text-slateInk/50 text-[11px]">(${item.park.state}) • ${item.park.region}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-slateInk text-xs text-right">
                  ${formatDistance(item.dist.miles, item.dist.km)}
                  <span class="text-[10px] text-slateInk/50 font-normal block">${item.bearing.degrees}° ${item.bearing.direction}</span>
                </span>
                <button onclick="enterParkQuests('${item.park.id}'); closeGpsCheckerModal();"
                  class="px-2.5 py-1.5 rounded-lg bg-forest hover:bg-pine text-white text-[11px] font-bold transition-all">
                  Quests
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- GPS Testing & Teleportation Station -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-parchmentDark shadow-sm space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider">
          <i data-lucide="sliders" class="w-4 h-4 text-amberRust"></i> GPS Field Simulator &amp; Park Teleporter
        </div>
        <span class="text-[11px] text-slateInk/50">Test geofence calculations anywhere</span>
      </div>

      <p class="text-xs text-slateInk/70">
        Simulate standing at any of the 64 National Parks to verify distance rankings, geofence checks, and trailhead arrival verification:
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button onclick="simulateGpsAtPark('chiricahua')" class="p-2.5 rounded-xl border border-parchmentDark hover:border-pine bg-parchment hover:bg-white text-left transition-all">
          <div class="font-bold text-forest text-xs">Chiricahua (AZ)</div>
          <div class="text-[10px] text-slateInk/60">Massai Point Overlook</div>
        </button>
        <button onclick="simulateGpsAtPark('yellowstone')" class="p-2.5 rounded-xl border border-parchmentDark hover:border-pine bg-parchment hover:bg-white text-left transition-all">
          <div class="font-bold text-forest text-xs">Yellowstone (WY)</div>
          <div class="text-[10px] text-slateInk/60">Old Faithful Boardwalk</div>
        </button>
        <button onclick="simulateGpsAtPark('acadia')" class="p-2.5 rounded-xl border border-parchmentDark hover:border-pine bg-parchment hover:bg-white text-left transition-all">
          <div class="font-bold text-forest text-xs">Acadia (ME)</div>
          <div class="text-[10px] text-slateInk/60">Jordan Pond House</div>
        </button>
        <button onclick="simulateGpsAtPark('greatsmokymountains')" class="p-2.5 rounded-xl border border-parchmentDark hover:border-pine bg-parchment hover:bg-white text-left transition-all">
          <div class="font-bold text-forest text-xs">Smokies (TN/NC)</div>
          <div class="text-[10px] text-slateInk/60">Kuwohi Observation Tower</div>
        </button>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <label for="modal-sim-park-select" class="text-xs font-bold text-slateInk/70 shrink-0">Simulate At Any Park:</label>
        <select id="modal-sim-park-select" onchange="simulateGpsAtPark(this.value)"
          class="flex-1 rounded-xl border border-parchmentDark bg-parchment px-3 py-2 text-xs font-bold text-forest focus:outline-none focus:ring-2 focus:ring-amberRust">
          <option value="">-- Choose from all 64 National Parks --</option>
          ${PARKS_DATA.map(p => `<option value="${p.id}">${p.name} (${p.state}) — ${p.landmark}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- Privacy & On-Device Security Note -->
    <div class="bg-forest/5 rounded-2xl p-4 border border-forest/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="space-y-0.5">
        <div class="font-bold text-forest flex items-center gap-1.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-pine"></i> On-Device GPS Privacy Protection
        </div>
        <p class="text-[11px] text-slateInk/70">
          Geofencing calculations run strictly in your local browser runtime. Coordinates are never sent to external tracking servers.
        </p>
      </div>
      <button onclick="toggleLocalGpsPrivacy(); renderGpsCheckerModal();"
        class="shrink-0 px-3 py-1.5 rounded-xl bg-forest text-white font-bold text-xs transition-colors hover:bg-pine">
        ${appState.localGpsOnly ? 'Local-Only Mode: ON' : 'Switch to Local-Only'}
      </button>
    </div>
  `;
}

function acquireModalGps() {
  requestUserGps(
    (pos) => {
      showToast('Live device coordinates locked!', 'success');
      renderGpsCheckerModal();
      if (appState.directorySort === 'nearest') renderDirectoryView();
      if (window.lucide) lucide.createIcons();
    },
    (err) => {
      showToast(`GPS scan error: ${err.message || 'Permission denied'}. You can use the simulation presets below.`, 'error');
      renderGpsCheckerModal();
      if (window.lucide) lucide.createIcons();
    }
  );
}

function simulateGpsAtPark(parkId) {
  if (!parkId) return;
  const park = PARKS_DATA.find(p => p.id === parkId);
  if (!park) return;
  appState.userGps = {
    lat: park.lat,
    lon: park.lon,
    accuracy: 4,
    altitude: 1250,
    heading: 0,
    isSimulated: true,
    timestamp: new Date().toLocaleTimeString(),
    label: `Simulated at ${park.name} (${park.state})`
  };
  saveState();
  renderGpsCheckerModal();
  if (appState.directorySort === 'nearest') renderDirectoryView();
  showToast(`Simulated GPS location set to ${park.name} (${park.landmark})!`, 'info');
  if (window.lucide) lucide.createIcons();
}


// ---------------------------------------------------------
// LEGAL GATEKEEPER & PRIVACY CONTROLS
// ---------------------------------------------------------
function openLegalModal(mandatory = false) {
  const modal = document.getElementById('legal-gate-modal');
  const closeX = document.getElementById('legal-close-x');
  if (!modal) return;
  if (mandatory && !appState.termsAccepted) {
    if (closeX) closeX.classList.add('hidden');
  } else {
    if (closeX) closeX.classList.remove('hidden');
    const c1 = document.getElementById('consent-check-1');
    const c2 = document.getElementById('consent-check-2');
    if (c1) c1.checked = appState.termsAccepted;
    if (c2) c2.checked = appState.termsAccepted;
    updateLegalConsentBtn();
  }
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function closeLegalModal() {
  if (!appState.termsAccepted) return;
  const modal = document.getElementById('legal-gate-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function updateLegalConsentBtn() {
  const c1 = document.getElementById('consent-check-1')?.checked;
  const c2 = document.getElementById('consent-check-2')?.checked;
  const btn = document.getElementById('legal-accept-btn');
  if (!btn) return;
  if (c1 && c2) {
    btn.disabled = false;
    btn.classList.remove('opacity-45', 'cursor-not-allowed');
  } else {
    btn.disabled = true;
    btn.classList.add('opacity-45', 'cursor-not-allowed');
  }
}

function acceptLegalTerms() {
  appState.termsAccepted = true;
  saveState();
  closeLegalModal();
  if (!isUserSignedIn()) {
    openAccountModal();
    showToast('Terms accepted! Sign in for free (no payment required) to start quests.', 'info');
  } else {
    showToast('Terms accepted. Explore all 64 U.S. National Parks!', 'success');
  }
}

function toggleLocalGpsPrivacy() {
  appState.localGpsOnly = !appState.localGpsOnly;
  saveState();
  renderHeaderStats();
  showToast(
    appState.localGpsOnly
      ? 'Local-Only GPS Mode ENABLED: Geofence checks stay strictly on-device.'
      : 'Standard GPS Mode: Ephemeral session check-ins enabled.',
    'info'
  );
}

// ---------------------------------------------------------
// CORE RENDERING FUNCTIONS
// ---------------------------------------------------------
function populateStateAndQuickDropdowns() {
  const stateSet = new Set();
  PARKS_DATA.forEach(p => {
    p.state.split('/').map(s => s.trim()).forEach(code => stateSet.add(code));
  });
  const sortedStates = Array.from(stateSet).sort();
  const stateSelect = document.getElementById('directory-state-select');
  if (stateSelect && stateSelect.options.length <= 1) {
    sortedStates.forEach(code => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = `State / Terr: ${code}`;
      stateSelect.appendChild(opt);
    });
  }

  const quickSelect = document.getElementById('park-quick-select');
  if (quickSelect) {
    quickSelect.innerHTML = PARKS_DATA.map(p =>
      `<option value="${p.id}" ${p.id === appState.activeParkId ? 'selected' : ''}>${p.name} (${p.state})</option>`
    ).join('');
  }
}

function renderAll() {
  populateStateAndQuickDropdowns();
  renderHeaderStats();
  renderDirectoryView();
  renderParkMap();
  renderParkHero();
  renderCategoryFilters();
  renderQuestCards();
  renderBadgesGrid();
  renderJournalEntries();
  renderLeaderboardView();
  if (window.lucide) lucide.createIcons();
}

function getRankInfo(xp) {
  let current = RANGER_RANKS[0];
  let next = RANGER_RANKS[1];
  for (let i = 0; i < RANGER_RANKS.length; i++) {
    if (xp >= RANGER_RANKS[i].minXp) {
      current = RANGER_RANKS[i];
      next = RANGER_RANKS[i + 1] || null;
    }
  }
  return { current, next };
}

function renderHeaderStats() {
  const setSafeText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const { current, next } = getRankInfo(appState.xp);
  setSafeText('player-level-badge', current.level);
  setSafeText('player-rank-title', `Level ${current.level}: ${current.title}`);
  setSafeText('mobile-xp-label', `${appState.xp} XP`);

  const xpBar = document.getElementById('player-xp-bar');
  if (next) {
    const range = next.minXp - current.minXp;
    const progress = Math.min(100, Math.round(((appState.xp - current.minXp) / range) * 100));
    setSafeText('player-xp-text', `${appState.xp} / ${next.minXp} XP`);
    if (xpBar) xpBar.style.width = `${progress}%`;
  } else {
    setSafeText('player-xp-text', `${appState.xp} XP (MAX RANK)`);
    if (xpBar) xpBar.style.width = '100%';
  }

  const exploredParks = PARKS_DATA.filter(p =>
    p.quests.some(q => appState.completedQuests.includes(q.id))
  ).length;

  const fullyCompletedParks = PARKS_DATA.filter(p =>
    p.quests.every(q => appState.completedQuests.includes(q.id))
  ).length;

  const activePark = PARKS_DATA.find(p => p.id === appState.activeParkId) || PARKS_DATA[0];
  setSafeText('nav-active-park-pill', activePark.shortName);
  setSafeText('gps-privacy-label', `Local GPS: ${appState.localGpsOnly ? 'ON' : 'STD'}`);

  setSafeText('stat-quests', appState.completedQuests.length);
  setSafeText('stat-parks', `${exploredParks}/64`);
  setSafeText('nav-map-progress-pill', `${exploredParks}/64`);
  setSafeText('header-account-email', appState.userEmail || 'Sign In');
  const cloudUserForCount = window.ParkQuestCloud?.getCurrentUser();
  const cloudProfileForCount = window.ParkQuestCloud?.getProfile();
  const friendsCountVal = cloudUserForCount && cloudProfileForCount
    ? (cloudProfileForCount.friends || []).length
    : (appState.friends || []).length;
  setSafeText('nav-friends-count', friendsCountVal);
  setSafeText('stat-badges', `${appState.unlockedBadges.length}/${BADGES_DATA.length}`);
  setSafeText('nav-badge-count', appState.unlockedBadges.length);
  setSafeText('nav-journal-count', appState.journalEntries.length);
  setSafeText('passport-parks-completed', `${fullyCompletedParks} / 64`);
  setSafeText('passport-total-count', `${appState.unlockedBadges.length} / ${BADGES_DATA.length}`);
  setSafeText('journal-total-xp', `${appState.xp} XP`);
}

// ---------------------------------------------------------
// SELECT A PARK DIRECTORY VIEW RENDERING
// ---------------------------------------------------------
function renderDirectoryView() {
  const regions = ['All 64 Parks', 'West', 'Southwest & Mountain', 'Midwest', 'Southeast & Caribbean', 'Alaska & Pacific'];
  const regionSelect = document.getElementById('directory-region-select');
  if (regionSelect) {
    regionSelect.innerHTML = regions.map(reg => {
      const count = reg === 'All 64 Parks'
        ? PARKS_DATA.length
        : PARKS_DATA.filter(p => p.region === reg).length;
      return `<option value="${reg}" ${appState.directoryRegion === reg ? 'selected' : ''}>${reg} (${count})</option>`;
    }).join('');
  }

  // Pre-calculate distances for all parks if user GPS is available
  PARKS_DATA.forEach(park => {
    if (appState.userGps && typeof park.lat === 'number' && typeof park.lon === 'number') {
      park.distanceToUser = calculateDistance(appState.userGps.lat, appState.userGps.lon, park.lat, park.lon);
    } else {
      park.distanceToUser = null;
    }
  });

  const query = appState.directorySearch.trim().toLowerCase();
  let filteredParks = PARKS_DATA.filter(park => {
    const matchesRegion = appState.directoryRegion === 'All 64 Parks' || park.region === appState.directoryRegion;
    const stateCodes = park.state.split('/').map(s => s.trim());
    const matchesState = appState.directoryState === 'ALL' || stateCodes.includes(appState.directoryState);

    const completedCount = park.quests.filter(q => appState.completedQuests.includes(q.id)).length;
    const isOffline = appState.offlinePacks.includes(park.id);
    const matchesStatus = appState.directoryStatus === 'all'
      || (appState.directoryStatus === 'offline' && isOffline)
      || (appState.directoryStatus === 'inprogress' && completedCount > 0);

    const matchesQuery = !query ||
      park.name.toLowerCase().includes(query) ||
      park.state.toLowerCase().includes(query) ||
      park.region.toLowerCase().includes(query) ||
      park.biome.toLowerCase().includes(query) ||
      park.tagline.toLowerCase().includes(query);
    return matchesRegion && matchesState && matchesStatus && matchesQuery;
  });

  // Sort by nearest GPS if requested
  if (appState.directorySort === 'nearest' && appState.userGps) {
    filteredParks.sort((a, b) => (a.distanceToUser?.miles ?? 999999) - (b.distanceToUser?.miles ?? 999999));
  }
  updateSortNearestButton();

  const countEl = document.getElementById('directory-result-count');
  if (countEl) {
    if (appState.directorySort === 'nearest' && appState.userGps) {
      countEl.innerHTML = `Showing ${filteredParks.length} of 64 Parks • <span class="text-amberRust font-bold">📍 Sorted by Distance to You</span>`;
    } else {
      countEl.textContent = `Showing ${filteredParks.length} of 64 National Parks`;
    }
  }

  const grid = document.getElementById('directory-parks-grid');
  if (!grid) return;

  if (filteredParks.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-3xl p-10 border border-dashed border-parchmentDark text-center space-y-3">
        <i data-lucide="search-x" class="w-10 h-10 text-pine/60 mx-auto"></i>
        <h3 class="font-serif text-lg font-bold text-forest">No Matching Parks Found</h3>
        <p class="text-xs text-slateInk/70">Try clearing your search or resetting the region, state, and status filters.</p>
        <button onclick="resetDirectoryFilters()" class="px-4 py-2 rounded-xl bg-forest text-white text-xs font-bold">
          Show All 64 Parks
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredParks.map(park => {
    const completedCount = park.quests.filter(q => appState.completedQuests.includes(q.id)).length;
    const totalCount = park.quests.length;
    const pct = Math.round((completedCount / totalCount) * 100);
    const isOfflineReady = appState.offlinePacks.includes(park.id);
    const totalParkXp = park.quests.reduce((sum, q) => sum + q.xp, 0);

    return `
      <div class="bg-white rounded-3xl overflow-hidden border-2 border-parchmentDark hover:border-pine/60 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
        <div>
          <div class="relative h-36 bg-gradient-to-br ${park.gradient} p-5 text-white overflow-hidden">
            <img src="images/${park.id}.jpg" alt="${park.name}" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.style.display='none'" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
            <div class="relative z-10 flex items-start justify-between gap-2">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center gap-1 bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/15">
                  <i data-lucide="map-pin" class="w-3 h-3 text-amber-400"></i> ${park.state}
                </span>
                ${park.distanceToUser ? `
                  <span class="inline-flex items-center gap-1 bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 border border-white/20" title="${formatDistance(park.distanceToUser.miles, park.distanceToUser.km)} from current GPS position">
                    <i data-lucide="navigation" class="w-2.5 h-2.5 text-amber-400"></i> ${formatDistance(park.distanceToUser.miles, park.distanceToUser.km)}
                  </span>
                ` : ''}
              </div>
              <div class="flex items-center gap-1.5">
                ${park.id === 'chiricahua' ? `<span class="bg-amberRust text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm">2026 New</span>` : ''}
                <span class="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  ${park.biome}
                </span>
              </div>
            </div>
            <div class="relative z-10 mt-3.5">
              <h3 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">${park.name}</h3>
              <p class="text-[11px] text-white/85 font-medium mt-0.5">${park.elevation} • ${totalParkXp} XP Available</p>
            </div>
          </div>

          <div class="p-5 space-y-3">
            <p class="text-xs text-slateInk/75 leading-relaxed line-clamp-2">${park.tagline}</p>

            <div>
              <div class="flex items-center justify-between text-xs font-bold mb-1">
                <span class="text-forest">Quests</span>
                <span class="${completedCount === totalCount ? 'text-amberRust' : 'text-pine'}">${completedCount} / ${totalCount}</span>
              </div>
              <div class="w-full h-2 bg-parchment rounded-full overflow-hidden border border-parchmentDark">
                <div class="h-full bg-gradient-to-r from-pine to-sage rounded-full transition-all duration-500" style="width: ${pct}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 pb-5 pt-2 flex items-center gap-2.5">
          <button onclick="downloadOfflineFromDirectory('${park.id}')" title="Download Offline Park Pack (${park.offlineSize})"
            class="p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 ${
              isOfflineReady
                ? 'bg-emerald-50 border-sage text-forest'
                : 'bg-parchment hover:bg-parchmentDark border-parchmentDark text-slateInk'
            }">
            <i data-lucide="${isOfflineReady ? 'check-circle-2' : 'download-cloud'}" class="w-4 h-4 ${isOfflineReady ? 'text-pine' : 'text-amberRust'}"></i>
            <span class="hidden sm:inline">${isOfflineReady ? 'Offline ✓' : park.offlineSize}</span>
          </button>

          <button onclick="enterParkQuests('${park.id}')"
            class="flex-1 py-2.5 px-4 rounded-xl bg-forest hover:bg-pine text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
            <span>Explore Park Quests</span>
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setDirectoryRegion(region) {
  appState.directoryRegion = region;
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
}

function setDirectoryState(stateCode) {
  appState.directoryState = stateCode;
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
}

function setDirectoryStatus(status) {
  appState.directoryStatus = status;
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
}

function resetDirectoryFilters() {
  appState.directoryRegion = 'All 64 Parks';
  appState.directoryState = 'ALL';
  appState.directoryStatus = 'all';
  appState.directorySearch = '';
  const input = document.getElementById('park-search-input');
  if (input) input.value = '';
  const stSel = document.getElementById('directory-state-select');
  if (stSel) stSel.value = 'ALL';
  const statSel = document.getElementById('directory-status-select');
  if (statSel) statSel.value = 'all';
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
}

function handleParkSearch(val) {
  appState.directorySearch = val;
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    if (val.trim().length > 0) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
}

function clearParkSearch() {
  appState.directorySearch = '';
  const input = document.getElementById('park-search-input');
  if (input) input.value = '';
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) clearBtn.classList.add('hidden');
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
}

function downloadOfflineFromDirectory(parkId) {
  const park = PARKS_DATA.find(p => p.id === parkId);
  if (!park) return;
  if (appState.offlinePacks.includes(parkId)) {
    showToast(`${park.name} Offline Pack (${park.offlineSize}) is already cached on this device!`, 'info');
    return;
  }
  appState.offlinePacks.push(parkId);
  saveState();
  renderDirectoryView();
  renderParkHero();
  if (window.lucide) lucide.createIcons();
  showToast(`Offline Park Pack downloaded for ${park.name} (${park.waypointsCount} safe GPS pins cached)!`, 'success');
}

function enterParkQuests(parkId) {
  appState.activeParkId = parkId;
  appState.activeFilter = 'all';
  saveState();
  populateStateAndQuickDropdowns();
  renderHeaderStats();
  renderParkHero();
  renderCategoryFilters();
  renderQuestCards();
  switchMainView('quests');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------------------------------------------------------
// ACTIVE PARK HERO, QUESTS, PASSPORT & JOURNAL RENDERING
// ---------------------------------------------------------
function renderParkHero() {
  const park = PARKS_DATA.find(p => p.id === appState.activeParkId) || PARKS_DATA[0];
  const completedCount = park.quests.filter(q => appState.completedQuests.includes(q.id)).length;
  const totalCount = park.quests.length;
  const isOfflineReady = appState.offlinePacks.includes(park.id);

  const hero = document.getElementById('park-hero-banner');
  if (!hero) return;
  hero.className = `relative rounded-3xl overflow-hidden shadow-lg border-2 border-pine/20 bg-gradient-to-r ${park.gradient} text-white transition-all`;
  hero.innerHTML = `
    <img src="images/${park.id}.jpg" alt="${park.name}" class="absolute inset-0 w-full h-full object-cover opacity-40" onerror="this.style.display='none'" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none"></div>
    <div class="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="space-y-2.5 max-w-2xl">
        <div class="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
          <span class="bg-black/25 px-2.5 py-1 rounded-full">${park.state} • ${park.region}</span>
          <span class="bg-black/25 px-2.5 py-1 rounded-full">${park.elevation}</span>
          <span class="bg-black/25 px-2.5 py-1 rounded-full">${park.acreage}</span>
        </div>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-sm">${park.name} National Park</h2>
        <p class="text-sm sm:text-base text-white/90 leading-relaxed">${park.tagline}</p>

        <div class="flex items-start gap-2 text-xs bg-white/15 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/25">
          <i data-lucide="ticket" class="w-4 h-4 text-amber-300 shrink-0 mt-0.5"></i>
          <span><strong>Entry &amp; Permit Disclosure:</strong> ${park.permitNotice}</span>
        </div>

        <div class="flex items-start gap-2 text-xs bg-amber-950/65 backdrop-blur-sm text-amber-100 px-3 py-2 rounded-xl border border-amber-400/40">
          <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
          <span><strong>Active Safety &amp; 36 CFR Notice:</strong> ${park.safetyAlert}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
        <div class="bg-black/30 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-center">
          <div class="text-xs text-white/75 font-medium">Park Quests Completed</div>
          <div class="font-serif text-2xl font-bold text-amber-300">${completedCount} / ${totalCount}</div>
        </div>

        <button onclick="downloadOfflinePack('${park.id}')"
          class="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md ${
            isOfflineReady
              ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-400/40 cursor-default'
              : 'bg-parchment text-forest hover:bg-white cursor-pointer'
          }">
          <i data-lucide="${isOfflineReady ? 'check-circle-2' : 'download-cloud'}" class="w-4 h-4 ${isOfflineReady ? 'text-emerald-400' : 'text-amberRust'}"></i>
          <span>${isOfflineReady ? `Offline Pack Cached (${park.offlineSize})` : `Download Offline Pack (${park.offlineSize})`}</span>
        </button>
      </div>
    </div>
  `;
}

function renderCategoryFilters() {
  const categories = [
    { id: 'all', label: 'All 20 Quests', icon: 'layers' },
    { id: 'free', label: 'Free (12)', icon: 'sparkles' },
    { id: 'paid', label: 'Pro Paid (8)', icon: 'crown' },
    { id: 'discovery', label: 'GPS Check-In', icon: 'map-pin' },
    { id: 'scavenger', label: 'Field Photo', icon: 'camera' },
    { id: 'funny_photo', label: 'Funny Photo', icon: 'smile' },
    { id: 'reflection', label: 'Your Experience', icon: 'pen-line' },
    { id: 'trivia', label: 'Ranger Riddle', icon: 'help-circle' },
    { id: 'stewardship', label: 'Stewardship', icon: 'sprout' }
  ];

  const container = document.getElementById('category-filter-pills');
  if (!container) return;
  container.innerHTML = categories.map(cat => {
    const active = appState.activeFilter === cat.id;
    return `
      <button onclick="setQuestFilter('${cat.id}')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
          active
            ? 'bg-forest text-white shadow-sm'
            : 'bg-parchment text-slateInk/75 hover:bg-parchmentDark/60'
        }">
        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
        <span>${cat.label}</span>
      </button>
    `;
  }).join('');
}

function getCategoryMeta(type) {
  switch (type) {
    case 'discovery':
      return { label: 'GPS Overlook Check-In', badgeBg: 'bg-sky-100 text-sky-800 border-sky-200', icon: 'map-pin', btnText: 'Safe-Stop GPS Check-In' };
    case 'scavenger':
      return { label: 'Field Snapshot / Wildlife', badgeBg: 'bg-amber-100 text-amber-900 border-amber-200', icon: 'camera', btnText: 'Log Field Snapshot' };
    case 'funny_photo':
      return { label: 'Funny Park Photo', badgeBg: 'bg-pink-100 text-pink-900 border-pink-200', icon: 'smile', btnText: 'Snap Funny Photo' };
    case 'reflection':
      return { label: 'Park Experience Story', badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200', icon: 'pen-line', btnText: 'Write Your Experience' };
    case 'trivia':
      return { label: 'Ranger Naturalist Riddle', badgeBg: 'bg-purple-100 text-purple-900 border-purple-200', icon: 'help-circle', btnText: 'Answer Riddle' };
    case 'stewardship':
      return { label: 'Leave No Trace Pledge', badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200', icon: 'sprout', btnText: 'Verify Stewardship' };
    default:
      return { label: 'Quest', badgeBg: 'bg-gray-100 text-gray-800', icon: 'compass', btnText: 'Start Quest' };
  }
}

function renderQuestCards() {
  const park = PARKS_DATA.find(p => p.id === appState.activeParkId) || PARKS_DATA[0];
  const grid = document.getElementById('quests-grid');
  if (!grid) return;

  const filtered = park.quests.filter(q => {
    if (appState.activeFilter === 'all') return true;
    if (appState.activeFilter === 'free') return !q.isPremium;
    if (appState.activeFilter === 'paid') return Boolean(q.isPremium);
    return q.type === appState.activeFilter;
  });

  const signedIn = isUserSignedIn();
  const signInGateBanner = !signedIn ? `
    <div class="col-span-full bg-forest text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border-2 border-sage/30">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-2xl bg-amberRust text-white flex items-center justify-center shrink-0">
          <i data-lucide="lock" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="font-serif text-base sm:text-lg font-bold">Sign In Required to Start or Edit Quests</div>
          <p class="text-xs text-parchment/80">Sign in for free (no payment required) to complete quests, undo progress, or unlock packs.</p>
        </div>
      </div>
      <button onclick="openAccountModal()"
        class="px-5 py-2.5 rounded-2xl bg-amberRust hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shrink-0 shadow-sm transition-colors cursor-pointer">
        Sign In Free
      </button>
    </div>
  ` : '';

  const lockedPaidCount = park.quests.filter(q => q.isPremium && !isQuestUnlocked(q, park.id)).length;
  const promoBanner = lockedPaidCount > 0 ? `
    <div class="col-span-full bg-gradient-to-r from-amber-50 via-parchment to-amber-50 border-2 border-amberRust/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-2xl bg-amberRust text-white flex items-center justify-center shrink-0 shadow-xs">
          <i data-lucide="crown" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="text-xs font-extrabold uppercase tracking-wider text-amberRust">12 Free Quests Included • 8 Pro Quests Available</div>
          <h4 class="font-serif text-base sm:text-lg font-bold text-forest">${park.name} Pro Expedition Pack (${lockedPaidCount} locked)</h4>
          <p class="text-xs text-slateInk/75">Unlock individual Pro quests ($1.99 each) or grab all 8 Pro quests for ${park.shortName} ($4.99).</p>
        </div>
      </div>
      <button onclick="openPremiumUnlockModal('${park.id}', '')"
        class="px-4 py-2.5 rounded-2xl bg-amberRust hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shrink-0 shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
        <i data-lucide="unlock" class="w-4 h-4"></i>
        <span>Unlock Pro Pack</span>
      </button>
    </div>
  ` : '';

  grid.innerHTML = signInGateBanner + promoBanner + filtered.map(quest => {
    const isCompleted = appState.completedQuests.includes(quest.id);
    const unlocked = isQuestUnlocked(quest, park.id);
    const meta = getCategoryMeta(quest.type);

    return `
      <div class="bg-white rounded-3xl p-6 border-2 ${isCompleted ? 'border-sage/70 bg-emerald-50/20' : !unlocked ? 'border-amberRust/35 bg-amber-50/10' : 'border-parchmentDark'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${meta.badgeBg}">
              <i data-lucide="${meta.icon}" class="w-3.5 h-3.5"></i>
              ${meta.label}
            </span>
            <div class="flex items-center gap-1.5">
              ${quest.isPremium
                ? `<span class="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${unlocked ? 'bg-emerald-100 text-forest border border-sage/40' : 'bg-amberRust text-white'}">
                     <i data-lucide="${unlocked ? 'crown' : 'lock'}" class="w-3 h-3"></i>
                     ${unlocked ? 'PRO' : quest.price || '$1.99'}
                   </span>`
                : `<span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-parchment text-pine border border-parchmentDark">FREE</span>`
              }
              <span class="inline-flex items-center gap-1 text-xs font-extrabold text-amberRust bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                +${quest.xp} XP
              </span>
            </div>
          </div>

          <div>
            <h3 class="font-serif text-xl font-bold text-forest leading-snug">${quest.title}</h3>
            <p class="text-sm text-slateInk/80 mt-1.5 leading-relaxed">${quest.description}</p>
          </div>

          <div class="pt-1 flex flex-wrap items-center gap-2 text-xs text-slateInk/65">
            <span class="bg-parchment px-2.5 py-1 rounded-lg font-medium">Difficulty: <strong>${quest.difficulty}</strong></span>
            ${quest.coords ? `<span class="bg-parchment px-2.5 py-1 rounded-lg font-mono text-[11px]">${quest.coords}</span>` : ''}
            <span class="bg-emerald-50 text-forest px-2.5 py-1 rounded-lg font-semibold">36 CFR Compliant</span>
          </div>
        </div>

        <div class="pt-2 border-t border-parchmentDark/70 space-y-2">
          ${isCompleted
            ? `<div class="w-full py-3 px-4 rounded-2xl bg-pine/15 text-forest font-bold text-sm flex items-center justify-center gap-2 border border-pine/30">
                 <i data-lucide="check-circle-2" class="w-5 h-5 text-pine"></i>
                 <span>Quest Accomplished!</span>
               </div>
               <button onclick="undoQuest('${quest.id}')"
                 class="w-full py-1.5 px-3 rounded-xl text-xs text-slateInk/50 hover:text-red-700 hover:bg-red-50 font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent hover:border-red-200">
                 <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
                 <span>Undo Completion</span>
               </button>`
            : !unlocked
              ? `<button onclick="openPremiumUnlockModal('${park.id}', '${quest.id}')"
                   class="w-full py-3 px-4 rounded-2xl bg-amberRust hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer">
                   <i data-lucide="lock" class="w-4 h-4 text-amber-100"></i>
                   <span>Unlock Pro Quest (${quest.price || '$1.99'})</span>
                 </button>`
              : `<button onclick="openQuestModal('${quest.id}')"
                   class="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-pine text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer">
                   <i data-lucide="${meta.icon}" class="w-4 h-4 text-amber-400"></i>
                   <span>${meta.btnText}</span>
                 </button>`
          }
          <div class="flex items-center justify-between text-[11px] text-slateInk/55 px-1">
            <span>Maintained trail/plaza waypoint</span>
            <button onclick="reportUnsafePin('${quest.id}', '${quest.title.replace(/'/g, "\\'")}')" class="hover:text-red-700 underline flex items-center gap-1">
              <i data-lucide="flag" class="w-3 h-3"></i> Report Unsafe / Closed Pin
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderBadgesGrid() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  const query = (appState.passportSearch || '').trim().toLowerCase();

  ['all', 'unlocked', 'locked'].forEach(f => {
    const btn = document.getElementById(`pass-filter-${f}`);
    if (!btn) return;
    if (appState.passportFilter === f) {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-forest text-white';
    } else {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-parchment text-slateInk/75 hover:bg-parchmentDark';
    }
  });

  const filteredBadges = BADGES_DATA.filter(badge => {
    const unlocked = appState.unlockedBadges.some(b => b.id === badge.id);
    const matchesStatus = appState.passportFilter === 'all'
      || (appState.passportFilter === 'unlocked' && unlocked)
      || (appState.passportFilter === 'locked' && !unlocked);
    const matchesQuery = !query
      || badge.title.toLowerCase().includes(query)
      || badge.subtitle.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  grid.innerHTML = filteredBadges.map(badge => {
    const unlockedRecord = appState.unlockedBadges.find(b => b.id === badge.id);
    const isUnlocked = Boolean(unlockedRecord);

    return `
      <div class="bg-white rounded-3xl p-5 border-2 ${isUnlocked ? 'border-amberRust/60 shadow-md' : 'border-parchmentDark opacity-75'} flex flex-col items-center text-center justify-between gap-3 transition-all">
        <div class="space-y-2.5 flex flex-col items-center">
          <div class="w-20 h-20 rounded-full ${isUnlocked ? badge.bg : 'bg-gray-200 grayscale'} patch-stitch flex items-center justify-center relative transition-all">
            ${badge.svg}
            ${!isUnlocked ? `<div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slateInk text-white flex items-center justify-center shadow"><i data-lucide="lock" class="w-3 h-3"></i></div>` : ''}
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.category === 'global' ? 'bg-amber-100 text-amberRust' : 'bg-emerald-50 text-forest'}">
              ${badge.category === 'global' ? 'Conservation Honor' : '64-Park Patch'}
            </span>
            <h3 class="font-serif text-base font-bold text-forest mt-1 leading-snug">${badge.title}</h3>
            <p class="text-xs font-semibold text-slateInk/70">${badge.subtitle}</p>
          </div>
          <p class="text-[11px] text-slateInk/65 leading-relaxed">${badge.criteria}</p>
        </div>

        <div class="w-full pt-2 border-t border-parchmentDark/60 text-[11px] font-bold">
          ${isUnlocked
            ? `<span class="text-pine flex items-center justify-center gap-1"><i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Stitched ${unlockedRecord.timestamp}</span>`
            : `<span class="text-slateInk/45">Locked Patch</span>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function setPassportFilter(filter) {
  appState.passportFilter = filter;
  renderBadgesGrid();
  if (window.lucide) lucide.createIcons();
}

function setPassportSearch(val) {
  appState.passportSearch = val;
  renderBadgesGrid();
  if (window.lucide) lucide.createIcons();
}

function renderJournalEntries() {
  const list = document.getElementById('journal-entries-list');
  if (!list) return;
  if (appState.journalEntries.length === 0) {
    list.innerHTML = `
      <div class="bg-white rounded-3xl p-10 border border-dashed border-parchmentDark text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-parchment mx-auto flex items-center justify-center text-pine">
          <i data-lucide="book-open" class="w-6 h-6"></i>
        </div>
        <h3 class="font-serif text-lg font-bold text-forest">Your Field Journal is Empty</h3>
        <p class="text-sm text-slateInk/70 max-w-md mx-auto">Select any of the 64 National Parks and complete GPS check-ins, field snapshots, ranger riddles, or stewardship pledges to record your adventure.</p>
        <button onclick="switchMainView('directory')" class="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-white text-xs font-bold">
          <i data-lucide="compass" class="w-4 h-4"></i> Browse All 64 Parks
        </button>
      </div>
    `;
    return;
  }

  list.innerHTML = appState.journalEntries.slice().reverse().map(entry => `
    <div class="bg-white rounded-2xl p-5 border border-parchmentDark shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs font-bold text-amberRust">
          <span>${entry.parkName}</span>
          <span>•</span>
          <span class="text-slateInk/50 font-normal">${entry.timestamp}</span>
        </div>
        <h4 class="font-serif text-base font-bold text-forest">${entry.questTitle}</h4>
        <p class="text-xs text-slateInk/75">${entry.note}</p>
      </div>
      <div class="shrink-0 flex items-center gap-2">
        <span class="px-3 py-1 rounded-full bg-emerald-50 text-forest border border-sage/40 text-xs font-extrabold">
          +${entry.xp} XP
        </span>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------
// NAVIGATION & QUEST WORKFLOWS
// ---------------------------------------------------------
function toggleNavDropdown() {
  const menu = document.getElementById('nav-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

function closeNavDropdown() {
  const menu = document.getElementById('nav-dropdown-menu');
  if (menu) menu.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('nav-dropdown-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeNavDropdown();
  }
});

function switchMainView(viewName) {
  appState.activeView = viewName;
  const viewMeta = {
    directory: { label: 'Select a Park (64)', icon: 'compass' },
    map: { label: 'Park Map', icon: 'map-pinned' },
    quests: { label: 'Active Quests', icon: 'map' },
    passport: { label: 'Passport & Patches', icon: 'award' },
    journal: { label: 'Field Journal', icon: 'book-open' },
    leaderboard: { label: 'Leaderboard & Friends', icon: 'trophy' }
  };

  ['directory', 'map', 'quests', 'passport', 'journal', 'leaderboard'].forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const nav = document.getElementById(`nav-${v}`);
    if (!el || !nav) return;
    if (v === viewName) {
      el.classList.remove('hidden');
      nav.classList.add('bg-parchment', 'text-forest', 'font-bold');
    } else {
      el.classList.add('hidden');
      nav.classList.remove('bg-parchment', 'text-forest', 'font-bold');
    }
  });

  const labelEl = document.getElementById('nav-dropdown-label');
  const iconEl = document.getElementById('nav-dropdown-icon');
  if (labelEl && viewMeta[viewName]) labelEl.textContent = viewMeta[viewName].label;
  if (iconEl && viewMeta[viewName]) iconEl.setAttribute('data-lucide', viewMeta[viewName].icon);
  closeNavDropdown();

  if (viewName === 'map') {
    renderParkMap();
  } else if (viewName === 'leaderboard') {
    renderLeaderboardView();
  }
  if (window.lucide) lucide.createIcons();
}

function selectPark(parkId) {
  appState.activeParkId = parkId;
  saveState();
  populateStateAndQuickDropdowns();
  renderHeaderStats();
  renderParkHero();
  renderQuestCards();
  if (window.lucide) lucide.createIcons();
}

function setQuestFilter(filterId) {
  appState.activeFilter = filterId;
  renderCategoryFilters();
  renderQuestCards();
  if (window.lucide) lucide.createIcons();
}

function downloadOfflinePack(parkId) {
  const park = PARKS_DATA.find(p => p.id === parkId);
  if (!park || appState.offlinePacks.includes(parkId)) return;
  appState.offlinePacks.push(parkId);
  saveState();
  renderParkHero();
  renderDirectoryView();
  if (window.lucide) lucide.createIcons();
  showToast(`Offline Park Pack downloaded for ${park.name} (${park.waypointsCount} safe GPS pins cached)!`, 'success');
}

function reportUnsafePin(questId, questTitle) {
  showToast(`Pin report logged for "${questTitle}". Our safety team reviews trail closures daily—always obey posted NPS signage!`, 'info');
}

// ---------------------------------------------------------
// QUEST VERIFICATION MODAL LOGIC
// ---------------------------------------------------------
let currentModalQuest = null;
let selectedPhotoPreset = null;
let uploadedPhotoDataUrl = null;
let selectedTriviaIndex = null;

function openQuestModal(questId) {
  if (!requireSignInForQuestAction('Please sign in first (no payment required) to start quests.')) return;
  let park = null;
  let quest = null;
  for (const p of PARKS_DATA) {
    const q = p.quests.find(item => item.id === questId);
    if (q) { park = p; quest = q; break; }
  }
  if (!park || !quest) return;
  if (!isQuestUnlocked(quest, park.id)) {
    openPremiumUnlockModal(park.id, quest.id);
    return;
  }

  currentModalQuest = { park, quest };
  selectedPhotoPreset = quest.presets ? quest.presets[0].id : null;
  uploadedPhotoDataUrl = null;
  selectedTriviaIndex = null;

  const meta = getCategoryMeta(quest.type);
  const badgeEl = document.getElementById('modal-quest-badge');
  const titleEl = document.getElementById('modal-quest-title');
  const body = document.getElementById('modal-quest-body');
  if (!badgeEl || !titleEl || !body) return;

  badgeEl.innerHTML = `<i data-lucide="${meta.icon}" class="w-3.5 h-3.5 text-amber-400"></i><span>${meta.label}</span>`;
  titleEl.textContent = quest.title;

  if (quest.type === 'discovery') {
    currentGpsCheckState = null;
    const targetCoordsStr = formatCoordinates(quest.lat, quest.lon);
    const radiusStr = `${quest.geofenceRadius || 8.0} miles`;

    body.innerHTML = `
      <p class="text-sm text-slateInk/80 leading-relaxed">${quest.description}</p>
      
      <div class="bg-parchment rounded-2xl p-4 border border-parchmentDark space-y-3.5">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-white/90 p-2.5 rounded-xl border border-parchmentDark">
            <span class="block text-[10px] font-bold uppercase tracking-wider text-slateInk/60">Target Waypoint</span>
            <span class="font-bold text-forest truncate block mt-0.5" title="${quest.landmark}">${quest.landmark}</span>
            <span class="font-mono text-[11px] text-slateInk/70 block mt-0.5">${targetCoordsStr}</span>
          </div>
          <div class="bg-white/90 p-2.5 rounded-xl border border-parchmentDark">
            <span class="block text-[10px] font-bold uppercase tracking-wider text-slateInk/60">Check-In Geofence</span>
            <span class="font-bold text-pine block mt-0.5">Within ${radiusStr}</span>
            <span class="text-[11px] text-slateInk/70 block mt-0.5">${appState.localGpsOnly ? 'On-Device Verification' : 'Ephemeral Session Check'}</span>
          </div>
        </div>

        <!-- Radar & GNSS Status Box -->
        <div id="gps-radar-box" class="bg-gradient-to-b from-forest/5 to-pine/10 border border-forest/20 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
          <div class="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div id="radar-ping-ring" class="absolute inset-0 rounded-full bg-pine/20 animate-radar-ping"></div>
            <div id="radar-center-icon" class="w-12 h-12 rounded-full bg-forest text-amber-300 flex items-center justify-center shadow-md relative z-10 transition-all">
              <i data-lucide="navigation" class="w-6 h-6"></i>
            </div>
          </div>

          <div id="gps-status-text" class="text-xs font-semibold text-forest min-h-[36px] flex items-center justify-center px-2">
            Standing safely at ${quest.landmark}. Tap "Scan Live Device GPS" or test arrival with the "Field Simulator".
          </div>

          <!-- Live Metrics Grid -->
          <div id="gps-metrics-grid" class="grid grid-cols-3 gap-2 text-center pt-2 border-t border-forest/15 text-[11px]">
            <div class="bg-white/70 rounded-xl p-2">
              <div class="text-[10px] text-slateInk/50 font-bold uppercase">Distance</div>
              <div id="metric-distance" class="font-bold text-forest mt-0.5">--</div>
            </div>
            <div class="bg-white/70 rounded-xl p-2">
              <div class="text-[10px] text-slateInk/50 font-bold uppercase">Bearing / Dir</div>
              <div id="metric-bearing" class="font-bold text-forest mt-0.5">--</div>
            </div>
            <div class="bg-white/70 rounded-xl p-2">
              <div class="text-[10px] text-slateInk/50 font-bold uppercase">Geofence</div>
              <div id="metric-geofence" class="font-bold text-amberRust mt-0.5">Not Checked</div>
            </div>
          </div>
        </div>

        <!-- GPS Action Buttons -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <button type="button" onclick="checkQuestDeviceGps()" id="gps-scan-btn"
              class="flex-1 py-2.5 px-4 rounded-xl bg-forest hover:bg-pine text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
              <i data-lucide="satellite" class="w-4 h-4 text-amber-400"></i>
              <span>Scan Live Device GPS</span>
            </button>
            <button type="button" onclick="toggleQuestGpsSimulator()" id="gps-sim-toggle-btn"
              class="py-2.5 px-3.5 rounded-xl bg-white hover:bg-parchment border border-parchmentDark text-slateInk font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer" title="Toggle Field Simulator &amp; Test Locations">
              <i data-lucide="sliders" class="w-4 h-4 text-amberRust"></i>
              <span>Field Simulator</span>
            </button>
          </div>

          <!-- Field Simulator Panel -->
          <div id="gps-simulator-panel" class="hidden bg-white/95 rounded-xl p-3 border border-parchmentDark space-y-2.5 animate-fade-in">
            <div class="flex items-center justify-between text-[11px]">
              <span class="font-bold text-forest flex items-center gap-1">
                <i data-lucide="sliders" class="w-3.5 h-3.5 text-amberRust"></i> GNSS Simulator &amp; Field Tester
              </span>
              <span class="text-slateInk/50">Test in-range &amp; out-of-range states</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" onclick="simulateQuestGpsAtWaypoint()"
                class="py-2 px-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-sage/50 text-[11px] font-bold text-forest text-center transition-all cursor-pointer">
                🎯 At Landmark<br><span class="font-normal text-[10px] text-pine">0.0 mi (Pass)</span>
              </button>
              <button type="button" onclick="simulateQuestGpsNearby()"
                class="py-2 px-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold text-sky-900 text-center transition-all cursor-pointer">
                🥾 Nearby Trail<br><span class="font-normal text-[10px] text-sky-700">1.2 mi (Pass)</span>
              </button>
              <button type="button" onclick="simulateQuestGpsDistant()"
                class="py-2 px-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold text-amber-900 text-center transition-all cursor-pointer">
                🚗 Distant<br><span class="font-normal text-[10px] text-amber-700">45 mi (Fail)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <label class="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-300 cursor-pointer text-xs text-amber-950 font-medium">
        <input type="checkbox" id="safe-stop-checkbox" onchange="updateGpsButtonState()" class="mt-0.5 rounded text-forest focus:ring-forest w-4 h-4 shrink-0" />
        <span><strong>Safety Confirmation:</strong> I am stopped completely in a safe, stationary location—not walking near drop-offs, off boardwalks, or operating a vehicle.</span>
      </label>

      <button id="gps-verify-btn" disabled onclick="submitGpsQuest()"
        class="w-full py-3 px-4 rounded-2xl bg-gray-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all opacity-45 cursor-not-allowed">
        <i data-lucide="crosshair" class="w-4 h-4 text-amber-400"></i>
        <span>Scan or Simulate In-Range GPS to Verify</span>
      </button>
    `;
  } else if (quest.type === 'scavenger' || quest.type === 'funny_photo') {
    const isFunny = quest.type === 'funny_photo';
    body.innerHTML = `
      <p class="text-sm text-slateInk/80 leading-relaxed">${quest.description}</p>
      <div class="space-y-2">
        <label class="block text-xs font-bold uppercase tracking-wider text-forest">1. ${isFunny ? 'Choose a Funny Snapshot Preset or Upload Your Silly Photo' : 'Choose a Field Snapshot or Upload Your Photo'}</label>
        <div class="grid grid-cols-2 gap-3">
          ${quest.presets.map(p => `
            <button type="button" onclick="selectPresetPhoto('${p.id}')" id="preset-btn-${p.id}"
              class="preset-card text-left rounded-2xl overflow-hidden border-2 ${selectedPhotoPreset === p.id ? 'border-amberRust ring-2 ring-amberRust/30' : 'border-parchmentDark'} bg-parchment transition-all">
              <div class="h-24 w-full overflow-hidden">${p.svg}</div>
              <div class="p-2.5 text-xs font-bold text-forest truncate">${p.label}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="flex items-center justify-between bg-parchment rounded-xl p-3 border border-parchmentDark">
        <span class="text-xs font-medium text-slateInk/75">${isFunny ? 'Upload your own funny park photo:' : 'Or attach a real camera photo:'}</span>
        <label class="px-3 py-1.5 rounded-lg bg-white border border-parchmentDark text-xs font-bold text-forest hover:bg-parchmentDark/40 cursor-pointer">
          Upload Image
          <input type="file" accept="image/*" onchange="handlePhotoUpload(event)" class="hidden" />
        </label>
      </div>
      <div id="uploaded-preview-box" class="hidden rounded-2xl overflow-hidden border border-parchmentDark">
        <img id="uploaded-preview-img" class="w-full h-36 object-cover" alt="Uploaded field observation" />
      </div>

      <label class="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-sage/40 cursor-pointer text-xs text-forest font-medium">
        <input type="checkbox" id="ugc-privacy-checkbox" checked class="mt-0.5 rounded text-forest focus:ring-forest w-4 h-4 shrink-0" />
        <span><strong>36 CFR &amp; Safety Check:</strong> Taken from a designated trail/boardwalk at a safe wildlife distance (25–100+ yds), with no hazardous stunts near cliffs or drop-offs.</span>
      </label>

      <button onclick="submitPhotoQuest()" class="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-pine text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all">
        <i data-lucide="${isFunny ? 'smile' : 'camera'}" class="w-4 h-4 text-amber-400"></i>
        <span>${isFunny ? 'Submit Funny Photo' : 'Log Field Snapshot'} (+${quest.xp} XP)</span>
      </button>
    `;
  } else if (quest.type === 'reflection') {
    const moods = ['Epic Views', 'Wildlife Sighting', 'Peaceful Trail', 'Family Memory', 'Unforgettable Sunset'];
    body.innerHTML = `
      <p class="text-sm text-slateInk/80 leading-relaxed">${quest.description}</p>
      <div class="space-y-2">
        <div class="text-xs font-bold uppercase tracking-wider text-forest">Highlight Tag (Optional)</div>
        <div class="flex flex-wrap gap-1.5" id="experience-mood-chips">
          ${moods.map(m => `
            <button type="button" onclick="toggleExperienceMood(this, '${m}')"
              class="exp-mood-chip px-2.5 py-1 rounded-full text-xs font-semibold bg-parchment text-forest border border-parchmentDark hover:border-pine transition-colors">
              ${m}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="space-y-1.5">
        <label for="experience-story-input" class="block text-xs font-bold uppercase tracking-wider text-forest">Your Park Experience</label>
        <textarea id="experience-story-input" rows="4" oninput="updateExperienceButton()"
          placeholder="${quest.promptPlaceholder || 'Describe your experience at this National Park...'}"
          class="w-full rounded-2xl border-2 border-parchmentDark bg-parchment/50 p-3.5 text-sm text-slateInk focus:outline-none focus:border-forest resize-y"></textarea>
        <div class="flex justify-between text-[11px] text-slateInk/60 px-1">
          <span>Saved directly to your Field Journal</span>
          <span id="experience-char-count">0 / 15 min chars</span>
        </div>
      </div>
      <button id="experience-submit-btn" disabled onclick="submitExperienceQuest()"
        class="w-full py-3 px-4 rounded-2xl bg-forest text-white font-bold text-sm flex items-center justify-center gap-2 opacity-40 cursor-not-allowed transition-all">
        <i data-lucide="pen-line" class="w-4 h-4 text-amber-400"></i>
        <span>Save Experience to Journal (+${quest.xp} XP)</span>
      </button>
    `;
  } else if (quest.type === 'trivia') {
    body.innerHTML = `
      <div class="bg-parchment rounded-2xl p-4 border border-parchmentDark">
        <div class="text-xs font-bold uppercase tracking-wider text-amberRust mb-1">Ranger Interpretive Question</div>
        <p class="font-serif text-base font-bold text-forest leading-snug">${quest.question}</p>
      </div>
      <div class="space-y-2.5" id="trivia-options-list">
        ${quest.options.map((opt, idx) => `
          <button type="button" onclick="selectTriviaOption(${idx})" id="trivia-opt-${idx}"
            class="w-full text-left p-3.5 rounded-2xl border-2 border-parchmentDark hover:border-pine bg-white text-xs sm:text-sm font-medium text-slateInk transition-all flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-parchment text-forest font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${String.fromCharCode(65 + idx)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="trivia-feedback" class="hidden text-xs font-semibold p-3 rounded-xl"></div>
      <button onclick="submitTriviaQuest()" class="w-full py-3 px-4 rounded-2xl bg-forest hover:bg-pine text-white font-bold text-sm flex items-center justify-center gap-2 shadow transition-all">
        <i data-lucide="check-circle" class="w-4 h-4 text-amber-400"></i>
        <span>Submit Answer (+${quest.xp} XP)</span>
      </button>
    `;
  } else if (quest.type === 'stewardship') {
    body.innerHTML = `
      <p class="text-sm text-slateInk/80 leading-relaxed">${quest.description}</p>
      <div class="space-y-2.5 bg-parchment p-4 rounded-2xl border border-parchmentDark">
        <div class="text-xs font-bold uppercase tracking-wider text-forest mb-1">Check Each Completed Leave No Trace Action:</div>
        ${quest.checklist.map(item => `
          <label class="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-parchmentDark cursor-pointer hover:border-pine transition-colors">
            <input type="checkbox" class="steward-check mt-0.5 rounded text-forest focus:ring-forest w-4 h-4" onchange="updateStewardButton()" />
            <span class="text-xs sm:text-sm text-slateInk font-medium leading-snug">${item}</span>
          </label>
        `).join('')}
      </div>
      <button id="steward-submit-btn" disabled onclick="submitStewardshipQuest()"
        class="w-full py-3 px-4 rounded-2xl bg-forest text-white font-bold text-sm flex items-center justify-center gap-2 opacity-40 cursor-not-allowed transition-all">
        <i data-lucide="sprout" class="w-4 h-4 text-amber-400"></i>
        <span>Complete Stewardship Pledge (+${quest.xp} XP)</span>
      </button>
    `;
  }

  const modal = document.getElementById('quest-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  if (window.lucide) lucide.createIcons();
}

function closeQuestModal() {
  const modal = document.getElementById('quest-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  currentModalQuest = null;
}

let currentGpsCheckState = null;

function toggleQuestGpsSimulator() {
  const panel = document.getElementById('gps-simulator-panel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (window.lucide) lucide.createIcons();
}

function checkQuestDeviceGps() {
  const status = document.getElementById('gps-status-text');
  if (!status || !currentModalQuest) return;

  status.innerHTML = `<span class="text-amberRust flex items-center justify-center gap-1.5"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Acquiring GNSS coordinates &amp; computing geodetic distance...</span>`;
  if (window.lucide) lucide.createIcons();

  if (!navigator.geolocation) {
    status.innerHTML = `<span class="text-red-700">Browser geolocation unavailable. Please use the Field Simulator below to test!</span>`;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLon = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy || 12);
      
      appState.userGps = {
        lat: userLat,
        lon: userLon,
        accuracy: accuracy,
        altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
        heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
        isSimulated: false,
        timestamp: new Date().toLocaleTimeString(),
        label: 'Live Device GPS'
      };
      saveState();

      evaluateQuestGeofence(userLat, userLon, accuracy, false, 'Live Device GPS');
    },
    (err) => {
      let errMsg = 'Location permission declined or unavailable.';
      if (err.code === 1) errMsg = 'Location permission denied by browser. Use the Field Simulator to test!';
      else if (err.code === 2) errMsg = 'GPS signal unavailable. Use the Field Simulator to test!';
      else if (err.code === 3) errMsg = 'GNSS lock timed out. Use the Field Simulator to test!';

      status.innerHTML = `<span class="text-amberRust">⚠️ ${errMsg}</span>`;
      renderQuestGpsMetrics(null, null, null, null, null, false, false, errMsg);
      updateGpsButtonState();
      if (window.lucide) lucide.createIcons();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function simulateQuestGpsAtWaypoint() {
  if (!currentModalQuest) return;
  const { quest } = currentModalQuest;
  evaluateQuestGeofence(quest.lat, quest.lon, 4, true, `Simulated At Landmark (${quest.landmark})`);
}

function simulateQuestGpsNearby() {
  if (!currentModalQuest) return;
  const { quest } = currentModalQuest;
  // Offset by ~0.015 degrees (~1.0 - 1.2 miles)
  const nearbyLat = quest.lat + 0.012;
  const nearbyLon = quest.lon + 0.010;
  evaluateQuestGeofence(nearbyLat, nearbyLon, 6, true, 'Simulated Nearby Trail (~1.2 mi)');
}

function simulateQuestGpsDistant() {
  if (!currentModalQuest) return;
  const { quest } = currentModalQuest;
  // Offset by ~0.65 degrees (~45 miles)
  const distantLat = quest.lat + 0.55;
  const distantLon = quest.lon + 0.55;
  evaluateQuestGeofence(distantLat, distantLon, 25, true, 'Simulated Distant Highway (~45 mi)');
}

function evaluateQuestGeofence(userLat, userLon, accuracy, isSimulated = false, label = '') {
  if (!currentModalQuest) return;
  const { quest } = currentModalQuest;
  const targetLat = quest.lat;
  const targetLon = quest.lon;
  const radius = quest.geofenceRadius || 8.0;

  const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
  const bearing = calculateBearing(userLat, userLon, targetLat, targetLon);
  const inRange = distance.miles <= radius;

  currentGpsCheckState = {
    userLat,
    userLon,
    accuracy,
    distance,
    bearing,
    inRange,
    isSimulated,
    label
  };

  const status = document.getElementById('gps-status-text');
  if (status) {
    if (inRange) {
      status.innerHTML = `<span class="text-pine font-bold flex items-center justify-center gap-1.5"><i data-lucide="check-circle-2" class="w-4 h-4 text-pine"></i> ✓ GEOFENCE VERIFIED: Standing within ${formatDistance(distance.miles, distance.km)} of ${quest.landmark}! (${label})</span>`;
    } else {
      status.innerHTML = `<span class="text-amberRust font-bold flex items-center justify-center gap-1.5"><i data-lucide="alert-triangle" class="w-4 h-4 text-amberRust"></i> OUTSIDE GEOFENCE: You are ${formatDistance(distance.miles, distance.km)} away (Allowed: within ${radius} mi).</span>`;
    }
  }

  renderQuestGpsMetrics(userLat, userLon, accuracy, distance, bearing, inRange, isSimulated);
  updateGpsButtonState();
  if (window.lucide) lucide.createIcons();
}

function renderQuestGpsMetrics(userLat, userLon, accuracy, distance, bearing, inRange, isSimulated, errorMsg = '') {
  const distEl = document.getElementById('metric-distance');
  const brgEl = document.getElementById('metric-bearing');
  const geofEl = document.getElementById('metric-geofence');
  const radarIcon = document.getElementById('radar-center-icon');

  if (distance && typeof distance.miles === 'number') {
    if (distEl) distEl.textContent = formatDistance(distance.miles, distance.km);
    if (brgEl) brgEl.textContent = `${bearing.degrees}° ${bearing.direction}`;
    if (geofEl) {
      if (inRange) {
        geofEl.className = 'font-bold text-pine mt-0.5';
        geofEl.textContent = '✓ In Range';
      } else {
        geofEl.className = 'font-bold text-red-700 mt-0.5';
        geofEl.textContent = 'Outside Limit';
      }
    }
    if (radarIcon) {
      if (inRange) {
        radarIcon.className = 'w-12 h-12 rounded-full bg-pine text-white flex items-center justify-center shadow-md relative z-10 pulse-glow-emerald';
      } else {
        radarIcon.className = 'w-12 h-12 rounded-full bg-amberRust text-white flex items-center justify-center shadow-md relative z-10';
      }
    }
  } else {
    if (distEl) distEl.textContent = '--';
    if (brgEl) brgEl.textContent = '--';
    if (geofEl) {
      geofEl.className = 'font-bold text-red-600 mt-0.5';
      geofEl.textContent = errorMsg ? 'Lock Failed' : 'Not Checked';
    }
  }
}

function updateGpsButtonState() {
  const safeChecked = document.getElementById('safe-stop-checkbox')?.checked;
  const verifyBtn = document.getElementById('gps-verify-btn');
  if (!verifyBtn || !currentModalQuest) return;

  const canVerify = safeChecked && currentGpsCheckState && currentGpsCheckState.inRange;
  verifyBtn.disabled = !canVerify;

  if (canVerify) {
    verifyBtn.classList.remove('opacity-45', 'cursor-not-allowed', 'bg-gray-400');
    verifyBtn.classList.add('bg-forest', 'hover:bg-pine', 'shadow-md', 'cursor-pointer');
    verifyBtn.innerHTML = `<i data-lucide="award" class="w-4 h-4 text-amber-400"></i><span>Claim Check-In (+${currentModalQuest.quest.xp} XP)</span>`;
  } else {
    verifyBtn.classList.add('opacity-45', 'cursor-not-allowed');
    verifyBtn.classList.remove('hover:bg-pine', 'shadow-md', 'cursor-pointer');
    if (!safeChecked) {
      verifyBtn.innerHTML = `<i data-lucide="shield-alert" class="w-4 h-4 text-amber-400"></i><span>Confirm Safety Checkbox to Verify</span>`;
    } else if (!currentGpsCheckState) {
      verifyBtn.innerHTML = `<i data-lucide="crosshair" class="w-4 h-4 text-amber-400"></i><span>Scan or Simulate In-Range GPS to Verify</span>`;
    } else if (!currentGpsCheckState.inRange) {
      verifyBtn.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i><span>Outside Geofence (${formatDistance(currentGpsCheckState.distance.miles, currentGpsCheckState.distance.km)})</span>`;
    }
  }
  if (window.lucide) lucide.createIcons();
}

function submitGpsQuest() {
  if (!currentModalQuest || !currentGpsCheckState || !currentGpsCheckState.inRange) {
    showToast('GPS geofence check must be verified within range before completing.', 'error');
    return;
  }
  const { quest } = currentModalQuest;
  const stateLabel = currentGpsCheckState.isSimulated ? 'Field Simulator' : 'Live GNSS';
  const distStr = formatDistance(currentGpsCheckState.distance.miles, currentGpsCheckState.distance.km);
  const note = `Verified arrival at ${quest.landmark} (${distStr} from waypoint, ${stateLabel} ±${currentGpsCheckState.accuracy}m).`;
  completeActiveQuest(note);
}

// Backwards compatibility aliases
function simulateGpsVerification() { simulateQuestGpsAtWaypoint(); }
function useRealDeviceGps() { checkQuestDeviceGps(); }

function selectPresetPhoto(presetId) {
  selectedPhotoPreset = presetId;
  uploadedPhotoDataUrl = null;
  document.getElementById('uploaded-preview-box')?.classList.add('hidden');
  document.querySelectorAll('.preset-card').forEach(el => {
    el.classList.remove('border-amberRust', 'ring-2', 'ring-amberRust/30');
    el.classList.add('border-parchmentDark');
  });
  const chosen = document.getElementById(`preset-btn-${presetId}`);
  if (chosen) {
    chosen.classList.remove('border-parchmentDark');
    chosen.classList.add('border-amberRust', 'ring-2', 'ring-amberRust/30');
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedPhotoDataUrl = e.target.result;
    selectedPhotoPreset = null;
    const img = document.getElementById('uploaded-preview-img');
    if (img) img.src = uploadedPhotoDataUrl;
    document.getElementById('uploaded-preview-box')?.classList.remove('hidden');
    document.querySelectorAll('.preset-card').forEach(el => {
      el.classList.remove('border-amberRust', 'ring-2', 'ring-amberRust/30');
      el.classList.add('border-parchmentDark');
    });
  };
  reader.readAsDataURL(file);
}

function submitPhotoQuest() {
  const privacyOk = document.getElementById('ugc-privacy-checkbox')?.checked;
  if (!privacyOk) {
    showToast('Please confirm the 36 CFR wildlife distance & UGC privacy check before logging.', 'error');
    return;
  }
  const { quest } = currentModalQuest;
  let note = 'Uploaded custom field observation photo (36 CFR compliant).';
  if (selectedPhotoPreset) {
    const preset = quest.presets.find(p => p.id === selectedPhotoPreset);
    note = preset ? preset.caption : 'Logged field snapshot.';
  }
  completeActiveQuest(note);
}

function selectTriviaOption(idx) {
  selectedTriviaIndex = idx;
  document.querySelectorAll('[id^="trivia-opt-"]').forEach((btn, i) => {
    if (i === idx) {
      btn.classList.remove('border-parchmentDark', 'bg-white');
      btn.classList.add('border-forest', 'bg-emerald-50/60');
    } else {
      btn.classList.add('border-parchmentDark', 'bg-white');
      btn.classList.remove('border-forest', 'bg-emerald-50/60');
    }
  });
}

function submitTriviaQuest() {
  const feedback = document.getElementById('trivia-feedback');
  if (!feedback) return;
  if (selectedTriviaIndex === null) {
    feedback.className = 'text-xs font-semibold p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200';
    feedback.textContent = 'Please select an answer option first!';
    feedback.classList.remove('hidden');
    return;
  }

  const { quest } = currentModalQuest;
  if (selectedTriviaIndex === quest.correctIndex) {
    // Disable options so user can read the congrats banner without rushing
    document.querySelectorAll('[id^="trivia-opt-"]').forEach((btn, i) => {
      btn.disabled = true;
      btn.classList.add('cursor-default');
      if (i === quest.correctIndex) {
        btn.classList.remove('border-parchmentDark', 'bg-white');
        btn.classList.add('border-sage', 'bg-emerald-50');
      } else {
        btn.classList.add('opacity-50');
      }
    });

    feedback.className = 'p-4 rounded-2xl bg-emerald-50 text-forest border-2 border-sage space-y-1.5 animate-fade-in';
    feedback.innerHTML = `
      <div class="font-serif text-base font-bold text-forest flex items-center gap-2">
        <span>🎉 Congrats! Spot on, Ranger!</span>
      </div>
      <p class="text-xs text-forest/85 leading-relaxed">${quest.hint || 'You nailed the Ranger interpretive riddle!'}</p>
    `;
    feedback.classList.remove('hidden');

    const submitBtn = document.querySelector('#quest-modal button[onclick="submitTriviaQuest()"]');
    if (submitBtn) {
      submitBtn.setAttribute('onclick', 'claimTriviaQuestReward()');
      submitBtn.className = 'w-full py-3 px-4 rounded-2xl bg-amberRust hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer';
      submitBtn.innerHTML = `<i data-lucide="award" class="w-4 h-4 text-amber-100"></i><span>Claim +${quest.xp} XP &amp; Continue</span>`;
      if (window.lucide) lucide.createIcons();
    }
  } else {
    feedback.className = 'text-xs font-semibold p-3 rounded-xl bg-red-50 text-red-900 border border-red-200';
    feedback.textContent = `Not quite! ${quest.hint}`;
    feedback.classList.remove('hidden');
  }
}

function claimTriviaQuestReward() {
  if (!currentModalQuest) return;
  const { quest } = currentModalQuest;
  completeActiveQuest(`Answered Ranger Riddle correctly: "${quest.options[quest.correctIndex]}"`);
}

function updateStewardButton() {
  const checks = Array.from(document.querySelectorAll('.steward-check'));
  const allChecked = checks.length > 0 && checks.every(c => c.checked);
  const btn = document.getElementById('steward-submit-btn');
  if (!btn) return;
  if (allChecked) {
    btn.disabled = false;
    btn.classList.remove('opacity-40', 'cursor-not-allowed');
  } else {
    btn.disabled = true;
    btn.classList.add('opacity-40', 'cursor-not-allowed');
  }
}

function submitStewardshipQuest() {
  completeActiveQuest('Completed all Leave No Trace & 36 CFR conservation pledges.');
}

let selectedExperienceMood = '';
function toggleExperienceMood(btn, mood) {
  document.querySelectorAll('.exp-mood-chip').forEach(el => {
    el.classList.remove('bg-forest', 'text-white', 'border-forest');
    el.classList.add('bg-parchment', 'text-forest', 'border-parchmentDark');
  });
  if (selectedExperienceMood === mood) {
    selectedExperienceMood = '';
  } else {
    selectedExperienceMood = mood;
    btn.classList.remove('bg-parchment', 'text-forest', 'border-parchmentDark');
    btn.classList.add('bg-forest', 'text-white', 'border-forest');
  }
}

function updateExperienceButton() {
  const input = document.getElementById('experience-story-input');
  const countEl = document.getElementById('experience-char-count');
  const btn = document.getElementById('experience-submit-btn');
  if (!input || !btn) return;
  const len = input.value.trim().length;
  if (countEl) countEl.textContent = len >= 15 ? `${len} chars ✓` : `${len} / 15 min chars`;
  btn.disabled = len < 15;
  if (len >= 15) {
    btn.classList.remove('opacity-40', 'cursor-not-allowed');
  } else {
    btn.classList.add('opacity-40', 'cursor-not-allowed');
  }
}

function submitExperienceQuest() {
  const input = document.getElementById('experience-story-input');
  const text = (input ? input.value : '').trim();
  if (text.length < 15) {
    showToast('Please write at least 15 characters describing your park experience.', 'error');
    return;
  }
  const tag = selectedExperienceMood ? `[${selectedExperienceMood}] ` : '';
  selectedExperienceMood = '';
  completeActiveQuest(`${tag}${text}`);
}

// ---------------------------------------------------------
// QUEST COMPLETION, XP & BADGE UNLOCKING
// ---------------------------------------------------------
function completeActiveQuest(journalNote) {
  if (!requireSignInForQuestAction()) return;
  if (!currentModalQuest) return;
  const { park, quest } = currentModalQuest;

  if (!appState.completedQuests.includes(quest.id)) {
    const oldRank = getRankInfo(appState.xp).current.level;
    appState.completedQuests.push(quest.id);
    appState.xp += quest.xp;
    const newRank = getRankInfo(appState.xp).current;

    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    appState.journalEntries.push({
      questId: quest.id,
      parkName: `${park.name} (${park.state})`,
      questTitle: quest.title,
      xp: quest.xp,
      note: journalNote,
      timestamp: now
    });

    const newlyUnlocked = [];
    BADGES_DATA.forEach(badge => {
      const alreadyHas = appState.unlockedBadges.some(b => b.id === badge.id);
      if (!alreadyHas && badge.check(appState)) {
        appState.unlockedBadges.push({ id: badge.id, timestamp: now });
        newlyUnlocked.push(badge);
      }
    });

    saveState();
    if (window.ParkQuestCloud) {
      window.ParkQuestCloud.recordQuestCompletion(quest.id, park.id, quest.xp);
    }
    closeQuestModal();
    renderAll();

    showToast(`Quest Complete! +${quest.xp} XP earned in ${park.name}.`, 'success');
    if (newRank.level > oldRank) {
      setTimeout(() => showToast(`🎉 Promoted to Level ${newRank.level}: ${newRank.title}!`, 'badge'), 900);
    }
    newlyUnlocked.forEach((b, idx) => {
      setTimeout(() => showToast(`🏅 New Embroidered Patch Unlocked: ${b.title}!`, 'badge'), 1600 + idx * 1000);
    });
  } else {
    closeQuestModal();
  }
}

// ---------------------------------------------------------
// UNDO QUEST COMPLETION
// ---------------------------------------------------------
function undoQuest(questId) {
  if (!requireSignInForQuestAction('Please sign in first to modify quest progress.')) return;
  if (!appState.completedQuests.includes(questId)) return;

  // Find the quest data to get its XP value
  let questXp = 0;
  let questTitle = '';
  for (const park of PARKS_DATA) {
    const q = park.quests.find(q => q.id === questId);
    if (q) { questXp = q.xp; questTitle = q.title; break; }
  }

  // Remove from completed quests
  appState.completedQuests = appState.completedQuests.filter(id => id !== questId);

  // Subtract XP (clamp to 0)
  appState.xp = Math.max(0, appState.xp - questXp);

  // Remove journal entry — match by questId first, fall back to questTitle for legacy entries
  const journalIdx = appState.journalEntries.findIndex(e => e.questId === questId);
  if (journalIdx !== -1) {
    appState.journalEntries.splice(journalIdx, 1);
  } else {
    const fallbackIdx = appState.journalEntries.findIndex(e => e.questTitle === questTitle);
    if (fallbackIdx !== -1) appState.journalEntries.splice(fallbackIdx, 1);
  }

  // Re-evaluate badges — remove any whose check() now fails
  appState.unlockedBadges = appState.unlockedBadges.filter(ub => {
    const badge = BADGES_DATA.find(b => b.id === ub.id);
    return badge && badge.check(appState);
  });

  saveState();
  if (window.ParkQuestCloud) {
    window.ParkQuestCloud.recordQuestUndo(questId, questXp);
  }
  renderAll();
  showToast(`Quest undone: "${questTitle}" — ${questXp} XP removed.`, 'info');
}

// ---------------------------------------------------------
// TOAST & RESET MODAL HELPERS
// ---------------------------------------------------------
function showToast(message, variant = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');

  const colors = {
    success: 'bg-forest text-white border-sage',
    badge: 'bg-amberRust text-white border-amber-300',
    info: 'bg-slateInk text-white border-slate-600',
    error: 'bg-red-800 text-white border-red-400'
  };

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-2 opacity-0 ${colors[variant] || colors.info}`;
  toast.innerHTML = `
    <i data-lucide="${variant === 'badge' ? 'award' : variant === 'success' ? 'check-circle-2' : variant === 'error' ? 'alert-circle' : 'info'}" class="w-5 h-5 shrink-0"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 350);
  }, 4200);
}

function openResetModal() {
  const m = document.getElementById('reset-modal');
  if (m) {
    m.classList.remove('hidden');
    m.classList.add('flex');
  }
}

function closeResetModal() {
  const m = document.getElementById('reset-modal');
  if (m) {
    m.classList.add('hidden');
    m.classList.remove('flex');
  }
}

function confirmResetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  appState = {
    termsAccepted: true,
    localGpsOnly: true,
    userGps: null,
    directorySort: 'default',
    activeParkId: 'chiricahua',
    mapSelectedParkId: 'chiricahua',
    mapStatusFilter: 'all',
    mapSearch: '',
    mapFocus: 'all',
    activeFilter: 'all',
    activeView: 'directory',
    directoryRegion: 'All 64 Parks',
    directoryState: 'ALL',
    directoryStatus: 'all',
    directorySearch: '',
    passportFilter: 'all',
    passportSearch: '',
    xp: 0,
    completedQuests: [],
    unlockedBadges: [],
    offlinePacks: [],
    journalEntries: []
  };
  saveState();
  closeResetModal();
  switchMainView('directory');
  renderAll();
  showToast('Demo progress has been reset to Level 1: Trailhead Rookie.', 'info');
}

// ---------------------------------------------------------
// INTERACTIVE 64-PARK CARTOGRAPHIC QUEST MAP
// ---------------------------------------------------------
let mapViewBox = { x: 0, y: 0, w: 1000, h: 620 };
let mapPanState = { dragging: false, startX: 0, startY: 0, startVbX: 0, startVbY: 0, moved: false };

function projectContiguousUS(lat, lon) {
  const rad = Math.PI / 180;
  const phi1 = 29.5 * rad;
  const phi2 = 45.5 * rad;
  const phi0 = 37.5 * rad;
  const lam0 = -96.0 * rad;

  const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
  const C = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
  const rho0 = Math.sqrt(Math.max(0, C - 2 * n * Math.sin(phi0))) / n;

  const phi = lat * rad;
  const lam = lon * rad;
  const theta = n * (lam - lam0);
  const rho = Math.sqrt(Math.max(0, C - 2 * n * Math.sin(phi))) / n;

  const xRaw = rho * Math.sin(theta);
  const yRaw = rho0 - rho * Math.cos(theta);

  return {
    x: 500 + xRaw * 1000,
    y: 235 - yRaw * 1000
  };
}

function projectAlaska(lat, lon) {
  // Maps AK (lat 54..71.5, lon -169..-130) into inset box x: 25..260, y: 465..598
  const x = 25 + ((lon - (-169)) / ( -130 - (-169) )) * 235;
  const y = 598 - ((lat - 54) / (71.5 - 54)) * 133;
  return { x, y };
}

function projectHawaii(lat, lon) {
  // Maps HI (lat 18.8..22.5, lon -160.5..-154.5) into inset box x: 285..445, y: 472..595
  const x = 285 + ((lon - (-160.5)) / (-154.5 - (-160.5))) * 160;
  const y = 595 - ((lat - 18.8) / (22.5 - 18.8)) * 123;
  return { x, y };
}

function projectParkToMap(park) {
  if (park.state === 'AK') return projectAlaska(park.lat, park.lon);
  if (park.state === 'HI') return projectHawaii(park.lat, park.lon);
  if (park.id === 'virginislands') return { x: 545, y: 538 };
  if (park.id === 'americansamoa') return { x: 725, y: 538 };
  return projectContiguousUS(park.lat, park.lon);
}

function projectPointsToSvgPath(points, projector) {
  const pts = points.map(pt => projector(pt[0], pt[1]));
  const n = pts.length;
  if (n < 3) return '';
  const tension = 0.28;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
}

const US_OUTLINE_COORDS = [
  [48.38, -124.73], [48.99, -122.75], [49.00, -117.03], [49.00, -110.00], [49.00, -104.05],
  [49.00, -97.23], [49.37, -95.15], [48.60, -93.30], [48.00, -89.50], [46.50, -84.35],
  [45.80, -83.50], [43.00, -82.42], [41.70, -83.45], [41.50, -81.70], [42.88, -78.90],
  [43.65, -76.20], [45.01, -74.75], [45.01, -71.50], [47.46, -69.22], [47.18, -67.79],
  [44.81, -66.95], [43.66, -70.25], [42.36, -71.05], [41.67, -69.95], [41.30, -71.85],
  [40.60, -74.00], [38.93, -74.96], [37.00, -75.95], [35.22, -75.53], [33.85, -77.95],
  [32.08, -80.85], [30.71, -81.45], [27.50, -80.30], [25.15, -80.25], [24.55, -81.78],
  [25.80, -81.50], [27.95, -82.80], [29.90, -84.30], [30.30, -87.45], [29.10, -89.25],
  [29.75, -93.85], [27.80, -97.05], [25.95, -97.15], [26.40, -99.10], [29.30, -100.90],
  [29.00, -103.10], [31.78, -106.50], [31.33, -108.21], [31.33, -111.05], [32.49, -114.81],
  [32.53, -117.12], [34.02, -118.50], [34.45, -120.47], [36.60, -121.90], [37.80, -122.52],
  [40.44, -124.41], [42.00, -124.21], [46.25, -124.05], [47.90, -124.65]
];

const AK_OUTLINE_COORDS = [
  [71.39, -156.48], [70.20, -148.00], [69.65, -141.00], [60.30, -141.00], [59.45, -135.30],
  [55.35, -131.65], [54.70, -132.80], [57.05, -135.33], [59.55, -139.75], [60.50, -145.75],
  [59.80, -149.40], [58.20, -154.20], [55.20, -162.70], [57.20, -158.50], [58.90, -157.00],
  [60.00, -162.50], [61.80, -166.10], [63.40, -162.00], [64.50, -165.40], [65.60, -168.00],
  [66.90, -162.60], [68.35, -166.75], [70.65, -160.00]
];

const HI_ISLANDS_COORDS = [
  [[22.22, -159.50], [22.10, -159.30], [21.88, -159.45], [22.05, -159.75]], // Kauai
  [[21.70, -157.98], [21.45, -157.65], [21.26, -157.85], [21.45, -158.20]], // Oahu
  [[20.98, -156.68], [20.75, -156.00], [20.62, -156.35], [20.85, -156.69]], // Maui
  [[20.26, -155.85], [19.72, -155.05], [19.00, -155.68], [19.55, -156.02]]  // Hawaii Big Island
];

function applyMapViewBox() {
  const svg = document.getElementById('parks-interactive-map');
  if (!svg) return;
  svg.setAttribute('viewBox', `${mapViewBox.x.toFixed(1)} ${mapViewBox.y.toFixed(1)} ${mapViewBox.w.toFixed(1)} ${mapViewBox.h.toFixed(1)}`);
}

function setMapFocus(focus) {
  appState.mapFocus = focus;
  const presets = {
    all: { x: 0, y: 0, w: 1000, h: 620 },
    contiguous: { x: 40, y: 15, w: 920, h: 455 },
    alaska: { x: 10, y: 448, w: 265, h: 165 },
    islands: { x: 270, y: 448, w: 550, h: 165 }
  };
  mapViewBox = { ...(presets[focus] || presets.all) };
  applyMapViewBox();

  ['all', 'contiguous', 'alaska', 'islands'].forEach(key => {
    const btn = document.getElementById(`map-focus-${key}`);
    if (!btn) return;
    if (key === focus) {
      btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-forest text-white';
    } else {
      btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slateInk/75 hover:bg-parchmentDark border border-parchmentDark';
    }
  });
  renderParkMap();
}

function zoomMap(factor) {
  const newW = Math.max(180, Math.min(1000, mapViewBox.w / factor));
  const newH = (newW / 1000) * 620;
  const cx = mapViewBox.x + mapViewBox.w / 2;
  const cy = mapViewBox.y + mapViewBox.h / 2;
  mapViewBox.w = newW;
  mapViewBox.h = newH;
  mapViewBox.x = Math.max(-40, Math.min(1040 - newW, cx - newW / 2));
  mapViewBox.y = Math.max(-30, Math.min(650 - newH, cy - newH / 2));
  applyMapViewBox();
}

function setMapStatusFilter(status) {
  appState.mapStatusFilter = status;
  ['all', 'unexplored', 'inprogress', 'mastered'].forEach(key => {
    const btn = document.getElementById(`map-filter-${key}`);
    if (!btn) return;
    if (key === status) {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-forest text-white whitespace-nowrap';
    } else {
      btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold bg-parchment text-slateInk/75 hover:bg-parchmentDark whitespace-nowrap';
    }
  });
  renderParkMap();
}

function setMapSearch(val) {
  appState.mapSearch = val;
  renderParkMap();
}

function selectMapPark(parkId) {
  appState.mapSelectedParkId = parkId;
  renderParkMap();
  renderMapInspector();
  if (window.lucide) lucide.createIcons();
}

function acquireMapGps() {
  const btn = document.getElementById('map-locate-btn');
  if (btn) btn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span class="hidden sm:inline">Locating...</span>`;
  if (window.lucide) lucide.createIcons();

  requestUserGps(
    () => {
      if (btn) btn.innerHTML = `<i data-lucide="crosshair" class="w-3.5 h-3.5"></i><span class="hidden sm:inline">GPS Active</span>`;
      renderParkMap();
      renderMapInspector();
      renderDirectoryView();
      if (window.lucide) lucide.createIcons();
      showToast('GPS position plotted on the 64-Park Atlas!', 'success');
    },
    (errMsg) => {
      if (btn) btn.innerHTML = `<i data-lucide="crosshair" class="w-3.5 h-3.5"></i><span class="hidden sm:inline">Locate Me</span>`;
      if (window.lucide) lucide.createIcons();
      showToast(`Could not acquire GPS: ${errMsg}`, 'info');
    }
  );
}

function showMapTooltip(evt, parkId) {
  const park = PARKS_DATA.find(p => p.id === parkId);
  const tip = document.getElementById('map-hover-tooltip');
  const wrapper = document.getElementById('map-canvas-wrapper');
  if (!park || !tip || !wrapper) return;

  const doneCount = park.quests.filter(q => appState.completedQuests.includes(q.id)).length;
  const totalCount = park.quests.length;
  const statusLabel = doneCount === totalCount ? '★ Mastered' : doneCount > 0 ? 'In Progress' : 'Unexplored';
  const statusColor = doneCount === totalCount ? 'text-amber-300' : doneCount > 0 ? 'text-emerald-300' : 'text-parchment/75';

  tip.innerHTML = `
    <div class="font-bold text-white leading-snug">${park.name} <span class="text-amber-300 font-normal">(${park.state})</span></div>
    <div class="flex items-center justify-between gap-3 mt-1 text-[11px]">
      <span class="${statusColor} font-semibold">${statusLabel}</span>
      <span class="font-mono text-white/90">${doneCount}/${totalCount} Quests</span>
    </div>
  `;
  tip.classList.remove('hidden');

  const rect = wrapper.getBoundingClientRect();
  let left = evt.clientX - rect.left + 14;
  let top = evt.clientY - rect.top - 12;
  if (left + 210 > rect.width) left = evt.clientX - rect.left - 205;
  if (top < 8) top = 8;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function hideMapTooltip() {
  const tip = document.getElementById('map-hover-tooltip');
  if (tip) tip.classList.add('hidden');
}

function renderParkMap() {
  const svg = document.getElementById('parks-interactive-map');
  if (!svg) return;

  // Update summary stats
  let masteredCount = 0;
  let inProgressCount = 0;
  let unexploredCount = 0;
  PARKS_DATA.forEach(p => {
    const freeDone = p.quests.filter(q => !q.isPremium && appState.completedQuests.includes(q.id)).length;
    const totalDone = p.quests.filter(q => appState.completedQuests.includes(q.id)).length;
    if (freeDone >= 12) masteredCount++;
    else if (totalDone > 0) inProgressCount++;
    else unexploredCount++;
  });

  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setTxt('map-stat-mastered', masteredCount);
  setTxt('map-stat-inprogress', inProgressCount);
  setTxt('map-stat-unexplored', unexploredCount);
  setTxt('map-stat-quests', `${appState.completedQuests.length}/${PARKS_DATA.length * 20}`);

  const usPath = projectPointsToSvgPath(US_OUTLINE_COORDS, projectContiguousUS);
  const akPath = projectPointsToSvgPath(AK_OUTLINE_COORDS, projectAlaska);
  const hiPaths = HI_ISLANDS_COORDS.map(isl => projectPointsToSvgPath(isl, projectHawaii)).join(' ');

  // Graticule lines for Contiguous US
  const latLines = [30, 35, 40, 45].map(lat => {
    const pts = [];
    for (let lon = -125; lon <= -67; lon += 2) pts.push(projectContiguousUS(lat, lon));
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return `<path d="${d}" fill="none" stroke="#1B4332" stroke-opacity="0.08" stroke-width="0.8" stroke-dasharray="4 4"/>`;
  }).join('');

  const lonLines = [-120, -110, -100, -90, -80, -70].map(lon => {
    const pts = [];
    for (let lat = 25; lat <= 49; lat += 2) pts.push(projectContiguousUS(lat, lon));
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return `<path d="${d}" fill="none" stroke="#1B4332" stroke-opacity="0.08" stroke-width="0.8" stroke-dasharray="4 4"/>`;
  }).join('');

  const query = (appState.mapSearch || '').trim().toLowerCase();
  const selectedId = appState.mapSelectedParkId || appState.activeParkId;
  const showLabels = mapViewBox.w < 620;

  // Render park pins (draw selected park last so it sits on top)
  const orderedParks = [...PARKS_DATA].sort((a, b) => (a.id === selectedId ? 1 : b.id === selectedId ? -1 : 0));

  const pinsMarkup = orderedParks.map(park => {
    const pt = projectParkToMap(park);
    const doneCount = park.quests.filter(q => appState.completedQuests.includes(q.id)).length;
    const freeDone = park.quests.filter(q => !q.isPremium && appState.completedQuests.includes(q.id)).length;
    const isMastered = freeDone >= 12;
    const isInProgress = doneCount > 0 && !isMastered;
    const isSelected = park.id === selectedId;

    let matchesFilter = true;
    if (appState.mapStatusFilter === 'unexplored') matchesFilter = doneCount === 0;
    else if (appState.mapStatusFilter === 'inprogress') matchesFilter = isInProgress;
    else if (appState.mapStatusFilter === 'mastered') matchesFilter = isMastered;

    const matchesSearch = !query ||
      park.name.toLowerCase().includes(query) ||
      park.state.toLowerCase().includes(query) ||
      park.region.toLowerCase().includes(query);

    const isMatch = matchesFilter && matchesSearch;
    const opacity = isMatch ? '1' : '0.22';

    const fill = isMastered ? '#F59E0B' : isInProgress ? '#10B981' : '#1B4332';
    const stroke = isSelected ? '#FBBF24' : isMastered ? '#FEF3C7' : '#FFFFFF';
    const radius = isSelected ? 8.5 : isMastered ? 7.5 : 6.5;

    return `
      <g class="map-park-pin" opacity="${opacity}"
         onclick="selectMapPark('${park.id}')"
         onmousemove="showMapTooltip(event, '${park.id}')"
         onmouseleave="hideMapTooltip()">
        ${isSelected ? `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="12" fill="none" stroke="#D97706" stroke-width="2.5" class="map-pin-selected-ring"/>` : ''}
        <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${isSelected ? 2.5 : 1.8}"/>
        ${isMastered
          ? `<text x="${pt.x.toFixed(1)}" y="${(pt.y + 3).toFixed(1)}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#FFFFFF" pointer-events="none">★</text>`
          : isInProgress
            ? `<text x="${pt.x.toFixed(1)}" y="${(pt.y + 3).toFixed(1)}" text-anchor="middle" font-size="8" font-weight="800" fill="#FFFFFF" pointer-events="none">${doneCount}</text>`
            : ''
        }
        ${(isSelected || (showLabels && isMatch) || (query && isMatch))
          ? `<text x="${pt.x.toFixed(1)}" y="${(pt.y - radius - 4).toFixed(1)}" text-anchor="middle" font-size="${isSelected ? 10 : 8.5}" font-weight="700" fill="#1B4332" stroke="#F8F5EE" stroke-width="2.5" paint-order="stroke" pointer-events="none">${park.shortName}</text>`
          : ''
        }
      </g>
    `;
  }).join('');

  // Optional live user GPS marker
  let userGpsMarker = '';
  if (appState.userGps && typeof appState.userGps.lat === 'number') {
    const { lat, lon } = appState.userGps;
    let userPt = null;
    if (lat >= 54 && lat <= 72 && lon >= -170 && lon <= -129) {
      userPt = projectAlaska(lat, lon);
    } else if (lat >= 18 && lat <= 23 && lon >= -161 && lon <= -154) {
      userPt = projectHawaii(lat, lon);
    } else if (lat >= 24 && lat <= 50 && lon >= -126 && lon <= -66) {
      userPt = projectContiguousUS(lat, lon);
    }
    if (userPt) {
      userGpsMarker = `
        <g pointer-events="none">
          <circle cx="${userPt.x.toFixed(1)}" cy="${userPt.y.toFixed(1)}" r="14" fill="#0EA5E9" fill-opacity="0.25" class="map-pin-selected-ring"/>
          <circle cx="${userPt.x.toFixed(1)}" cy="${userPt.y.toFixed(1)}" r="6" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
          <text x="${userPt.x.toFixed(1)}" y="${(userPt.y + 16).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="800" fill="#0369A1" stroke="#FFFFFF" stroke-width="2.5" paint-order="stroke">YOU</text>
        </g>
      `;
    }
  }

  svg.innerHTML = `
    <defs>
      <linearGradient id="mapOceanBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e4eee9"/>
        <stop offset="100%" stop-color="#d5e5dd"/>
      </linearGradient>
      <filter id="landShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#1B4332" flood-opacity="0.14"/>
      </filter>
    </defs>

    <!-- Ocean / Background -->
    <rect x="-200" y="-200" width="1400" height="1020" fill="url(#mapOceanBg)"/>

    <!-- Lat/Lon Graticule -->
    <g>${latLines}${lonLines}</g>

    <!-- Contiguous U.S. Landmass -->
    <path d="${usPath}" fill="#F8F5EE" stroke="#2D6A4F" stroke-width="1.6" stroke-linejoin="round" filter="url(#landShadow)"/>

    <!-- Alaska Inset Box -->
    <g>
      <rect x="18" y="452" width="250" height="154" rx="14" fill="#dfece5" stroke="#2D6A4F" stroke-opacity="0.35" stroke-width="1.2"/>
      <text x="28" y="468" font-size="10" font-weight="800" fill="#1B4332" letter-spacing="0.06em">ALASKA (8 PARKS)</text>
      <path d="${akPath}" fill="#F8F5EE" stroke="#2D6A4F" stroke-width="1.3" stroke-linejoin="round"/>
    </g>

    <!-- Hawaii Inset Box -->
    <g>
      <rect x="278" y="452" width="174" height="154" rx="14" fill="#dfece5" stroke="#2D6A4F" stroke-opacity="0.35" stroke-width="1.2"/>
      <text x="288" y="468" font-size="10" font-weight="800" fill="#1B4332" letter-spacing="0.06em">HAWAII (2)</text>
      <path d="${hiPaths}" fill="#F8F5EE" stroke="#2D6A4F" stroke-width="1.3" stroke-linejoin="round"/>
    </g>

    <!-- U.S. Virgin Islands Inset Box -->
    <g>
      <rect x="462" y="452" width="166" height="154" rx="14" fill="#dfece5" stroke="#2D6A4F" stroke-opacity="0.35" stroke-width="1.2"/>
      <text x="472" y="468" font-size="10" font-weight="800" fill="#1B4332" letter-spacing="0.06em">VIRGIN ISLANDS (1)</text>
      <path d="M510,534 Q525,522 544,528 Q562,535 574,527 Q580,540 562,548 Q540,550 515,544 Z" fill="#F8F5EE" stroke="#2D6A4F" stroke-width="1.3"/>
    </g>

    <!-- American Samoa Inset Box -->
    <g>
      <rect x="638" y="452" width="166" height="154" rx="14" fill="#dfece5" stroke="#2D6A4F" stroke-opacity="0.35" stroke-width="1.2"/>
      <text x="648" y="468" font-size="10" font-weight="800" fill="#1B4332" letter-spacing="0.06em">AMERICAN SAMOA (1)</text>
      <path d="M690,538 Q712,524 736,530 Q758,536 762,546 Q742,554 714,550 Q694,548 690,538 Z" fill="#F8F5EE" stroke="#2D6A4F" stroke-width="1.3"/>
    </g>

    <!-- Decorative Compass Rose -->
    <g transform="translate(905, 530)" opacity="0.65" pointer-events="none">
      <circle cx="0" cy="0" r="34" fill="none" stroke="#1B4332" stroke-width="1" stroke-dasharray="2 3"/>
      <polygon points="0,-30 6,-6 0,-11 -6,-6" fill="#D97706"/>
      <polygon points="0,30 6,6 0,11 -6,6" fill="#1B4332"/>
      <polygon points="-30,0 -6,-6 -11,0 -6,6" fill="#1B4332"/>
      <polygon points="30,0 6,-6 11,0 6,6" fill="#1B4332"/>
      <text x="0" y="-36" text-anchor="middle" font-size="10" font-weight="800" fill="#1B4332">N</text>
    </g>

    <!-- 64 Park Pins -->
    <g>${pinsMarkup}</g>

    <!-- Live User GPS -->
    ${userGpsMarker}
  `;

  renderMapInspector();
}

function renderMapInspector() {
  const panel = document.getElementById('map-quest-inspector');
  if (!panel) return;

  const park = PARKS_DATA.find(p => p.id === (appState.mapSelectedParkId || appState.activeParkId)) || PARKS_DATA[0];
  const doneCount = park.quests.filter(q => appState.completedQuests.includes(q.id)).length;
  const totalCount = park.quests.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  const earnedXp = park.quests.reduce((s, q) => s + (appState.completedQuests.includes(q.id) ? q.xp : 0), 0);
  const totalXp = park.quests.reduce((s, q) => s + q.xp, 0);
  const isOfflineReady = appState.offlinePacks.includes(park.id);

  let distText = '';
  if (appState.userGps && typeof park.lat === 'number') {
    const d = calculateDistance(appState.userGps.lat, appState.userGps.lon, park.lat, park.lon);
    distText = `<span class="inline-flex items-center gap-1 bg-black/45 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300"><i data-lucide="navigation" class="w-2.5 h-2.5"></i> ${formatDistance(d.miles, d.km)}</span>`;
  }

  panel.innerHTML = `
    <div class="relative h-40 bg-gradient-to-br ${park.gradient} p-5 text-white overflow-hidden flex flex-col justify-between">
      <img src="images/${park.id}.jpg" alt="${park.name}" class="absolute inset-0 w-full h-full object-cover opacity-55" onerror="this.style.display='none'" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15 pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between gap-2">
        <span class="inline-flex items-center gap-1 bg-black/45 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/15">
          <i data-lucide="map-pin" class="w-3 h-3 text-amber-400"></i> ${park.state} • ${park.biome}
        </span>
        ${distText}
      </div>

      <div class="relative z-10">
        <h3 class="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-sm">${park.name} National Park</h3>
        <p class="text-[11px] text-white/85 font-mono mt-0.5">${park.coords} • ${park.elevation}</p>
      </div>
    </div>

    <div class="p-4 sm:p-5 space-y-4">
      <!-- Park Progress Bar -->
      <div class="bg-parchment rounded-2xl p-3 border border-parchmentDark">
        <div class="flex items-center justify-between text-xs font-bold mb-1.5">
          <span class="text-forest">${doneCount} / ${totalCount} Quests Complete</span>
          <span class="text-amberRust">${earnedXp} / ${totalXp} XP</span>
        </div>
        <div class="w-full h-2 bg-white rounded-full overflow-hidden border border-parchmentDark">
          <div class="h-full bg-gradient-to-r from-pine to-amberRust rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      </div>

      <!-- Interactive Quests for Selected Park -->
      <div class="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
        <div class="text-[11px] font-bold uppercase tracking-wider text-slateInk/55 px-1">Interactive Park Quests (12 Free • 8 Pro)</div>
        ${park.quests.map(quest => {
          const isCompleted = appState.completedQuests.includes(quest.id);
          const unlocked = isQuestUnlocked(quest, park.id);
          const meta = getCategoryMeta(quest.type);
          return `
            <div class="rounded-2xl p-3 border transition-all ${isCompleted ? 'bg-emerald-50/50 border-sage/60' : !unlocked ? 'bg-amber-50/20 border-amberRust/30' : 'bg-parchment/40 border-parchmentDark hover:border-pine/50'}">
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg}">
                  <i data-lucide="${meta.icon}" class="w-3 h-3"></i>
                  ${meta.label}
                </span>
                <div class="flex items-center gap-1">
                  ${quest.isPremium ? `<span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${unlocked ? 'bg-emerald-100 text-forest' : 'bg-amberRust text-white'}">${unlocked ? 'PRO' : quest.price || '$1.99'}</span>` : ''}
                  <span class="text-[11px] font-extrabold text-amberRust">+${quest.xp} XP</span>
                </div>
              </div>
              <div class="font-serif font-bold text-sm text-forest leading-snug">${quest.title}</div>
              <p class="text-[11px] text-slateInk/70 mt-0.5 line-clamp-2">${quest.description}</p>
              <div class="mt-2.5 flex items-center justify-between gap-2">
                ${isCompleted
                  ? `<span class="inline-flex items-center gap-1 text-xs font-bold text-pine">
                       <i data-lucide="check-circle-2" class="w-4 h-4"></i> Accomplished
                     </span>
                     <button onclick="undoQuest('${quest.id}')" class="text-[11px] font-semibold text-slateInk/55 hover:text-red-700 underline flex items-center gap-1">
                       <i data-lucide="rotate-ccw" class="w-3 h-3"></i> Undo
                     </button>`
                  : !unlocked
                    ? `<button onclick="openPremiumUnlockModal('${park.id}', '${quest.id}')"
                         class="w-full py-2 px-3 rounded-xl bg-amberRust hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer">
                         <i data-lucide="lock" class="w-3.5 h-3.5 text-amber-100"></i>
                         <span>Unlock Pro (${quest.price || '$1.99'})</span>
                       </button>`
                    : `<button onclick="openQuestModal('${quest.id}')"
                         class="w-full py-2 px-3 rounded-xl bg-forest hover:bg-pine text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer">
                         <i data-lucide="${meta.icon}" class="w-3.5 h-3.5 text-amber-400"></i>
                         <span>${meta.btnText}</span>
                       </button>`
                }
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer Actions -->
      <div class="pt-2 border-t border-parchmentDark flex items-center gap-2">
        <button onclick="downloadOfflineFromDirectory('${park.id}')"
          class="px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 ${
            isOfflineReady ? 'bg-emerald-50 border-sage text-forest' : 'bg-parchment hover:bg-parchmentDark border-parchmentDark text-slateInk'
          }">
          <i data-lucide="${isOfflineReady ? 'check-circle-2' : 'download-cloud'}" class="w-4 h-4 ${isOfflineReady ? 'text-pine' : 'text-amberRust'}"></i>
          <span>${isOfflineReady ? 'Cached' : park.offlineSize}</span>
        </button>
        <button onclick="enterParkQuests('${park.id}')"
          class="flex-1 py-2.5 px-4 rounded-xl bg-amberRust hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all">
          <span>Open Full Park Page</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  `;
}

function initMapPanAndZoom() {
  const svg = document.getElementById('parks-interactive-map');
  if (!svg || svg.dataset.panInit) return;
  svg.dataset.panInit = '1';

  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.18 : 0.85;
    zoomMap(factor);
  }, { passive: false });

  svg.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.map-park-pin')) return;
    mapPanState.dragging = true;
    mapPanState.startX = e.clientX;
    mapPanState.startY = e.clientY;
    mapPanState.startVbX = mapViewBox.x;
    mapPanState.startVbY = mapViewBox.y;
    svg.setPointerCapture(e.pointerId);
  });

  svg.addEventListener('pointermove', (e) => {
    if (!mapPanState.dragging) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dx = (e.clientX - mapPanState.startX) * (mapViewBox.w / rect.width);
    const dy = (e.clientY - mapPanState.startY) * (mapViewBox.h / rect.height);
    mapViewBox.x = Math.max(-60, Math.min(1060 - mapViewBox.w, mapPanState.startVbX - dx));
    mapViewBox.y = Math.max(-40, Math.min(660 - mapViewBox.h, mapPanState.startVbY - dy));
    applyMapViewBox();
  });

  const endDrag = () => { mapPanState.dragging = false; };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
}

// ---------------------------------------------------------
// PAID / PRO QUEST UNLOCK SYSTEM
// ---------------------------------------------------------
function openPremiumUnlockModal(parkId, questId) {
  if (!requireSignInForQuestAction('Please sign in first (free — no payment required to sign in).')) return;
  const park = PARKS_DATA.find(p => p.id === parkId) || PARKS_DATA[0];
  const quest = questId ? park.quests.find(q => q.id === questId) : null;
  const body = document.getElementById('premium-unlock-body');
  const modal = document.getElementById('premium-unlock-modal');
  if (!body || !modal) return;

  body.innerHTML = `
    <div class="bg-parchment rounded-2xl p-3.5 border border-parchmentDark text-xs space-y-1">
      <div class="font-bold text-forest">${park.name} National Park (${park.state})</div>
      <p class="text-slateInk/75">Every park includes <strong>12 free quests</strong>. Unlock the 8 extra Pro quests below for bonus XP and expedition challenges.</p>
    </div>

    <div class="space-y-2.5">
      ${quest ? `
        <button onclick="unlockSingleQuest('${quest.id}')"
          class="w-full text-left p-3.5 rounded-2xl border-2 border-parchmentDark hover:border-amberRust bg-white transition-all flex items-center justify-between gap-3 cursor-pointer">
          <div>
            <div class="font-bold text-sm text-forest">Unlock This Quest Only</div>
            <div class="text-xs text-slateInk/70">${quest.title} (+${quest.xp} XP)</div>
          </div>
          <span class="px-3 py-1.5 rounded-xl bg-amberRust text-white font-extrabold text-xs shrink-0">${quest.price || '$1.99'}</span>
        </button>
      ` : ''}

      <button onclick="unlockParkProPack('${park.id}')"
        class="w-full text-left p-3.5 rounded-2xl border-2 border-amberRust bg-amber-50/50 hover:bg-amber-50 transition-all flex items-center justify-between gap-3 cursor-pointer">
        <div>
          <div class="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amberRust">Best for 1 Park</div>
          <div class="font-bold text-sm text-forest">Unlock All 8 Pro Quests in ${park.shortName}</div>
          <div class="text-xs text-slateInk/70">Includes all 8 expedition, funny photo &amp; essay quests</div>
        </div>
        <span class="px-3 py-1.5 rounded-xl bg-amberRust text-white font-extrabold text-xs shrink-0">$4.99</span>
      </button>

      <button onclick="unlockAllParksPro()"
        class="w-full text-left p-3.5 rounded-2xl border-2 border-forest bg-forest/5 hover:bg-forest/10 transition-all flex items-center justify-between gap-3 cursor-pointer">
        <div>
          <div class="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-pine">All 64 Parks • 512 Pro Quests</div>
          <div class="font-bold text-sm text-forest">Grand Naturalist All-Access Pro Pass</div>
          <div class="text-xs text-slateInk/70">Unlocks every paid quest across all 64 National Parks</div>
        </div>
        <span class="px-3 py-1.5 rounded-xl bg-forest text-white font-extrabold text-xs shrink-0">$19.99</span>
      </button>
    </div>

    <p class="text-[11px] text-slateInk/55 text-center">Demo Storefront: Clicking an option immediately unlocks the quests for your current email account (${appState.userEmail}).</p>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function closePremiumUnlockModal() {
  const modal = document.getElementById('premium-unlock-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function unlockSingleQuest(questId) {
  if (!appState.unlockedPremiumQuests.includes(questId)) {
    appState.unlockedPremiumQuests.push(questId);
  }
  saveState();
  closePremiumUnlockModal();
  renderAll();
  showToast('Pro Quest unlocked! You can now start and earn bonus XP.', 'success');
}

function unlockParkProPack(parkId) {
  if (!appState.unlockedPremiumParks.includes(parkId)) {
    appState.unlockedPremiumParks.push(parkId);
  }
  const park = PARKS_DATA.find(p => p.id === parkId);
  saveState();
  closePremiumUnlockModal();
  renderAll();
  showToast(`Unlocked all 8 Pro Quests for ${park ? park.name : parkId}!`, 'success');
}

function unlockAllParksPro() {
  appState.allAccessPro = true;
  saveState();
  closePremiumUnlockModal();
  renderAll();
  showToast('Grand Naturalist All-Access Pro Pass activated across all 64 parks!', 'badge');
}

// ---------------------------------------------------------
// EMAIL-BASED ACCOUNTS, FRIENDS LIST & LEADERBOARD
// ---------------------------------------------------------
function openAccountModal() {
  const emailIn = document.getElementById('account-email-input');
  const nameIn = document.getElementById('account-name-input');
  if (emailIn) emailIn.value = appState.userEmail || '';
  if (nameIn) nameIn.value = appState.userName || '';

  const modal = document.getElementById('account-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  if (window.lucide) lucide.createIcons();
}

function closeAccountModal() {
  const modal = document.getElementById('account-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function switchToEmailProfile(emailRaw, displayNameRaw) {
  const email = emailRaw.trim().toLowerCase();
  const displayName = (displayNameRaw || '').trim() || email.split('@')[0];
  if (!email) return;
  appState.userEmail = email;
  appState.userName = displayName;
  saveState();
  renderAll();
  closeAccountModal();
  showToast(`Signed in as ${appState.userName} (${appState.userEmail})`, 'success');
}

function saveEmailAccount(evt) {
  evt.preventDefault();
  const email = document.getElementById('account-email-input')?.value || '';
  const password = document.getElementById('account-password-input')?.value || '';
  const name = document.getElementById('account-name-input')?.value || '';

  if (window.ParkQuestCloud && window.ParkQuestCloud.isConfigured() && password) {
    window.ParkQuestCloud.signInEmail(email.trim(), password)
      .then(() => {
        closeAccountModal();
        showToast(`Signed in to Firebase as ${email.trim()}`, 'success');
      })
      .catch(err => showToast(err.message || 'Sign-in failed.', 'error'));
    return;
  }

  switchToEmailProfile(email, name);
}

async function cloudCreateAccount() {
  const email = (document.getElementById('account-email-input')?.value || '').trim();
  const password = document.getElementById('account-password-input')?.value || '';
  const name = (document.getElementById('account-name-input')?.value || '').trim();
  if (!email) { showToast('Enter an email address first.', 'error'); return; }

  if (window.ParkQuestCloud && window.ParkQuestCloud.isConfigured()) {
    if (password.length < 6) {
      showToast('Firebase requires a password of at least 6 characters.', 'error');
      return;
    }
    try {
      await window.ParkQuestCloud.signUpEmail(email, password, name);
      closeAccountModal();
      showToast('Cloud account created & local progress synced!', 'success');
    } catch (err) {
      showToast(err.message || 'Could not create account.', 'error');
    }
  } else {
    switchToEmailProfile(email, name);
  }
}

async function cloudSignInGoogle() {
  if (!window.ParkQuestCloud || !window.ParkQuestCloud.isConfigured()) {
    showToast('Add your Firebase config in firebase-config.js to enable Google Sign-In.', 'info');
    return;
  }
  try {
    await window.ParkQuestCloud.signInGoogle();
    closeAccountModal();
    showToast('Signed in with Google!', 'success');
  } catch (err) {
    showToast(err.message || 'Google Sign-In cancelled or failed.', 'error');
  }
}

async function cloudSignOut() {
  if (window.ParkQuestCloud) {
    await window.ParkQuestCloud.signOutUser();
  }
  cloudLeaderboardRows = null;
  cloudGlobalRows = null;
  cloudFriendRequests = { incoming: [], outgoing: [] };
  cloudSyncMeta = null;

  // Reset active local session to signed-out state
  appState.userEmail = '';
  appState.userName = '';
  appState.xp = 0;
  appState.completedQuests = [];
  appState.unlockedBadges = [];
  appState.offlinePacks = [];
  appState.journalEntries = [];
  appState.unlockedPremiumQuests = [];
  appState.unlockedPremiumParks = [];
  appState.allAccessPro = false;
  appState.friends = [...DEFAULT_FRIENDS];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

  const signOutBtn = document.getElementById('cloud-signout-btn');
  if (signOutBtn) signOutBtn.classList.add('hidden');

  closeAccountModal();
  renderAll();
  showToast('Signed out. Sign back in anytime to load your cloud progress.', 'info');
}

function getLocalFriendCode() {
  if (appState.localFriendCode) return appState.localFriendCode;
  const email = (appState.userEmail || '').toLowerCase();
  if (!email) return '------';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 33 + email.charCodeAt(i)) >>> 0;
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[h % chars.length];
    h = Math.floor(h / chars.length) + i * 7 + 13;
  }
  appState.localFriendCode = code;
  return code;
}

function copyMyFriendCode() {
  const cloudProfile = window.ParkQuestCloud?.getProfile();
  const code = cloudProfile?.friendCode || getLocalFriendCode();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Copied Friend Code: ${code}`, 'success');
    }).catch(() => showToast(`Your Friend Code: ${code}`, 'info'));
  } else {
    showToast(`Your Friend Code: ${code}`, 'info');
  }
}

async function addFriendByCodeForm(evt) {
  evt.preventDefault();
  const input = document.getElementById('friend-code-input');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) return;

  if (window.ParkQuestCloud && window.ParkQuestCloud.isConfigured() && window.ParkQuestCloud.getCurrentUser()) {
    try {
      const targetDoc = await window.ParkQuestCloud.sendFriendRequestByCode(code);
      if (input) input.value = '';
      renderLeaderboardView();
      if (window.lucide) lucide.createIcons();
      showToast(`Friend request sent to ${targetDoc.displayName} (${targetDoc.friendCode})!`, 'success');
    } catch (err) {
      showToast(err.message || 'Could not send friend request.', 'error');
    }
    return;
  }

  // Local fallback if Firebase isn't configured yet
  if (code === getLocalFriendCode()) {
    showToast('That is your own Friend Code!', 'info');
    return;
  }
  const pseudoEmail = `ranger.${code.toLowerCase()}@parkquest.app`;
  if (!appState.friends.includes(pseudoEmail)) {
    appState.friends.push(pseudoEmail);
    if (!appState.friendNicknames) appState.friendNicknames = {};
    appState.friendNicknames[pseudoEmail] = `Ranger #${code}`;
    saveState();
    renderAll();
    showToast(`Added Ranger #${code} locally! Configure Firebase for live cloud sync.`, 'success');
  } else {
    showToast(`Friend Code ${code} is already on your list.`, 'info');
  }
  if (input) input.value = '';
}

let cloudLeaderboardRows = null;
let cloudGlobalRows = null;
let cloudFriendRequests = { incoming: [], outgoing: [] };
let cloudSyncMeta = null;

window.getLocalProgressForCloudMigration = function () {
  const visitedSet = new Set();
  PARKS_DATA.forEach(p => {
    if (p.quests.some(q => appState.completedQuests.includes(q.id))) {
      visitedSet.add(p.id);
    }
  });
  return {
    displayName: appState.userName || 'Park Explorer',
    totalPoints: appState.xp || 0,
    completedQuests: [...(appState.completedQuests || [])],
    parksVisited: Array.from(visitedSet)
  };
};

window.calculatePointsForQuests = function (questIds) {
  let pts = 0;
  const set = new Set(questIds);
  PARKS_DATA.forEach(p => {
    p.quests.forEach(q => {
      if (set.has(q.id)) pts += q.xp;
    });
  });
  return pts;
};

window.onCloudAuthStateChanged = function (user, profile) {
  const signOutBtn = document.getElementById('cloud-signout-btn');
  if (signOutBtn) {
    if (user) signOutBtn.classList.remove('hidden');
    else signOutBtn.classList.add('hidden');
  }
  if (user && profile) {
    appState.userEmail = user.email || appState.userEmail;
    appState.userName = profile.displayName || user.displayName || appState.userName;
    if (typeof profile.totalPoints === 'number' && profile.totalPoints >= appState.xp) {
      appState.xp = profile.totalPoints;
    }
    if (Array.isArray(profile.completedQuests)) {
      appState.completedQuests = Array.from(new Set([...appState.completedQuests, ...profile.completedQuests]));
    }
    saveState();
  }
  renderAll();
};

window.onCloudProfileUpdated = function (profile, meta) {
  cloudSyncMeta = meta;
  if (profile) {
    if (typeof profile.totalPoints === 'number') appState.xp = profile.totalPoints;
    if (Array.isArray(profile.completedQuests)) appState.completedQuests = [...profile.completedQuests];
    if (profile.displayName) appState.userName = profile.displayName;
    saveState();
  }
  renderAll();
};

window.onCloudLeaderboardUpdated = function (rows) {
  cloudLeaderboardRows = rows;
  renderLeaderboardView();
  if (window.lucide) lucide.createIcons();
};

window.onCloudGlobalLeaderboardUpdated = function (rows) {
  cloudGlobalRows = rows;
  renderLeaderboardView();
  if (window.lucide) lucide.createIcons();
};

window.onCloudFriendRequestsUpdated = function (reqs) {
  cloudFriendRequests = reqs || { incoming: [], outgoing: [] };
  renderLeaderboardView();
  if (window.lucide) lucide.createIcons();
};

function setLeaderboardTab(tab) {
  appState.leaderboardTab = tab;
  saveState();
  renderLeaderboardView();
  if (window.lucide) lucide.createIcons();
}

function addFriendByEmail(evt) {
  evt.preventDefault();
  const emailInput = document.getElementById('friend-email-input');
  const nameInput = document.getElementById('friend-name-input');
  const email = (emailInput?.value || '').trim().toLowerCase();
  const nickname = (nameInput?.value || '').trim();
  if (!email) return;

  if (email === (appState.userEmail || '').toLowerCase()) {
    showToast('You are already on the leaderboard with your own email!', 'info');
    return;
  }
  if (!appState.friends.includes(email)) {
    appState.friends.push(email);
    if (nickname) {
      if (!appState.friendNicknames) appState.friendNicknames = {};
      appState.friendNicknames[email] = nickname;
    }
    saveState();
    renderAll();
    showToast(`Added ${nickname || email} to your Friends List!`, 'success');
  } else {
    showToast(`${email} is already in your Friends List.`, 'info');
  }
  if (emailInput) emailInput.value = '';
  if (nameInput) nameInput.value = '';
}

function removeFriend(email) {
  appState.friends = (appState.friends || []).filter(f => f !== email);
  saveState();
  renderAll();
  showToast(`Removed ${email} from your Friends List.`, 'info');
}

async function removeCloudFriend(friendUid) {
  if (!window.ParkQuestCloud) return;
  try {
    await window.ParkQuestCloud.removeFriendByUid(friendUid);
    if (Array.isArray(cloudLeaderboardRows)) {
      cloudLeaderboardRows = cloudLeaderboardRows.filter(r => r.uid !== friendUid);
    }
    renderHeaderStats();
    renderLeaderboardView();
    if (window.lucide) lucide.createIcons();
    showToast('Friend removed from your leaderboard.', 'info');
  } catch (err) {
    showToast(err.message || 'Could not remove friend.', 'error');
  }
}

async function addCloudFriendByUid(friendUid, friendName) {
  if (!window.ParkQuestCloud) return;
  try {
    const targetDoc = (cloudGlobalRows || []).find(r => r.uid === friendUid);
    if (!targetDoc) throw new Error('Could not find user profile.');
    await window.ParkQuestCloud.sendFriendRequestToUser(targetDoc);
    renderLeaderboardView();
    if (window.lucide) lucide.createIcons();
    showToast(`Friend request sent to ${friendName || targetDoc.displayName}!`, 'success');
  } catch (err) {
    showToast(err.message || 'Could not send friend request.', 'error');
  }
}

async function acceptCloudFriendRequest(requestId, fromUid, fromName) {
  if (!window.ParkQuestCloud) return;
  try {
    await window.ParkQuestCloud.acceptFriendRequest(requestId, fromUid);
    showToast(`You and ${fromName || 'your friend'} are now friends!`, 'success');
  } catch (err) {
    showToast(err.message || 'Could not accept request.', 'error');
  }
}

async function declineCloudFriendRequest(requestId) {
  if (!window.ParkQuestCloud) return;
  try {
    await window.ParkQuestCloud.declineFriendRequest(requestId);
    showToast('Friend request declined.', 'info');
  } catch (err) {
    showToast(err.message || 'Could not decline request.', 'error');
  }
}

function hashEmailScore(email) {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) % 100000;
  const quests = 4 + (h % 22);
  return {
    xp: quests * 165 + (h % 90),
    quests,
    parks: Math.max(1, Math.min(64, Math.ceil(quests / 3))),
    badges: Math.max(1, Math.floor(quests / 4))
  };
}

function renderLeaderboardView() {
  const accountCard = document.getElementById('leaderboard-account-card');
  const listEl = document.getElementById('leaderboard-list');
  const friendsEl = document.getElementById('friends-list-container');
  const friendsBadge = document.getElementById('friends-list-badge');
  const codeDisplay = document.getElementById('my-friend-code-display');
  const syncPill = document.getElementById('cloud-sync-pill');
  if (!listEl) return;

  const cloudUser = window.ParkQuestCloud?.getCurrentUser();
  const cloudProfile = window.ParkQuestCloud?.getProfile();
  const activeFriendCode = cloudProfile?.friendCode || getLocalFriendCode();
  if (codeDisplay) codeDisplay.textContent = activeFriendCode;

  if (syncPill) {
    if (cloudUser && cloudSyncMeta) {
      if (cloudSyncMeta.hasPendingWrites || cloudSyncMeta.fromCache) {
        syncPill.textContent = 'Offline • Queued';
        syncPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amberRust text-white';
      } else {
        syncPill.textContent = 'Cloud Live';
        syncPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white';
      }
    } else if (window.ParkQuestCloud?.isConfigured()) {
      syncPill.textContent = 'Sign In to Sync';
      syncPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 text-amber-200';
    } else {
      syncPill.textContent = 'Local Mode';
      syncPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 text-emerald-200';
    }
  }

  const myEmail = (appState.userEmail || '').toLowerCase();
  const myExplored = PARKS_DATA.filter(p => p.quests.some(q => appState.completedQuests.includes(q.id))).length;
  const myRank = getRankInfo(appState.xp).current;

  if (accountCard) {
    accountCard.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300">${cloudUser ? 'Cloud Account' : myEmail ? 'Local Account' : 'Not Signed In'}</span>
        <span class="text-[10px] font-bold bg-forest/80 px-2 py-0.5 rounded-full text-emerald-200">Lvl ${myRank.level}</span>
      </div>
      <div class="font-serif text-lg font-bold text-white leading-tight">${appState.userName || 'Not Signed In'}</div>
      <div class="text-xs font-mono text-parchment/80 truncate">${myEmail || 'Sign in free (no payment required)'}</div>
      <button onclick="openAccountModal()" class="w-full mt-1 py-2 px-3 rounded-xl bg-amberRust hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer">
        ${cloudUser ? 'Manage Cloud Account' : 'Sign In / Create Account'}
      </button>
    `;
  }

  // Tab styling
  const gBtn = document.getElementById('lb-tab-global');
  const fBtn = document.getElementById('lb-tab-friends');
  if (gBtn && fBtn) {
    if (appState.leaderboardTab === 'friends') {
      fBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-forest text-white shadow-xs';
      gBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-white text-slateInk/75 hover:bg-parchmentDark border border-parchmentDark';
    } else {
      gBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-forest text-white shadow-xs';
      fBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-white text-slateInk/75 hover:bg-parchmentDark border border-parchmentDark';
    }
  }

  // If completely signed out (neither Firebase Cloud user nor local email account), show signed-out state
  if (!cloudUser && !myEmail) {
    const sub = document.getElementById('lb-subtitle');
    if (sub) sub.textContent = 'Not Signed In';
    listEl.innerHTML = `
      <div class="p-10 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-parchment text-forest flex items-center justify-center mx-auto border border-parchmentDark">
          <i data-lucide="user-x" class="w-6 h-6 text-amberRust"></i>
        </div>
        <h3 class="font-serif text-lg font-bold text-forest">Sign In to View the Leaderboard</h3>
        <p class="text-xs text-slateInk/70 max-w-sm mx-auto">You are currently signed out. Sign in with Google or Email to see global standings, send friend requests, and compete with friends.</p>
        <button onclick="openAccountModal()" class="px-5 py-2.5 rounded-xl bg-forest hover:bg-pine text-white text-xs font-bold shadow-xs cursor-pointer">
          Sign In / Create Account
        </button>
      </div>
    `;
    if (friendsBadge) friendsBadge.textContent = '0';
    if (friendsEl) friendsEl.innerHTML = `<p class="text-xs text-slateInk/60 text-center py-4">Sign in to view and manage your friends list.</p>`;
    renderFriendRequestsPanel(null);
    return;
  }

  // Signed-in Firebase Cloud User: ALWAYS render strictly You + accepted friends!
  if (cloudUser) {
    const allowedFriendSet = new Set(cloudProfile?.friends || []);
    const sourceRows = Array.isArray(cloudLeaderboardRows) ? cloudLeaderboardRows : (cloudProfile ? [cloudProfile] : []);
    const visibleRows = sourceRows
      .filter(r => r && (r.uid === cloudUser.uid || allowedFriendSet.has(r.uid)))
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    const sub = document.getElementById('lb-subtitle');
    if (sub) sub.textContent = `${visibleRows.length} ${visibleRows.length === 1 ? 'Ranger' : 'Friends Competing'}`;

    listEl.innerHTML = visibleRows.map((row, idx) => {
      const rankNum = idx + 1;
      const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;
      const isMe = row.uid === cloudUser.uid;
      const parksCount = (row.parksVisited || []).length;
      const questsCount = (row.completedQuests || []).length;
      return `
        <div class="p-4 flex items-center justify-between gap-3 ${isMe ? 'bg-amber-50/70' : 'hover:bg-parchment/40'} transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl ${rankNum <= 3 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-parchment text-forest font-bold'} flex items-center justify-center text-sm shrink-0">
              ${medal}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-serif font-bold text-sm sm:text-base text-forest truncate">${row.displayName || 'Explorer'}</span>
                ${isMe ? `<span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-forest text-white">You</span>` : `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-pine">Friend</span>`}
              </div>
              <div class="text-[11px] font-mono text-slateInk/60 truncate">Code: ${row.friendCode || '------'} • ${parksCount} Parks Visited</div>
            </div>
          </div>
          <div class="flex items-center gap-4 shrink-0 text-right">
            <div class="hidden sm:block text-xs text-slateInk/70">
              <span class="font-bold text-forest">${questsCount}</span> quests • <span class="font-bold text-forest">${parksCount}</span> parks
            </div>
            <div class="bg-parchment px-3 py-1.5 rounded-xl border border-parchmentDark">
              <div class="font-serif font-bold text-sm text-amberRust">${(row.totalPoints || 0).toLocaleString()} XP</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const cloudFriendsOnly = visibleRows.filter(r => r.uid !== cloudUser.uid);
    if (friendsBadge) friendsBadge.textContent = cloudFriendsOnly.length;
    if (friendsEl) {
      if (cloudFriendsOnly.length === 0) {
        friendsEl.innerHTML = `<p class="text-xs text-slateInk/60 text-center py-4">No friends yet. Send or accept a Friend Request!</p>`;
      } else {
        friendsEl.innerHTML = cloudFriendsOnly.map(f => `
          <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-parchment/60 border border-parchmentDark">
            <div class="min-w-0">
              <div class="text-xs font-bold text-forest truncate">${f.displayName || 'Explorer'}</div>
              <div class="text-[11px] font-mono text-slateInk/60 truncate">Code: ${f.friendCode || '------'} • ${(f.totalPoints || 0).toLocaleString()} XP</div>
            </div>
            <button onclick="removeCloudFriend('${f.uid}')" title="Remove friend" class="p-1.5 rounded-lg text-slateInk/45 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `).join('');
      }
    }
    renderFriendRequestsPanel(cloudUser);
    return;
  }

  // Local-only fallback (when Firebase is not configured)
  const byEmail = new Map();
  (appState.friends || []).forEach(fEmail => {
    const em = fEmail.toLowerCase();
    const nick = appState.friendNicknames?.[em] || em.split('@')[0];
    const stats = hashEmailScore(em);
    byEmail.set(em, { email: em, name: nick, ...stats, isFriend: true, isMe: false });
  });

  byEmail.set(myEmail, {
    email: myEmail,
    name: appState.userName || 'You',
    xp: appState.xp,
    quests: appState.completedQuests.length,
    parks: myExplored,
    badges: appState.unlockedBadges.length,
    isFriend: false,
    isMe: true
  });

  const rows = Array.from(byEmail.values()).sort((a, b) => b.xp - a.xp);
  const sub = document.getElementById('lb-subtitle');
  if (sub) sub.textContent = `${rows.length} ${rows.length === 1 ? 'Ranger' : 'Friends Competing'}`;

  listEl.innerHTML = rows.map((row, idx) => {
    const rankNum = idx + 1;
    const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;
    return `
      <div class="p-4 flex items-center justify-between gap-3 ${row.isMe ? 'bg-amber-50/70' : 'hover:bg-parchment/40'} transition-colors">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl ${rankNum <= 3 ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-parchment text-forest font-bold'} flex items-center justify-center text-sm shrink-0">
            ${medal}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-serif font-bold text-sm sm:text-base text-forest truncate">${row.name}</span>
              ${row.isMe ? `<span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-forest text-white">You</span>` : `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-pine">Friend</span>`}
            </div>
            <div class="text-[11px] font-mono text-slateInk/60 truncate">${row.email}</div>
          </div>
        </div>
        <div class="flex items-center gap-4 shrink-0 text-right">
          <div class="hidden sm:block text-xs text-slateInk/70">
            <span class="font-bold text-forest">${row.quests}</span> quests • <span class="font-bold text-forest">${row.parks}</span> parks
          </div>
          <div class="bg-parchment px-3 py-1.5 rounded-xl border border-parchmentDark">
            <div class="font-serif font-bold text-sm text-amberRust">${row.xp.toLocaleString()} XP</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (friendsBadge) friendsBadge.textContent = (appState.friends || []).length;
  renderFriendRequestsPanel(null);
  if (friendsEl) {
    const friendsList = appState.friends || [];
    if (friendsList.length === 0) {
      friendsEl.innerHTML = `<p class="text-xs text-slateInk/60 text-center py-4">No friends added yet. Add a friend by email above!</p>`;
    } else {
      friendsEl.innerHTML = friendsList.map(fEmail => {
        const entry = byEmail.get(fEmail.toLowerCase());
        return `
          <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-parchment/60 border border-parchmentDark">
            <div class="min-w-0">
              <div class="text-xs font-bold text-forest truncate">${entry ? entry.name : fEmail}</div>
              <div class="text-[11px] font-mono text-slateInk/60 truncate">${fEmail} • ${entry ? entry.xp.toLocaleString() : 0} XP</div>
            </div>
            <button onclick="removeFriend('${fEmail.replace(/'/g, "\\'")}')" title="Remove friend" class="p-1.5 rounded-lg text-slateInk/45 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
      }).join('');
    }
  }
}

function renderFriendRequestsPanel(cloudUser) {
  const container = document.getElementById('friend-requests-container');
  const badge = document.getElementById('friend-requests-badge');
  if (!container || !badge) return;

  if (!cloudUser) {
    badge.textContent = '0';
    container.innerHTML = `<p class="text-xs text-slateInk/60 text-center py-2">Sign in with Firebase to send &amp; receive friend requests.</p>`;
    return;
  }

  const incoming = cloudFriendRequests.incoming || [];
  const outgoing = cloudFriendRequests.outgoing || [];
  badge.textContent = incoming.length;

  if (incoming.length === 0 && outgoing.length === 0) {
    container.innerHTML = `<p class="text-xs text-slateInk/60 text-center py-2">No pending friend requests.</p>`;
    return;
  }

  const inHtml = incoming.map(req => `
    <div class="p-2.5 rounded-xl bg-amber-50/70 border border-amberRust/30 flex items-center justify-between gap-2">
      <div class="min-w-0">
        <div class="text-xs font-bold text-forest truncate">${req.fromName || 'Explorer'}</div>
        <div class="text-[10px] font-mono text-slateInk/65">Incoming • Code: ${req.fromCode || '------'}</div>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button onclick="acceptCloudFriendRequest('${req.id}', '${req.fromUid}', '${(req.fromName || '').replace(/'/g, "\\'")}')"
          class="px-2.5 py-1 rounded-lg bg-forest hover:bg-pine text-white text-[11px] font-bold cursor-pointer">Accept</button>
        <button onclick="declineCloudFriendRequest('${req.id}')"
          class="px-2 py-1 rounded-lg bg-white hover:bg-red-50 text-slateInk/70 hover:text-red-700 border border-parchmentDark text-[11px] font-bold cursor-pointer">Decline</button>
      </div>
    </div>
  `).join('');

  const outHtml = outgoing.map(req => `
    <div class="p-2.5 rounded-xl bg-parchment/60 border border-parchmentDark flex items-center justify-between gap-2">
      <div class="min-w-0">
        <div class="text-xs font-bold text-forest truncate">${req.toName || 'Explorer'}</div>
        <div class="text-[10px] font-mono text-slateInk/60">Sent • Pending acceptance</div>
      </div>
      <button onclick="declineCloudFriendRequest('${req.id}')" title="Cancel request"
        class="px-2 py-1 rounded-lg text-[11px] font-semibold text-slateInk/55 hover:text-red-700 hover:bg-red-50 cursor-pointer">Cancel</button>
    </div>
  `).join('');

  container.innerHTML = inHtml + outHtml;
}

// Initialize App on Load
window.addEventListener('DOMContentLoaded', () => {
  initLegalTermsContent();
  loadState();
  initMapPanAndZoom();
  renderAll();
  switchMainView(appState.activeView || 'directory');
  if (!appState.termsAccepted) {
    openLegalModal(true);
  }
});
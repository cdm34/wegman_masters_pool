/**
 * app.js — Masters Pool Scoreboard
 *
 * API: GET https://live-golf-data.p.rapidapi.com/leaderboard
 * One call returns all players + per-round scores, avoiding the scorecard
 * 20/day limit. Round scores in `rounds[]` are raw strokes (e.g. 68, 72).
 * We convert to relative-to-par using COURSE_PAR from pool-config.js.
 * The `today` field is already relative-to-par for the current round.
 */

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "https://live-golf-data.p.rapidapi.com";
const CACHE_KEY = "masters_pool_leaderboard_cache_v2";
const SETTINGS_KEY = "masters_pool_settings";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

const ROUND_NAMES = { 1: "Thursday", 2: "Friday", 3: "Saturday", 4: "Sunday" };

// ─── State ────────────────────────────────────────────────────────────────────
let leaderboardData = null;
let currentRound = 1;
let activeTab = null; // will be set to currentRound after first load

// ─── Settings ─────────────────────────────────────────────────────────────────
function getSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  const base = { apiKey: "", tournId: DEFAULT_API_CONFIG.tournId, year: DEFAULT_API_CONFIG.year };
  return saved ? { ...base, ...JSON.parse(saved) } : base;
}

function saveSettings() {
  const settings = {
    apiKey: document.getElementById("api-key-input").value.trim(),
    tournId: document.getElementById("tourn-id-input").value.trim(),
    year: document.getElementById("season-year-input").value.trim(),
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  localStorage.removeItem(CACHE_KEY); // clear cache on settings change
  closeSettings();
  fetchLiveData();
}

function openSettings() {
  const s = getSettings();
  document.getElementById("api-key-input").value = s.apiKey || "";
  document.getElementById("tourn-id-input").value = s.tournId || DEFAULT_API_CONFIG.tournId;
  document.getElementById("season-year-input").value = s.year || DEFAULT_API_CONFIG.year;
  document.getElementById("modal-overlay").classList.add("open");
}

function closeSettings() {
  document.getElementById("modal-overlay").classList.remove("open");
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 4000);
}

// ─── Cache ────────────────────────────────────────────────────────────────────
function getCachedData() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL_MS) return data;
  } catch { }
  return null;
}

function setCachedData(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

// ─── API Fetch ────────────────────────────────────────────────────────────────
async function fetchLiveData(forceRefresh = false) {
  const btn = document.getElementById("refresh-btn");
  btn.classList.add("spinning");
  setStatus("Fetching live scores…", "loading");

  if (!forceRefresh) {
    // 1. Try Firebase first (communal cache)
    if (window.loadFromFirebase) {
      const fbData = await window.loadFromFirebase();
      if (fbData && fbData.payload) {
        leaderboardData = fbData.payload;
        setStatus("Loaded from pool cache", "ok");
        renderAll();
        btn.classList.remove("spinning");
        return;
      }
    }

    // 2. Fall back to local device cache
    const cached = getCachedData();
    if (cached) {
      leaderboardData = cached;
      setStatus("Loaded from local cache (≤10 min old)", "ok");
      renderAll();
      btn.classList.remove("spinning");
      return;
    }
  }

  const settings = getSettings();
  if (!settings.apiKey) {
    setStatus("⚠ No API key set — click ⚙ Settings to add yours", "warn");
    btn.classList.remove("spinning");
    renderDemoMode();
    return;
  }

  try {
    const url = `${API_BASE}/leaderboard?tournId=${settings.tournId}&year=${settings.year}&orgId=${DEFAULT_API_CONFIG.orgId}`;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "live-golf-data.p.rapidapi.com",
        "x-rapidapi-key": settings.apiKey,
      },
    });

    if (!resp.ok) throw new Error(`API ${resp.status}: ${resp.statusText}`);

    const data = await resp.json();
    leaderboardData = data;
    setCachedData(data);

    if (window.saveToFirebase) {
      await window.saveToFirebase(data);
    }

    setStatus("Live data loaded successfully", "ok");
    renderAll();
  } catch (err) {
    console.error("Fetch error:", err);
    setStatus(`Error: ${err.message}`, "error");
    showToast(`Failed to fetch: ${err.message}`, "error");
    const stale = localStorage.getItem(CACHE_KEY);
    if (stale) {
      leaderboardData = JSON.parse(stale).data;
      renderAll();
      showToast("Showing cached data", "warn");
    }
  } finally {
    btn.classList.remove("spinning");
  }
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function setStatus(text, state) {
  document.getElementById("status-text").textContent = text;
  document.getElementById("status-dot").className = `status-dot ${state}`;
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("status-time").textContent = `Last updated: ${now}`;
}

// ─── Score Helpers ─────────────────────────────────────────────────────────
/**
 * Normalize a player name for accent-insensitive matching.
 * "Ludvig Åberg" and "Ludvig Aberg" both become "ludvig aberg".
 * Strips diacritical marks using Unicode NFD decomposition.
 */
function normalizeNameKey(firstName, lastName) {
  const raw = `${firstName} ${lastName}`;
  let norm = raw
    .normalize("NFD")                    // decompose accented chars (e.g. Å → A + combining ring)
    .replace(/[\u0300-\u036f]/g, "")     // strip the combining marks
    .replace(/ø/gi, "o")                 // specifically replace the Danish ø (which does not decompose)
    .toLowerCase()
    .trim();

  // Handle common nicknames vs official API names
  if (norm.includes("niemann") || norm.includes("nieman") || norm.includes("joaquin") || norm.includes("joauqin") || norm.includes("neiman") || norm.includes("niemen")) return "joaquin niemann";
  if (norm === "cameron young") return "cam young";
  if (norm === "matthew fitzpatrick") return "matt fitzpatrick";
  if (norm === "partick cantlay") return "patrick cantlay";
  if (norm === "partrick reed") return "patrick reed";
  
  return norm;
}
/**
 * Parse raw API score string → number or null.
 * API gives us either strokes (e.g. "68") or relative-to-par (e.g. "-4", "E", "+2").
 */
function parseScore(str) {
  if (str === undefined || str === null || str === "" || str === "--") return null;
  const s = String(str).trim();
  if (["CUT", "WD", "DQ", "MDF", "W/D"].includes(s)) return null;
  if (s === "E") return 0;
  const n = parseInt(s, 10);
  return isNaN(n) ? null : n;
}

/**
 * Convert a raw stroke count to relative-to-par.
 * If the value looks like a stroke total (>= 50) assume it's strokes.
 * Otherwise assume it's already relative-to-par.
 */
function toRelPar(val) {
  if (val === null || val === undefined) return null;
  if (val >= 50) return val - COURSE_PAR; // raw strokes → rel to par
  return val; // already relative
}

/** Format relative-to-par for display */
function fmtScore(val) {
  if (val === null || val === undefined) return "--";
  if (val === 0) return "E";
  return val > 0 ? `+${val}` : `${val}`;
}

function scoreClass(val) {
  if (val === null || val === undefined) return "";
  if (val < 0) return "score-under";
  if (val > 0) return "score-over";
  return "score-even";
}

// ─── Build Player Map ─────────────────────────────────────────────────────────
/**
 * Returns a map of "FirstName LastName" → player data.
 *
 * The leaderboard API returns per-player:
 *   total       — cumulative tournament score (rel-to-par string, e.g. "-4", "E")
 *   today       — current-round score (rel-to-par). May also be called todayScore.
 *   rounds[]    — optional array of per-round stroke data
 *
 * For Round 1 standings we need each golfer's Round 1 score. We try:
 *   1. rounds[] array from the API (strokes field, converted to rel-to-par)
 *   2. today / todayScore field (already rel-to-par)
 *   3. Fallback: use `total` for the current round (valid in R1 when total = R1 score,
 *      and still reasonable guidance for partial later rounds)
 */
function buildPlayerMap(data) {
  const map = {};
  if (!data || !data.leaderboardRows) return map;

  // Log the first player row once so we can verify the API field names
  if (data.leaderboardRows.length > 0 && !window._apiShapeLogged) {
    console.log('[Masters Pool] Sample leaderboard row:', JSON.stringify(data.leaderboardRows[0], null, 2));
    console.log('[Masters Pool] Top-level keys:', Object.keys(data));
    window._apiShapeLogged = true;
  }

  const crNum = parseInt(data.currentRound ?? data.current_round ?? "1", 10);

  for (const row of data.leaderboardRows) {
    // Use accent-normalized key so "Aberg" matches "Åberg", etc.
    const key = normalizeNameKey(row.firstName, row.lastName);

    // ── 1. Try rounds[] array for completed-round strokes ──
    const rounds = { 1: null, 2: null, 3: null, 4: null };
    for (const rd of (row.rounds ?? [])) {
      const id = parseInt(rd.roundId ?? rd.round, 10);
      if (id >= 1 && id <= 4) {
        // `strokes` may be a raw count (e.g. 68) or already rel-to-par (e.g. -4)
        const val = rd.strokes ?? rd.score ?? rd.value;
        rounds[id] = toRelPar(parseScore(val));
      }
    }

    // ── 2. Try multiple field names for today's (current-round) score ──
    const todayRaw = row.currentRoundScore ?? row.today ?? row.todayScore ?? row.today_score ?? row.currentScore ?? null;
    const todayVal = parseScore(todayRaw);
    if (todayVal !== null) {
      rounds[crNum] = todayVal;
    }

    // ── 3. Fallback: if current round still null, derive from total ──
    //    In Round 1: total === R1 score (no prior rounds to subtract)
    //    In later rounds: total is cumulative, so this is imprecise but
    //    better than showing nothing when today is unavailable
    if (rounds[crNum] === null) {
      const totalVal = toRelPar(parseScore(row.total));
      if (totalVal !== null) rounds[crNum] = totalVal;
    }

    // ── 4. Derive older completed round scores from totals if still missing ──
    //    e.g. R1 score = (total after R1) when we have round-by-round totals
    //    We skip this for now; the rounds[] array should cover it.

    map[key] = {
      firstName: row.firstName,
      lastName: row.lastName,
      position: row.position,
      total: toRelPar(parseScore(row.total)),
      today: todayVal,
      thru: row.thru ?? row.holesPlayed ?? "--",
      status: row.status,
      rounds,
    };
  }

  return map;
}

// ─── Pool Standings Calculation ───────────────────────────────────────────────
/**
 * For a given round number (1-4) or 'tourn' (overall):
 * - Get each participant's score for each pick for that round
 * - Find their best N picks (lowest scores)
 * - Rank participants by that combined score (lower = better)
 *
 * DUPLICATE PICKS: each participant's picks are evaluated independently.
 * If two people both pick Scheffler, they each get full credit for his score.
 */
function calculateStandings(playerMap, roundKey) {
  const isTournament = roundKey === "tourn";
  const roundNum = isTournament ? null : parseInt(roundKey, 10);

  return POOL_PARTICIPANTS.map((participant) => {
    const picksData = participant.picks.map((pick) => {
      const key = normalizeNameKey(pick.firstName, pick.lastName);
      const player = playerMap[key];

      const roundScore = isTournament
        ? (player?.total ?? null)
        : (player?.rounds?.[roundNum] ?? null);

      return {
        name: `${pick.firstName} ${pick.lastName}`,
        firstName: pick.firstName,
        lastName: pick.lastName,
        found: !!player,
        roundScore,                         // score for this specific day/tournament
        total: player?.total ?? null,  // always the tournament total
        today: player?.today ?? null,
        thru: player?.thru ?? "--",
        position: player?.position ?? "--",
        rounds: player?.rounds ?? { 1: null, 2: null, 3: null, 4: null },
        status: player?.status ?? "unknown",
      };
    });

    // Sort picks by this round's score (ascending = best)
    const scoredPicks = picksData
      .filter((p) => p.roundScore !== null)
      .sort((a, b) => a.roundScore - b.roundScore);

    const best2 = scoredPicks.slice(0, SCORING_CONFIG.dailyPicksScored);
    const combinedScore = best2.length > 0
      ? best2.reduce((sum, p) => sum + p.roundScore, 0)
      : null;

    return {
      name: participant.name,
      picks: picksData,
      combinedScore,
      best2Picks: best2,
    };
  }).sort((a, b) => {
    // Lower combined score wins; null (no data) goes to the bottom
    if (a.combinedScore !== null && b.combinedScore !== null) return a.combinedScore - b.combinedScore;
    if (a.combinedScore !== null) return -1;
    if (b.combinedScore !== null) return 1;
    return 0;
  });
}

// ─── Tab Logic ────────────────────────────────────────────────────────────────
function switchTab(tabKey) {
  activeTab = tabKey;

  // Update tab button styles
  const keys = [1, 2, 3, 4, "tourn"];
  keys.forEach((k) => {
    const btn = document.getElementById(`tab-${k === "tourn" ? "tourn" : "r" + k}`);
    if (btn) btn.classList.toggle("active", k === tabKey);
  });

  // Re-render the panel if we have data
  if (leaderboardData) {
    const playerMap = buildPlayerMap(leaderboardData);
    renderTabPanel(playerMap, tabKey);
  }
}

// ─── Render All ───────────────────────────────────────────────────────────────
function renderAll() {
  if (!leaderboardData) { renderDemoMode(); return; }

  currentRound = parseInt(leaderboardData.currentRound ?? "1", 10);
  document.getElementById("current-round").textContent = currentRound;

  const playerMap = buildPlayerMap(leaderboardData);

  // Mark tabs as available/completed/upcoming
  updateTabStates();

  // Default active tab = current round (only set on first load)
  if (activeTab === null) activeTab = currentRound;
  switchTab(activeTab);

  // Render the leaderboard table
  renderLeaderboard(playerMap);
}

function updateTabStates() {
  for (let r = 1; r <= 4; r++) {
    const btn = document.getElementById(`tab-r${r}`);
    if (!btn) continue;
    btn.classList.remove("tab-completed", "tab-upcoming", "tab-live");
    if (r < currentRound) btn.classList.add("tab-completed");
    if (r === currentRound) btn.classList.add("tab-live");
    if (r > currentRound) btn.classList.add("tab-upcoming");
  }
}

// ─── Render Tab Panel ─────────────────────────────────────────────────────────
function renderTabPanel(playerMap, tabKey) {
  const panel = document.getElementById("tab-panels");
  const standings = calculateStandings(playerMap, tabKey);
  const isTourn = tabKey === "tourn";
  const roundNum = isTourn ? null : parseInt(tabKey, 10);

  const label = isTourn
    ? "Tournament Total"
    : `Round ${roundNum} · ${ROUND_NAMES[roundNum]}`;

  const isLive = !isTourn && roundNum === currentRound;

  let html = `<div class="standings-grid">`;

  standings.forEach((participant, idx) => {
    const rank = idx + 1;
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
    const isLeader = rank === 1;

    const best2Names = participant.best2Picks
      .map((p) => p.lastName)
      .join(" + ") || "—";

    const best2Detail = participant.best2Picks
      .map((p) => `${fmtScore(p.roundScore)}`)
      .join(" + ") || "";

    html += `
      <div class="standing-card${isLeader ? " leader" : ""}" id="sc-${participant.name.replace(/\W/g, "-")}">
        <div class="card-header">
          <span class="rank-badge">${medal}</span>
          <div class="participant-info">
            <span class="participant-name">${participant.name}</span>
            <span class="participant-sub">Best 2: <em>${best2Names}</em>${best2Detail ? ` (${best2Detail})` : ""}</span>
          </div>
          <div class="card-score-big">
            <span class="score-label-sm">${isTourn ? "Total" : isLive ? "Today" : "Round"}</span>
            <span class="score-big ${scoreClass(participant.combinedScore)}">${fmtScore(participant.combinedScore)}</span>
          </div>
        </div>
        <div class="picks-list">
          <div class="picks-header">
            <span>Golfer</span><span>Pos</span><span>Thru</span>
            <span>${isTourn ? "Total" : "R" + (isTourn ? "" : roundNum)}</span>
            <span>Overall</span>
          </div>
          ${participant.picks.map((pick) => {
      const isBest2 = participant.best2Picks.some((b) => b.name === pick.name);
      const isCut = pick.status === "cut" || pick.status === "wd" || pick.status === "dq";
      const dispScore = isTourn ? pick.total : pick.roundScore;
      return `
              <div class="pick-row ${isBest2 ? "best-pick" : ""} ${!pick.found ? "not-found" : ""} ${isCut ? "pick-cut" : ""}">
                <span class="pick-name">
                  ${pick.name}
                  ${isBest2 ? '<span class="tag-best2">Best 2</span>' : ""}
                  ${isCut ? '<span class="tag-cut">CUT</span>' : ""}
                </span>
                <span class="pick-pos">${pick.found ? pick.position : "✕"}</span>
                <span class="pick-thru">${pick.thru}</span>
                <span class="pick-today ${scoreClass(dispScore)}">${fmtScore(dispScore)}</span>
                <span class="pick-total ${scoreClass(pick.total)}">${fmtScore(pick.total)}</span>
              </div>`;
    }).join("")}
        </div>
      </div>`;
  });

  html += `</div>`;
  panel.innerHTML = html;
}

// ─── Leaderboard Table ────────────────────────────────────────────────────────
function renderLeaderboard(playerMap) {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  // All unique picks + who picked them
  const allPickKeys = new Set();
  const pickOwnerMap = {};
  const pickDisplayName = {}; // normalized key → display name with proper accents

  for (const participant of POOL_PARTICIPANTS) {
    for (const pick of participant.picks) {
      const key = normalizeNameKey(pick.firstName, pick.lastName);
      allPickKeys.add(key);
      if (!pickOwnerMap[key]) pickOwnerMap[key] = [];
      // Store the display name (with accents) for the first occurrence
      if (!pickDisplayName[key]) pickDisplayName[key] = `${pick.firstName} ${pick.lastName}`;
      if (!pickOwnerMap[key].includes(participant.name)) {
        pickOwnerMap[key].push(participant.name);
      }
    }
  }

  const rows = Array.from(allPickKeys)
    .map((key) => ({ key, display: pickDisplayName[key] ?? key, owners: pickOwnerMap[key], player: playerMap[key] ?? null }))
    .sort((a, b) => (a.player?.total ?? 999) - (b.player?.total ?? 999));

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="loading-row">No golfers configured in pool-config.js</td></tr>`;
    return;
  }

  rows.forEach(({ key, display, owners, player }) => {
    const tr = document.createElement("tr");
    const cut = !player || ["cut", "wd", "dq"].includes(player?.status);
    if (cut) tr.classList.add("row-cut");

    const r = player?.rounds ?? { 1: null, 2: null, 3: null, 4: null };

    tr.innerHTML = `
      <td class="cell-pos">${player ? (player.position || "--") : "✕"}</td>
      <td class="cell-name">${display}</td>
      <td class="cell-owner">${owners.join(", ")}</td>
      <td class="cell-score ${scoreClass(player?.total)}">${fmtScore(player?.total)}</td>
      <td class="cell-today ${scoreClass(player?.today)}">${fmtScore(player?.today)}</td>
      <td class="cell-thru">${player?.thru ?? "--"}</td>
      <td class="cell-round">${fmtScore(r[1])}</td>
      <td class="cell-round">${fmtScore(r[2])}</td>
      <td class="cell-round">${fmtScore(r[3])}</td>
      <td class="cell-round">${fmtScore(r[4])}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ─── Demo Mode ────────────────────────────────────────────────────────────────
function renderDemoMode() {
  currentRound = 2;
  document.getElementById("current-round").textContent = currentRound;

  // Build fake leaderboard rows for every unique pick
  const seen = new Set();
  const fakeRows = [];
  for (const participant of POOL_PARTICIPANTS) {
    for (const pick of participant.picks) {
      const key = `${pick.firstName} ${pick.lastName}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const r1 = Math.floor(Math.random() * 8) - 4;
      const r2 = Math.floor(Math.random() * 8) - 4;
      fakeRows.push({
        firstName: pick.firstName,
        lastName: pick.lastName,
        position: String(fakeRows.length + 1),
        total: r1 + r2,
        today: r2,
        thru: "18",
        status: "active",
        rounds: [
          { roundId: "1", strokes: String(72 + r1) },
          { roundId: "2", strokes: String(r2) },
        ],
      });
    }
  }

  leaderboardData = {
    leaderboardRows: fakeRows,
    currentRound: String(currentRound),
    roundStatus: "Demo",
  };

  activeTab = null; // reset so it defaults to currentRound
  renderAll();
  showToast("⚠ Demo mode — add your API key in ⚙ Settings", "warn");
}

// ─── Utility: Fetch Schedule (browser console helper) ────────────────────────
async function fetchSchedule() {
  const s = getSettings();
  if (!s.apiKey) { console.warn("Set API key first"); return; }
  const r = await fetch(`${API_BASE}/schedule?year=${s.year}&orgId=1`, {
    headers: { "x-rapidapi-host": "live-golf-data.p.rapidapi.com", "x-rapidapi-key": s.apiKey },
  });
  const d = await r.json();
  console.table(d.schedule.map((t) => ({ tournId: t.tournId, name: t.name, week: t.date?.weekNumber })));
  return d;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  // Bust cache if year changed
  const settings = getSettings();
  const raw = localStorage.getItem(CACHE_KEY);
  if (raw) {
    try {
      const { data } = JSON.parse(raw);
      if (data?._year && data._year !== settings.year) localStorage.removeItem(CACHE_KEY);
    } catch { }
  }
  fetchLiveData();
});

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
let lastApiUpdateMs = null; // tracks actual API ping time

// ─── Featured Teams ──────────────────────────────────────────────────────────
const FEATURED_KEY = "masters_pool_featured_teams";
const TOGGLE_KEY = "masters_pool_show_featured";
const DEFAULT_FEATURED_TEAMS = ["Adam, Colin", "Wegman, Brett", "Corell, Charlie", "Riggs, Ryan"];

let featuredTeams = new Set();
let showFeaturedOnly = false;

function initFeatured() {
  const savedTeams = localStorage.getItem(FEATURED_KEY);
  if (savedTeams) {
    featuredTeams = new Set(JSON.parse(savedTeams));
  } else {
    // First run or cleared cache: use defaults
    featuredTeams = new Set(DEFAULT_FEATURED_TEAMS);
    localStorage.setItem(FEATURED_KEY, JSON.stringify([...featuredTeams]));
  }

  const savedToggle = localStorage.getItem(TOGGLE_KEY);
  showFeaturedOnly = savedToggle === "true";

  // Update checkbox state if element exists
  const toggle = document.getElementById("featured-toggle");
  if (toggle) toggle.checked = showFeaturedOnly;
}

function toggleFeatured(name) {
  if (featuredTeams.has(name)) {
    featuredTeams.delete(name);
  } else {
    featuredTeams.add(name);
  }
  localStorage.setItem(FEATURED_KEY, JSON.stringify([...featuredTeams]));
  renderAll();
}

function toggleShowFeaturedOnly() {
  const toggle = document.getElementById("featured-toggle");
  showFeaturedOnly = toggle ? toggle.checked : !showFeaturedOnly;
  localStorage.setItem(TOGGLE_KEY, showFeaturedOnly);
  renderAll();
}

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
  fetchLiveData(true);
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
    const cache = JSON.parse(raw);
    if (Date.now() - cache.timestamp < CACHE_TTL_MS) return cache;
  } catch { }
  return null;
}

function setCachedData(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

// ─── API Fetch ────────────────────────────────────────────────────────────────
async function fetchLiveData(forceRefresh = false) {
  const btn = document.getElementById("refresh-btn");
  if (btn) btn.classList.add("spinning");
  setStatus("Fetching live scores…", "loading");

  if (!forceRefresh) {
    // 1. Try Firebase first (communal cache)
    if (window.loadFromFirebase) {
      const fbData = await window.loadFromFirebase();
      if (fbData && fbData.payload) {
        leaderboardData = fbData.payload;
        setStatus("Loaded from pool cache", "ok", fbData.timestamp);
        renderAll();
        if (btn) btn.classList.remove("spinning");
        return;
      }
    }

    // 2. Fall back to local device cache
    const cached = getCachedData();
    if (cached) {
      leaderboardData = cached.data;
      setStatus("Loaded from local cache (≤10 min old)", "ok", cached.timestamp);
      renderAll();
      if (btn) btn.classList.remove("spinning");
      return;
    }
  }

  const settings = getSettings();
  if (!settings.apiKey) {
    setStatus("⚠ No API key set — click ⚙ Settings to add yours", "warn");
    if (btn) btn.classList.remove("spinning");
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

    setStatus("Live data loaded successfully", "ok", Date.now());
    renderAll();
  } catch (err) {
    console.error("Fetch error:", err);
    showToast(`Failed to fetch: ${err.message}`, "error");
    const stale = localStorage.getItem(CACHE_KEY);
    if (stale) {
      const cache = JSON.parse(stale);
      leaderboardData = cache.data;
      renderAll();
      showToast("Showing cached data", "warn");
      setStatus(`Error: ${err.message}`, "error", cache.timestamp);
    } else {
      setStatus(`Error: ${err.message}`, "error");
    }
  } finally {
    if (btn) btn.classList.remove("spinning");
  }
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function setStatus(text, state, timestamp = null) {
  document.getElementById("status-text").textContent = text;
  document.getElementById("status-dot").className = `status-dot ${state}`;
  if (timestamp) {
    lastApiUpdateMs = timestamp;
  }
  if (lastApiUpdateMs) {
    const d = new Date(lastApiUpdateMs);
    const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.getElementById("status-time").textContent = `Last updated: ${timeStr}`;
  } else {
    document.getElementById("status-time").textContent = "Last updated: --";
  }
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
/** Unwrap MongoDB extended JSON values if present */
function extractVal(v) {
  if (v && typeof v === "object") {
    if (v.$numberInt !== undefined) return v.$numberInt;
    if (v.$numberLong !== undefined) return v.$numberLong;
    if (v.$numberDouble !== undefined) return v.$numberDouble;
  }
  return v;
}

/**
 * Parse raw API score string → number or null.
 * API gives us either strokes (e.g. "68") or relative-to-par (e.g. "-4", "E", "+2").
 */
function parseScore(str) {
  const unwrapped = extractVal(str);
  if (unwrapped === undefined || unwrapped === null || unwrapped === "" || unwrapped === "--") return null;
  const s = String(unwrapped).trim();
  if (["CUT", "WD", "DQ", "MDF", "W/D"].includes(s.toUpperCase())) return null;
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
  for (const row of data.leaderboardRows) {
    // We forcefully use the tournament's active round for today's live score mapping!
    const crNum = currentRound;

    // Use accent-normalized key so "Aberg" matches "Åberg", etc.
    const key = normalizeNameKey(extractVal(row.firstName), extractVal(row.lastName));

    // ── 1. Try rounds[] array for completed-round strokes ──
    const rounds = { 1: null, 2: null, 3: null, 4: null };
    for (const rd of (row.rounds ?? [])) {
      const idRaw = rd.roundId ?? rd.round;
      const id = parseInt(extractVal(idRaw), 10);
      if (id >= 1 && id <= 4) {
        // `strokes` may be a raw count (e.g. 68) or already rel-to-par (e.g. -4)
        const val = rd.scoreToPar ?? rd.strokes ?? rd.score ?? rd.value;
        rounds[id] = toRelPar(parseScore(val));
      }
    }

    // ── 2. Try multiple field names for today's (current-round) score ──
    const todayRaw = row.currentRoundScore ?? row.today ?? row.todayScore ?? row.today_score ?? row.currentScore ?? null;
    const todayVal = toRelPar(parseScore(todayRaw));
    if (todayVal !== null) {
      rounds[crNum] = todayVal;
    }

    // ── 3. Fallback: if current round still null, derive from total ──
    //    In Round 1: total === R1 score
    //    In later rounds: today = total - sum(prior rounds)
    if (rounds[crNum] === null) {
      const totalVal = toRelPar(parseScore(row.total));
      if (totalVal !== null) {
        if (crNum === 1) {
          rounds[crNum] = totalVal;
        } else {
          // Derive today's score by subtracting completed prior rounds from total
          let priorSum = 0;
          let canDerive = true;
          for (let i = 1; i < crNum; i++) {
            if (rounds[i] === null) {
              canDerive = false;
              break;
            }
            priorSum += rounds[i];
          }
          if (canDerive) {
            rounds[crNum] = totalVal - priorSum;
          } else {
            // If someone is active but we can't derive, default to Even (0) 
            // instead of showing a cumulative total as a daily score.
            rounds[crNum] = 0;
          }
        }
      }
    }

    // ── 4. Derive older completed round scores from totals if still missing ──
    //    e.g. R1 score = (total after R1) when we have round-by-round totals
    //    We skip this for now; the rounds[] array should cover it.

    map[key] = {
      firstName: extractVal(row.firstName),
      lastName: extractVal(row.lastName),
      position: extractVal(row.position),
      total: toRelPar(parseScore(row.total)),
      today: todayVal,
      thru: extractVal(row.thru ?? row.holesPlayed ?? "--"),
      status: extractVal(row.status),
      rounds,
    };
  }

  return map;
}

/**
 * Re-calculates the field-wide leaderboard rankings for a specific past round.
 * Useful for showing positions in the R1, R2, or R3 tabs that reflect 
 * the state of the tournament at that time.
 */
function calculateHistoricalRanks(playerMap, roundNum) {
  const playersInField = Object.values(playerMap).map(p => {
    let scoreAtRound = 0;
    let playedAtRound = true;
    for (let r = 1; r <= roundNum; r++) {
      if (p.rounds[r] === null) {
        playedAtRound = false;
        break;
      }
      scoreAtRound += p.rounds[r];
    }
    return { 
      key: normalizeNameKey(p.firstName, p.lastName),
      fullName: `${p.firstName} ${p.lastName}`,
      scoreAtRound, 
      playedAtRound 
    };
  }).filter(p => p.playedAtRound);

  // Sort field by cumulative score at that round
  playersInField.sort((a, b) => a.scoreAtRound - b.scoreAtRound);

  const ranks = {};
  // Standard tie logic (1, 2, 2, 4...)
  playersInField.forEach((p, i) => {
    if (i > 0 && p.scoreAtRound === playersInField[i - 1].scoreAtRound) {
      p.baseRank = playersInField[i - 1].baseRank;
    } else {
      p.baseRank = i + 1;
    }
  });

  playersInField.forEach((p, i) => {
    const tied = (i > 0 && p.scoreAtRound === playersInField[i - 1].scoreAtRound) ||
                 (i < playersInField.length - 1 && p.scoreAtRound === playersInField[i + 1].scoreAtRound);
    ranks[p.key] = tied ? `T${p.baseRank}` : `${p.baseRank}`;
  });

  return ranks;
}

/**
 * Converts "Last, First" into "First Last". 
 * Preserves trailing identifiers like "#1" or "(Papa 1)" correctly.
 */
function formatOwnerName(rawName) {
  if (!rawName.includes(",")) return rawName;
  const parts = rawName.split(",");
  const lastName = parts[0].trim();
  const firstPart = parts[1].trim();

  // Extract trailing tags like #1, #2, or (Papa 1) from first name if present
  const match = firstPart.match(/^(.*?)\s+(#\d+|\(.*\))$/);
  if (match) {
    return `${match[1]} ${lastName} ${match[2]}`;
  }
  return `${firstPart} ${lastName}`;
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

  // Pre-calculate field rankings for past rounds so "Pos" is historically accurate
  const historicalRanks = (!isTournament && roundNum < currentRound) 
    ? calculateHistoricalRanks(playerMap, roundNum)
    : null;

  const sorted = POOL_PARTICIPANTS.map((participant) => {
    const picksData = participant.picks.map((pick) => {
      const key = normalizeNameKey(pick.firstName, pick.lastName);
      const player = playerMap[key];

      return {
        name: `${pick.firstName} ${pick.lastName}`,
        firstName: pick.firstName,
        lastName: pick.lastName,
        found: !!player,
        total: player?.total ?? null,
        today: player?.today ?? null,
        thru: player?.thru ?? "--",
        position: historicalRanks ? (historicalRanks[key] ?? "--") : (player?.position ?? "--"),
        rounds: player?.rounds ?? { 1: null, 2: null, 3: null, 4: null },
        status: player?.status ?? "unknown",
      };
    });

    if (isTournament) {
      // Tournament Score = Sum of daily Best 2s
      let combinedScore = 0;
      let hasData = false;
      const dailyTotals = { 1: null, 2: null, 3: null, 4: null };

      for (let r = 1; r <= 4; r++) {
        const roundPicks = picksData
          .map(p => ({ ...p, score: p.rounds[r] }))
          .filter(p => p.score !== null)
          .sort((a, b) => a.score - b.score);
        
        if (roundPicks.length > 0) {
          const b2 = roundPicks.slice(0, SCORING_CONFIG.dailyPicksScored);
          const rTotal = b2.reduce((sum, p) => sum + p.score, 0);
          dailyTotals[r] = rTotal;
          combinedScore += rTotal;
          hasData = true;
        }
      }

      return {
        name: formatOwnerName(participant.name),
        rawName: participant.name,
        note: participant.note || null,
        picks: picksData,
        combinedScore: hasData ? combinedScore : null,
        dailyTotals,
      };
    } else {
      // Daily Score = Best 2 of current round
      const scoredPicks = picksData
        .map(p => ({ ...p, roundScore: p.rounds[roundNum] }))
        .filter((p) => p.roundScore !== null)
        .sort((a, b) => a.roundScore - b.roundScore);

      const best2 = scoredPicks.slice(0, SCORING_CONFIG.dailyPicksScored);
      const combinedScore = best2.length > 0
        ? best2.reduce((sum, p) => sum + p.roundScore, 0)
        : null;

      return {
        name: formatOwnerName(participant.name),
        rawName: participant.name,
        note: participant.note || null,
        picks: picksData,
        combinedScore,
        best2Picks: best2,
      };
    }
  }).sort((a, b) => {
    // Lower combined score wins; null (no data) goes to the bottom
    if (a.combinedScore !== null && b.combinedScore !== null) return a.combinedScore - b.combinedScore;
    if (a.combinedScore !== null) return -1;
    if (b.combinedScore !== null) return 1;
    return 0;
  });

  // Calculate standard Golf Rankings (1, T2, T2, 4...)
  sorted.forEach((p, i) => {
    if (p.combinedScore === null) {
      p.rankString = "--";
      p.isLeader = false;
      return;
    }

    if (i > 0 && p.combinedScore === sorted[i - 1].combinedScore) {
      p.baseRank = sorted[i - 1].baseRank;
    } else {
      p.baseRank = i + 1;
    }

    const tiedWithPrev = (i > 0 && p.combinedScore === sorted[i - 1].combinedScore);
    const tiedWithNext = (i < sorted.length - 1 && p.combinedScore === sorted[i + 1].combinedScore);
    const isTied = tiedWithPrev || tiedWithNext;

    p.rankString = isTied ? `T${p.baseRank}` : `${p.baseRank}`;
    p.isLeader = (p.baseRank === 1);
  });

  return sorted;
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

  // Detect current round from API metadata, golfer rows, and as a date-based fallback
  let detectedRound = parseInt(extractVal(leaderboardData.currentRound ?? leaderboardData.current_round), 10) || 1;
  if (leaderboardData.leaderboardRows) {
    for (const r of leaderboardData.leaderboardRows) {
      const pRnd = parseInt(extractVal(r.currentRound ?? r.current_round), 10);
      if (!isNaN(pRnd) && pRnd > detectedRound) detectedRound = pRnd;
    }
  }

  // Date-based fallback for Masters 2026 (April 9-12)
  const now = new Date();
  if (now.getFullYear() === 2026 && now.getMonth() === 3) { // 3 = April
    const day = now.getDate();
    if (day === 10 && detectedRound < 2) detectedRound = 2; // Fri
    if (day === 11 && detectedRound < 3) detectedRound = 3; // Sat
    if (day === 12 && detectedRound < 4) detectedRound = 4; // Sun
  }

  currentRound = detectedRound;
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
  const isLive = !isTourn && roundNum === currentRound;

  let filteredStandings = standings;
  if (showFeaturedOnly) {
    filteredStandings = standings.filter(p => featuredTeams.has(p.rawName));
  }

  let html = `<div class="standings-grid${showFeaturedOnly ? " filtered" : ""}">`;

  if (filteredStandings.length === 0 && showFeaturedOnly) {
    html += `
      <div class="loading-card">
        <p>No featured teams selected.</p>
        <button class="btn-primary" onclick="toggleShowFeaturedOnly(); document.getElementById('featured-toggle').checked=false;">Show All Teams</button>
      </div>`;
  }

  filteredStandings.forEach((participant) => {
    const isLeader = participant.isLeader;
    const isFeatured = featuredTeams.has(participant.rawName);

    let medal;
    if (participant.rankString === "1") medal = "🥇";
    else if (participant.rankString === "2") medal = "🥈";
    else if (participant.rankString === "3") medal = "🥉";
    else if (participant.rankString.startsWith("T") || participant.rankString === "--") medal = participant.rankString;
    else medal = `#${participant.rankString}`;

    // Header logic differences
    let subLabel = "";
    if (isTourn) {
      const totals = [1, 2, 3, 4].map(r => fmtScore(participant.dailyTotals[r]));
      subLabel = `Daily B2 Sum: <em>${totals.join(" + ")}</em>`;
    } else {
      const names = participant.best2Picks.map(p => p.lastName).join(" + ") || "—";
      const detail = participant.best2Picks.map(p => fmtScore(p.roundScore)).join(" + ");
      subLabel = `Best 2: <em>${names}</em>${detail ? ` (${detail})` : ""}`;
    }

    html += `
      <div class="standing-card${isLeader ? " leader" : ""}${isFeatured ? " featured" : ""}" id="sc-${participant.name.replace(/\W/g, "-")}">
        <div class="card-header">
          <button class="btn-star${isFeatured ? " active" : ""}" onclick="toggleFeatured('${participant.rawName.replace(/'/g, "\\'")}')" title="Toggle Featured">
            ${isFeatured ? "★" : "☆"}
          </button>
          <span class="rank-badge">${medal}</span>
          <div class="participant-info">
            <span class="participant-name">${participant.name}</span>
            <span class="participant-sub">${subLabel}</span>
            ${participant.note ? `<span class="participant-note">${participant.note}</span>` : ""}
          </div>
          <div class="card-score-big">
            <span class="score-label-sm">${isTourn ? "Total" : isLive ? "Today" : "Round"}</span>
            <span class="score-big ${scoreClass(participant.combinedScore)}">${fmtScore(participant.combinedScore)}</span>
          </div>
        </div>
        <div class="picks-list${isTourn ? " is-tourn" : ""}">
          <div class="picks-header">
            <span>Golfer</span><span>Pos</span>
            ${isTourn 
              ? `<span>R1</span><span>R2</span><span>R3</span><span>R4</span><span>Total</span>`
              : `<span>Thru</span><span>R${roundNum}</span><span>Overall</span>`
            }
          </div>
          ${(() => {
            // For tournament tab, pre-calculate which golfers are best 2 for EACH round
            const bestInRound = { 1: [], 2: [], 3: [], 4: [] };
            if (isTourn) {
              for (let r = 1; r <= 4; r++) {
                const dayScores = participant.picks
                  .map((p, i) => ({ i, s: p.rounds[r] }))
                  .filter(x => x.s !== null)
                  .sort((a, b) => a.s - b.s);
                bestInRound[r] = dayScores.slice(0, SCORING_CONFIG.dailyPicksScored).map(x => x.i);
              }
            }

            return participant.picks.map((pick, pIdx) => {
      const isBest2 = !isTourn && participant.best2Picks?.some((b) => b.name === pick.name);
      const isCut = pick.status === "cut" || pick.status === "wd" || pick.status === "dq";
      const showCutIndicator = isCut && (roundNum > 2 || isTourn);
      
      if (isTourn) {
        return `
              <div class="pick-row ${isCut ? "pick-cut" : ""}">
                <span class="pick-name">
                  ${pick.name}
                  ${showCutIndicator ? '<span class="tag-cut">CUT</span>' : ""}
                </span>
                <span class="pick-pos">${pick.found ? pick.position : "✕"}</span>
                <span class="pick-score ${scoreClass(pick.rounds[1])} ${bestInRound[1].includes(pIdx) ? "best-round-score" : ""}">${fmtScore(pick.rounds[1])}</span>
                <span class="pick-score ${scoreClass(pick.rounds[2])} ${bestInRound[2].includes(pIdx) ? "best-round-score" : ""}">${fmtScore(pick.rounds[2])}</span>
                <span class="pick-score ${scoreClass(pick.rounds[3])} ${bestInRound[3].includes(pIdx) ? "best-round-score" : ""}">${fmtScore(pick.rounds[3])}</span>
                <span class="pick-score ${scoreClass(pick.rounds[4])} ${bestInRound[4].includes(pIdx) ? "best-round-score" : ""}">${fmtScore(pick.rounds[4])}</span>
                <span class="pick-total ${scoreClass(pick.total)}">${fmtScore(pick.total)}</span>
              </div>`;
      }

      const displayThru = (roundNum < currentRound) 
        ? "F" 
        : (roundNum === currentRound ? pick.thru : "--");

      return `
              <div class="pick-row ${isBest2 ? "best-pick" : ""} ${!pick.found ? "not-found" : ""} ${showCutIndicator ? "pick-cut" : ""}">
                <span class="pick-name">
                  ${pick.name}
                  ${isBest2 ? '<span class="tag-best2">Best 2</span>' : ""}
                  ${showCutIndicator ? '<span class="tag-cut">CUT</span>' : ""}
                </span>
                <span class="pick-pos">${pick.found ? pick.position : "✕"}</span>
                <span class="pick-thru">${displayThru}</span>
                <span class="pick-today ${scoreClass(pick.rounds[roundNum])}">${fmtScore(pick.rounds[roundNum])}</span>
                <span class="pick-total ${scoreClass(pick.total)}">${fmtScore(pick.total)}</span>
              </div>`;
    }).join("");
          })()}
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
      const fmtName = formatOwnerName(participant.name);
      if (!pickOwnerMap[key].includes(fmtName)) {
        pickOwnerMap[key].push(fmtName);
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

    // Format owners into nice little readable chips or just a bulleted list so commas don't clash with Last, First names
    const ownerHtml = owners.map(o => `<span class="owner-pill">${o}</span>`).join(" ");

    tr.innerHTML = `
      <td class="cell-pos">${player ? (player.position || "--") : "✕"}</td>
      <td class="cell-name">${display}</td>
      <td class="cell-owner">${ownerHtml}</td>
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
  initFeatured();
  fetchLiveData();
});

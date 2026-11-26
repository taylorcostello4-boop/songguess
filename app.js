/* SongGuess — a two-player Beatles listening duel.
   Round flow: each player hears 0.25s → 0.5s → 2s → 15s from the start of
   their own song, drawn from the round's difficulty tier. Guess at any point;
   the shorter the clip, the more points. Songs live in songs.js. */
(function () {
  'use strict';

  // ───────────────────────────── game rules ─────────────────────────────
  const CLIP_LENGTHS = [0.25, 0.5, 2, 15];
  const LABELS = ['0.25 seconds', '0.5 seconds', '2 seconds', '15 seconds'];
  const POINTS = [5, 3, 2, 1];
  const ROUNDS = 5;

  // Deezer's preview links are signed and expire about 15 minutes after
  // they’re issued, so each one is fetched fresh and reused for a while.
  const PREVIEW_TTL = 9 * 60 * 1000;

  // Extra accepted answers for titles people type differently.
  const TITLE_ALIASES = {
    'Norwegian Wood (This Bird Has Flown)': [
      'Norwegian Wood',
      'This Bird Has Flown',
      'Norwegian Wood This Bird Has Flown',
    ],
    'Ob-La-Di, Ob-La-Da': ['Obladi Oblada', 'Ob La Di', 'Obladi'],
    'Back In the U.S.S.R.': ['Back in the USSR', 'Back in USSR'],
    "I'm Only Sleeping": ['I am Only Sleeping'],
    "Can't Buy Me Love": ['Cannot Buy Me Love'],
    'A Hard Day’s Night': ['Hard Day’s Night', 'Hard Days Night'],
    'Eight Days a Week': ['8 Days a Week'],
    'Strawberry Fields Forever': ['Strawberry Fields'],
    'Here, There and Everywhere': ['Here There and Everywhere'],
    'With a Little Help From My Friends': [
      'A Little Help from My Friends',
      'Little Help from My Friends',
    ],
    'The Long and Winding Road': ['Long and Winding Road'],
    'Lucy In the Sky with Diamonds': ['Lucy in the Sky'],
  };

  // ─────────────────────────── title matching ───────────────────────────
  function normalizeTitle(raw) {
    if (!raw) return '';
    let s = String(raw).toLowerCase();
    s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/\([^)]*\)/g, ' ');            // drop "(This Bird Has Flown)" etc.
    s = s.replace(/[‘’'`´]/g, '');     // can't -> cant
    s = s.replace(/&/g, ' and ');
    s = s.replace(/[.,!?;:"“”«»]/g, '');         // U.S.S.R. -> ussr
    s = s.replace(/[\[\]{}]/g, ' ');
    s = s.replace(/[-–—]/g, ' ');                // ob-la-di -> ob la di
    s = s.replace(/\b(?:by\s+the\s+beatles|the\s+beatles|beatles)\b/g, ' ');
    return s.replace(/\s+/g, ' ').trim();
  }

  function coreTitle(raw) {
    let t = normalizeTitle(raw);
    t = t.replace(/^(?:the|a|an)\s+/, '');
    return t.replace(/\s+/g, ' ').trim();
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length;
    const n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(
          prev[j] + 1,
          cur[j - 1] + 1,
          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      prev = cur;
    }
    return prev[n];
  }

  const ALIASES_BY_CORE = {};
  Object.keys(TITLE_ALIASES).forEach(function (title) {
    ALIASES_BY_CORE[coreTitle(title)] = TITLE_ALIASES[title];
  });

  function isCorrect(guess, song) {
    const gRaw = coreTitle(guess);
    if (!gRaw || !song) return false;
    const g = gRaw.replace(/\bthe\b/g, ' ').replace(/\s+/g, ' ').trim();
    const candidates = [song.title].concat(ALIASES_BY_CORE[coreTitle(song.title)] || []);
    return candidates.some(function (title) {
      const tFull = coreTitle(title);
      if (!tFull) return false;
      const t = tFull.replace(/\bthe\b/g, ' ').replace(/\s+/g, ' ').trim();
      if (g === t) return true;
      const allowed = t.length >= 16 ? 2 : t.length >= 8 ? 1 : 0;
      return allowed > 0 && levenshtein(g, t) <= allowed;
    });
  }

  // ─────────────────────────── build a game ────────────────────────────
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function buildRounds(tiers) {
    return (tiers || []).slice(0, ROUNDS).map(function (tier) {
      const pool = shuffle(tier.songs);
      return {
        tier: tier,
        songs: [pool[0], pool[1]], // player 0, player 1 — two different songs, same tier
        results: [null, null],
      };
    });
  }

  // ───────────────────────────── helpers ───────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  const ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z" fill="currentColor"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor"/></svg>',
    muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm14.6 3 2.4-2.4-1.1-1.1-2.4 2.4-2.4-2.4-1.1 1.1 2.4 2.4-2.4 2.4 1.1 1.1 2.4-2.4 2.4 2.4 1.1-1.1z" fill="currentColor"/></svg>',
  };

  // ═════════════════════════════ browser app ══════════════════════════
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = { normalizeTitle, coreTitle, isCorrect, levenshtein, shuffle, buildRounds };
    }
    return;
  }

  const screenEl = document.getElementById('screen');
  const soundBtn = document.getElementById('soundToggle');
  const audio = document.getElementById('player');
  audio.preload = 'auto';

  let ui = {};
  let raf = null;
  let hardStop = null;
  let pendingPlay = null;
  let refreshing = false;
  let actx = null;

  function freshState() {
    return {
      phase: 'setup',
      names: ['Player 1', 'Player 2'],
      players: [{ name: 'Player 1' }, { name: 'Player 2' }],
      scores: [0, 0],
      rounds: [],
      roundIndex: 0,
      turn: 0,
      stage: 0,
      heard: false,
      wrong: [],
      playing: false,
      loadedSong: null,
      last: null,
      muted: false,
      volume: 0.9,
    };
  }

  let state = freshState();

  // ─────────────────────────── preferences ─────────────────────────────
  function loadPrefs() {
    try {
      const prefs = JSON.parse(localStorage.getItem('songguess:prefs') || '{}');
      if (Array.isArray(prefs.names) && prefs.names.length === 2) state.names = prefs.names.map(String).slice(0, 2);
      if (typeof prefs.muted === 'boolean') state.muted = prefs.muted;
      if (typeof prefs.volume === 'number') state.volume = Math.min(1, Math.max(0, prefs.volume));
    } catch (e) { /* private mode, file:// restrictions — no problem */ }
  }

  function savePrefs() {
    try {
      localStorage.setItem('songguess:prefs', JSON.stringify({
        names: state.names, muted: state.muted, volume: state.volume,
      }));
    } catch (e) { /* ignore */ }
  }

  // ───────────────────────────── audio ─────────────────────────────────
  function currentSong() {
    const round = state.rounds[state.roundIndex];
    if (!round) return null;
    return round.songs[state.turn] || null;
  }

  function freshPreview(song) {
    if (!song || !song.preview) return null;
    if (!song.previewAt || Date.now() - song.previewAt > PREVIEW_TTL) return null;
    return song.preview;
  }

  // A Deezer preview URL, fetched once per song and reused until it ages out.
  function resolvePreview(song) {
    if (!song) return Promise.resolve(null);
    const cached = freshPreview(song);
    if (cached) return Promise.resolve(cached);
    if (song.previewPromise) return song.previewPromise;
    const lookup = song.deezerId
      ? deezerJsonp('https://api.deezer.com/track/' + song.deezerId)
      : Promise.resolve(null);
    song.previewPromise = lookup.then(function (track) {
      if (track && track.preview) return track.preview;
      // The stored id may be stale — fall back to a title search.
      const q = 'artist:"The Beatles" track:"' + String(song.title).replace(/["\\]/g, '') + '"';
      return deezerJsonp('https://api.deezer.com/search?q=' + encodeURIComponent(q) + '&limit=10')
        .then(function (res) {
          const wanted = coreTitle(song.title);
          const hit = ((res && res.data) || []).find(function (r) {
            return r && r.preview && r.artist && r.artist.name === 'The Beatles' &&
              coreTitle(r.title) === wanted;
          });
          return hit ? hit.preview : null;
        });
    }).then(function (url) {
      song.previewPromise = null;
      if (url) {
        song.preview = url;
        song.previewAt = Date.now();
      }
      return url || null;
    }, function () {
      song.previewPromise = null;
      return null;
    });
    return song.previewPromise;
  }

  // Warm up every song in the game so the first press of play is instant.
  function prefetchPreviews(rounds) {
    (rounds || []).forEach(function (round) {
      round.songs.forEach(function (song) { if (song) resolvePreview(song); });
    });
  }

  function loadSong(song) {
    if (!song) return;
    const url = freshPreview(song);
    if (state.loadedSong === song && (!url || audio.getAttribute('src') === url)) return;
    state.loadedSong = song;
    if (url) {
      audio.src = url;
      audio.load();
      return;
    }
    resolvePreview(song).then(function (fresh) {
      if (!fresh || state.loadedSong !== song) return;
      audio.src = fresh;
      audio.load();
    });
  }

  function setProgress(pct) {
    if (ui.progress) ui.progress.style.width = Math.max(0, Math.min(1, pct)) * 100 + '%';
  }

  function tick() {
    if (!state.playing) return;
    const limit = CLIP_LENGTHS[state.stage];
    const t = Math.min(limit, audio.currentTime || 0);
    setProgress(t / limit);
    if (ui.recordTime) ui.recordTime.textContent = Math.max(0, limit - t).toFixed(1) + 's';
    if (audio.ended || audio.paused || t >= limit - 0.01) {
      endClip(true);
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  async function playClip() {
    if (state.phase !== 'turn') return;
    if (state.playing) {
      endClip(false);
      return;
    }
    const song = currentSong();
    if (!song) return;
    let url = freshPreview(song);
    if (!url) {
      setHint('Loading the clip…');
      url = await resolvePreview(song);
      if (!url) {
        setHint('Couldn’t load the clip. Check your connection, then press play.', true);
        return;
      }
      if (state.phase !== 'turn' || currentSong() !== song) return;
    }
    if (audio.getAttribute('src') !== url) {
      audio.src = url;
      audio.load();
    }
    state.loadedSong = song;
    audio.muted = state.muted;
    audio.volume = state.volume;
    try { audio.currentTime = 0; } catch (e) { /* not ready yet */ }

    state.playing = true;
    setProgress(0);
    updateTurnUI();
    try {
      await audio.play();
    } catch (e) {
      state.playing = false;
      updateTurnUI();
      setHint('Playback was blocked — press play once more.', true);
      return;
    }
    if (ui.recordTime) ui.recordTime.textContent = CLIP_LENGTHS[state.stage].toFixed(1) + 's';
    raf = requestAnimationFrame(tick);
    clearTimeout(hardStop);
    // Safety net in case animation frames are throttled by the browser.
    hardStop = setTimeout(function () {
      if (state.playing) endClip(true);
    }, CLIP_LENGTHS[state.stage] * 1000 + 300);
  }

  function endClip(completed) {
    clearTimeout(hardStop);
    hardStop = null;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    try { audio.pause(); } catch (e) { /* ignore */ }
    state.playing = false;
    if (completed) {
      state.heard = true;
      setProgress(1);
      beep('clip');
      setHint(LABELS[state.stage] + ' played. Name that song.');
    }
    updateTurnUI();
  }

  function stopEverything() {
    clearTimeout(hardStop);
    clearTimeout(pendingPlay);
    hardStop = null;
    pendingPlay = null;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    state.playing = false;
    try { audio.pause(); } catch (e) { /* ignore */ }
  }

  audio.addEventListener('error', async function () {
    if (state.phase !== 'turn' || refreshing || !state.loadedSong) return;
    const song = state.loadedSong;
    refreshing = true;
    setHint('Clip didn’t load — reconnecting…', true);
    song.preview = null;
    song.previewAt = 0;
    const url = await resolvePreview(song);
    refreshing = false;
    if (state.phase !== 'turn' || currentSong() !== song) return;
    if (url) {
      state.loadedSong = null;
      loadSong(song);
      setHint('Reconnected. Press play again.');
    } else {
      setHint('Couldn’t load the clip. Check your connection, then press play.', true);
    }
  });

  // Deezer's API has no CORS headers, so requests come back as JSONP.
  function deezerJsonp(url) {
    return new Promise(function (resolve) {
      const cb = '__sgCb' + Math.random().toString(36).slice(2);
      const script = document.createElement('script');
      let done = false;
      const finish = function (val) {
        if (done) return;
        done = true;
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        script.remove();
        resolve(val || null);
      };
      window[cb] = function (data) { finish(data && !data.error ? data : null); };
      script.onerror = function () { finish(null); };
      script.src = url + (url.indexOf('?') < 0 ? '?' : '&') + 'output=jsonp&callback=' + cb;
      document.head.appendChild(script);
      setTimeout(function () { finish(null); }, 8000);
    });
  }

  // ─────────────────────────── UI sounds ───────────────────────────────
  function beep(kind) {
    if (state.muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const now = actx.currentTime;
      const notes = kind === 'win' ? [[523, 0], [784, 0.11]]
        : kind === 'lose' ? [[196, 0], [147, 0.12]]
        : [[880, 0]];
      notes.forEach(function (pair) {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = kind === 'lose' ? 'triangle' : 'sine';
        o.frequency.value = pair[0];
        g.gain.setValueAtTime(0.0001, now + pair[1]);
        g.gain.exponentialRampToValueAtTime(0.06, now + pair[1] + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + pair[1] + 0.3);
        o.connect(g).connect(actx.destination);
        o.start(now + pair[1]);
        o.stop(now + pair[1] + 0.32);
      });
    } catch (e) { /* audio context unavailable */ }
  }

  // ─────────────────────────── game flow ───────────────────────────────
  function startGame() {
    const n1Input = document.getElementById('name1');
    const n2Input = document.getElementById('name2');
    const n1 = (n1Input && n1Input.value || '').trim() || 'Player 1';
    const n2 = (n2Input && n2Input.value || '').trim() || 'Player 2';
    state.names = [n1.slice(0, 18), n2.slice(0, 18)];
    savePrefs();
    resetGame();
  }

  function resetGame() {
    const tiers = window.SONG_TIERS || [];
    state.players = [{ name: state.names[0] }, { name: state.names[1] }];
    state.scores = [0, 0];
    state.rounds = buildRounds(tiers);
    prefetchPreviews(state.rounds);
    state.roundIndex = 0;
    state.turn = 0;
    state.last = null;
    state.loadedSong = null;
    state.phase = 'handoff';
    render();
  }

  function startTurn() {
    state.phase = 'turn';
    state.stage = 0;
    state.heard = false;
    state.wrong = [];
    state.playing = false;
    loadSong(currentSong());
    render();
  }

  function handleGuess(raw) {
    if (state.phase !== 'turn') return;
    const guess = String(raw || '').trim();
    if (!guess) {
      setHint('Type a song title first.');
      if (ui.input) ui.input.focus();
      return;
    }
    if (!state.heard) {
      setHint('Have a listen first — press play.');
      return;
    }
    const song = currentSong();
    if (isCorrect(guess, song)) {
      finishTurn({ correct: true, stage: state.stage, points: POINTS[state.stage], guessed: guess });
      return;
    }

    state.wrong.push({ text: guess, stage: state.stage });
    if (state.stage < CLIP_LENGTHS.length - 1) {
      beep('lose');
      advanceStage('Not it.');
    } else {
      finishTurn({ correct: false, stage: state.stage, points: 0, guessed: guess });
    }
  }

  // Move up one rung of the listen ladder (0.25s → 0.5s → 2s → 15s).
  function advanceStage(lead) {
    state.stage += 1;
    state.heard = false;
    if (ui.input) ui.input.value = '';
    updateTurnUI();
    setProgress(0);
    setHint(lead + ' Here comes ' + LABELS[state.stage] + ' — listen closely.');
    clearTimeout(pendingPlay);
    pendingPlay = setTimeout(function () {
      pendingPlay = null;
      if (state.phase === 'turn' && !state.playing && !state.heard) playClip();
    }, 550);
  }

  // Skip to the next listen without guessing; on the last rung, reveal the song.
  function skipStage() {
    if (state.phase !== 'turn') return;
    stopEverything();
    if (state.stage < CLIP_LENGTHS.length - 1) {
      advanceStage('Skipped.');
    } else {
      finishTurn({ correct: false, stage: state.stage, points: 0, skipped: true });
    }
  }

  function finishTurn(outcome) {
    stopEverything();
    const round = state.rounds[state.roundIndex];
    const song = currentSong();
    round.results[state.turn] = {
      correct: outcome.correct,
      stage: outcome.stage,
      points: outcome.points,
      song: song,
      guessed: outcome.guessed || '',
      skipped: !!outcome.skipped,
    };
    state.scores[state.turn] += outcome.points;
    state.last = {
      correct: outcome.correct,
      stage: outcome.stage,
      points: outcome.points,
      song: song,
      player: state.turn,
      skipped: !!outcome.skipped,
    };
    if (outcome.correct) beep('win');
    else if (!outcome.skipped) beep('lose');
    state.phase = 'result';
    render();
  }

  function continueAfterResult() {
    const first = state.roundIndex % 2;
    if (state.turn === first) {
      state.turn = 1 - first;
      state.phase = 'handoff';
    } else {
      state.phase = 'round';
    }
    render();
  }

  function nextRound() {
    if (state.roundIndex < state.rounds.length - 1) {
      state.roundIndex += 1;
      state.turn = state.roundIndex % 2;
      state.phase = 'handoff';
    } else {
      state.phase = 'end';
    }
    render();
  }

  function toggleSound() {
    state.muted = !state.muted;
    audio.muted = state.muted;
    soundBtn.classList.toggle('is-muted', state.muted);
    soundBtn.setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
    savePrefs();
  }

  // ─────────────────────────── rendering ───────────────────────────────
  function render() {
    stopEverything();
    const renderers = {
      setup: renderSetup,
      handoff: renderHandoff,
      turn: renderTurn,
      result: renderResult,
      round: renderRoundSummary,
      end: renderEnd,
    };
    (renderers[state.phase] || renderSetup)();
  }

  function scoreChip(i, active) {
    const name = esc(state.players[i] ? state.players[i].name : 'Player ' + (i + 1));
    return '<div class="score-chip p' + i + (active ? ' is-active' : '') + '">' +
      '<span class="score-chip__name"><span class="dot"></span>' + name + '</span>' +
      '<span class="score-chip__pts">' + state.scores[i] + '<small>pts</small></span>' +
      '</div>';
  }

  function renderSetup() {
    soundBtn.classList.toggle('is-muted', state.muted);
    audio.muted = state.muted;
    ui = {};
    screenEl.innerHTML =
      '<section class="card setup anim">' +
        '<p class="eyebrow">A two-player listening duel</p>' +
        '<h1 class="hero-title">Name that <br><span>Beatles song</span></h1>' +
        '<p class="lede">A quarter of a second. Half a second. Two seconds. Fifteen. ' +
          'Guess as early as you can — each round, both players get their own song, ' +
          'drawn from the same difficulty tier.</p>' +
        '<form id="setupForm" class="setup-form">' +
          '<div class="names">' +
            '<label class="name-field p0"><span>Player one</span>' +
              '<input id="name1" maxlength="18" autocomplete="off" spellcheck="false" value="' + esc(state.names[0]) + '"></label>' +
            '<label class="name-field p1"><span>Player two</span>' +
              '<input id="name2" maxlength="18" autocomplete="off" spellcheck="false" value="' + esc(state.names[1]) + '"></label>' +
          '</div>' +
          '<ol class="rules">' +
            '<li><b>0.25s</b><span>A quarter of a second — 5 points</span></li>' +
            '<li><b>0.5s</b><span>Miss it, hear half a second — 3 points</span></li>' +
            '<li><b>2s</b><span>Then two seconds — 2 points</span></li>' +
            '<li><b>15s</b><span>Then fifteen — 1 point</span></li>' +
          '</ol>' +
          '<button type="submit" class="btn btn--primary btn--lg">Start the duel</button>' +
        '</form>' +
        '<p class="fineprint">Five rounds of rising difficulty · highest score wins · ' +
          'clips are the first 30 seconds of each song, streamed from Deezer, so an internet connection is required.</p>' +
      '</section>';
  }

  function renderHandoff() {
    const round = state.rounds[state.roundIndex];
    if (!round) { state.phase = 'setup'; render(); return; }
    const player = state.players[state.turn];
    const other = state.players[1 - state.turn];
    const n = state.roundIndex + 1;
    screenEl.innerHTML =
      '<section class="card handoff p' + state.turn + ' anim">' +
        '<p class="eyebrow">Round ' + n + ' of ' + ROUNDS + ' · ' + esc(round.tier.name) + '</p>' +
        '<h2 class="handoff__title">' + esc(player.name) + ', you’re up.</h2>' +
        '<p class="muted">' + esc(round.tier.blurb) + '. Hand the laptop over, ' +
          esc(other.name) + ' — no peeking at the screen.</p>' +
        '<div class="handoff-badge"><span class="handoff-badge__disc"></span>' +
          '<span>' + esc(player.name) + ' plays this one</span></div>' +
        '<div class="score-strip">' + scoreChip(0, state.turn === 0) + scoreChip(1, state.turn === 1) + '</div>' +
        '<button class="btn btn--primary btn--lg" data-action="ready">I’m ready — play my song</button>' +
        '<p class="fineprint">Your first listen is just a quarter of a second.</p>' +
      '</section>';
  }

  function renderTurn() {
    const round = state.rounds[state.roundIndex];
    const player = state.players[state.turn];
    const n = state.roundIndex + 1;
    screenEl.innerHTML =
      '<section class="turn p' + state.turn + ' anim">' +
        '<div class="score-strip">' + scoreChip(0, state.turn === 0) + scoreChip(1, state.turn === 1) + '</div>' +
        '<div class="turn-head">' +
          '<span class="eyebrow">' + esc(player.name) + ' · Round ' + n + ' of ' + ROUNDS + '</span>' +
          '<span class="tier-pill">' + esc(round.tier.name) + '</span>' +
        '</div>' +
        '<div class="stage">' +
          '<div class="record" id="record">' +
            '<div class="record__disc"></div>' +
            '<div class="record__label p' + state.turn + '">' +
              '<span class="record__time" id="recordTime">0.25s</span>' +
              '<span class="record__sub">clip</span>' +
            '</div>' +
          '</div>' +
          '<div class="progress" aria-hidden="true"><div class="progress__fill" id="progressFill"></div></div>' +
          '<button class="play-btn" data-action="play" id="playBtn">' +
            '<span class="play-btn__ic">' + ICONS.play + ICONS.pause + '</span>' +
            '<span id="playLabel">Play 0.25 seconds</span>' +
          '</button>' +
          '<ol class="ladder" id="ladder" aria-label="Snippet lengths: 0.25, 0.5, 2 and 15 seconds"></ol>' +
          '<button class="skip-btn" type="button" data-action="skip" id="skipBtn">Skip ahead — hear 0.5 seconds</button>' +
        '</div>' +
        '<form id="guessForm" class="guess" autocomplete="off">' +
          '<label class="sr-only" for="guessInput">Song title</label>' +
          '<input id="guessInput" type="text" placeholder="Type the song title…" ' +
            'autocomplete="off" autocapitalize="words" spellcheck="false" maxlength="60">' +
          '<button type="submit" class="btn btn--primary">Guess</button>' +
        '</form>' +
        '<p class="feedback" id="feedback" role="status" aria-live="polite">Press play, then name that tune.</p>' +
        '<ul class="attempts" id="attempts"></ul>' +
      '</section>';

    ui = {
      record: document.getElementById('record'),
      recordTime: document.getElementById('recordTime'),
      progress: document.getElementById('progressFill'),
      playBtn: document.getElementById('playBtn'),
      playLabel: document.getElementById('playLabel'),
      ladder: document.getElementById('ladder'),
      skipBtn: document.getElementById('skipBtn'),
      attempts: document.getElementById('attempts'),
      input: document.getElementById('guessInput'),
      feedback: document.getElementById('feedback'),
    };
    updateTurnUI();
    if (window.matchMedia && window.matchMedia('(pointer:fine)').matches && ui.input) {
      setTimeout(function () { if (ui.input) ui.input.focus(); }, 80);
    }
  }

  function updateTurnUI() {
    if (!ui.playBtn) return;
    const limit = CLIP_LENGTHS[state.stage];
    ui.playLabel.textContent = state.playing
      ? 'Stop'
      : state.heard ? 'Hear ' + LABELS[state.stage] + ' again' : 'Play ' + LABELS[state.stage];
    ui.playBtn.classList.toggle('is-playing', state.playing);
    ui.record.classList.toggle('is-playing', state.playing);
    if (!state.playing) {
      ui.recordTime.textContent = limit + 's';
      if (!state.heard) setProgress(0);
    }
    ui.ladder.innerHTML = CLIP_LENGTHS.map(function (len, i) {
      const cls = i < state.stage ? 'is-missed' : i === state.stage ? 'is-active' : 'is-locked';
      return '<li class="ladder__step ' + cls + '"><span>' + len + 's</span></li>';
    }).join('');
    if (ui.skipBtn) {
      ui.skipBtn.textContent = state.stage < CLIP_LENGTHS.length - 1
        ? 'Skip ahead — hear ' + LABELS[state.stage + 1]
        : 'Skip — reveal the answer';
    }
    ui.attempts.innerHTML = state.wrong.map(function (w) {
      return '<li><span class="x" aria-hidden="true">✕</span> “' + esc(w.text) + '”' +
        ' <span class="at">at ' + CLIP_LENGTHS[w.stage] + 's</span></li>';
    }).join('');
  }

  function setHint(text, warn) {
    if (!ui.feedback) return;
    ui.feedback.textContent = text;
    ui.feedback.classList.toggle('is-warn', !!warn);
  }

  function renderResult() {
    const last = state.last;
    const player = state.players[last.player];
    const n = state.roundIndex + 1;
    const tier = state.rounds[state.roundIndex].tier;
    const first = state.roundIndex % 2;
    const nextName = state.players[1 - state.turn].name;
    const nextLabel = state.turn === first ? 'Pass to ' + nextName : 'See round results';

    const headlines = [
      'A quarter of a second. That’s all it took.',
      'Half a second. Sharp ears.',
      'Two seconds was enough.',
      'Worth the wait.',
    ];
    const headline = last.correct
      ? headlines[last.stage]
      : last.skipped ? 'Skipped this one' : 'Out of listens';
    const sub = last.correct
      ? 'Named it after listening to ' + LABELS[last.stage] + '.'
      : last.skipped
        ? 'No guess this time. Here’s the one that got away.'
        : 'You had all fifteen seconds and still missed it — it happens to the best of us.';

    screenEl.innerHTML =
      '<section class="card result p' + last.player + ' anim">' +
        '<p class="eyebrow">' + esc(player.name) + ' · Round ' + n + ' of ' + ROUNDS +
          ' · ' + esc(tier.name) + '</p>' +
        '<div class="result__badge ' + (last.correct ? 'is-win' : 'is-miss') + '">' +
          (last.correct ? '✦' : '✕') + '</div>' +
        '<h2>' + esc(headline) + '</h2>' +
        '<p class="muted">' + esc(sub) + '</p>' +
        '<div class="answer">' +
          '<span class="answer__kicker">The song was</span>' +
          '<span class="answer__title">' + esc(last.song.title) + '</span>' +
          '<span class="answer__album">' + esc(last.song.album) + '</span>' +
        '</div>' +
        '<div class="points' + (last.correct ? '' : ' is-zero') + '">' +
          (last.correct ? '+' + last.points : '+0') + '<span>points</span></div>' +
        '<button class="btn btn--primary btn--lg" data-action="continue">' + esc(nextLabel) + '</button>' +
      '</section>';
  }

  function resultCell(i) {
    const round = state.rounds[state.roundIndex];
    const res = round.results[i];
    const player = state.players[i];
    const song = round.songs[i];
    let status;
    let pts;
    if (!res) {
      status = 'Still to play';
      pts = '—';
    } else if (res.correct) {
      status = 'Named it at ' + CLIP_LENGTHS[res.stage] + 's';
      pts = '+' + res.points;
    } else if (res.skipped) {
      status = 'Skipped';
      pts = '+0';
    } else {
      status = 'No luck';
      pts = '+0';
    }
    return '<div class="duo__card p' + i + '">' +
      '<span class="duo__head">' + esc(player.name) + '</span>' +
      '<span class="duo__song">' + esc(song.title) + '</span>' +
      '<span class="duo__album">' + esc(song.album) + '</span>' +
      '<span class="duo__status">' + esc(status) + '</span>' +
      '<span class="duo__pts">' + pts + '<small>pts</small></span>' +
      '</div>';
  }

  function renderRoundSummary() {
    const n = state.roundIndex + 1;
    const tier = state.rounds[state.roundIndex].tier;
    const isLast = state.roundIndex === state.rounds.length - 1;
    screenEl.innerHTML =
      '<section class="card round anim">' +
        '<p class="eyebrow">Round ' + n + ' of ' + ROUNDS + ' · ' + esc(tier.name) + '</p>' +
        '<h2>Round ' + n + ' wrapped</h2>' +
        '<div class="duo">' + resultCell(0) + resultCell(1) + '</div>' +
        '<div class="totals">' +
          '<span class="p0">' + esc(state.players[0].name) + ' <b>' + state.scores[0] + '</b></span>' +
          '<span class="totals__vs">vs</span>' +
          '<span class="p1">' + esc(state.players[1].name) + ' <b>' + state.scores[1] + '</b></span>' +
        '</div>' +
        '<button class="btn btn--primary btn--lg" data-action="next-round">' +
          (isLast ? 'See final results' : 'Next round') + '</button>' +
      '</section>';
  }

  function renderEnd() {
    const [a, b] = state.names;
    const diff = state.scores[0] - state.scores[1];
    const winner = diff === 0 ? null : diff > 0 ? 0 : 1;
    const headline = winner === null ? 'Dead heat.' : state.players[winner].name + ' wins.';

    const rows = state.rounds.map(function (round, i) {
      const cells = [0, 1].map(function (p) {
        const r = round.results[p];
        const pts = r ? r.points : 0;
        const mark = r && r.correct ? ' ✓' : '';
        return '<span class="p' + p + '">' + esc(round.songs[p].title) + mark +
          ' <b>+' + pts + '</b></span>';
      }).join('');
      return '<div class="round-row">' +
        '<span class="round-row__label">Round ' + (i + 1) + ' · ' + esc(round.tier.name) + '</span>' +
        '<span class="round-row__cells">' + cells + '</span>' +
        '</div>';
    }).join('');

    screenEl.innerHTML =
      '<section class="card end anim">' +
        '<p class="eyebrow">Final score · out of ' + (ROUNDS * 5) + '</p>' +
        '<h1 class="end__title">' + esc(headline) + '</h1>' +
        '<p class="muted">' + (winner === null
          ? 'Perfectly matched. A rematch is the only civil way to settle it.'
          : 'Won by ' + Math.abs(diff) + (Math.abs(diff) === 1 ? ' point' : ' points') + '.') + '</p>' +
        '<div class="podium">' +
          '<div class="podium__card p0' + (winner === 0 ? ' is-winner' : '') + '">' +
            '<span class="podium__name">' + esc(a) + '</span>' +
            '<span class="podium__score">' + state.scores[0] + '</span>' +
            '<span class="podium__pts">points</span>' +
          '</div>' +
          '<div class="podium__card p1' + (winner === 1 ? ' is-winner' : '') + '">' +
            '<span class="podium__name">' + esc(b) + '</span>' +
            '<span class="podium__score">' + state.scores[1] + '</span>' +
            '<span class="podium__pts">points</span>' +
          '</div>' +
        '</div>' +
        '<div class="final-table">' +
          '<div class="final-table__head">' +
            '<span class="p0">' + esc(a) + '</span>' +
            '<span class="p1">' + esc(b) + '</span>' +
          '</div>' +
          rows +
        '</div>' +
        '<div class="end__actions">' +
          '<button class="btn btn--primary" data-action="rematch">Rematch — new songs</button>' +
          '<button class="btn" data-action="new-players">Change players</button>' +
        '</div>' +
        '<p class="fineprint">Clips are the first 30 seconds of each song, streamed from Deezer.</p>' +
      '</section>';
  }

  // ─────────────────────────── events ──────────────────────────────────
  screenEl.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    switch (btn.dataset.action) {
      case 'play': playClip(); break;
      case 'skip': skipStage(); break;
      case 'ready': startTurn(); break;
      case 'continue': continueAfterResult(); break;
      case 'next-round': nextRound(); break;
      case 'rematch': resetGame(); break;
      case 'new-players': state.phase = 'setup'; render(); break;
      default: break;
    }
  });

  screenEl.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.id === 'setupForm') startGame();
    else if (e.target.id === 'guessForm') {
      const input = document.getElementById('guessInput');
      handleGuess(input ? input.value : '');
    }
  });

  soundBtn.addEventListener('click', toggleSound);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state.playing) endClip(false);
  });

  // ───────────────────────────── boot ──────────────────────────────────
  loadPrefs();
  audio.muted = state.muted;
  soundBtn.classList.toggle('is-muted', state.muted);
  soundBtn.setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
  soundBtn.innerHTML = ICONS.speaker + ICONS.muted;
  state.phase = 'setup';
  render();
})();

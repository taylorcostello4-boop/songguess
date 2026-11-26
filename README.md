# SongGuess

A two-player Beatles song-guessing duel. You hear a quarter of a second from
the start of a song, guess, and if you miss you get half a second — then two
seconds, then fifteen. The earlier you name the tune, the more points you score.

**Play online:** https://taylorcostello4-boop.github.io/songguess/

## Play

Open `index.html` in a browser (double-click it, or `open index.html`). No build,
no server, no install. It needs an internet connection: the clips stream from
Deezer and the display font comes from Google Fonts.

## How a game works

- **Five rounds of rising difficulty** — Warm-Up, Familiar, In Between, Deep Cuts,
  Connoisseur. Each round draws from its own tier of songs.
- **Both players play every round**, each on their own song from the same tier.
  Who goes first alternates each round.
- **The listen ladder:** 0.25 seconds → guess; wrong → 0.5 seconds; wrong →
  2 seconds; wrong → 15 seconds. Every rung replays the song from its start,
  so each listen is the previous one plus a few more seconds.
- **Skip ahead:** not ready to guess? The skip link hands you the next, longer
  listen without typing anything. On the 15s rung it reveals the song and ends
  the turn at 0 points.
- **Points:** 5 for naming it at 0.25s, 3 at 0.5s, 2 at 2s, 1 at 15s. Nothing after
  four misses. Maximum 25.
- **Answers are forgiving:** case, punctuation, missing "The"/"A", ampersands,
  minor typos and the usual alternate titles ("Norwegian Wood", "Ob-La-Di",
  "Back in the USSR") are all accepted.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | The look — warm ink, gold vs. sea-glass player colours, vinyl record |
| `app.js` | Game flow, audio playback, title matching |
| `songs.js` | The catalogue: 47 songs across 5 difficulty tiers |

`app.js` exports its pure helpers (`isCorrect`, `coreTitle`, `buildRounds`, …)
when loaded in Node, so the matching and round-building logic can be tested
without a browser.

## Songs and audio

Clips are the first 30 seconds of each track, streamed from Deezer's public
preview API — nothing is downloaded into this folder. Each entry in `songs.js`
stores a stable Deezer track id; the actual preview URL is fetched in the
browser when a game starts. That's deliberate: Deezer signs its preview URLs
and they expire after about 15 minutes, so they can't be stored. If a preview
fails to load, the game looks that song up again by id, and then by title, and
retries.

To add songs, search:

```
https://api.deezer.com/search?q=artist:"The Beatles" track:"<song>"
```

and add an entry to the matching tier in `songs.js` with the result's `title`,
`album.title` and `id`. Any Beatles recording works, but the tier assignments
are what make the game get harder.

Deezer's API sends no CORS headers, so lookups go through JSONP
(`&output=jsonp&callback=…`) rather than `fetch`.

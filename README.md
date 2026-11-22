# SongGuess

A two-player Beatles song-guessing duel. You hear a tenth of a second of a song,
guess, and if you miss you get half a second — then two seconds, then fifteen.
The earlier you name the tune, the more points you score.

**Play online:** https://taylorcostello4-boop.github.io/songguess/

## Play

Open `index.html` in a browser (double-click it, or `open index.html`). No build,
no server, no install. It needs an internet connection: the clips stream from
Apple and the display font comes from Google Fonts.

## How a game works

- **Five rounds of rising difficulty** — Warm-Up, Familiar, In Between, Deep Cuts,
  Connoisseur. Each round draws from its own tier of songs.
- **Both players play every round**, each on their own song from the same tier.
  Who goes first alternates each round.
- **The listen ladder:** 0.1 seconds → guess; wrong → 0.5 seconds; wrong →
  2 seconds; wrong → 15 seconds. A correct guess ends your turn and sends you on.
- **Skip ahead:** not ready to guess? The skip link hands you the next, longer
  listen without typing anything. On the 15s rung it reveals the song and ends
  the turn at 0 points.
- **Points:** 5 for naming it at 0.1s, 3 at 0.5s, 2 at 2s, 1 at 15s. Nothing after
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

Clips are the official 30-second previews from Apple's public iTunes / Apple
Music preview API and stream from Apple's CDN — nothing is downloaded into this
folder. If a stored preview URL ever stops working, the game looks that song up
again automatically from the iTunes API and retries.

To add songs, search:

```
https://itunes.apple.com/search?term=<song>+Beatles&entity=song
```

and add an entry to the matching tier in `songs.js` using the result's
`trackName`, `collectionName` and `previewUrl`. Any Beatles recording works, but
the tier assignments are what make the game get harder.

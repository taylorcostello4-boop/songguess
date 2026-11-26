/* Song catalogue — titles and the Deezer track ids whose 30-second previews
   the game streams. Deezer previews are the first 30 seconds of the track,
   so every clip begins at the start of the song. Streams need an internet
   connection. To add songs, search
   https://api.deezer.com/search?q=artist:"The Beatles" track:"<title>"
   and add the track's `id` below; the game looks the preview URL up at
   play time (Deezer's preview links are signed and expire after ~15
   minutes, so they can’t be stored here). */
window.SONG_TIERS = [
  { level: 1, name: "Warm-Up", blurb: "Anthems you’ve heard a thousand times", songs: [
    { title: "Hey Jude", album: "The Beatles 1967-1970 (The Blue Album)", deezerId: 116348108 },
    { title: "Let It Be", album: "Let It Be", deezerId: 116348656 },
    { title: "Yesterday", album: "Help!", deezerId: 116348366 },
    { title: "Come Together", album: "Abbey Road (Remastered)", deezerId: 116348452 },
    { title: "Here Comes the Sun", album: "Abbey Road (Remastered)", deezerId: 116348464 },
    { title: "Help!", album: "Help!", deezerId: 116348342 },
    { title: "Yellow Submarine", album: "Yellow Submarine", deezerId: 116348724 },
    { title: "I Want to Hold Your Hand", album: "Meet The Beatles!", deezerId: 116348148 },
    { title: "Love Me Do", album: "Please Please Me", deezerId: 116348328 },
  ]},
  { level: 2, name: "Familiar", blurb: "Core catalogue — sing-along territory", songs: [
    { title: "A Hard Day’s Night", album: "A Hard Day’s Night", deezerId: 116348426 },
    { title: "Can’t Buy Me Love", album: "A Hard Day’s Night", deezerId: 116348438 },
    { title: "Eight Days a Week", album: "Beatles For Sale", deezerId: 116348384 },
    { title: "All You Need Is Love", album: "Yellow Submarine", deezerId: 116348734 },
    { title: "Penny Lane", album: "Magical Mystery Tour", deezerId: 116348296 },
    { title: "Ticket to Ride", album: "Help!", deezerId: 116348354 },
    { title: "I Saw Her Standing There", album: "Please Please Me", deezerId: 116348314 },
    { title: "Nowhere Man", album: "The Beatles 1962-1966 (The Red Album)", deezerId: 116348258 },
    { title: "Lucy in the Sky with Diamonds", album: "Sgt. Pepper’s Lonely Hearts Club Band", deezerId: 116348674 },
  ]},
  { level: 3, name: "In Between", blurb: "Albums a little deeper in", songs: [
    { title: "Something", album: "Abbey Road (Remastered)", deezerId: 116348454 },
    { title: "Norwegian Wood (This Bird Has Flown)", album: "Rubber Soul", deezerId: 116348254 },
    { title: "Eleanor Rigby", album: "Revolver", deezerId: 116348400 },
    { title: "Get Back", album: "Let It Be", deezerId: 116348668 },
    { title: "The Long and Winding Road", album: "Let It Be", deezerId: 116348664 },
    { title: "Ob-La-Di, Ob-La-Da", album: "The Beatles (The White Album)", deezerId: 116348198 },
    { title: "While My Guitar Gently Weeps", album: "The Beatles (The White Album)", deezerId: 116348204 },
    { title: "With a Little Help from My Friends", album: "Sgt. Pepper’s Lonely Hearts Club Band", deezerId: 116348672 },
    { title: "Back in the U.S.S.R.", album: "The Beatles (The White Album)", deezerId: 116348192 },
  ]},
  { level: 4, name: "Deep Cuts", blurb: "For the ones who know the B-sides", songs: [
    { title: "Strawberry Fields Forever", album: "Magical Mystery Tour", deezerId: 116348294 },
    { title: "Across the Universe", album: "Let It Be", deezerId: 116348650 },
    { title: "Here, There and Everywhere", album: "Revolver", deezerId: 116348406 },
    { title: "Blackbird", album: "The Beatles (The White Album)", deezerId: 116348212 },
    { title: "In My Life", album: "Rubber Soul", deezerId: 116348272 },
    { title: "Michelle", album: "Rubber Soul", deezerId: 116348264 },
    { title: "Golden Slumbers", album: "Abbey Road (Remastered)", deezerId: 116348478 },
    { title: "Martha My Dear", album: "The Beatles (The White Album)", deezerId: 116348208 },
    { title: "Rocky Raccoon", album: "The Beatles (The White Album)", deezerId: 116348216 },
  ]},
  { level: 5, name: "Connoisseur", blurb: "Only true scholars get these", songs: [
    { title: "For No One", album: "Revolver", deezerId: 116348416 },
    { title: "I’m Only Sleeping", album: "Yesterday and Today", deezerId: 116348402 },
    { title: "Rain", album: "Hey Jude", deezerId: 116348856 },
    { title: "She Said She Said", album: "Revolver", deezerId: 116348410 },
    { title: "Tomorrow Never Knows", album: "Revolver", deezerId: 116348424 },
    { title: "Old Brown Shoe", album: "The Beatles 1967-1970 (The Blue Album)", deezerId: 116348124 },
    { title: "Savoy Truffle", album: "The Beatles (The White Album)", deezerId: 116348244 },
    { title: "Hey Bulldog", album: "Yellow Submarine", deezerId: 116348730 },
    { title: "Only a Northern Song", album: "Yellow Submarine", deezerId: 116348726 },
    { title: "Blue Jay Way", album: "Magical Mystery Tour", deezerId: 116348286 },
    { title: "Love You To", album: "Revolver", deezerId: 116348404 },
  ]},
];

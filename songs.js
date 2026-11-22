/* Song catalogue — titles and 30-second preview clips served by the public
   iTunes / Apple Music preview API. Clips stream from Apple’s CDN, so the
   game needs an internet connection. To add songs, copy a result from
   https://itunes.apple.com/search?term=<title>+Beatles&entity=song into the
   right tier below; the preview URL is the `previewUrl` field. */
window.SONG_TIERS = [
  { level: 1, name: "Warm-Up", blurb: "Anthems you’ve heard a thousand times", songs: [
    { title: "Hey Jude", album: "The Beatles 1967-1970 (The Blue Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3d/08/f5/3d08f5d7-1e0a-99d9-1085-d50ecc972bb9/mzaf_1689604474306790314.plus.aac.p.m4a" },
    { title: "Let It Be", album: "Let It Be", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/76/fd/6076fd8f-422a-d5e3-7b02-5953bc93cfbd/mzaf_3945462995290301839.plus.aac.p.m4a" },
    { title: "Yesterday", album: "Help!", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/69/2d/d1692d74-fe32-c676-7a1d-00deacae1644/mzaf_11316115358642175957.plus.aac.p.m4a" },
    { title: "Come Together", album: "Abbey Road (Remastered)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/26/65/7c/26657c20-9fec-56d6-55ff-61a76996f19b/mzaf_6128091568231335556.plus.aac.p.m4a" },
    { title: "Here Comes the Sun", album: "Abbey Road (Remastered)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cd/7d/83/cd7d834f-34bf-7be0-1647-0fb0920d25a7/mzaf_5281747653026802926.plus.aac.p.m4a" },
    { title: "Help!", album: "Help!", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/90/c1/c1/90c1c133-02e3-255d-3a0d-e70c5a404bc5/mzaf_14127376946151186172.plus.aac.p.m4a" },
    { title: "Yellow Submarine", album: "Yellow Submarine", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/50/f1/56/50f15606-5db2-bbe1-d1a6-26b6af00f096/mzaf_15360858106537701679.plus.aac.p.m4a" },
    { title: "I Want to Hold Your Hand", album: "Meet The Beatles!", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/23/39/04/233904f8-fcb8-06cf-cbe8-1381da0e7688/mzaf_5151378790459346359.plus.aac.p.m4a" },
    { title: "Love Me Do", album: "Please Please Me", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0d/cd/b5/0dcdb53d-e336-d5f5-be7c-927bda09785e/mzaf_2684842830409832377.plus.aac.p.m4a" },
  ]},
  { level: 2, name: "Familiar", blurb: "Core catalogue — sing-along territory", songs: [
    { title: "A Hard Day’s Night", album: "A Hard Day’s Night", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/fc/b6/fffcb61c-6eae-4bfc-0aeb-2c108e37daa5/mzaf_8090789301194267540.plus.aac.p.m4a" },
    { title: "Can’t Buy Me Love", album: "A Hard Day’s Night", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1c/1d/4b/1c1d4b36-db20-02bd-d867-0808fdbb120d/mzaf_12888580731973632250.plus.aac.p.m4a" },
    { title: "Eight Days a Week", album: "Beatles For Sale", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/76/62/fa/7662fa75-0451-dba5-2907-8410b90f2e5b/mzaf_18104468157067362692.plus.aac.p.m4a" },
    { title: "All You Need Is Love", album: "Yellow Submarine", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3a/93/64/3a9364c8-ad48-51a7-0f77-6d5cfe32c52c/mzaf_1139281838358525048.plus.aac.p.m4a" },
    { title: "Penny Lane", album: "Magical Mystery Tour", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/62/ec/2a/62ec2a88-e671-7d8e-0356-8109836b6655/mzaf_12791907294675235647.plus.aac.p.m4a" },
    { title: "Ticket to Ride", album: "Help!", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/06/58/5d/06585d28-684c-b319-fc9e-3c38658d048a/mzaf_680399913916269098.plus.aac.p.m4a" },
    { title: "I Saw Her Standing There", album: "Please Please Me", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2b/ca/ee/2bcaeeb4-6172-57e2-ffb8-cb1932a1ece3/mzaf_13691895688485550309.plus.aac.p.m4a" },
    { title: "Nowhere Man", album: "The Beatles 1962-1966 (The Red Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/dd/1f/e2/dd1fe27b-4494-f629-dd36-2c7f32e6a82b/mzaf_691315532735999904.plus.aac.p.m4a" },
    { title: "Lucy in the Sky with Diamonds", album: "Sgt. Pepper’s Lonely Hearts Club Band", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/96/86/21/968621d4-d2d3-fd21-b470-ca94381df068/mzaf_12457232456006444049.plus.aac.p.m4a" },
  ]},
  { level: 3, name: "In Between", blurb: "Albums a little deeper in", songs: [
    { title: "Something", album: "Abbey Road (Remastered)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5c/a4/c5/5ca4c55e-d3de-9945-b72f-7dd4874cf1ff/mzaf_4930102790747210494.plus.aac.p.m4a" },
    { title: "Norwegian Wood (This Bird Has Flown)", album: "Rubber Soul", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/88/0f/fa/880ffa54-5d93-74bc-a72d-a6172eb30874/mzaf_3345449973631871314.plus.aac.p.m4a" },
    { title: "Eleanor Rigby", album: "Revolver", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/99/09/83/99098388-9516-8d3b-df47-594bf758d1c2/mzaf_1133000424273343422.plus.aac.p.m4a" },
    { title: "Get Back", album: "Let It Be", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fc/b6/37/fcb637b1-d4a8-4503-3cf2-2461aa985442/mzaf_1593867703553255943.plus.aac.p.m4a" },
    { title: "The Long and Winding Road", album: "Let It Be", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/fe/ea/cefeea20-f81c-bdec-810d-9d8261534439/mzaf_7841874808993242207.plus.aac.p.m4a" },
    { title: "Ob-La-Di, Ob-La-Da", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c2/ee/e7/c2eee730-8947-7cdd-45f3-e9c0e373d010/mzaf_14763310702600918980.plus.aac.p.m4a" },
    { title: "While My Guitar Gently Weeps", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/03/93/8b/03938bd3-3ffe-919b-fd7a-88aa675a1f4d/mzaf_12972449021563558427.plus.aac.p.m4a" },
    { title: "With a Little Help from My Friends", album: "Sgt. Pepper’s Lonely Hearts Club Band", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/af/59/0daf59c2-2dbd-d343-500d-97776fac94e0/mzaf_11107756826099585353.plus.aac.p.m4a" },
    { title: "Back in the U.S.S.R.", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/f0/f9/22f0f9be-e890-d547-9bd9-22b039d11ca1/mzaf_67748781079386670.plus.aac.p.m4a" },
  ]},
  { level: 4, name: "Deep Cuts", blurb: "For the ones who know the B-sides", songs: [
    { title: "Strawberry Fields Forever", album: "Magical Mystery Tour", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/50/dc/3e/50dc3ea7-0c12-3a54-cbfa-874c8e1e9730/mzaf_8056056744713597418.plus.aac.p.m4a" },
    { title: "Across the Universe", album: "Let It Be", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c1/af/ad/c1afadae-ba7b-1eea-9b50-71b337231d3e/mzaf_12921995535485868030.plus.aac.p.m4a" },
    { title: "Here, There and Everywhere", album: "Revolver", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b6/0c/48/b60c483c-55cd-db4d-bd87-03cdd4f46f89/mzaf_4424978574262499872.plus.aac.p.m4a" },
    { title: "Blackbird", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d7/a8/7c/d7a87c46-c7c1-ad50-f7df-d69f9e5c7b30/mzaf_2918272753652652091.plus.aac.p.m4a" },
    { title: "In My Life", album: "Rubber Soul", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/94/06/17940675-693d-18b7-976c-da14f9a421de/mzaf_9990485107419671881.plus.aac.p.m4a" },
    { title: "Michelle", album: "Rubber Soul", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/74/0e/ad/740ead5d-a518-3b89-42b7-18080c270872/mzaf_18211500609417818063.plus.aac.p.m4a" },
    { title: "Golden Slumbers", album: "Abbey Road (Remastered)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/15/1e/30/151e3063-df9a-bcea-5c0f-975e17f01278/mzaf_12375188615933412390.plus.aac.p.m4a" },
    { title: "Martha My Dear", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a5/c8/43/a5c84376-4f6f-3da0-2214-b83cbd245e8d/mzaf_7472038306721341683.plus.aac.p.m4a" },
    { title: "Rocky Raccoon", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/02/64/bb/0264bb09-a713-da19-0348-750a9a646c0c/mzaf_17075359265657335246.plus.aac.p.m4a" },
  ]},
  { level: 5, name: "Connoisseur", blurb: "Only true scholars get these", songs: [
    { title: "For No One", album: "Revolver", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/00/9d/d9/009dd903-d922-5151-1a61-b199698fa47e/mzaf_3741004214175128395.plus.aac.p.m4a" },
    { title: "I’m Only Sleeping", album: "Yesterday and Today", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d1/87/f2/d187f21b-3f0a-4b04-53db-900fb0f5a9ea/mzaf_13432817498487453859.plus.aac.p.m4a" },
    { title: "Rain", album: "Hey Jude", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/3c/dc/863cdcac-0d28-94a0-15d0-a01f167432fd/mzaf_11642894207651407766.plus.aac.p.m4a" },
    { title: "She Said She Said", album: "Revolver", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5c/5b/19/5c5b190a-e18e-8291-3670-edad463dca47/mzaf_18195521700256247794.plus.aac.p.m4a" },
    { title: "Tomorrow Never Knows", album: "Revolver", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/06/32/5c/06325cdd-595a-1d3c-70cb-edbf95f12180/mzaf_12201596573310501527.plus.aac.p.m4a" },
    { title: "Old Brown Shoe", album: "The Beatles 1967-1970 (The Blue Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/92/d9/9f/92d99f04-0387-5f69-cb83-11f99f2f72b7/mzaf_14799397007943746131.plus.aac.p.m4a" },
    { title: "Savoy Truffle", album: "The Beatles (The White Album)", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e4/27/5a/e4275a32-249b-3fe7-9330-cb0148f7964c/mzaf_4794866333162775521.plus.aac.p.m4a" },
    { title: "Hey Bulldog", album: "Yellow Submarine", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/d2/06/11d2063e-17f2-cd64-d379-d2a046eb19d4/mzaf_6885507254713721676.plus.aac.p.m4a" },
    { title: "Only a Northern Song", album: "Yellow Submarine", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d1/46/36/d146363e-8593-7efa-39cd-3149c1d7e763/mzaf_2262831597239807359.plus.aac.p.m4a" },
    { title: "Blue Jay Way", album: "Magical Mystery Tour", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/74/a4/9a/74a49ada-7530-a928-9bff-18e4d75e9e2a/mzaf_7607275845783049054.plus.aac.p.m4a" },
    { title: "Love You To", album: "Revolver", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4e/eb/cf/4eebcffb-7af9-3c5f-def2-6ae674b992e3/mzaf_12736864593528727637.plus.aac.p.m4a" },
  ]},
];

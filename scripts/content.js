(async function() {
  // 1. Extract the *beatmap* ID from the hash (mania/7891011 etc.)
  //    Fallback: if you prefer the set-ID instead, use location.pathname.split('/')[2]
  const hashMatch = window.location.hash.match(/#\w+\/(\d+)/);
  if (!hashMatch) return;  
  const setId = location.pathname.split('/')[2];


  // 2. Plug in your API key (get one at https://osu.ppy.sh/p/api)
  const API_KEY = 'd93ea35ebb57cb25e4d5c21ce76d410b91efe3cd';

  // 3. Build the URL & fetch
  const url = `https://osu.ppy.sh/api/get_beatmaps?s=${setId}&k=${API_KEY}`;
  let beatmap;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (!data.length) return;
    beatmap = data[0];
  } catch (err) {
    console.error('osu! API error:', err);
    return;
  }

  // 4. Pull out only the fields you want
  const { artist, title, version, creator, bpm, total_length } = beatmap;
  const mins = Math.floor(total_length/60);
  const secs = String(total_length%60).padStart(2, '0');

  // 5. Create your badge
  const badge = document.createElement('div');
  badge.style.cssText = `
    padding: 6px 12px;
    margin-top: 8px;
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
  `;
  badge.textContent =
    `🎵 ${artist} – ${title} [${version}]  •  mapped by ${creator}  •  ` +
    `⏱ ${mins}:${secs}  •  ⚡ ${bpm} BPM`;

  // 6. Insert it somewhere sensible on the page
  const container = document.querySelector('.beatmapset-info__song-info');
  if (container) container.insertAdjacentElement('afterend', badge);
})();

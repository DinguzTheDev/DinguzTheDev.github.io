// script.js - Simple Home launcher with wide tiles and direct Download
// === Jak dodać gry ===
// Edytuj tablicę GAMES poniżej: każdy obiekt powinien mieć:
// id (unikatowy), name, thumbnail (URL .png/.jpg lub ścieżka w repo, np. "images/thumb1.png"),
// size (np "450 MB"), version (np "v1.0"), date (np "2025-08-09"), download (bezpośredni URL do pliku).
//
// Przykład:
// {
//   id: "mygame01",
//   name: "My Game",
//   thumbnail: "images/mythumb.png"  // lub "https://.../thumb.png"
//   size: "1.2 GB",
//   version: "v2.0",
//   date: "2025-08-09",
//   download: "https://yourhost.com/files/mygame.zip"
// }

const GAMES = [
  {
    id: "sample-forest",
    name: "Forest Runner",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
    size: "75 MB",
    version: "v1.2",
    date: "2025-08-01",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-sky",
    name: "Sky Blazer",
    thumbnail: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=1400&auto=format&fit=crop",
    size: "220 MB",
    version: "v2.0",
    date: "2025-07-24",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-puzzle",
    name: "Puzzle Island",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop",
    size: "42 MB",
    version: "v0.9",
    date: "2025-05-12",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  }
];

// DOM refs
const homeGrid = document.getElementById('homeGrid');
const tileTemplate = document.getElementById('tileTemplate');
const searchInput = document.getElementById('search');

// Create tile element
function createTile(game) {
  const tpl = tileTemplate.content.cloneNode(true);
  const tile = tpl.querySelector('.tile');
  const img = tile.querySelector('.thumb');
  const title = tile.querySelector('.title');
  const sizeEl = tile.querySelector('.size');
  const metaEl = tile.querySelector('.meta');
  const downloadBtn = tile.querySelector('.downloadBtn');

  // Fill fields
  img.src = game.thumbnail || '';
  img.alt = game.name || 'game';
  title.textContent = game.name || 'No name';
  sizeEl.textContent = `${game.size || '—'} • ${game.version || '—'}`;
  metaEl.textContent = `Updated: ${game.date || '—'}`;
  downloadBtn.href = game.download || '#';

  // If thumbnail fails to load, show subtle fallback (gray bg)
  img.addEventListener('error', () => {
    img.style.objectFit = 'contain';
    img.src = ''; // blank so CSS shows background
    img.alt = 'thumbnail missing';
  });

  // Tile click: simple feedback
  tile.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let link be clicked normally
    tile.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}], {duration:200, easing:'ease-out'});
  });

  // Download click: try open in new tab and attempt a forced download via a[download]
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const url = game.download;
    if (!url) return;

    // 1) open in new tab (best for external hosts)
    try { window.open(url, '_blank'); } catch (err) { /* ignore */ }

    // 2) attempt programmatic download (works for same-origin or blobs)
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${game.id || 'file'}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => a.remove(), 1000);
    } catch (err) { /* ignore */ }
  });

  return tile;
}

// Render home grid with optional filter
function renderHome(filter = '') {
  homeGrid.innerHTML = '';
  const list = GAMES.filter(g => (g.name || '').toLowerCase().includes(filter.toLowerCase()));
  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = 'var(--muted)';
    empty.style.padding = '24px';
    empty.textContent = 'No games found.';
    homeGrid.appendChild(empty);
    return;
  }
  list.forEach(game => {
    const tile = createTile(game);
    homeGrid.appendChild(tile);
    requestAnimationFrame(() => tile.classList.add('appeared'));
  });
}

// Search behavior
searchInput.addEventListener('input', (e) => {
  renderHome(e.target.value);
});

// Init
function init() {
  renderHome();
  // Press Enter in search focuses first Download
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = document.querySelector('.downloadBtn');
      if (first) first.focus();
    }
  });
}

// Run
init();

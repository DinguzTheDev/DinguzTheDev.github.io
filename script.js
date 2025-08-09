const GAMES = [
  {
    id: "game1",
    name: "Sigma Game",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
    size: "15.6 GB",
    version: "v1.4.5-beta",
    date: "2025-08-09",
    download: "https://example.com/game1.zip"
  },
  {
    id: "game2",
    name: "Sky Blazer",
    thumbnail: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=1400&auto=format&fit=crop",
    size: "220 MB",
    version: "v2.0",
    date: "2025-07-24",
    download: "https://example.com/game2.zip"
  },
  {
    id: "game3",
    name: "Desert Dash",
    thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1400&auto=format&fit=crop",
    size: "110 MB",
    version: "v1.5",
    date: "2025-07-15",
    download: "https://example.com/game3.zip"
  },
  {
    id: "game4",
    name: "Ocean Explorer",
    thumbnail: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
    size: "300 MB",
    version: "v3.1",
    date: "2025-06-30",
    download: "https://example.com/game4.zip"
  }
];

const gameListEl = document.getElementById('gameList');
const searchInput = document.getElementById('search');

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

function renderGames(filter = '') {
  gameListEl.innerHTML = '';
  const f = filter.toLowerCase().trim();
  const filtered = GAMES.filter(g => g.name.toLowerCase().includes(f));
  if (filtered.length === 0) {
    gameListEl.innerHTML = `<p style="color:#6688cc; user-select:none;">No games found.</p>`;
    return;
  }

  filtered.forEach(game => {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    tile.innerHTML = `
      <img class="game-thumb" src="${escapeHtml(game.thumbnail)}" alt="${escapeHtml(game.name)} thumbnail" loading="lazy" />
      <div class="game-info">
        <h3 class="game-name">${escapeHtml(game.name)}</h3>
        <div class="game-meta">${escapeHtml(game.size)} • ${escapeHtml(game.version)} • Updated: ${escapeHtml(game.date)}</div>
        <a href="${escapeHtml(game.download)}" target="_blank" rel="noopener" class="download-btn" tabindex="0">Download</a>
      </div>
    `;
    gameListEl.appendChild(tile);
  });
}

searchInput.addEventListener('input', e => {
  renderGames(e.target.value);
});

renderGames();

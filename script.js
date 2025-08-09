// script.js — Home (3 per row), add unlimited games, store in localStorage

const LS_KEY = 'dinguz_games_v1';

// Sample games that appear on first load (only if localStorage empty)
const SAMPLE_GAMES = [
  {
    id: "sample-forest",
    name: "Forest Runner",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    size: "75 MB",
    version: "v1.2",
    date: "2025-08-01",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-sky",
    name: "Sky Blazer",
    thumbnail: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=1200&auto=format&fit=crop",
    size: "220 MB",
    version: "v2.0",
    date: "2025-07-24",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-puzzle",
    name: "Puzzle Island",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    size: "42 MB",
    version: "v0.9",
    date: "2025-05-12",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  }
];

// DOM refs
const homeGrid = document.getElementById('homeGrid');
const searchInput = document.getElementById('search');
const addFormWrap = document.getElementById('addFormWrap');
const addGameForm = document.getElementById('addGameForm');
const toggleFormBtn = document.getElementById('toggleForm');
const cancelFormBtn = document.getElementById('cancelForm');

let GAMES = [];

// Load games from localStorage or use sample
function loadGames(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) { GAMES = parsed; return; }
    }
  }catch(e){
    console.warn('Failed to parse saved games', e);
  }
  // fallback
  GAMES = SAMPLE_GAMES.slice();
  saveGames();
}

function saveGames(){
  try{
    localStorage.setItem(LS_KEY, JSON.stringify(GAMES));
  }catch(e){
    console.warn('Failed to save games', e);
  }
}

// Create a tile element
function createTile(game){
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.innerHTML = `
    <div class="thumbWrap">
      <img src="${escapeHtml(game.thumbnail || '')}" alt="${escapeHtml(game.name || 'game')}">
    </div>
    <div class="tileFooter">
      <div class="leftInfo">
        <div class="title">${escapeHtml(game.name || 'Untitled')}</div>
        <div class="meta">${escapeHtml(game.size || '—')} • ${escapeHtml(game.version || '—')} • Updated: ${escapeHtml(game.date || '—')}</div>
      </div>
      <div class="rightActions">
        <a class="downloadBtn" href="${escapeHtml(game.download || '#')}" target="_blank" rel="noopener">Download</a>
      </div>
    </div>
  `;
  // fallback for broken thumbnails
  const img = tile.querySelector('img');
  img.addEventListener('error', () => {
    img.style.objectFit = 'contain';
    img.src = '';
    img.alt = 'thumbnail missing';
    img.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
  });
  return tile;
}

// Render grid (with optional filter)
function renderGrid(filter = ''){
  homeGrid.innerHTML = '';
  const query = (filter || '').toLowerCase().trim();
  const list = GAMES.filter(g => (g.name || '').toLowerCase().includes(query));
  if(list.length === 0){
    const el = document.createElement('div');
    el.style.color = 'var(--muted)';
    el.style.padding = '20px';
    el.textContent = 'No games found.';
    homeGrid.appendChild(el);
    return;
  }
  list.forEach(game => {
    const tile = createTile(game);
    homeGrid.appendChild(tile);
  });
}

// Simple unique id generator
function makeId(name){
  return (name || 'game').toLowerCase().replace(/[^a-z0-9]+/g,'-') + '-' + Date.now().toString(36).slice(-6);
}

// Form handling
toggleFormBtn.addEventListener('click', () => {
  const hidden = addFormWrap.classList.toggle('hidden');
  addFormWrap.setAttribute('aria-hidden', String(hidden));
  if(!hidden){
    addFormWrap.querySelector('input[name="name"]').focus();
  }
});
cancelFormBtn.addEventListener('click', () => {
  addFormWrap.classList.add('hidden');
  addFormWrap.setAttribute('aria-hidden', 'true');
  addGameForm.reset();
});

addGameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const thumbnail = (data.get('thumbnail') || '').toString().trim();
  const download = (data.get('download') || '').toString().trim();
  const size = (data.get('size') || '').toString().trim();
  const version = (data.get('version') || '').toString().trim();
  const date = (data.get('date') || '').toString().trim() || new Date().toISOString().slice(0,10);

  if(!name || !thumbnail || !download){
    alert('Please provide at least name, thumbnail URL and download URL.');
    return;
  }

  const newGame = {
    id: makeId(name),
    name, thumbnail, download, size, version, date
  };

  GAMES.unshift(newGame); // newest first
  saveGames();
  renderGrid(searchInput.value);
  form.reset();
  addFormWrap.classList.add('hidden');
  addFormWrap.setAttribute('aria-hidden', 'true');
  // scroll to top so user sees the new tile
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Search
searchInput.addEventListener('input', (e) => {
  renderGrid(e.target.value);
});

// Escape to close form
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && !addFormWrap.classList.contains('hidden')){
    addFormWrap.classList.add('hidden');
    addFormWrap.setAttribute('aria-hidden', 'true');
  }
});

// Utilities
function escapeHtml(s){
  if(!s) return '';
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

// Init
loadGames();
renderGrid();

// script.js - Client-side launcher logic
// Easy place to add games:
// Add objects to the `GAMES` array below with properties:
// id (unique string), name, thumbnail (URL), size (string), version (string), date (string), download (URL)
// Example:
// {
//   id: "coolgame1",
//   name: "Cool Game",
//   thumbnail: "https://example.com/thumb.jpg",
//   size: "120 MB",
//   version: "v1.0",
//   date: "2025-08-09",
//   download: "https://example.com/file.zip"
// }

const GAMES = [
  {
    id: "sample-1",
    name: "Forest Runner",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1c92b1c046bdd0f5bbd4d9d5a2cf1d87",
    size: "75 MB",
    version: "v1.2",
    date: "2025-08-01",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-2",
    name: "Sky Blazer",
    thumbnail: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b8f2a7d3a7f8f3d9df3e2a2c9f4b6d4",
    size: "220 MB",
    version: "v2.0",
    date: "2025-07-24",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-3",
    name: "Puzzle Island",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=06b8a7c2f5f8b3b9f1c2d3a4b5c6d7e8",
    size: "42 MB",
    version: "v0.9",
    date: "2025-05-12",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  }
];

// --- App State & DOM ----
const browseGrid = document.getElementById('browseGrid');
const libGrid = document.getElementById('libGrid');
const tileTemplate = document.getElementById('tileTemplate');
const searchInput = document.getElementById('search');
const tabs = document.querySelectorAll('.tab');
const libCount = document.getElementById('libCount');

let LIB = []; // array of game ids
const LS_KEY = 'dinguz_library_v1';

// Load library from localStorage
function loadLibrary(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) LIB = parsed;
    }
  }catch(e){
    console.warn('Failed to load library', e);
    LIB = [];
  }
}
function saveLibrary(){
  try{
    localStorage.setItem(LS_KEY, JSON.stringify(LIB));
  }catch(e){
    console.warn('Failed to save library', e);
  }
}

// Utility to render a tile
function createTile(game, fromLibrary=false){
  const tpl = tileTemplate.content.cloneNode(true);
  const tile = tpl.querySelector('.tile');
  const img = tile.querySelector('.thumb');
  const sizeEl = tile.querySelector('.size');
  const metaEl = tile.querySelector('.meta');
  const addBtn = tile.querySelector('.addBtn');
  const downloadBtn = tile.querySelector('.downloadBtn');

  img.src = game.thumbnail;
  img.alt = game.name;
  sizeEl.textContent = `${game.size} • ${game.version}`;
  metaEl.textContent = `Added: ${game.date}`;
  downloadBtn.href = game.download;
  downloadBtn.textContent = 'Download';

  // Hide Add button if already in library
  if(fromLibrary || LIB.includes(game.id)){
    addBtn.textContent = 'Added';
    addBtn.disabled = true;
    addBtn.style.opacity = '0.8';
  }

  // Add behavior: clicking tile must not open details; we simply prevent pointer on entire tile except buttons
  tile.addEventListener('click', (e) => {
    // If click was on button or link, let it
    const isBtn = e.target.closest('button') || e.target.closest('a');
    if(isBtn) return;
    // otherwise do nothing (no detail view)
    // subtle visual feedback
    tile.animate([{transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}], {duration:220, easing:'ease-out'});
  });

  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToLibrary(game, tile);
  });

  // Ensure download opens immediate link (user provided). We simply open the URL in new tab.
  downloadBtn.addEventListener('click', (e) => {
    // No special handling
  });

  return tile;
}

// Render browse grid based on filter
function renderBrowse(filter=''){
  browseGrid.innerHTML = '';
  const list = GAMES.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
  list.forEach(game => {
    const tile = createTile(game, false);
    browseGrid.appendChild(tile);
    requestAnimationFrame(()=> tile.classList.add('appeared'));
  });
}

// Render library grid
function renderLibrary(){
  libGrid.innerHTML = '';
  const libGames = LIB.map(id => GAMES.find(g => g.id === id)).filter(Boolean);
  libGames.forEach(game=>{
    const tile = createTile(game, true);
    libGrid.appendChild(tile);
    requestAnimationFrame(()=> tile.classList.add('appeared'));
  });
  libCount.textContent = LIB.length;
}

// Add to library with animation & safety checks
function addToLibrary(game, tileElement){
  if(!game || !game.id) return;
  if(LIB.includes(game.id)) return;

  // Validate required fields to prevent breaking
  if(!game.name || !game.download || !game.thumbnail){
    alert('Game entry is missing required fields (name, thumbnail or download). Check your data.');
    return;
  }

  // Visual "fly" animation: clone image and animate to library area
  const img = tileElement.querySelector('.thumb');
  const imgRect = img.getBoundingClientRect();
  const clone = img.cloneNode(true);
  clone.style.position='fixed';
  clone.style.left = imgRect.left + 'px';
  clone.style.top = imgRect.top + 'px';
  clone.style.width = imgRect.width + 'px';
  clone.style.height = imgRect.height + 'px';
  clone.style.zIndex = 9999;
  clone.style.borderRadius = '12px';
  clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6)';
  document.body.appendChild(clone);

  const targetRect = libGrid.getBoundingClientRect();
  const destX = targetRect.left + 40;
  const destY = targetRect.top + 40;

  clone.animate([
    { transform: 'translate(0,0) scale(1)', opacity:1 },
    { transform: `translate(${destX - imgRect.left}px, ${destY - imgRect.top}px) scale(0.18)`, opacity:0.6 }
  ], { duration: 650, easing:'cubic-bezier(.2,.9,.3,1)' });

  setTimeout(()=>{
    try{ clone.remove(); }catch(e){}
    LIB.push(game.id);
    saveLibrary();
    renderLibrary();
    // Update Add button state in browse tiles
    const browseTiles = Array.from(browseGrid.querySelectorAll('.tile'));
    browseTiles.forEach(t=>{
      const name = t.querySelector('.thumb').alt;
      if(name === game.name){
        const btn = t.querySelector('.addBtn');
        btn.textContent='Added';
        btn.disabled=true;
        btn.style.opacity='0.8';
      }
    });
  }, 700);
}

// Tabs behavior
tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(t.dataset.tab).classList.add('active');
  });
});

// Search behavior
searchInput.addEventListener('input', (e)=>{
  renderBrowse(e.target.value);
});

// Init
function init(){
  loadLibrary();
  renderBrowse();
  renderLibrary();

  // Accessibility: press Enter in search focuses first match's Add button
  searchInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const firstAdd = document.querySelector('#browse .addBtn:not([disabled])');
      if(firstAdd) firstAdd.focus();
    }
  });
}

// Run
init();

/* -- End of script -- */

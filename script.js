// script.js - Simplified launcher: Home with wide tiles + direct Download
// Dodawaj swoje gry do tablicy GAMES.
// Każdy obiekt powinien mieć: id, name, thumbnail, size, version, date, download
// Example:
// {
//   id: "mygame1",
//   name: "My Game",
//   thumbnail: "https://example.com/mythumb.png",
//   size: "450 MB",
//   version: "v1.3",
//   date: "2025-08-09",
//   download: "https://example.com/mygame.zip"
// }

const GAMES = [
  {
    id: "sample-1",
    name: "Forest Runner",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
    size: "75 MB",
    version: "v1.2",
    date: "2025-08-01",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-2",
    name: "Sky Blazer",
    thumbnail: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=1200&auto=format&fit=crop",
    size: "220 MB",
    version: "v2.0",
    date: "2025-07-24",
    download: "https://example-files.online-convert.com/document/txt/example.txt"
  },
  {
    id: "sample-3",
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
const tileTemplate = document.getElementById('tileTemplate');
const searchInput = document.getElementById('search');

// Create tile DOM from template
function createTile(game){
  const tpl = tileTemplate.content.cloneNode(true);
  const tile = tpl.querySelector('.tile');
  const img = tile.querySelector('.thumb');
  const title = tile.querySelector('.title');
  const sizeEl = tile.querySelector('.size');
  const metaEl = tile.querySelector('.meta');
  const downloadBtn = tile.querySelector('.downloadBtn');

  // Fill content
  img.src = game.thumbnail;
  img.alt = game.name;
  title.textContent = game.name;
  sizeEl.textContent = `${game.size} • ${game.version}`;
  metaEl.textContent = `Updated: ${game.date}`;
  downloadBtn.href = game.download;
  downloadBtn.textContent = 'Download';

  // Click on tile (not buttons) gives subtle feedback only
  tile.addEventListener('click', (e) => {
    const isLink = e.target.closest('a');
    if(isLink) return;
    tile.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}], {duration:220, easing:'ease-out'});
  });

  // Force download behavior: try to start download/open immediately when user clicks
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const url = game.download;
    // Try: 1) open in new tab
    try{
      window.open(url, '_blank');
    }catch(err){
      // ignore
    }
    // 2) try to create an invisible a[download] (works only for same-origin or blob)
    try{
      const a = document.createElement('a');
      a.href = url;
      // use suggested filename from id
      a.download = `${game.id || 'file'}`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(()=> a.remove(), 1000);
    }catch(err){
      // ignore
    }
  });

  return tile;
}

// Render all games with optional filter
function renderHome(filter=''){
  homeGrid.innerHTML = '';
  const list = GAMES.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
  list.forEach(game => {
    const tile = createTile(game);
    homeGrid.appendChild(tile);
    requestAnimationFrame(()=> tile.classList.add('appeared'));
  });
}

// Search behavior
searchInput.addEventListener('input', (e)=>{
  renderHome(e.target.value);
});

// Init
function init(){
  renderHome();
  // Press Enter in search focuses first Download
  searchInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const first = document.querySelector('.downloadBtn');
      if(first) first.focus();
    }
  });
}
init();

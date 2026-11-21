import {CatalogService} from './services/CatalogService.js';
import {Header} from './components/Header.js';
import {Filters} from './components/Filters.js';
import {ProductCard} from './components/ProductCard.js';
import {DetailsDrawer} from './components/DetailsDrawer.js';
import {ViewerShell,WALL_COLORS} from './components/ViewerShell.js';
import {Viewer3D} from './three/Viewer3D.js';

/**
 * Estado compartido de esta demo: en una app mayor podría vivir en un store.
 * Todos los botones usan delegación de eventos; el HTML de cada componente es puro.
 */
const state={
  query:'',sort:'featured',maxPrice:1200,styles:[],finishes:[],power:'all',
  favorites:new Set(),cart:new Set(),selectedProductId:null,drawerId:null,
  mode:'catalog',roomMode:'viewer',night:false,wallColor:WALL_COLORS[0][1]
};
const catalog=new CatalogService();
const app=document.querySelector('#app');
let viewer=null;
let toastTimer=null;

function matchingProducts(){
  const bands={all:[0,300],low:[0,110],mid:[111,150],high:[151,300]};
  const [minPower,maxPower]=bands[state.power];
  return catalog.filter({...state,minPower,maxPower});
}
function renderCatalog(){
  // Desmontar WebGL ANTES de reemplazar el DOM para evitar pérdida de recursos.
  destroyViewer();state.mode='catalog';
  app.innerHTML=`${Header()}<main class="catalog-page"><section class="catalog-hero"><p>Inicio / Productos / Lámparas colgantes</p><h1>Lámparas LED Colgantes</h1><span>Diseño, tecnología y calidez para tus espacios.</span></section>
    <div class="catalog-layout">${Filters()}<section class="products-area"><div class="listing-toolbar"><div><strong id="result-count"></strong><span> luminarias disponibles</span></div><div class="listing-tools"><label>Ordenar por: <select id="sort"><option value="featured">Destacados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="power">Mayor potencia</option></select></label><span class="grid-symbol">▦</span></div></div><div id="product-grid" class="product-grid"></div></section></div></main><div id="drawer-root"></div><div id="toast" role="status" aria-live="polite"></div>`;
  document.querySelector('#search').value=state.query;
  document.querySelector('#sort').value=state.sort;
  document.querySelector('#max-price').value=state.maxPrice;
  document.querySelector('#max-price-label').textContent=`S/ ${state.maxPrice.toLocaleString('es-PE')}`;
  document.querySelector(`input[name="power"][value="${state.power}"]`).checked=true;
  document.querySelectorAll('input[name="style"]').forEach(el=>el.checked=state.styles.includes(el.value));
  document.querySelectorAll('input[name="finish"]').forEach(el=>el.checked=state.finishes.includes(el.value));
  drawProducts();updateCounters();
}
function drawProducts(){
  const list=matchingProducts();
  document.querySelector('#result-count').textContent=list.length;
  document.querySelector('#product-grid').innerHTML=list.length?list.map(p=>ProductCard(p,state.favorites.has(p.id))).join(''):'<div class="empty-list">No hay productos con esos filtros. Prueba con otros criterios.</div>';
}
function updateCounters(){
  const favorites=document.querySelector('#favorites-counter span');const cart=document.querySelector('#cart-counter span');
  if(favorites)favorites.textContent=state.favorites.size;
  if(cart)cart.textContent=state.cart.size;
}
function showDetails(id){const p=catalog.findById(id);if(!p)return;state.drawerId=id;document.querySelector('#drawer-root').innerHTML=DetailsDrawer(p);}
function closeDetails(){state.drawerId=null;const root=document.querySelector('#drawer-root');if(root)root.innerHTML='';}
function toast(message){let el=document.querySelector('#toast');if(!el){el=document.createElement('div');el.id='toast';el.setAttribute('role','status');document.body.append(el);}el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
function openViewer(id,mode='viewer'){
  const product=catalog.findById(id)||catalog.findById('akela');
  if(!product.modelUrl){showDetails(product.id);toast('Aún no hay un modelo 3D para este producto.');return;}
  state.selectedProductId=product.id;state.mode='viewer';state.roomMode=mode;state.night=false;state.wallColor=WALL_COLORS[0][1];
  app.innerHTML=ViewerShell(product,mode);
  viewer=new Viewer3D(document.querySelector('#three-canvas'),{modelUrl:product.modelUrl,onStatus:(message)=>{const node=document.querySelector('#canvas-status');if(node){node.textContent=message;node.classList.add('visible');setTimeout(()=>node?.classList.remove('visible'),2400);}}});
  setRoomMode(mode);
}
function destroyViewer(){if(viewer){viewer.dispose();viewer=null;}}
function setRoomMode(mode){
  state.roomMode=mode;viewer?.setMode(mode);
  const inRoom=mode!=='viewer';
  document.querySelector('.viewer-page')?.classList.toggle('in-room',inRoom);
  document.querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('selected',b.dataset.room===mode));
  const readable={sala:'SALA · VISTA FIJA',comedor:'COMEDOR · VISTA FIJA',cocina:'COCINA · VISTA FIJA',viewer:'VISUALIZADOR 3D',try:'PROBAR EN AMBIENTE · COMEDOR'};
  document.querySelector('#scene-label').textContent=readable[mode];
  document.querySelector('#canvas-hint').textContent=inRoom?'Cámara fija · Personaliza los colores y la luz':'Arrastra para rotar · Rueda para acercar';
}
function setLayout(layout){viewer?.setLayout(layout);document.querySelector('#layout-horizontal')?.classList.toggle('chosen',layout==='horizontal');document.querySelector('#layout-diagonal')?.classList.toggle('chosen',layout==='diagonal');}
function setNight(value){state.night=value;viewer?.setNight(value);document.querySelector('#day-mode')?.classList.toggle('selected',!value);document.querySelector('#night-mode')?.classList.toggle('selected',value);}
function setWall(color){state.wallColor=color;viewer?.setWallColor(color);document.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('selected',b.dataset.color===color));}
function clearFilters(){state.query='';state.maxPrice=1200;state.styles=[];state.finishes=[];state.power='all';state.sort='featured';renderCatalog();}

// Delegación: estos eventos se mantienen aunque los componentes se vuelvan a renderizar.
document.addEventListener('click',event=>{
  const room=event.target.closest('[data-room]');if(room){setRoomMode(room.dataset.room);return;}
  const actionEl=event.target.closest('[data-action]');
  if(actionEl){const {action,id}=actionEl.dataset;
    if(action==='home'){renderCatalog();return;}
    if(action==='details'){showDetails(id);return;}
    if(action==='close-details'){closeDetails();return;}
    if(action==='view'){openViewer(id,'viewer');return;}
    if(action==='try'){openViewer(id,'try');return;}
    if(action==='view-demo'||action==='open-viewer'){openViewer('akela','viewer');return;}
    if(action==='rooms'){openViewer('akela','sala');return;}
    if(action==='clear-filters'){clearFilters();return;}
    if(action==='favorite'){state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);drawProducts();updateCounters();return;}
    if(action==='add-cart'){state.cart.add(id);updateCounters();toast('Añadido al carrito de demostración');return;}
    if(action==='show-cart'){toast(state.cart.size?`Carrito de demostración: ${state.cart.size} producto(s)`:'Tu carrito está vacío');return;}
    if(action==='show-favorites'){toast(state.favorites.size?`Tienes ${state.favorites.size} favorito(s)`:'Aún no tienes favoritos');return;}
  }
  if(event.target.id==='layout-horizontal')setLayout('horizontal');
  if(event.target.id==='layout-diagonal')setLayout('diagonal');
  if(event.target.id==='reset-camera')viewer?.resetCamera();
  if(event.target.id==='power'){const on=viewer?.lighting.togglePower();event.target.textContent=on?'⏻ Encendida':'⏻ Apagada';}
  if(event.target.id==='day-mode')setNight(false);
  if(event.target.id==='night-mode')setNight(true);
  const colorEl=event.target.closest('[data-color]');if(colorEl)setWall(colorEl.dataset.color);
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.id==='search'){state.query=el.value;drawProducts();}
  if(el.id==='max-price'){state.maxPrice=Number(el.value);document.querySelector('#max-price-label').textContent=`S/ ${state.maxPrice.toLocaleString('es-PE')}`;drawProducts();}
  if(el.id==='brightness'){const val=Number(el.value);viewer?.lighting.setBrightness(val/100);document.querySelector('#brightness-label').textContent=val+'%';}
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.id==='sort'){state.sort=el.value;drawProducts();}
  if(el.name==='power'){state.power=el.value;drawProducts();}
  if(el.name==='style'){state.styles=[...document.querySelectorAll('input[name="style"]:checked')].map(x=>x.value);drawProducts();}
  if(el.name==='finish'){state.finishes=[...document.querySelectorAll('input[name="finish"]:checked')].map(x=>x.value);drawProducts();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.drawerId)closeDetails();});
renderCatalog();

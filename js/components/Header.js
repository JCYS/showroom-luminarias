export function Header(){return `
<header class="site-header">
  <button class="brand" data-action="home" aria-label="Volver al catálogo">LÚMINA<span>.</span><small>ILUMINACIÓN PREMIUM</small></button>
  <nav class="main-nav" aria-label="Principal">
    <button data-action="home" class="nav-current">Inicio</button>
    <button data-action="home">Productos</button>
    <button data-action="rooms">Ambientes</button>
    <button data-action="open-viewer">Visualizador</button>
  </nav>
  <label class="header-search"><span>⌕</span><input type="search" id="search" placeholder="Buscar lámparas, modelos o ambientes…" autocomplete="off" aria-label="Buscar productos"/></label>
  <div class="header-actions"><button id="favorites-counter" data-action="show-favorites" title="Favoritos">♡ <span>0</span></button><button id="cart-counter" data-action="show-cart" title="Carrito">♧ <span>0</span></button></div>
</header>`;}

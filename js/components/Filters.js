const styles=['Moderno','Minimalista','Contemporáneo','Clásico moderno'];
const finishes=[['Dorado','#d6ae59'],['Negro','#302b2a'],['Cromo','#a9a9a9']];
/** Filtros visibles en el catálogo. El controlador de aplicación lee sus valores. */
export function Filters(){return `<aside class="filters" aria-label="Filtros del catálogo"><div class="filter-header"><h2>Filtros</h2><button data-action="clear-filters">Limpiar</button></div>
<section><h3>Categoría</h3><label><input type="checkbox" checked disabled/> Lámparas colgantes</label><label><input type="checkbox" disabled/> Lámparas de techo</label><label><input type="checkbox" disabled/> Lámparas de pared</label><p class="filter-hint">Otras categorías próximamente</p></section>
<section><h3>Potencia</h3><label><input type="radio" name="power" value="all" checked/> Todas</label><label><input type="radio" name="power" value="low"/> Hasta 110 W</label><label><input type="radio" name="power" value="mid"/> 111 a 150 W</label><label><input type="radio" name="power" value="high"/> Más de 150 W</label></section>
<section><h3>Precio máximo</h3><input type="range" id="max-price" min="150" max="1200" step="10" value="1200"><div class="price-range"><span>S/ 150</span><output id="max-price-label">S/ 1,200</output></div></section>
<section><h3>Estilo</h3>${styles.map(x=>`<label><input type="checkbox" name="style" value="${x}"/> ${x}</label>`).join('')}</section>
<section><h3>Acabado</h3><div class="finish-row">${finishes.map(([name,hex])=>`<label class="finish-choice" title="${name}"><input type="checkbox" name="finish" value="${name}"/><span style="--swatch:${hex}"></span>${name}</label>`).join('')}</div></section></aside>`;}

import {currency,escapeHTML,productImage} from '../utils/format.js';
/** Tarjeta reusable de catálogo: únicamente recibe un objeto producto. */
export function ProductCard(p, favorite=false){return `<article class="product-card" data-product="${p.id}">
<div class="card-media"><img src="${productImage(p)}" alt="Luminaria ${escapeHTML(p.name)}" loading="lazy"><span class="stock-badge">✓ En stock</span><button class="favorite ${favorite?'is-favorite':''}" data-action="favorite" data-id="${p.id}" aria-label="Marcar ${escapeHTML(p.name)} como favorito">${favorite?'♥':'♡'}</button></div>
<div class="card-content"><div class="name-line"><h3>${escapeHTML(p.name)}</h3><strong>${p.watts} W</strong></div><p class="model-code">Modelo: ${escapeHTML(p.code)}</p>
<div class="card-specs"><div><span>▱ ${escapeHTML(p.materials)}</span><span>⌁ ${escapeHTML(p.dimensions)}</span><span>☼ ${p.lumens?p.lumens.toLocaleString('es-PE')+' lm · ':''}${escapeHTML(p.temperature)}</span></div><div class="card-price"><small>Precio</small><strong>${currency(p.price)}</strong></div></div>
<div class="card-buttons"><button data-action="details" data-id="${p.id}" class="button-secondary">◉ Ver detalles</button><button data-action="try" data-id="${p.id}" class="button-primary">⬡ Probar en ambiente</button></div></div></article>`;}

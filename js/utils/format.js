/** Moneda de demostración: soles peruanos. */
export const currency = (amount) => new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(amount);
/** Escapa texto antes de insertarlo en plantillas HTML. */
export const escapeHTML = (input) => String(input ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
/** Ruta relativa válida tanto localmente como en GitHub Pages. */
export const productImage = product => `./assets/images/products/${encodeURIComponent(product.image)}`;

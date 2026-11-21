import {products} from '../data/products.js';
/**
 * Servicio de consultas del catálogo: no conoce elementos DOM.
 * Mantener la búsqueda fuera del componente permite cambiar luego el origen de datos.
 */
export class CatalogService {
  constructor(items=products){this.items=items;}
  findById(id){return this.items.find(item=>item.id===id) ?? null;}
  filter({query='',styles=[],finishes=[],maxPrice=1200,minPower=0,maxPower=300,sort='featured'}={}){
    // La búsqueda incluye nombre, código y material.
    const needle=query.trim().toLocaleLowerCase('es');
    const result=this.items.filter(p=>(!needle||[p.name,p.code,p.materials,p.description].join(' ').toLocaleLowerCase('es').includes(needle))&&(!styles.length||styles.includes(p.style))&&(!finishes.length||finishes.includes(p.finish))&&p.price<=maxPrice&&p.watts>=minPower&&p.watts<=maxPower);
    if(sort==='price-asc')result.sort((a,b)=>a.price-b.price);
    if(sort==='price-desc')result.sort((a,b)=>b.price-a.price);
    if(sort==='power')result.sort((a,b)=>b.watts-a.watts);
    return result;
  }
}

# LÚMINA v4 — Catálogo + ocho luminarias 3D

Demo **HTML + CSS + JavaScript ES Modules + Three.js**. Sin build step, backend ni React. Publicable directamente en GitHub Pages.

## Ejecutar

```bash
cd lumina_catalogo_v4
python3 -m http.server 8000
```

Abrir http://localhost:8000. **No abras `index.html` con `file://`**: los módulos y los archivos GLB necesitan HTTP. El import map carga Three.js 0.169.0 desde jsDelivr, por lo que necesitas acceso a internet en el navegador.

## Flujo de usuario

1. El sitio comienza en el **catálogo de ocho luminarias**.
2. Seleccionar **Ver** abre la ficha rápida. **Probar en ambiente** abre la escena.
3. Cada luminaria carga su propio archivo GLB desde `assets/models/<id>.glb`.
4. En **Visualizador**, la cámara se controla con ratón y rueda. En **Sala / Comedor / Cocina / Probar**, la cámara es fija.
5. Se puede modificar brillo, encendido, modo día/noche y color de pared; los controles horizontal/diagonal se habilitan solo en luminarias de aros (HARLEY, AKELA, ORBIS y VÉLAR).

## Distribución de carpetas

- `index.html`: solo HTML base y dependencias; ninguna lógica funcional.
- `css/styles.css`: sistema visual, responsive, catálogo y visor.
- `js/data/products.js`: datos de ocho productos y rutas de modelos.
- `js/components/`: presentación de tarjetas, filtros, panel, cabecera y visor.
- `js/services/CatalogService.js`: reglas de filtrado, ordenación y búsqueda.
- `js/three/Viewer3D.js`: ciclo de vida del renderer, GLTFLoader, cámara, rig opcional de anillos.
- `js/three/LightingController.js`: emisión y modo nocturno.
- `js/three/RoomFactory.js`: escenarios geométricos sencillos.
- `tools/generate_models.py`: **script reproducible** para los ocho modelos GLB.
- `docs/ARCHITECTURE.md`: descripción ampliada y decisiones técnicas.

## Modelos conceptuales incluidos

| GLB | Geometría principal | Acabado |
| --- | --- | --- |
| `harley.glb` | Tres aros inclinables | Dorado |
| `luren.glb` | Ondas curvas entrelazadas | Dorado |
| `luxen.glb` | Dos trazos ondulados horizontales | Dorado |
| `noctis.glb` | Tres tiras LED lineales sinuosas | Negro |
| `akela.glb` | Tres aros escalonados | Negro |
| `mirabel.glb` | Araña de gotas de cristal facetado | Cromado |
| `orbis.glb` | Tres aros escalonados | Cromado |
| `velar.glb` | Tres aros de inclinación expresiva | Dorado |

Los modelos son **interpretaciones geométricas aproximadas** de las fotografías del catálogo: no son copias exactas, CAD manufacturable ni un estudio lumínico/fotométrico. Las dimensiones se han simplificado para la demo. No usar para especificaciones técnicas, cargas estructurales ni montaje real.

### Regenerar archivos GLB

```bash
python3 -m pip install numpy trimesh
python3 tools/generate_models.py
```

El script asigna nombres a las mallas (`Ring_1_LED`, etc.) que el visor interpreta para las animaciones de anillos. Si cambias la geometría, conserva los identificadores y actualiza `RING_RIGS` en `Viewer3D.js` (radios y alturas Z).

## GitHub Pages

Sube **el contenido de esta carpeta** a la raíz de tu repositorio. En GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

Con el repositorio `JCYS/showroom-luminarias`, la URL prevista es:
https://jcys.github.io/showroom-luminarias/

Los paths `./assets/...` funcionan bajo subcarpetas de GitHub Pages. No necesitas Node.js ni una base de datos.

## Límites conocidos del MVP

- Las fotografías son las imágenes recortadas/procesadas de referencias compartidas para este prototipo; revisa derechos antes de una publicación comercial.
- Los ambientes y luces son ilustrativos y no hacen simulación fotométrica real (lux/IES).
- Precios, carrito y favoritos son demostrativos y no guardan datos de forma persistente.
- `GLTFLoader` carga un GLB bajo demanda al abrir cada producto; al cerrar la escena se libera el renderer y los recursos de GPU. No hay predescarga de los ocho modelos.
- Unity/Web no está incluido en este paquete.

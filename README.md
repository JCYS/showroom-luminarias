# LÚMINA — Catálogo de luminarias y showroom 3D

Prototipo modular **HTML + CSS + JavaScript ES Modules + Three.js**. Se publica en GitHub Pages sin compilación, Node ni backend.

## Inicio rápido

```bash
cd lumina_catalogo_v3
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. Para el renderizado 3D se necesita conexión a internet porque Three.js se importa desde jsDelivr.

**GitHub Pages:** sube **el contenido de esta carpeta** a la raíz del repositorio, selecciona Settings → Pages → Deploy from branch → `main` / `(root)`.

## Flujo de uso

1. El usuario entra al **Catálogo**, puede buscar, filtrar y ordenar las 8 luminarias demo.
2. **Ver detalles** abre un panel lateral con ficha, precio y acciones disponibles.
3. **Probar en ambiente** abre el showroom únicamente para productos con `modelUrl` propio.
4. En el showroom se puede elegir **Sala / Comedor / Cocina** (cámaras fijas), **Visualizador** (cámara libre), o **Probar en ambiente** (comedor personalizable).
5. Cambiar **color de pared, día/noche, brillo, encendido y disposición de aros**; volver al catálogo.

## Limitaciones importantes de la demo

- Los precios, stock, descripciones, fotografías recortadas de las referencias compartidas y modelos son **contenido conceptual**, no un catálogo comercial verificado.
- Solo **AKELA** utiliza el GLB de prueba de **tres aros** creado en el proyecto anterior. Ese GLB es aproximado y **no corresponde fielmente** al artículo comercial fotografiado; debe sustituirse por el CAD/modelo GLB correcto antes de usarlo para ventas.
- Los demás productos no tienen GLB propio: la interfaz no los hace pasar por un modelo distinto, pero permite abrir una demo con AKELA.
- Las habitaciones se han construido con geometría procedural ligera, no con muebles fotorrealistas ni simulación fotométrica.
- Carrito y favoritos funcionan en memoria; al recargar la página se reinician. No hay pagos, pedidos ni almacenamiento persistente.
- Las categorías alternativas figuran deshabilitadas porque este mockup solo contiene colgantes.

## Estructura

```text
index.html                     Punto de entrada; no incluye lógica de negocio
css/styles.css                 Design tokens y estilos responsive
js/main.js                     Controlador UI y navegación
js/data/products.js            Catálogo demo reemplazable por API
js/services/CatalogService.js  Búsquedas, filtros, ordenación
js/components/                 HTML declarativo de UI
  Header.js, Filters.js, ProductCard.js, DetailsDrawer.js, ViewerShell.js
js/three/Viewer3D.js           Three.js, cámara, GLB, arillos inclinables, limpieza GPU
js/three/RoomFactory.js        Escenarios 3D ligeros (sala, comedor, cocina)
js/three/LightingController.js Emisión, brillo, encendido y día/noche
js/utils/format.js             Moneda, seguridad HTML y rutas relativas
assets/images/products/        Fotografías de demostración
assets/models/                 Archivo GLB del primer prototipo
docs/ARCHITECTURE.md           Contratos de datos y guía para desarrolladores
```

## Ampliar el catálogo

Añade un objeto en `js/data/products.js` incluyendo `id`, `image`, `modelUrl` y propiedades técnicas. Si el producto no tiene modelo validado, utiliza `modelUrl:null`. Los archivos GLB se guardan en `assets/models/`. Los modelos deben seguir la convención Z vertical y estar escalados/colocados para coincidir con el ambiente, o se deberá incluir un adaptador por producto.

## Licencias / dependencias

Three.js v0.169 se carga desde jsDelivr. No se incorporan dependencias locales ni paquetes de terceros en el ZIP. Las imágenes de producto se recortaron de las imágenes facilitadas por el usuario; comprueba sus derechos antes de un uso comercial.

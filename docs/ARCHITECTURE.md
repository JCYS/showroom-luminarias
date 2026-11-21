# Arquitectura de referencia v4

## Fronteras de módulos

`products.js` → `CatalogService` → `ProductCard` y `DetailsDrawer` → `main.js` (coordinación) → `Viewer3D` → `GLTFLoader` → modelos GLB.

- `main.js`: estado de navegación, delegación de eventos, apertura/cierre de vistas; nunca construye geometría.
- `components/*`: retornan HTML a partir de datos saneados; no gestionan recursos de GPU.
- `Viewer3D`: crea su escena y cámara y las destruye al salir; recibe un producto con `id` y `modelUrl`.
- `LightingController`: administra materiales emisivos de cada GLB, encendido y brillo; no altera modelos originales en el catálogo.
- `RoomFactory`: sala, comedor y cocina con Z vertical y cámara fija.
- `tools/generate_models.py`: generación procedural independiente del frontend.

## Contrato de producto

```js
{
  id: 'harley', // ID utilizado por el rig y por la ruta del modelo
  name: 'HARLEY',
  image: 'harley.webp',
  modelUrl: './assets/models/harley.glb',
  watts: 152,
  price: 205
}
```

Todos los modelos usan **metros aproximados, centro X=0/Y=0, Z vertical**, base del plafón próxima a Z=3. Los anillos exportan las mallas `Ring_1_Metal`, `Ring_1_LED`, etc. Las suspensiones fijas se ocultan solo en los cuatro modelos animables, y el visor recrea cables de longitud dinámica.

## Rendimiento

- La app inicial solo carga imágenes del catálogo. El motor WebGL se crea al entrar al visor.
- Un único archivo GLB por luminaria (~115 a 210 KB en esta versión); geometrías con pocos polígonos.
- `requestAnimationFrame` solo existe mientras el usuario está en el visor; `dispose` libera WebGLRenderer, OrbitControls, materiales y geometrías.
- `devicePixelRatio` limitado a 1.8 para pantallas de alta densidad.

## Evolución

1. Sustituir modelos conceptuales por modelos CAD/GLB de los proveedores, optimizados para web.
2. Agregar mapas normales, texturas KTX2 y compresión Meshopt/Draco si crece el catálogo.
3. Añadir catálogo remoto y referencias a escenas almacenadas para compartir configuraciones con Unity.
4. Implementar mediciones reales solo con especificaciones fotométricas verificadas del fabricante.

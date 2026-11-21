# Arquitectura — Guía para desarrolladores

## Objetivo
Separar presentación del catálogo, reglas de negocio y visor WebGL. **No** mezclar datos y lógica de renderizado dentro del `index.html`.

## Flujo

```text
index.html
  └── js/main.js  [estado de interfaz + eventos]
      ├── CatalogService.js [filtrado puro]
      │    └── products.js [datos]
      ├── components/ [templates HTML sin estado]
      └── Viewer3D.js [GPU y animación]
           ├── RoomFactory.js [geometría de ambientes]
           └── LightingController.js [materiales y luces]
```

## Entidades

### Producto
- `id`: identificador estable, usado por botones y seleccionador.
- `name`, `code`, `watts`, `price`, `materials`, `dimensions`, `lumens`, `temperature`: ficha.
- `image`: nombre de archivo dentro de `assets/images/products/`.
- `modelUrl`: ruta relativa hacia un GLB verificado. Si es `null`, la página ofrece **demo con otro producto claramente identificado**.
- `style`, `finish`, `category`, `stock`: atributos para filtros y futuras integraciones.

### Estado de interfaz
- `state.mode`: pantalla actual (`catalog` / `viewer`).
- `state.roomMode`: tipo de vista (`viewer`, `sala`, `comedor`, `cocina`, `try`).
- `state.query`, `maxPrice`, `styles`, `finishes`, `power`, `sort`: búsqueda/filtros.
- `state.favorites`, `cart`: `Set` en memoria, no base de datos.
- `state.night`, `wallColor`: personalización actual.

## Responsabilidades de Three.js

`Viewer3D` crea renderer, cámara, controles, carga GLB y gestiona el ciclo de vida. Usa `dispose()` al abandonar el visor para liberar texturas, geometría y WebGL context.

`RoomFactory` construye versiones **geométricas ligeras** del cuarto, con materiales compartidos para cambio de color. Coordenadas: X horizontal, Y profundidad, Z vertical.

`LightingController` cambia emisión e iluminación visual. **No representa cálculos de lux o luminancia real.**

## Siguiente fase para producción

1. Obtener GLB/GLTF reales y optimizados para cada luminaria con dimensiones del fabricante.
2. Mantener por modelo `scale`, `rotation`, `mountAnchor`, `lightConfig`, `dimensionsMeters`.
3. Sustituir habitaciones procedurales por GLB optimizados, con puntos de anclaje coherentes.
4. API para catálogo, inventario y precios, más carrito persistente.
5. Cargar modelos bajo demanda con caché; convertir texturas a KTX2, geometría Draco o Meshopt cuando proceda.
6. Crear tests visuales en navegadores y móviles; añadir fallback de captura cuando WebGL no esté disponible.
7. Normalizar el contrato de escena para exportar después configuraciones a Unity Web o una app Unity nativa.

## Nota sobre recursos

Las fotografías de catálogo son recortes de las referencias suministradas y no representan archivos originales de fabricantes. Evitar publicación comercial sin autorización.

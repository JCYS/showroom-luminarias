# LÚMINA — Showroom 3D de luminaria

Proyecto web estático basado en el modelo GLB creado a partir de la fotografía de referencia.

## Cómo ejecutarlo

1. Descomprime el ZIP.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta `python3 -m http.server 8000`.
4. Abre `http://localhost:8000` en el navegador.

Requiere conexión a Internet para cargar Three.js desde jsDelivr. No necesita npm ni instalación de dependencias.

## Funciones

- Fondo arquitectónico cálido construido con CSS.
- Cámara 3D orbitable con el mouse y zoom.
- **Horizontal**: tres aros paralelos según la variante central de la fotografía.
- **Vista diagonal**: inclina cada aro con una transición animada y ajusta los cables de suspensión.
- Encendido/apagado y ajuste visual del brillo.
- Restablecer vista.
- Adaptación a escritorio y móviles.

## Archivos

- `index.html` — interfaz y renderizado Three.js.
- `assets/luminaria_tres_aros.glb` — modelo 3D.
- `create_model.py` — script original de creación del GLB.

## Limitaciones

Es un prototipo conceptual, no una reproducción exacta del fabricante ni un estudio lumínico IES. La textura de cristal es simplificada. La disposición diagonal anima aros del modelo y reconstruye sus cables en tiempo real.

## Novedades — versión 2

La barra superior incluye cinco vistas:

- **Sala, Comedor y Cocina:** escenas 3D estilizadas, con cámara fija (no se puede girar ni hacer zoom).
- **Visualizador:** recupera el modelo sobre el fondo original; permite girar, hacer zoom, cambiar entre aros horizontales y diagonales, encender/apagar y ajustar brillo.
- **Probar en ambiente:** luminaria instalada en una sala 3D con cámara fija, selector de cinco colores de paredes y alternancia Día/Noche.

Todos los ambientes están construidos con geometría procedural ligera de Three.js y reutilizan `assets/luminaria_tres_aros.glb`. No son fotografías ni interiores fotogramétricos; son una base funcional y ligera para desarrollar un showroom más realista.

## Publicación en GitHub Pages

Copia **`index.html`** y la carpeta **`assets/`** a la raíz del repositorio. En la configuración de GitHub Pages, selecciona `Deploy from a branch`, `main`, `/(root)`.

URL esperada para el repositorio JCYS/showroom-luminarias:
`https://jcys.github.io/showroom-luminarias/`

No hace falta backend. El archivo GLB se solicita con la ruta relativa `./assets/luminaria_tres_aros.glb`.

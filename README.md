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

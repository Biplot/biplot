# Oficina virtual de BiPlot

> Estado: **en construcción** (rama `claude/gallant-chaum-91b474`, 24-09-2026). Este archivo parte como plan
> y se completa al cerrar.

Idea de Christopher en la reunión de socios del 24-09-2026: BiPlot son dos socios, pero el público entra a
una oficina con **personal propio**, al modo de una banda virtual. Cada integrante tiene nombre, rol,
personalidad, look y placa; la gente los ve trabajando y entra a las salas de cada proyecto, que funcionan
como portafolio.

## Plan

1. **Elenco** (`datos.js`, `elenco.js`): siete integrantes originales, uno por rol del motor E0–E9
   (diagnóstico, datos, diseño, desarrollo, validación, puesta en marcha y cosecha), dibujados en SVG con la
   paleta de marca. Coral queda fuera de la escena: es sólo del botón "Agenda tu diagnóstico".
2. **Oficina** (`index.html`, `oficina.js`, `oficina.css`): escena isométrica en SVG, sin librerías,
   navegable con mouse, dedo y teclado (flechas, + y −), con el personal animado, sala de reuniones,
   estantería del núcleo, oficina de los socios y una sala por proyecto: Nu Home 360, Fundos 360, Haru
   Isidora, Eleven Club, Rumbo y los cuatro casos de referencia. Respeta "reducir movimiento" y tiene
   botón de pausa.
3. **Kit para Instagram** (`kit/`): ficha de cada integrante y tres piezas de la oficina en 1080×1350 y
   1080×1920, exportadas a PNG en `kit/png/` con `_herramientas/exportar-kit.mjs` (Edge sin interfaz).
4. **Publicación**: vista previa en Vercel (cuenta de Hernán) y PR a `main` con capturas a 1920, 1440,
   1366 y 375 px. `main` publica biplot.cl (GitHub Pages): no se mergea sin el visto bueno de Hernán.

Las carpetas que empiezan con `_` no se publican en biplot.cl (Jekyll de GitHub Pages las ignora).

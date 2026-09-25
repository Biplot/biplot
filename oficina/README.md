# La oficina de BiPlot

BiPlot HQ: una oficina dibujada que se puede recorrer, al modo de una banda virtual. El equipo trabaja en la planta
baja y cada proyecto tiene su sala en el piso 1, con la esencia de su negocio. Las mismas piezas sirven para Instagram.

- Página: `oficina/index.html` → **biplot.cl/oficina/** cuando se mergee a `main` (GitHub Pages publica `main`).
- Enlaces directos: `/oficina/#lupe`, `/oficina/#fundos`, `/oficina/#piso-1`, `/oficina/#conversar`… (cualquier integrante, sala o piso).
- Kit para Instagram: `oficina/kit/` (galería) y `oficina/kit/png/` (los PNG).

## El equipo

Diez integrantes, cada uno con placa, y dos mascotas. En la oficina son cabezones en vector, con el mismo trazo de la
escena; en las fichas y en redes, ilustraciones con tinta y color plano. Coral no aparece en ningún dibujo: sigue
reservado para "Agenda tu diagnóstico".

| Integrante | Nombre | Rol | Placa | Dónde está | Frase |
|---|---|---|---|---|---|
| **Lupe** | Guadalupe Cifuentes | Diagnóstico | E1 | Sala de diagnóstico | «Lo que pides no siempre es lo que necesitas.» |
| **The Architect** | | Estrategia y proyectos | E2 | Sala de planos | «Si no se puede dibujar, no se puede construir.» |
| **Celda** (Byte) | Celeste Dávila | Datos y métricas | E3 | Su estación y el laboratorio | «Si no cuadra, no avanza.» |
| **The Engine** | | Ejecución y sistemas | E4 | Sala de máquinas | «Lo que se repite, se automatiza.» |
| **Grilla** (Pixel) | Griselda Llanos | Diseño | E5 | Su estación | «Si hay que explicarlo, está mal diseñado.» |
| **Bucle** (Kilo) | Benjamín Ochoa | Desarrollo | E5 | Su estación | «Rebanada chica, entrega segura.» |
| **Tamandúa** | Tomás Hormazábal | Validación | E6 | Su estación | «Si se puede romper, lo rompo yo antes.» |
| **Faro** | Fausto Torres | Puesta en marcha | E7 | El tubo a producción | «No termina cuando se publica. Termina cuando se usa.» |
| **Pepa** | Josefa Huerta | Cosecha | E9 | Estantería del núcleo | «Lo que sirve dos veces se guarda. Lo demás, se bota.» |
| **Aby** | | La corresponsal | PRENSA | El set | «¿The Engine existe? Yo tampoco lo sé.» |
| **Atlas** | | Mascota de The Architect | 360° | Sobre la mesa de dos | «Desde aquí arriba se ve todo.» |
| **Plotty** | | Recepción | E0 | Recepción | «Tres preguntas. Prometo que no es un formulario.» |

Pronombres para los textos: Lupe, Celda, Grilla, Pepa y Aby en femenino; el resto en masculino. En los textos públicos
se habla de integrantes, todos con placa y con el mismo trato.

## Qué hay en la oficina

**Planta baja.** La recepción con Plotty y la vitrina; el muro del equipo; las estaciones de Celda, Grilla, Bucle y
Tamandúa; el tubo "A producción" de Faro; la sala de diagnóstico con el motor en la pizarra; la estantería del núcleo
(Pepa, los cuatro casos de referencia, el Recetario y "Seis décadas"); el café con el reloj en hora de Chile; y al fondo
la **Sala de planos y máquinas** (The Architect y The Engine frente a frente en la mesa de dos, Atlas proyectando el
mapa y el tubo del plano que baja a los racks), **el set** donde graba Aby, el **laboratorio de métricas** y el
**ascensor** al piso 1. La **Puerta 404** es una caja cerrada: nunca se abre.

**Piso 1.** Una sala por proyecto, cada una con la esencia de su negocio, y una sala libre:

| Sala | Esencia | Lo que se mueve |
|---|---|---|
| Fundos 360 | Sala de ventas de parcelas: maqueta del terreno, plano de loteo, ciclo de venta | Una parcela pasa a reservada y cae un pin |
| Haru 360 | Barra de sushi: noren, vitrina de pescados, comandas por canal, QR en las mesas | Entra una comanda, sale vapor, se mecen los faroles |
| Eleven 360 | Gimnasio: mancuernas, trotadora, clases del día, torniquete con huella | Corre la cinta, la huella marca, sube un cupo |
| Nu Home 360 | Casa modular a medio armar: catálogo, configurador, carta Gantt de fábrica | La grúa baja un módulo y el configurador suma uno |
| Rumbo | Un camino del día 1 al 30 que termina en una escalera | Se marca un hábito, sube la racha, flamea la bandera |
| Tu proyecto aquí | Sala libre con Plotty esperando | Plotty flota; al tocarla se abre su conversación |

Cuando un proyecto ocupa la última sala libre de un piso, se abre el piso siguiente con su sala "Tu proyecto aquí".

**Plotty (E0).** Hace tres preguntas (rubro, dónde vive la operación y horas a la semana en tareas repetidas), arma el
mensaje de WhatsApp para agendar y deja en la vitrina de la recepción los tres casos más cercanos al rubro. El rubro
queda guardado en el navegador de quien visita (`localStorage`), sólo para su vitrina.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La página: barra de marca, escena, pisos, menú "Recorre la oficina", controles, bienvenida, recorrido guiado y panel |
| `datos.js` | **Lo único que hay que tocar para cambiar textos**: equipo, mascotas, fases, salas, proyectos, casos, vitrina y las preguntas de Plotty |
| `escena.js` | La oficina isométrica: la planta baja, el piso 1, las zonas, la vitrina y los recorridos del equipo |
| `oficina.js` | Interfaz: cámara (arrastrar, rueda, pellizco, teclado), pisos, menú, recorrido guiado, paneles, chat y videos |
| `oficina.css` | Estilos con los tokens oscuros de la marca y todas las animaciones |
| `elenco.js` | *Generado.* Los cabezones de la oficina y la credencial (lo usan la oficina y el kit) |
| `piso1.js` | *Generado.* El piso 1 y el primer plano de cada sala |
| `ilustraciones.js` | *Generado.* Las ilustraciones de ficha; se cargan recién al abrir la primera ficha |
| `kit/` | Galería y plantilla de las piezas de Instagram (`?pieza=ficha-lupe&formato=4x5`) |
| `kit/png/` | Los PNG exportados (29 archivos) |
| `casos/` | Copias publicables de las demos y documentos de los casos de referencia del núcleo |
| `media/` | El teaser de Nu Home 360 (horizontal, vertical y póster) |
| `_herramientas/` | Scripts internos y las fuentes de los dibujos. **No se publican en biplot.cl** (Jekyll ignora carpetas con `_`) |

Sin librerías ni build para la página: SVG, CSS y JavaScript planos. Lo único externo son las fuentes de Google Fonts
(Inter, Space Grotesk y Space Mono). Los videos se cargan sólo al abrir el panel de su sala.

## Cómo se edita

- **Textos, enlaces, quién trabajó en qué**: `datos.js`. Cada proyecto tiene `equipo`, `enlaces`, `puntos`, `esencia` y
  `media`. Sin `media`, el panel muestra el primer plano de la sala.
- **Los dibujos** (cabezones, ilustraciones y salas del piso 1) viven en `_herramientas/dibujos/`: `cabezones/`,
  `ilustracion/` y `piso1/salas.mjs`. Después de cambiarlos se regeneran los tres archivos:

  ```bash
  node oficina/_herramientas/dibujos/generar.mjs
  ```

- **Un proyecto nuevo**: se agrega en `datos.js` (`proyectos`), se dibuja su sala en `_herramientas/dibujos/piso1/salas.mjs`
  (una función con la esencia de su rubro, en el lugar de la sala libre) y se regenera. Lo que se mueve en una sala lleva
  una clase `p1-…` con su animación en `oficina.css`.
- **Videos de las salas**: Fundos y Haru usan los teasers del sitio (`assets/casos/`); el de Nu Home vive en `oficina/media/`,
  comprimido con `ffmpeg -crf 28 -preset slow -movflags +faststart` y con el póster en el segundo 10.
- **Casos de referencia**: si cambian en su fuente, correr `node oficina/_herramientas/sincronizar-casos.mjs`.

## Probar

```bash
npx http-server . -p 5480 -c-1
```

Abrir http://localhost:5480/oficina/. La prueba funcional (menú, los dos pisos, recorrido guiado, chat de Plotty y
vitrina, teclado, enlaces directos, Escape, pausa, movimiento reducido, errores de consola y desbordes a 1440, 1366 y
375 px) corre sola con Edge o Chrome sin interfaz y no necesita servidor:

```bash
node oficina/_herramientas/probar-oficina.mjs
```

Con otro Chromium: `NAVEGADOR=/ruta/al/chrome node oficina/_herramientas/probar-oficina.mjs`.

## Accesibilidad

Todo lo que se abre en la escena está también en el menú "Recorre la oficina" (botones de verdad, con teclado), y los
pisos se cambian con dos botones. Al recorrer el menú con Tab la cámara va mostrando dónde está cada cosa. Sobre la
escena: flechas para moverse, `+` y `−` para acercar, `0` para ver todo, `Escape` cierra. El chat de Plotty son
botones, con los mensajes anunciados a lectores de pantalla. Con "reducir movimiento" todo queda quieto y la cámara
salta sin animación; además hay un botón para pausar.

## Kit para Instagram

Catorce piezas en publicación (1080 × 1350) e historia (1080 × 1920), más la imagen para compartir el enlace
(1200 × 630, `oficina-og.png`, ya enlazada en las etiquetas `og:image` de la página). En las historias lo importante
queda fuera de las franjas de 250 px de arriba y abajo.

| Pieza | Archivos | Texto sugerido para la publicación |
|---|---|---|
| La oficina | `oficina-4x5.png`, `oficina-9x16.png` | Pasa a la oficina: el equipo trabajando y una sala por proyecto. biplot.cl/oficina |
| El equipo | `elenco-4x5.png`, `elenco-9x16.png` | Diez integrantes, uno por parte del trabajo. Los reconoces por su placa. |
| ¿Quién hace qué? | `motor-4x5.png`, `motor-9x16.png` | Diez fases, un solo motor. |
| ¿Quién es real? | `quien-4x5.png`, `quien-9x16.png` | Aby dice que ella. Los demás no contestan. |
| Fichas | `ficha-<id>-4x5.png`, `ficha-<id>-9x16.png` | Una por integrante: su frase, sus tres rasgos (en `datos.js`) y biplot.cl/oficina |

Se regeneran con `node oficina/_herramientas/exportar-kit.mjs` (todas) o `--solo ficha-lupe,oficina`. Con
`--capturas <carpeta>` saca además la oficina a 1920, 1440, 1366 y 375 px (planta baja, piso 1, una sala y una ficha).

## Conexión con el CRM

La oficina queda lista para conectarse al CRM de BiPlot sin cambiar su código:

1. **Un solo contrato de datos.** Todo lo que muestra la oficina sale de `window.OFICINA_DATOS` (`datos.js`). El CRM
   exportaría el mismo objeto como `oficina.json`, sólo con campos públicos, y la oficina lo leería con un `fetch`.
2. **Proyectos = salas.** Cada proyecto con la marca "mostrar en la oficina" aporta nombre, rubro, estado, esencia,
   resumen, puntos, enlaces y sus versiones liberadas (videos y demos con datos ilustrativos) como `media`.
3. **Equipo = roles.** Cada integrante corresponde a un rol del motor; el CRM arma el campo `equipo` de cada sala y las
   líneas "Ahora: …" de cada ficha. Nunca tareas, notas, horas ni costos.
4. **Plotty = entrada al CRM.** Las tres respuestas de Plotty son las de la calificación (E0): hoy viajan en el mensaje
   de WhatsApp; con el CRM, entrarían como solicitud.
5. **Sin datos de personas.** Ni en el JSON público ni en la oficina: sólo el nombre del proyecto y del cliente, con su
   autorización.

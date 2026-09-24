# La oficina de BiPlot

Idea de Christopher en la reunión de socios del 24-09-2026: BiPlot son dos socios, pero el público entra a una
**oficina con personal propio**, al modo de una banda virtual. Cada integrante tiene nombre, rol, personalidad, look
y una placa con la fase del motor que lleva. La gente los ve trabajando y entra a las salas de cada proyecto, que
funcionan como portafolio. Las mismas piezas sirven para Instagram.

- Página: `oficina/index.html` → **biplot.cl/oficina/** cuando se mergee a `main` (GitHub Pages publica `main`).
- Enlaces directos: `/oficina/#lupe`, `/oficina/#nuhome`, `/oficina/#sala-e1`… (cualquier integrante o sala).
- Kit para Instagram: `oficina/kit/` (galería) y `oficina/kit/png/` (los PNG).

## El personal

Siete integrantes originales, uno por rol del motor de entrega. La inspiración es el concepto de banda virtual, no
el dibujo ni los personajes de nadie: son criaturas geométricas con la paleta de BiPlot. Coral no aparece en la
escena ni en el personal: sigue reservado para "Agenda tu diagnóstico".

| Integrante | Rol | Placa | Fases | Cómo reconocerlo | Frase |
|---|---|---|---|---|---|
| **Lupe** | Diagnóstico | E1 | E0, E1, E2, E8 | Un solo ojo, que es una lupa. Humita azul y portapapeles | «Lo que pides no siempre es lo que necesitas.» |
| **Celda** | Datos | E3 | E3, E4 | Cubo con cuerpo de planilla; sus celdas se encienden. Anda con plumero | «Si no cuadra, no avanza.» |
| **Grilla** | Diseño | E2 | E2, E5 | Grillo cian, lentes redondos, antenas de gráfico, huincha de medir de bufanda | «Si hay que explicarlo, está mal diseñado.» |
| **Bucle** | Desarrollo | E5 | E5 | Pulpo azul con audífonos y una taza | «Rebanada chica, entrega segura.» |
| **Tamandúa** | Validación | E6 | E6 | Oso hormiguero con su chaleco de nacimiento y linterna | «Si se puede romper, lo rompo yo antes.» |
| **Faro** | Puesta en marcha | E7 | E7 | Faro a rayas con la lámpara cian; el manual bajo el brazo | «No termina cuando se publica. Termina cuando se usa.» |
| **Pepa** | Cosecha | E9 | E9 | Degú con delantal, canasto de pepas y un brote en el bolsillo | «Lo que sirve dos veces se guarda. Lo demás, se bota.» |

Pronombres para los textos: Lupe, Celda, Grilla y Pepa en femenino; Bucle, Tamandúa y Faro en masculino.
**Los socios no se dibujan**: son los jefes de proyecto de cara al cliente (así lo planteó Christopher). La oficina
tiene una "Oficina de los socios" vacía y el texto dice que a ellos se les conoce en persona.

## Qué hay en la oficina

Recepción (Lupe atiende), muro del personal, cuatro estaciones de trabajo (Celda, Grilla, Bucle y Tamandúa), el tubo
"A producción" de Faro, la sala de diagnóstico (E1) con el motor en la pizarra, la estantería del núcleo (Pepa, los cuatro casos de
referencia, el Recetario y "Seis décadas"), la oficina de los socios, un café con el reloj en hora de Chile y cinco
salas de proyecto: **Nu Home 360, Fundos 360, Haru 360** (Haru Isidora), **Eleven 360** (Eleven Club) **y Rumbo**. Tamandúa lleva una entrega de
Bucle a Faro, que la sube por el tubo; Lupe va y vuelve de la sala E1; Pepa se lleva pepas de las estaciones.

Material de Collahuasi (Pica Florece u otro) no está incluido: requiere confirmación de Hernán.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La página: barra de marca, escena, menú "Recorre la oficina", controles, bienvenida, recorrido guiado y panel |
| `datos.js` | **Lo único que hay que tocar para cambiar textos**: personal, fases, proyectos, casos y estantería |
| `elenco.js` | El dibujo SVG de cada integrante y su credencial (lo usan la oficina y el kit) |
| `escena.js` | La oficina isométrica: planta, salas, muebles, pantallas, recorridos del personal |
| `oficina.js` | Interfaz: cámara (arrastrar, rueda, pellizco, teclado), menú, recorrido guiado, paneles y videos |
| `oficina.css` | Estilos con los tokens oscuros de `04-marca/tokens.css` y las animaciones |
| `kit/` | Galería y plantilla de las piezas de Instagram (`?pieza=ficha-lupe&formato=4x5`) |
| `kit/png/` | Los PNG exportados (21 archivos) |
| `casos/` | Copias publicables de las demos y documentos de los casos de referencia del núcleo |
| `_herramientas/` | Scripts internos. **No se publican en biplot.cl** (Jekyll de GitHub Pages ignora carpetas con `_`) |

Sin librerías ni build: SVG, CSS y JavaScript planos. Lo único externo son las fuentes de Google Fonts (Inter, Space
Grotesk y Space Mono). Los videos se cargan sólo al abrir el panel de su sala.

## Cómo se edita

- **Textos, enlaces, quién trabajó en qué**: `datos.js`. Cada proyecto tiene `equipo` (ids del personal), `enlaces`,
  `puntos` y `media`. Sin `media`, el panel muestra la sala dibujada.
- **Teaser de Nu Home** (lo está haciendo otra conversación en `biplot-nucleo/04-marca/05-teaser-nuhome-360`): copiar
  los MP4 comprimidos a `assets/casos/nuhome-360-h.mp4` y `-v.mp4` con su póster `.jpg`, y en `datos.js` poner
  `media: { h: '../assets/casos/nuhome-360-h.mp4', v: '../assets/casos/nuhome-360-v.mp4', poster: '../assets/casos/nuhome-360-h.jpg' }`.
- **Una sala de proyecto nueva**: las cinco salas del fondo están en `escena.js` (`SALAS`, en orden de izquierda a
  derecha, 4 baldosas cada una) con su pantalla en `PANTALLAS` y sus muebles más abajo. Para reemplazar una sala se
  cambia el id en `SALAS`, sus muebles y su entrada en `datos.js`; para sumar una sexta hay que ensanchar la planta
  (`ANCHO`).
- **Casos de referencia**: la fuente es `biplot-nucleo/02-casos`. Si cambian allá, correr
  `node oficina/_herramientas/sincronizar-casos.mjs` (copia, reemplaza los enlaces a claude.ai por la demo local,
  escribe BiPlot donde el núcleo todavía dice BIPLOT, agrega el ícono de pestaña, corrige la lista de pasos del
  documento —en el núcleo el texto cae en la columna del número— y marca las copias con `noindex`).

## Probar

```bash
npx http-server . -p 5480 -c-1
```

Abrir http://localhost:5480/oficina/. La prueba funcional (menú, recorrido guiado, teclado, enlaces directos,
Escape, pausa, movimiento reducido, errores de consola y desbordes a 1440, 1366 y 375 px) corre sola con Edge sin
interfaz y no necesita servidor:

```bash
node oficina/_herramientas/probar-oficina.mjs
```

## Accesibilidad

Todo lo que se abre en la escena está también en el menú "Recorre la oficina" (botones de verdad, con teclado). Al
recorrer el menú con Tab la cámara va mostrando dónde está cada cosa. Sobre la escena: flechas para moverse, `+` y
`−` para acercar, `0` para ver todo, `Escape` cierra. Con "reducir movimiento" el personal queda quieto y la cámara
salta sin animación; además hay un botón para pausar. La escena tiene título y descripción para lectores de pantalla.

## Kit para Instagram

Diez piezas en publicación (1080 × 1350) e historia (1080 × 1920), más la imagen para compartir el enlace
(1200 × 630, `oficina-og.png`, ya enlazada en las etiquetas `og:image` de la página). En las historias lo importante
queda fuera de las franjas de 250 px de arriba y abajo.

| Pieza | Archivos | Texto sugerido para la publicación |
|---|---|---|
| La oficina | `oficina-4x5.png`, `oficina-9x16.png` | Somos dos socios. El resto del equipo lo ves aquí dibujado: siete especialistas. Pasa a la oficina y conócelos: biplot.cl/oficina |
| El personal | `elenco-4x5.png`, `elenco-9x16.png` | Siete especialistas, uno por parte del trabajo. Los reconoces por su placa. |
| ¿Quién hace qué? | `motor-4x5.png`, `motor-9x16.png` | Diez fases, siete especialistas. Tú hablas con los socios. |
| Fichas | `ficha-<nombre>-4x5.png`, `ficha-<nombre>-9x16.png` | Una por integrante: su frase, sus tres rasgos (están en `datos.js`) y biplot.cl/oficina |

Se regeneran con `node oficina/_herramientas/exportar-kit.mjs` (todas) o `--solo ficha-lupe,oficina`. El script
levanta su propio servidor y un Edge sin interfaz con puerto de depuración asignado por el sistema (nunca uno fijo:
otras sesiones pueden tener su propio Edge abierto). Con `--capturas <carpeta>` saca además la oficina a 1920,
1440, 1366 y 375 px.

## Conexión con el CRM

El CRM propio de BiPlot se está proponiendo en paralelo (`biplot-nucleo/05-crm`, v0.2). La oficina queda lista para
conectarse sin cambiar su código, respetando los principios de la v0.1 (cero conexiones en vivo, resultados y no
procesos, versiones sin datos reales):

1. **Un solo contrato de datos.** Todo lo que muestra la oficina sale de `window.OFICINA_DATOS` (`datos.js`). El CRM
   exportaría el mismo objeto como `oficina.json`, sólo con campos públicos. La oficina lo leería con un `fetch`
   y, si falla, se quedaría con `datos.js`.
2. **Proyectos = salas.** Cada proyecto del CRM con la marca "mostrar en la oficina" aporta nombre, rubro, estado,
   resumen, puntos y enlaces, más las **versiones liberadas** del repositorio de versiones (videos y demos con datos
   ilustrativos) como `media`. La fase actual se muestra sólo si el cliente autorizó publicarla.
3. **Personal = roles del CRM.** El elenco es el mismo en la oficina, en el CRM y en el ambiente del cliente. Cada
   integrante corresponde a un rol del motor; el CRM registra en la línea de tiempo qué rol cerró cada compuerta y con
   eso arma el campo `equipo` de cada sala y las líneas "Ahora: …" de cada ficha (que hoy son textos fijos). Nunca
   tareas, notas, horas ni costos.
4. **Ambiente de cara al cliente.** Cada cliente entra por un enlace privado (como el portal de Nu Home) a una versión
   de la oficina con sólo su sala. Ahí le plantea algo al rol que corresponda (diseño, datos, operaciones…) y el
   pedido entra al CRM como solicitud para ese rol. Los socios, como jefes de proyecto, la revisan y la bajan al
   equipo; el cliente ve el estado en su sala. La oficina pública nunca muestra salas privadas.
5. **Sin datos de personas.** Ni en el JSON público ni en la oficina: sólo el nombre del proyecto y del cliente, y
   únicamente con su autorización.

## Pendiente

- Decidir cómo se nombra al personal de cara al público. Hoy dice "siete especialistas" y la bienvenida aclara
  que están dibujados ("El resto del equipo lo ves aquí dibujado"), para no dar a entender que son siete personas.

- Confirmar que los clientes autorizan su sala pública (Haru Isidora ya aparece en la portada de biplot.cl; Nu Home,
  Fundos y Eleven, por confirmar).
- Sumar el teaser de Nu Home cuando esté listo (ver "Cómo se edita").
- Registrar biplot.cl/oficina en `biplot-nucleo/03-entregables/artefactos.md` al mergear.

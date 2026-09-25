# Propuesta de sitio · Fundos Inmobiliaria

Rediseño del sitio público de Fundos Inmobiliaria (fundosinmobiliaria.com), construido sobre el **Manual de Marca Fundos 360°** (septiembre 2026): verde bosque y dorado tierra, Cormorant Garamond + Mulish.

Sitio estático (HTML, CSS y JavaScript, sin build ni dependencias). Funciona abriendo `index.html` directo o desde cualquier hosting.

## Cómo verla

- **Local:** desde la raíz del repo, `npx http-server . -p 8080` y abre http://localhost:8080/propuestas/fundos-inmobiliaria/
- **Publicada con el sitio de BiPlot:** `https://biplot.cl/propuestas/fundos-inmobiliaria/` (lleva `noindex`, no aparece en buscadores).

## Qué propone

| Sección | Qué gana el cliente |
|---|---|
| **Hero con paisaje vivo** | Ilustración por capas (volcán, cipreses y surcos dorados del isotipo) que se mueve con el cursor y el scroll. Primera impresión premium, sin fotos de stock. |
| **Buscador** | Destino + presupuesto con conteo en vivo ("27 parcelas disponibles hoy"). Lleva directo al plano ya filtrado. |
| **Proyectos comparables** | Misma ficha para los tres: desde, superficie, reserva y disponibilidad. Ficha ampliada con destacados, cercanías y mapa. |
| **Recorrido virtual 360°** ★ | Los tours de cada proyecto se ven dentro de la página: una lente "Entrar" abre el recorrido como un portal, se cambia de proyecto sin salir, hay pantalla completa y, al terminar, "Ver lotes", "Agendar visita" o "Compartir" por WhatsApp. Accesos desde el hero, cada tarjeta ("Recorrido 360°"), el plano (botón 360°) y la ficha del proyecto. Enlace directo: `#recorrido-puerto-varas`. |
| **Plano interactivo de lotes** ★ | La función estrella. Estado, precio y superficie de cada lote. Filtros por estado, precio y sector; vista de lista ordenable; favoritos que se envían por WhatsApp; enlace directo a un lote (`#lote-malalcahuello-12`); "Reservar este lote" precarga el formulario. En un lote vendido, sugiere el disponible más parecido. |
| **Videos (listo para usar)** | Soporte para video de portada en el hero y visor de video por proyecto (YouTube, Vimeo o archivo propio). No se muestra nada hasta cargar un video en `lib/manifest.js`. |
| **Cómo comprar en 6 pasos** | El mismo embudo de Fundos 360° (reserva → validación → gastos → escritura → inscripción en el CBR), explicado sin letra chica. |
| **Mi compra (Fundos 360°)** | Portal del comprador: avance de su compra, documentos y próximos hitos. Diferencia real frente a la competencia. |
| **Simulador** | Contado o financiamiento, con reparto visual de la compra y envío de la simulación por WhatsApp. |
| **Quiénes somos, valores y equipo** | Textos y valores del sitio actual, foto real del río y el equipo con foto en arco y botón de WhatsApp para cada persona. |
| **Preguntas frecuentes** | Rol propio, construcción, reserva, gastos, plazos, financiamiento, visitas. |
| **Agenda tu visita** | Formulario validado que abre WhatsApp con el mensaje listo: nombre, proyecto, fecha, horario y lote. |

Además: barra de acción fija en móvil (WhatsApp + Agendar visita), botón flotante de WhatsApp en escritorio, navegación con teclado en el plano, contraste AA y sitio legible sin JavaScript.

## Antes de publicar: qué validar con Fundos

Todo lo editable está en `lib/manifest.js`.

- [ ] **Contacto:** número de WhatsApp, correo y horario. Hoy es un placeholder (`+56 9 0000 0000`).
- [ ] **Lotes, precios y estados:** son referenciales, basados en ejemplos del manual. Lo ideal es leerlos desde Fundos 360° (módulo Parcelas) para mostrar la disponibilidad real.
- [ ] **Superficie por lote:** se asume 5.000 m² en todos los proyectos (confirmar, sobre todo Puerto Varas).
- [ ] **Marchigüe:** falta su masterplan real.
- [ ] **Financiamiento:** tasa (0,9 % mensual), pie mínimo (30 %) y plazos son supuestos. Si no hay crédito directo, usar `financiamiento.habilitado = false`.
- [ ] **Preguntas frecuentes:** revisar las respuestas (condiciones de devolución de la reserva, construcción, plazos).
- [ ] **Destacados y cercanías:** las distancias se miden desde cada pueblo, no desde el proyecto. Reemplazar por los tiempos reales.
- [ ] **Mi compra:** es un módulo nuevo que se propone sobre Fundos 360°. Hoy la sección lo muestra como vista previa.
- [ ] **Fotos:** las ilustraciones son intencionales, pero se pueden sumar fotos de dron reales en la ficha de cada proyecto.
- [ ] **Equipo:** hoy se muestra como "Equipo comercial". Si se quiere, sumar nombre y cargo de cada persona y su propio WhatsApp. Las fotos se tomaron de capturas del sitio actual: conviene reemplazarlas por los archivos originales.
- [ ] **Videos:** la propuesta no incluye videos. El sitio ya está preparado: basta con subir el archivo o pegar el enlace (ver "Videos" más abajo).
- [ ] **Concurso:** el sitio actual tiene una página de concurso; se puede sumar como banner o sección cuando esté definido.
- [ ] **Al publicarlo en el dominio de Fundos:** quitar la etiqueta "Propuesta" del menú, quitar `noindex` y cambiar la URL de `og:image`.

## Estructura

```
index.html        Todo el contenido (se lee completo sin JavaScript)
styles.css        Tokens del manual + estilos, mobile-first
main.js           Interacciones: plano, filtros, favoritos, simulador, formulario, paralaje
lib/manifest.js   Datos: contacto, proyectos, lotes, financiamiento
assets/img/       Isotipo (del manual), logos de proyectos, fotos (nosotros y equipo), favicon y og-fundos.jpg
assets/video/     Videos propios (portada y proyectos), si se usan archivos en vez de YouTube
.htaccess         Caché para hosting Apache/Hostinger
```

### Videos

Todo se configura en `lib/manifest.js`; si un campo queda vacío, no aparece nada.

- **Video de portada (hero):** `videoPortada: { mp4: "assets/video/portada.mp4", webm: "", poster: "" }`. Debe ser un archivo propio (no YouTube): sin sonido, 10 a 20 segundos, H.264 a 1920 px y menos de 8 MB. Se reproduce en silencio y en bucle, con botón de pausa; no se carga con ahorro de datos ni con movimiento reducido, y mientras carga se ve la ilustración.
- **Video de cada proyecto:** `video: "https://youtu.be/XXXXXXXXXXX"` (también `youtube.com/watch?v=…`, `shorts/…`, Vimeo o `assets/video/archivo.mp4`). Aparece el botón "Ver video" en la tarjeta y en la ficha, y se abre en un visor dentro de la página.
- Para un video largo o con sonido, conviene YouTube o Vimeo: no consume el ancho de banda del hosting y se adapta a la conexión de cada persona.

### Recorridos 360°

- Las URL están en `lib/manifest.js`, campo `tour` de cada proyecto (y repetidas en el HTML para que los enlaces funcionen sin JavaScript).
- El recorrido **no se carga hasta que la persona entra**: la página sigue liviana y en el celular no se consumen datos sin permiso. Al acercarse a la sección se hace una conexión anticipada con cada servidor para que abra más rápido.
- Si el sitio donde se publique prohíbe incrustar otras páginas (política de seguridad), la sección lo detecta y ofrece abrir el recorrido en una pestaña nueva. Esto pasa, por ejemplo, en la vista previa de Claude; en biplot.cl o el hosting de Fundos se ve incrustado.
- Los recorridos están en Netlify y GitHub Pages, que por defecto permiten incrustarlos. Si algún día se les agrega `X-Frame-Options` o `frame-ancestors`, hay que permitir el dominio de Fundos.

### Planos y lotes

Los planos de **Malalcahuello** y **Puerto Varas** replican los masterplan de Fundos: misma geometría de lotes, colores por categoría de precio, vendidas en gris (Malalcahuello) o negro (Puerto Varas), servidumbres, río o estero, camino principal y la leyenda "Precios lista" con el precio anterior tachado.

- **Precios y estados** se editan en `lib/manifest.js`. Cada lote es `[número, categoría, estado]` (`disponible`, `reservada` o `vendida`); el precio sale de la categoría (`categorias`), con `lista` para el precio tachado.
- **Geometría** en `lib/planos.js`. Se generó automáticamente desde las imágenes de los masterplan (segmentación de bordes de lotes, servidumbres y agua). Si cambia un loteo, conviene regenerarla desde el nuevo plano.
- **Marchigüe** usa un plano ilustrativo con el mismo estilo hasta tener su masterplan.

## Notas de marca y técnicas

- Paleta y tipografías del manual. Se agregaron dos tonos derivados solo para texto pequeño sobre fondo claro, para cumplir contraste AA: dorado `#7A5D33` y neutro `#5E584E`.
- El isotipo se extrajo del PDF del manual, con transparencia, y se usa sin alterar.
- Sin librerías: JavaScript propio en patrón IIFE, `defer` y cada módulo aislado con `safe()`. Solo se carga Google Fonts.
- Al subir cambios de CSS/JS, actualiza el `?v=AAAAMMDD` en `index.html`.
- Con *movimiento reducido* activo se apagan el paralaje, los destellos y la animación del teléfono; el resto sigue igual.
- El formulario hoy abre WhatsApp. En producción conviene enviar también cada solicitud al módulo **Leads** de Fundos 360°.

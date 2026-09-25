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
| **Plano interactivo de lotes** ★ | La función estrella. Estado, precio y superficie de cada lote. Filtros por estado, precio y sector; vista de lista ordenable; favoritos que se envían por WhatsApp; enlace directo a un lote (`#lote-malalcahuello-12`); "Reservar este lote" precarga el formulario. En un lote vendido, sugiere el disponible más parecido. |
| **Cómo comprar en 6 pasos** | El mismo embudo de Fundos 360° (reserva → validación → gastos → escritura → inscripción en el CBR), explicado sin letra chica. |
| **Mi compra (Fundos 360°)** | Portal del comprador: avance de su compra, documentos y próximos hitos. Diferencia real frente a la competencia. |
| **Simulador** | Contado o financiamiento, con reparto visual de la compra y envío de la simulación por WhatsApp. |
| **Quiénes somos + valores** | Textos y valores del manual (transparencia, cercanía, innovación, confianza). |
| **Preguntas frecuentes** | Rol propio, construcción, reserva, gastos, plazos, financiamiento, visitas. |
| **Agenda tu visita** | Formulario validado que abre WhatsApp con el mensaje listo: nombre, proyecto, fecha, horario y lote. |

Además: barra de acción fija en móvil (WhatsApp + Agendar visita), botón flotante de WhatsApp en escritorio, navegación con teclado en el plano, contraste AA y sitio legible sin JavaScript.

## Antes de publicar: qué validar con Fundos

Todo lo editable está en `lib/manifest.js`.

- [ ] **Contacto:** número de WhatsApp, correo y horario. Hoy es un placeholder (`+56 9 0000 0000`).
- [ ] **Lotes, precios y estados:** son referenciales, basados en ejemplos del manual. Lo ideal es leerlos desde Fundos 360° (módulo Parcelas) para mostrar la disponibilidad real.
- [ ] **Puerto Varas:** se presenta como *preventa*. Confirmar la etapa del proyecto.
- [ ] **Financiamiento:** tasa (0,9 % mensual), pie mínimo (30 %) y plazos son supuestos. Si no hay crédito directo, usar `financiamiento.habilitado = false`.
- [ ] **Preguntas frecuentes:** revisar las respuestas (condiciones de devolución de la reserva, construcción, plazos).
- [ ] **Destacados y cercanías:** las distancias se miden desde cada pueblo, no desde el proyecto. Reemplazar por los tiempos reales.
- [ ] **Mi compra:** es un módulo nuevo que se propone sobre Fundos 360°. Hoy la sección lo muestra como vista previa.
- [ ] **Fotos:** las ilustraciones son intencionales, pero se pueden sumar fotos de dron reales en la ficha de cada proyecto.
- [ ] **Al publicarlo en el dominio de Fundos:** quitar la etiqueta "Propuesta" del menú, quitar `noindex` y cambiar la URL de `og:image`.

## Estructura

```
index.html        Todo el contenido (se lee completo sin JavaScript)
styles.css        Tokens del manual + estilos, mobile-first
main.js           Interacciones: plano, filtros, favoritos, simulador, formulario, paralaje
lib/manifest.js   Datos: contacto, proyectos, lotes, financiamiento
assets/img/       Isotipo (del manual), favicon y og-fundos.jpg para compartir
.htaccess         Caché para hosting Apache/Hostinger
```

### Editar lotes

Cada lote es `[número, sector, m², precio, estado]` con estado `disponible`, `reservada` o `vendida`. El dibujo del plano se genera desde `plano`: el camino (`camino`), el río (`rio`) y las filas de lotes a cada lado (`filas`). La cantidad de lotes de las filas debe sumar el total de la lista.

## Notas de marca y técnicas

- Paleta y tipografías del manual. Se agregaron dos tonos derivados solo para texto pequeño sobre fondo claro, para cumplir contraste AA: dorado `#7A5D33` y neutro `#5E584E`.
- El isotipo se extrajo del PDF del manual, con transparencia, y se usa sin alterar.
- Sin librerías: JavaScript propio en patrón IIFE, `defer` y cada módulo aislado con `safe()`. Solo se carga Google Fonts.
- Al subir cambios de CSS/JS, actualiza el `?v=AAAAMMDD` en `index.html`.
- Con *movimiento reducido* activo se apagan el paralaje, los destellos y la animación del teléfono; el resto sigue igual.
- El formulario hoy abre WhatsApp. En producción conviene enviar también cada solicitud al módulo **Leads** de Fundos 360°.

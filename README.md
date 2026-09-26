# BiPlot

Sitio de BiPlot — automatización de procesos hecha a la medida.

Sitio estático (HTML, CSS y JavaScript, sin build). Se sirve tal cual:

- `index.html` — sitio principal.
- `plotline.html` — recorrido "Cómo pensamos la automatización".
- `oficina/` — la oficina virtual de BiPlot (personal, salas por proyecto y kit para Instagram). Ver `oficina/README.md`.
- `assets/` — video, imágenes y scripts.
- `propuestas/fundos-inmobiliaria/` — propuesta de sitio para Fundos Inmobiliaria (no indexada; ver su README).

## Desarrollo local

Cualquier servidor estático sirve. Por ejemplo:

```bash
npx http-server . -p 8080
```

Luego abre http://localhost:8080

## Despliegue

Sitio estático: Vercel (u otro host estático) lo sirve directo desde la raíz, sin paso de build.

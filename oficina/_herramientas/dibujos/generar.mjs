#!/usr/bin/env node
// Genera los dibujos de la oficina a partir de sus fuentes (sin dependencias: Node 22+):
//   oficina/elenco.js         el elenco cabezón que vive en la escena (window.Elenco)
//   oficina/ilustraciones.js  las ilustraciones de las fichas y del kit (window.Ilustraciones)
//   oficina/piso1.js          el piso 1: las seis salas de proyecto y sus primeros planos (window.Piso1)
//
// Uso, desde la raíz del repo:  node oficina/_herramientas/dibujos/generar.mjs
//
// Fuentes: cabezones/ (personajes de oficina), ilustracion/ (personajes de ficha y redes) y piso1/ (salas).
// Las medidas de cada cabezón (caja, centro y pies) están en cabezones/medidas.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { VECTOR } from './cabezones/todos.mjs';
import * as SALAS from './piso1/salas.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const oficina = path.resolve(aqui, '..', '..');
const MED = JSON.parse(readFileSync(path.join(aqui, 'cabezones', 'medidas.json'), 'utf8'));
const CABECERA = (que) => `/*\n * Oficina BiPlot · ${que}\n * Generado por _herramientas/dibujos/generar.mjs desde sus fuentes. No se edita a mano.\n */\n`;

// Números con un decimal: los dibujos pesan la mitad y no se nota a ninguna escala de la oficina.
const redondear = (svg) => svg.replace(/-?\d+\.\d{2,}/g, (m) => String(Math.round(parseFloat(m) * 10) / 10));
const prefijar = (svg, p) => svg.replace(/id="([^"]+)"/g, `id="${p}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}-$1)`).replace(/href="#([^"]+)"/g, `href="#${p}-$1"`);
const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + ' KB';

/* ───────── Elenco cabezón ───────── */
// En la escena, 1 unidad de personaje = 4 unidades de dibujo: pies en (0, 0) y entre 200 y 260 de alto,
// igual que el elenco anterior (la escena lo usa a 0,34 y la credencial a ~0,45).
const ESCALA = 4;
const IDS = ['lupe', 'architect', 'celda', 'engine', 'grilla', 'bucle', 'tamandua', 'faro', 'pepa', 'aby', 'atlas', 'plotty'];
const MASCOTAS = ['atlas', 'plotty'];
const sprite = {}, alto = {}, ancho = {};
for (const id of IDS) {
  const m = MED[id];
  const partes = VECTOR[id]().svg({ partes: true });
  sprite[id] = { t: `${-m.cx} ${-m.pie}`, s: redondear(partes.sil), c: redondear(partes.color) };
  alto[id] = Math.round(m.alto * ESCALA);
  ancho[id] = Math.round(m.ancho * ESCALA);
}
const elenco = CABECERA('elenco') + `/*
 * Cada integrante en vector, cabezón y con el mismo trazo de la oficina. Coordenadas locales: pies en (0, 0).
 * Elenco.svg(id)           → <g> del personaje (con clases para animar en oficina.css)
 * Elenco.defs()            → <defs> compartidos (una vez por documento)
 * Elenco.placaTarjeta(p)   → credencial grande para fichas y paneles
 * Elenco.flota[id]         → altura a la que flotan las mascotas, en baldosas
 */
(function () {
  'use strict';

  var C = {
    niebla: '#F2F4F7', blanco: '#FFFFFF', grafito: '#1C1C1E',
    a900: '#091D33', a800: '#0E2A47', a700: '#17446F', a600: '#35679A', a500: '#5B6B7F',
    a400: '#6B7A8C', a300: '#B9C8D8', a200: '#C4D2E0', a150: '#D5E2EE', a50: '#EDF1F5',
    cian: '#17C3B2', c700: '#0A8A7E', c600: '#168A86', c300: '#7FD8CF', vidrio: '#DDF4F1', naranjo: '#F5883A'
  };
  var ESCALA = ${ESCALA};
  var SPRITE = ${JSON.stringify(sprite)};
  var ALTO = ${JSON.stringify(alto)};
  var ANCHO = ${JSON.stringify(ancho)};
  var MASCOTAS = ${JSON.stringify(MASCOTAS)};

  function defs() {
    return '<defs><radialGradient id="pj-halo"><stop offset="0" stop-color="' + C.cian + '" stop-opacity=".55"/><stop offset="1" stop-color="' + C.cian + '" stop-opacity="0"/></radialGradient></defs>';
  }

  // El cuerpo respira desde los pies; las mascotas flotan.
  function svg(id) {
    if (!SPRITE[id]) return '';
    var clase = MASCOTAS.indexOf(id) > -1 ? 'pj-flota' : 'pj-cuerpo';
    var S = SPRITE[id];
    return '<g class="pj pj-' + id + '"><g class="' + clase + '"><g transform="scale(' + ESCALA + ') translate(' + S.t + ')">' +
      S.s + '<g transform="translate(.28 .36)">' + S.s + '</g>' + S.c + '</g></g></g>';
  }

  // Credencial grande (placa) para paneles y fichas: 300 × 190.
  function placaTarjeta(p, retrato, op) {
    var masc = MASCOTAS.indexOf(p.id) > -1, alto = ALTO[p.id] || 220, ancho = ANCHO[p.id] || 110;
    var k = Math.min(masc ? 0.9 : 0.46, (masc ? 96 : 104) / alto, 84 / ancho);
    var arriba = { aby: 'PRENSA', atlas: 'MASCOTA', plotty: 'MASCOTA' }[p.id] || 'EQUIPO';
    var nombre = p.nombre, largo = nombre.length > 9;
    return '<g class="placa-grande">' +
      '<rect x="0" y="0" width="300" height="190" rx="16" fill="' + C.niebla + '"/>' +
      '<path d="M0 44 V16 a16 16 0 0 1 16 -16 H284 a16 16 0 0 1 16 16 V44 Z" fill="' + C.a800 + '"/>' +
      (op && op.isoSimple
        // Bajo 28 px el manual pide priorizar el cuadrado y el punto coral
        ? '<rect x="14" y="8" width="28" height="28" rx="7" fill="url(#bp-sq)" stroke="#7fd8cf" stroke-width=".8"/><circle cx="33.5" cy="17.5" r="3.4" fill="#FF6B4A"/>'
        : '<g transform="translate(14 8) scale(.28)">' + ISO + '</g>') +
      '<text x="50" y="30" font-family="Space Mono, monospace" font-weight="700" font-size="18" fill="' + C.niebla + '" letter-spacing="-1">Bi<tspan font-family="Space Grotesk, sans-serif" fill="' + C.cian + '" letter-spacing="0">Plot</tspan></text>' +
      '<text x="284" y="29" text-anchor="end" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="11" letter-spacing="3" fill="' + C.a300 + '">' + arriba + '</text>' +
      '<rect x="16" y="58" width="92" height="116" rx="10" fill="' + C.a800 + '"/>' +
      (retrato ? '<g transform="translate(62 ' + (masc ? 160 : 170) + ') scale(' + k + ')">' + svg(p.id) + '</g>' : '') +
      '<text x="124" y="92" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="' + (largo ? 20 : 30) + '" fill="' + C.a800 + '" letter-spacing="-.5">' + nombre + '</text>' +
      '<text x="124" y="118" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="' + (p.rol.length > 18 ? 12.5 : 15) + '" fill="#0B776D">' + p.rol + '</text>' +
      '<rect x="124" y="136" width="' + (p.placa.length > 3 ? 84 : 58) + '" height="30" rx="8" fill="' + C.cian + '"/>' +
      '<text x="' + (p.placa.length > 3 ? 166 : 153) + '" y="157" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="' + (p.placa.length > 3 ? 14 : 17) + '" fill="' + C.a800 + '">' + p.placa + '</text>' +
      (p.placa.length > 3 ? '' : '<path d="M196 160 L214 146 L232 150 L252 134 L270 138" stroke="' + C.a300 + '" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>') +
      '</g>';
  }

  // Isotipo oficial (04-marca/logo/isotipo.svg), sin cambios de color ni de forma. Usa el degradado #bp-sq.
  var ISO = '<rect x="4" y="4" width="92" height="92" rx="22" fill="url(#bp-sq)" stroke="#7fd8cf" stroke-width="2.4"/>' +
    '<path d="M27 23V75H80" fill="none" stroke="#35679a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M31 67L45 53L59 57L72 35" fill="none" stroke="#168a86" stroke-width="3.6" stroke-linecap="round"/>' +
    '<circle cx="31" cy="67" r="5.6" fill="#17C3B2"/><circle cx="45" cy="53" r="5.6" fill="#17C3B2"/>' +
    '<circle cx="59" cy="57" r="5.6" fill="#17C3B2"/><circle cx="72" cy="35" r="7" fill="#FF6B4A"/>';
  var ISO_DEFS = '<linearGradient id="bp-sq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c426d"/><stop offset="1" stop-color="#0d2642"/></linearGradient>';

  window.Elenco = {
    C: C, svg: svg, defs: function () { return defs().replace('</defs>', ISO_DEFS + '</defs>'); },
    placaTarjeta: placaTarjeta, alto: ALTO, ancho: ANCHO, isotipo: ISO,
    // El equipo, en el orden del motor; después las dos mascotas
    ids: ${JSON.stringify(IDS.filter((i) => !MASCOTAS.includes(i)))},
    mascotas: MASCOTAS,
    flota: { atlas: 1.3, plotty: 1.05 }
  };
})();
`;
writeFileSync(path.join(oficina, 'elenco.js'), elenco);
console.log('elenco.js', kb(elenco));

/* ───────── Ilustraciones de ficha ───────── */
const ILUS = {};
const personas = ['lupe', 'celda', 'grilla', 'bucle', 'tamandua', 'faro', 'pepa', 'architect', 'engine'];
for (const id of personas) {
  const m = await import(`./ilustracion/${id}.mjs`);
  ILUS[id] = { vb: '0 0 300 520', svg: prefijar(redondear(m[id]()), 'il-' + id) };
}
const ab = await import('./ilustracion/aby.mjs');
ILUS.aby = { vb: '0 0 300 520', svg: prefijar(redondear(ab.abyUrbana()), 'il-aby') };
ILUS['aby-elegante'] = { vb: '0 0 300 520', svg: prefijar(redondear(ab.abyElegante()), 'il-abye') };
const at = await import('./ilustracion/atlas.mjs');
const pl = await import('./ilustracion/plotty.mjs');
ILUS.atlas = { vb: '0 0 300 320', svg: redondear(at.atlas('mira', 'il-at')) };
ILUS.plotty = { vb: '0 0 300 320', svg: redondear(pl.plotty('hola', 'il-pl')) };
// Recorte de la cabeza de cada ilustración (viewBox), para los avatares del kit
const CABEZA = { bucle: '90 14 124 124', lupe: '88 106 124 124', celda: '86 22 128 128', grilla: '88 30 124 124', tamandua: '84 36 124 124', faro: '80 38 140 140', pepa: '86 120 128 128',
  architect: '86 18 128 128', engine: '86 36 128 128', aby: '84 46 132 132', 'aby-elegante': '84 46 132 132', plotty: '66 20 168 168', atlas: '70 78 160 160' };
for (const id of Object.keys(ILUS)) ILUS[id].cabeza = CABEZA[id];
const ilus = CABECERA('ilustraciones') + `/*
 * La ilustración de cada integrante (tinta con peso y color plano), para las fichas de la oficina y el kit.
 * Se carga recién cuando se abre la primera ficha. window.Ilustraciones[id] = { vb, svg }.
 */
window.Ilustraciones = ${JSON.stringify(ILUS)};
`;
writeFileSync(path.join(oficina, 'ilustraciones.js'), ilus);
console.log('ilustraciones.js', kb(ilus));

/* ───────── Piso 1 ───────── */
// Plotty vive en la sala libre: se dibuja con su cabezón (la maqueta lo referencia con <use>).
const conPlotty = (svg) => svg.replace(/<use href="#v-plotty"\/>/g, redondear(VECTOR.plotty().svg()));
const piso = SALAS.piso1();
const salas = {};
for (const s of SALAS.SALAS) { const r = SALAS.salaSola(s.id); salas[s.id] = { vb: r.vb, svg: conPlotty(r.svg) }; }
const p1 = CABECERA('piso 1') + `/*
 * El piso 1: seis salas de proyecto, cada una con la esencia de su negocio, y el primer plano de cada sala
 * para su panel. Todo lo que se mueve lleva una clase «p1-…» (oficina.css). Coordenadas del mundo de escena.js.
 */
window.Piso1 = ${JSON.stringify({ vb: piso.vb, svg: conPlotty(piso.svg), zonas: piso.zonas, salas })};
`;
writeFileSync(path.join(oficina, 'piso1.js'), p1);
console.log('piso1.js', kb(p1));

#!/usr/bin/env node
// Copia las demos y los documentos de los casos de referencia desde biplot-nucleo/02-casos a oficina/casos,
// para servirlos desde biplot.cl (los artifacts de claude.ai piden iniciar sesión a quien no es dueño).
// La fuente única sigue siendo el núcleo: si un caso cambia allá, se vuelve a correr este script.
//
// Uso (desde la raíz del repo biplot):
//   node oficina/_herramientas/sincronizar-casos.mjs [--nucleo <ruta a biplot-nucleo>]
// Por defecto busca el núcleo en ~/dev/biplot/biplot-nucleo o en la variable BIPLOT_NUCLEO.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf('--nucleo');
const nucleo = i > -1 ? process.argv[i + 1] : (process.env.BIPLOT_NUCLEO || path.join(os.homedir(), 'dev', 'biplot', 'biplot-nucleo'));
const origen = path.join(nucleo, '02-casos');
const destino = path.join(aqui, '..', 'casos');
if (!fs.existsSync(origen)) { console.error('No encontré ' + origen + ' (usa --nucleo <ruta>)'); process.exit(1); }

const CASOS = ['01-taller-aguilar', '02-distribuidora-punto-sur', '03-clinica-dental', '04-mantencion-terreno'];
let n = 0;
for (const caso of CASOS) {
  fs.mkdirSync(path.join(destino, caso), { recursive: true });
  for (const archivo of ['demo.html', 'caso.html']) {
    const de = path.join(origen, caso, archivo);
    if (!fs.existsSync(de)) { console.warn('Falta ' + de); continue; }
    let html = fs.readFileSync(de, 'utf8');
    // El documento enlaza su demo publicada en claude.ai: aquí apunta a la copia vecina.
    html = html.replace(/https:\/\/claude\.ai\/code\/artifact\/[0-9a-f-]{36}/g, 'demo.html');
    // Las piezas del núcleo son fragmentos para artifacts (sin doctype ni head): aquí se sirven solas.
    // Sin doctype el navegador entra en modo quirks; se agrega la cabecera mínima y noindex.
    if (!/^\s*<!doctype/i.test(html)) {
      html = '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<meta name="robots" content="noindex">\n' + html;
    } else if (!/name="robots"/.test(html)) {
      html = html.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex">');
    }
    fs.writeFileSync(path.join(destino, caso, archivo), html);
    n++;
  }
}
console.log(n + ' archivos copiados a ' + destino);

// Registro de los personajes en vector (versión oficina).
import { architect } from './architect.mjs';
import * as EQ from './equipo.mjs';
import * as AB from './aby.mjs';
import * as MA from './mascotas.mjs';
export const VECTOR = {
  architect, lupe: EQ.lupe, bucle: EQ.bucle, celda: EQ.celda, grilla: EQ.grilla, tamandua: EQ.tamandua,
  faro: EQ.faro, pepa: EQ.pepa, engine: EQ.engine, aby: AB.abyUrbana, 'aby-elegante': AB.abyElegante,
  atlas: MA.atlas, plotty: MA.plotty
};

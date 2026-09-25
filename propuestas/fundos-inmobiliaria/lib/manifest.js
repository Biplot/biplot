/* =============================================================
   Fundos Inmobiliaria — datos del sitio
   Único lugar donde se editan proyectos, lotes, precios y contacto.
   Todos los valores son REFERENCIALES para la propuesta: en la versión
   final se leen desde Fundos 360° (módulo Parcelas) para que el plano
   muestre la disponibilidad real.
   ============================================================= */
(function () {
  "use strict";

  var D = "disponible", R = "reservada", V = "vendida";

  // Lote compacto: [número, índice de sector, m², precio CLP, estado]
  function lotes(rows) {
    return rows.map(function (r) {
      return { n: r[0], sector: r[1], m2: r[2], precio: r[3], estado: r[4] };
    });
  }

  window.__BRAND__ = {
    marca: "Fundos Inmobiliaria",

    contacto: {
      whatsapp: "56900000000",              // Reemplazar: número real, formato internacional sin "+"
      whatsappVisible: "+56 9 0000 0000",   // Reemplazar
      email: "contacto@fundosinmobiliaria.com", // Confirmar
      horario: "Lunes a sábado, 9:00 a 19:00"   // Confirmar
    },

    // Monto de reserva por lote (dato de Fundos 360°)
    reserva: 1000000,

    // Simulador. Si Fundos no ofrece crédito directo: habilitado = false
    financiamiento: {
      habilitado: true,
      tasaMensual: 0.009,   // 0,9 % mensual — referencial, confirmar
      pieMinimo: 0.3,
      plazos: [12, 24, 36, 48]
    },

    proyectos: [
      {
        id: "malalcahuello",
        nombre: "Malalcahuello",
        estado: "venta",
        region: "La Araucanía",
        zona: "Cordillera",
        resumen: "Bosque nativo, volcanes y el río Lolén. Nieve en invierno; pesca, senderos y termas el resto del año.",
        descripcion: "Un proyecto en plena cordillera de La Araucanía, con parcelas frente al río Lolén y rodeadas de bosque nativo. Ideal para una casa de montaña, un refugio familiar o un proyecto turístico propio.",
        destacados: ["Parcelas frente al río Lolén", "Entorno de bosque nativo y volcanes", "Temporada de nieve, pesca y termas", "Plano y antecedentes legales a la vista"],
        cercanias: [["Centro de ski Corralco", "13 km"], ["Curacautín", "28 km"], ["Temuco", "115 km"]],
        cercaniasNota: "Distancias aproximadas desde el pueblo de Malalcahuello.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Malalcahuello%2C+Araucan%C3%ADa%2C+Chile",
        sectores: ["Frente Río Lolén – norte", "Zona norte – faja río"],
        plano: {
          tipo: "rio",
          camino: [[70, 340], [270, 302], [530, 344], [775, 318], [975, 352]],
          rio: [[-20, 92], [240, 58], [520, 118], [790, 84], [1020, 136]],
          filas: [{ lado: -1, desde: 18, hasta: 150, lotes: 12 }, { lado: 1, desde: 18, hasta: 146, lotes: 12 }]
        },
        lotes: lotes([
          [1, 0, 5000, 22990000, D], [2, 0, 5000, 22990000, V], [3, 0, 5000, 22990000, D],
          [4, 0, 5000, 16990000, V], [5, 0, 5000, 21990000, R], [6, 0, 5000, 22990000, D],
          [7, 0, 5000, 22990000, D], [8, 0, 5000, 22990000, R], [9, 0, 5400, 23490000, D],
          [10, 0, 5000, 22990000, D], [11, 0, 5000, 22990000, V], [12, 0, 5800, 23990000, D],
          [13, 1, 5000, 19990000, D], [14, 1, 5000, 18990000, D], [15, 1, 5000, 19990000, R],
          [16, 1, 5000, 19990000, D], [17, 1, 5200, 20990000, D], [18, 1, 5000, 19990000, V],
          [19, 1, 5000, 19990000, D], [20, 1, 5200, 20990000, R], [21, 1, 5200, 20990000, D],
          [22, 1, 5000, 19990000, D], [23, 1, 5000, 19990000, R], [24, 1, 5600, 21490000, D]
        ])
      },
      {
        id: "marchigue",
        nombre: "Marchigüe",
        estado: "venta",
        region: "O'Higgins",
        zona: "Valle de Colchagua",
        resumen: "Lomajes suaves, viñedos y cielos despejados. Clima templado todo el año, a unos 40 minutos de Pichilemu.",
        descripcion: "Parcelas entre lomajes y viñedos del valle de Colchagua, con clima templado y cielos despejados casi todo el año. Cerca de la costa y de la ruta del vino, para vivir con calma o invertir en una zona que crece.",
        destacados: ["Zona vitivinícola de Colchagua", "Clima templado y soleado", "Cerca de Pichilemu y Santa Cruz", "Plano y antecedentes legales a la vista"],
        cercanias: [["Pichilemu", "43 km"], ["Santa Cruz", "49 km"], ["Santiago", "180 km"]],
        cercaniasNota: "Distancias aproximadas desde Marchigüe.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Marchig%C3%BCe%2C+O%27Higgins%2C+Chile",
        sectores: ["Sector Norte", "Sector Sur"],
        plano: {
          tipo: "lomas",
          camino: [[70, 412], [280, 360], [510, 350], [745, 290], [975, 250]],
          filas: [{ lado: -1, desde: 18, hasta: 142, lotes: 10 }, { lado: 1, desde: 18, hasta: 142, lotes: 10 }]
        },
        lotes: lotes([
          [1, 0, 5000, 13490000, D], [2, 0, 5000, 12990000, D], [3, 0, 5000, 12990000, V],
          [4, 0, 5000, 12990000, D], [5, 0, 5000, 13490000, R], [6, 0, 5000, 13490000, D],
          [7, 0, 5000, 13990000, D], [8, 0, 5000, 13990000, V], [9, 0, 5200, 14490000, D],
          [10, 0, 5500, 14990000, R],
          [11, 1, 5000, 14490000, D], [12, 1, 5000, 13990000, D], [13, 1, 5000, 13990000, R],
          [14, 1, 5000, 14490000, D], [15, 1, 5000, 14490000, V], [16, 1, 5200, 14990000, D],
          [17, 1, 5200, 14990000, D], [18, 1, 5400, 15490000, R], [19, 1, 6000, 15990000, D],
          [20, 1, 5400, 15490000, R]
        ])
      },
      {
        id: "puerto-varas",
        nombre: "Puerto Varas",
        estado: "preventa",
        region: "Los Lagos",
        zona: "Lago Llanquihue",
        resumen: "Bosque, lago y el volcán Osorno en el horizonte. Vida de sur con Puerto Montt y el aeropuerto a unos 20 km.",
        descripcion: "Nuestro próximo proyecto, en el entorno del lago Llanquihue y con el volcán Osorno en el horizonte. Las personas inscritas en la preventa reciben el plano y los precios de lanzamiento antes de su publicación.",
        destacados: ["Vista al volcán Osorno", "Entorno de bosque y lago", "Puerto Montt y aeropuerto cerca", "Precios de lanzamiento para inscritos"],
        cercanias: [["Puerto Montt", "20 km"], ["Aeropuerto El Tepual", "20 km"], ["Frutillar", "27 km"]],
        cercaniasNota: "Distancias aproximadas desde Puerto Varas.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Puerto+Varas%2C+Los+Lagos%2C+Chile",
        sectores: [],
        plano: null,
        lotes: []
      }
    ],

    preguntasWhatsApp: "Hola Fundos, tengo una pregunta sobre sus parcelas."
  };
})();

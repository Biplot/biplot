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

  // Lote compacto: [número, categoría de precio (null si está vendido), estado, m² opcional]
  // El precio sale de la categoría; la superficie por defecto es 5.000 m².
  function lotes(rows) {
    return rows.map(function (r) {
      return { n: r[0], cat: r[1], estado: r[2], m2: r[3] || 5000 };
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

    // Video de portada del hero (opcional). Un archivo liviano, sin sonido, de 10 a 20 segundos:
    // assets/video/portada.mp4 (H.264, 1920 px, menos de 8 MB) y, si se puede, una versión .webm.
    // Mientras esté vacío se muestra la ilustración animada. Con "ahorro de datos" o movimiento
    // reducido activos, tampoco se carga.
    videoPortada: { mp4: "", webm: "", poster: "" },

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
        // Recorrido virtual 360° (se incrusta en la sección #recorrido)
        tour: "https://cmaulenb.github.io/fundoslonquimaynieve/",
        // Video del proyecto (opcional): enlace de YouTube o Vimeo, o un archivo en assets/video/.
        // Ej.: "https://youtu.be/XXXXXXXXXXX" · "https://vimeo.com/123456789" · "assets/video/malalcahuello.mp4"
        video: "",
        logo: "assets/img/logo-malalcahuello.webp",
        // Colores y precios del masterplan "Precios lista"
        leyenda: "Precios lista",
        categorias: {
          oro:     { color: "#B79E2E", lista: 30990000, precio: 20990000 },
          celeste: { color: "#2A97C4", lista: 28990000, precio: 18990000 },
          azul:    { color: "#26306A", lista: 24990000, precio: 14990000 },
          verde:   { color: "#6C9A47", lista: 19990000, precio: 9990000 },
          lila:    { color: "#B463D6", lista: 10990000, precio: 7990000 }
        },
        vendidaColor: "#A8AAA5",
        etiqueta: "circulo",
        agua: "#1E9BE3",
        lotes: lotes([
          [1, null, V], [2, null, V], [3, null, V], [4, null, V], [5, "celeste", D], [6, "oro", D],
          [7, "oro", D], [8, "oro", D], [9, null, V], [10, null, V], [11, null, V], [12, null, V],
          [13, null, V], [14, null, V], [15, null, V], [16, null, V], [17, null, V], [18, "azul", D],
          [19, "azul", D], [20, "azul", D], [21, null, V], [22, null, V], [23, null, V], [24, null, V],
          [25, "azul", D], [26, null, V], [27, null, V], [28, "azul", D], [29, null, V], [30, "azul", D],
          [31, "azul", D], [32, "azul", D], [33, null, V], [34, null, V], [35, null, V], [36, null, V],
          [37, null, V], [38, null, V], [39, null, V], [40, "verde", D], [41, "verde", D], [42, null, V],
          [43, null, V], [44, null, V], [45, "azul", D], [46, "azul", D], [47, null, V], [48, null, V],
          [49, null, V], [50, null, V], [51, null, V], [52, null, V], [53, null, V], [54, "verde", D],
          [55, null, V], [56, null, V], [57, null, V], [58, null, V]
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
        // Recorrido virtual 360° (se incrusta en la sección #recorrido)
        tour: "https://marchigue.netlify.app/",
        // Video del proyecto (opcional): enlace de YouTube o Vimeo, o un archivo en assets/video/.
        // Ej.: "https://youtu.be/XXXXXXXXXXX" · "https://vimeo.com/123456789" · "assets/video/malalcahuello.mp4"
        video: "",
        logo: "assets/img/logo-marchigue.webp",
        sectores: ["Sector Norte", "Sector Sur"],
        // Plano ilustrativo: reemplazar por el masterplan real de Marchigüe
        leyenda: "Precios",
        categorias: {
          a: { color: "#C9C43A", precio: 12990000 },
          b: { color: "#2A97C4", precio: 13990000 },
          c: { color: "#35A83A", precio: 14990000 }
        },
        vendidaColor: "#A8AAA5",
        etiqueta: "circulo",
        plano: {
          tipo: "lomas",
          camino: [[70, 412], [280, 360], [510, 350], [745, 290], [975, 250]],
          filas: [{ lado: -1, desde: 18, hasta: 142, lotes: 10 }, { lado: 1, desde: 18, hasta: 142, lotes: 10 }]
        },
        lotes: lotes([
          [1, "b", D], [2, "a", D], [3, "a", V], [4, "a", D], [5, "b", R], [6, "b", D],
          [7, "b", D], [8, "b", V], [9, "c", D], [10, "c", R],
          [11, "c", D], [12, "b", D], [13, "b", R], [14, "c", D], [15, "c", V], [16, "c", D],
          [17, "c", D], [18, "c", R], [19, "c", D], [20, "c", R]
        ])
      },
      {
        id: "puerto-varas",
        nombre: "Puerto Varas",
        estado: "venta",
        region: "Los Lagos",
        zona: "Entre mar y lago",
        resumen: "Fundos de Puerto Varas: bosque nativo atravesado por un estero, con camino principal y caminos interiores. Puerto Montt y el aeropuerto a unos 20 km.",
        descripcion: "Fundos de Puerto Varas, entre mar y lago. Un predio de bosque nativo atravesado por un estero, con acceso por camino principal y caminos interiores a cada parcela. Vida de sur, cerca de la ciudad.",
        destacados: ["Estero dentro del predio", "Bosque nativo", "Acceso por camino principal", "Plano y antecedentes legales a la vista"],
        cercanias: [["Puerto Montt", "20 km"], ["Aeropuerto El Tepual", "20 km"], ["Frutillar", "32 km"]],
        cercaniasNota: "Distancias aproximadas desde Puerto Varas.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Puerto+Varas%2C+Los+Lagos%2C+Chile",
        // Recorrido virtual 360° (se incrusta en la sección #recorrido)
        tour: "https://6aab0a2a79cbb906fe66b800--tourspuertovaras.netlify.app/",
        // Video del proyecto (opcional): enlace de YouTube o Vimeo, o un archivo en assets/video/.
        // Ej.: "https://youtu.be/XXXXXXXXXXX" · "https://vimeo.com/123456789" · "assets/video/malalcahuello.mp4"
        video: "",
        sectores: [],
        leyenda: "Precios",
        categorias: {
          amarillo:    { color: "#C9C43A", precio: 27990000 },
          verdeClaro:  { color: "#35A83A", precio: 35990000 },
          celeste:     { color: "#1E95BF", precio: 40990000 },
          verdeOscuro: { color: "#2F5E2C", precio: 45990000 },
          morado:      { color: "#6A67C9", precio: 50990000 }
        },
        vendidaColor: "#141414",
        etiqueta: "hexagono",
        agua: "#2B3BFF",
        lotes: lotes([
          [1, "verdeOscuro", D], [2, "morado", D], [3, "morado", D], [4, "verdeOscuro", D], [5, "morado", D], [6, "verdeOscuro", D],
          [7, "verdeOscuro", D], [8, "morado", D], [9, "verdeOscuro", D], [10, "verdeClaro", D], [11, "celeste", D], [12, "verdeClaro", D],
          [13, "verdeClaro", D], [14, "celeste", D], [15, "celeste", D], [16, "celeste", D], [17, "celeste", D], [18, "verdeClaro", D],
          [19, "verdeClaro", D], [20, "celeste", D], [21, "celeste", D], [22, "celeste", D], [23, "verdeClaro", D], [24, "verdeClaro", D],
          [25, "verdeClaro", D], [26, "verdeClaro", D], [27, "celeste", D], [28, "celeste", D], [29, "celeste", D], [30, "verdeClaro", D],
          [31, "verdeClaro", D], [32, "celeste", D], [33, "celeste", D], [34, "celeste", D], [35, "celeste", D], [36, "verdeClaro", D],
          [37, "verdeClaro", D], [38, "celeste", D], [39, "verdeClaro", D], [40, "verdeClaro", D], [41, "celeste", D], [42, "verdeClaro", D],
          [43, "verdeClaro", D], [44, "celeste", D], [45, "verdeClaro", D], [46, "verdeClaro", D], [47, "celeste", D], [48, "verdeClaro", D],
          [49, "verdeClaro", D], [50, "celeste", D], [51, "verdeClaro", D], [52, "amarillo", D], [53, "celeste", D], [54, "celeste", D],
          [55, "celeste", D], [56, "celeste", D], [57, "amarillo", D], [58, "amarillo", D], [59, "celeste", D], [60, "celeste", D],
          [61, "celeste", D], [62, "celeste", D], [63, "verdeClaro", D], [64, "celeste", D], [65, "celeste", D], [66, "verdeClaro", D],
          [67, "verdeClaro", D], [68, "celeste", D], [69, "celeste", D], [70, "celeste", D], [71, "verdeClaro", D], [72, "verdeClaro", D],
          [73, "verdeClaro", D], [74, "verdeClaro", D], [75, "celeste", D], [76, "celeste", D], [77, "celeste", D], [78, "celeste", D],
          [79, null, V]
        ])
      },
      {
        id: "santo-domingo",
        nombre: "Santo Domingo",
        estado: "preventa",
        region: "Valparaíso",
        zona: "Costa central",
        resumen: "Naturaleza privilegiada, costa exclusiva, vida extraordinaria. Nuestro próximo proyecto, cerca del mar.",
        descripcion: "Fundos de Santo Domingo: naturaleza privilegiada, costa exclusiva y vida extraordinaria. Nuestro próximo proyecto en la costa central, pensado para una casa de playa, un refugio de fin de semana o vivir con el mar cerca. Inscríbete en la preventa y recibe el plano y los precios de lanzamiento antes que nadie.",
        destacados: ["Costa central de Chile", "Precios de lanzamiento para inscritos", "Plano y precios antes de su publicación", "Acompañamiento hasta la inscripción en el CBR"],
        cercanias: [["San Antonio", "10 km"], ["Reserva Nacional El Yali", "20 km"], ["Santiago", "115 km"]],
        cercaniasNota: "Distancias aproximadas desde la comuna de Santo Domingo. Se confirmarán con la ubicación del proyecto.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Santo+Domingo%2C+Valpara%C3%ADso%2C+Chile",
        video: "",
        logo: "assets/img/logo-santo-domingo.webp",
        lotes: []
      }
    ],

    preguntasWhatsApp: "Hola Fundos, tengo una pregunta sobre sus parcelas."
  };
})();

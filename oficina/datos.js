/*
 * Oficina BiPlot · datos
 * El personal, las fases del motor, las salas y los proyectos que se muestran en la oficina.
 * Es lo único que hay que tocar para cambiar textos, enlaces o quién trabajó en qué.
 * A futuro lo genera el CRM de BiPlot (ver README.md, "Conexión con el CRM"): mismo formato.
 * Regla: sólo datos públicos. Sin nombres de personas reales, sin cifras de clientes.
 */
(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/56966275675?text=' +
    encodeURIComponent('Hola BiPlot, vengo de la oficina virtual y quiero agendar un diagnóstico.');

  window.OFICINA_DATOS = {
    version: '2026-09-24',
    cta: { texto: 'Agenda tu diagnóstico', url: WHATSAPP },
    sitio: { texto: 'biplot.cl', url: '../' },

    /* El personal. `placa` es la fase que lleva en la credencial; `fases`, todas las que cubre. */
    personal: [
      {
        id: 'lupe', nombre: 'Lupe', rol: 'Diagnóstico', placa: 'E1', fases: ['E0', 'E1', 'E2', 'E8'],
        lema: 'La que pregunta primero.',
        resumen: 'Recibe a cada negocio que llega. Mira cómo se trabaja de verdad —las planillas, los chats, los pasos que nadie cuestiona— y mide cuántas horas se van en cada uno. Con eso elige el camino: primero ordenar, después automatizar y software sólo si hace falta. A los 30, 60 y 90 días vuelve a medir.',
        rasgos: ['Pregunta «¿por qué?» hasta llegar al fondo.', 'Escucha más de lo que habla.', 'No sale de una reunión sin una cifra.'],
        frase: 'Lo que pides no siempre es lo que necesitas.',
        look: 'Un solo ojo, que es una lupa. Humita azul y portapapeles.',
        ahora: ['Atendiendo a quien acaba de llegar.', 'Midiendo cuántas horas se van en una planilla.', 'Armando la radiografía de un negocio.']
      },
      {
        id: 'celda', nombre: 'Celda', rol: 'Datos', placa: 'E3', fases: ['E3', 'E4'],
        lema: 'La que ordena los datos.',
        resumen: 'Abre los Excel, los CSV y las exportaciones que nadie quiere abrir. Encuentra duplicados, vacíos y fórmulas rotas, arma el modelo de datos y deja escrito quién puede ver qué. Mientras los datos reales no estén cargados, no se construye nada.',
        rasgos: ['Ve un duplicado a diez filas de distancia.', 'Le tiene alergia a «final_final_v3.xlsx».', 'Es feliz cuando todo cuadra.'],
        frase: 'Si no cuadra, no avanza.',
        look: 'Un cubo con cuerpo de planilla: sus celdas se encienden cuando algo cuadra. Anda con plumero.',
        ahora: ['Limpiando una planilla con tres hojas repetidas.', 'Cruzando dos listas de clientes.', 'Dibujando el modelo de datos.']
      },
      {
        id: 'grilla', nombre: 'Grilla', rol: 'Diseño', placa: 'E2', fases: ['E2', 'E5'],
        lema: 'La que dibuja antes de construir.',
        resumen: 'Convierte el diagnóstico en una maqueta que se puede tocar antes de que exista una línea de código. Diseña cada pantalla para quien la va a usar —en el celular en terreno o en el escritorio de la gerencia— y cuida que se entienda al primer vistazo.',
        rasgos: ['Todo cae en su grilla de 72 píxeles.', 'Si hay que explicarlo, lo vuelve a dibujar.', 'Prueba cada botón con el pulgar.'],
        frase: 'Si hay que explicarlo, está mal diseñado.',
        look: 'Grillo alto y cian, con lentes redondos, antenas de gráfico y una huincha de medir de bufanda.',
        ahora: ['Dibujando la maqueta de un cotizador.', 'Probando un botón con el pulgar.', 'Alineando todo a la grilla.']
      },
      {
        id: 'bucle', nombre: 'Bucle', rol: 'Desarrollo', placa: 'E5', fases: ['E5'],
        lema: 'El que construye por rebanadas.',
        resumen: 'Construye el sistema en rebanadas finas: cada una funciona sola y se puede mostrar. Parte de lo que el equipo ya tiene resuelto, así cada proyecto arranca más adelante que el anterior.',
        rasgos: ['Escribe con seis brazos, pero entrega de a una rebanada.', 'Prefiere reutilizar antes que reinventar.', 'No suelta el café.'],
        frase: 'Rebanada chica, entrega segura.',
        look: 'Pulpo azul con audífonos y una taza en el tentáculo más confiable.',
        ahora: ['Construyendo la rebanada 3.', 'Conectando el módulo de cobranza.', 'Rellenando el café.']
      },
      {
        id: 'tamandua', nombre: 'Tamandúa', rol: 'Validación', placa: 'E6', fases: ['E6'],
        lema: 'El que se come los bichos.',
        resumen: 'Antes de que algo llegue al cliente, lo prueba en celular, tablet y dos tamaños de escritorio, con cada perfil de usuario y en tema claro y oscuro. Se come los errores —los bichos— antes de que alguien más los vea.',
        rasgos: ['Si se puede romper, lo rompe primero.', 'Revisa en cuatro pantallas a la vez.', 'Trabaja con linterna: los bichos se esconden.'],
        frase: 'Si se puede romper, lo rompo yo antes.',
        look: 'Oso hormiguero con su chaleco de nacimiento, linterna en la frente y celular en la mano.',
        ahora: ['Probando una pantalla a 375 píxeles.', 'Revisando qué ve cada perfil.', 'Comiéndose un bicho.']
      },
      {
        id: 'faro', nombre: 'Faro', rol: 'Puesta en marcha', placa: 'E7', fases: ['E7'],
        lema: 'El que se queda hasta que se usa.',
        resumen: 'Publica el sistema, lo instala en el día a día del cliente y enseña a cada perfil a usarlo, con su manual. No da el trabajo por terminado cuando se publica: lo da por terminado cuando la gente lo usa sin tener que llamarlo.',
        rasgos: ['Tiene paciencia infinita para enseñar.', 'Su luz se enciende cuando algo sale a producción.', 'Anda con el manual bajo el brazo.'],
        frase: 'No termina cuando se publica. Termina cuando se usa.',
        look: 'Faro a rayas azul y niebla, con la lámpara cian en la cabeza y el manual bajo el brazo.',
        ahora: ['Subiendo una entrega a producción.', 'Enseñando a usar el sistema en terreno.', 'Escribiendo el manual de cada perfil.']
      },
      {
        id: 'pepa', nombre: 'Pepa', rol: 'Cosecha', placa: 'E9', fases: ['E9'],
        lema: 'La que guarda lo que sirve.',
        resumen: 'Cuando un proyecto cierra, recorre la oficina y se lleva lo que le sirve al próximo cliente: componentes, reglas, textos y plantillas. Sólo guarda lo que ya se usó en dos proyectos distintos. Por eso cada sistema nuevo parte con ventaja.',
        rasgos: ['Lo que sirve dos veces, lo guarda.', 'Lo que no, lo bota sin pena.', 'Sabe dónde está todo en la estantería.'],
        frase: 'Lo que sirve dos veces se guarda. Lo demás, se bota.',
        look: 'Degú chilena con delantal, un canasto de pepas y un brote en el bolsillo.',
        ahora: ['Guardando un componente en la estantería.', 'Revisando qué se usó dos veces.', 'Ordenando el núcleo.']
      }
    ],

    /* El motor de entrega, fase por fase, con quién la lleva. */
    fases: [
      { id: 'E0', nombre: 'Calificación', texto: '45 minutos, sin costo: ¿tiene sentido trabajar juntos?', quien: ['lupe'] },
      { id: 'E1', nombre: 'Diagnóstico', texto: 'El proceso real, los dolores en horas y pesos, y la línea base.', quien: ['lupe'] },
      { id: 'E2', nombre: 'Camino y primera entrega', texto: 'Se elige lo justo: ordenar, automatizar, ver o construir.', quien: ['lupe', 'grilla'] },
      { id: 'E3', nombre: 'Datos', texto: 'Los datos reales, cargados y revisados.', quien: ['celda'] },
      { id: 'E4', nombre: 'Modelo y permisos', texto: 'Quién ve qué, validado contigo.', quien: ['celda'] },
      { id: 'E5', nombre: 'Construcción', texto: 'Rebanadas cortas que funcionan solas.', quien: ['bucle', 'grilla'] },
      { id: 'E6', nombre: 'Validación', texto: 'Se prueba con uso real antes de aceptar.', quien: ['tamandua'] },
      { id: 'E7', nombre: 'Puesta en marcha', texto: 'Publicar, enseñar y acompañar.', quien: ['faro'] },
      { id: 'E8', nombre: 'Medición', texto: 'Día 30, 60 y 90, contra la línea base.', quien: ['lupe'] },
      { id: 'E9', nombre: 'Cosecha', texto: 'Lo que sirve para el próximo, al núcleo.', quien: ['pepa'] }
    ],

    /* Proyectos con sala propia. `media.video` usa los teasers del sitio; sin video se dibuja la sala. */
    proyectos: [
      {
        id: 'nuhome', nombre: 'Nu Home 360', cliente: 'Nu Home', rubro: 'Casas modulares', estado: 'Plataforma a la medida · en desarrollo',
        acento: '#C4D2E0',
        resumen: 'Nu Home fabrica casas modulares. Nu Home 360 junta en una sola plataforma todo lo que pasa entre el primer contacto y la entrega de la casa: ventas, cotizaciones, fábrica, bodega, pagos y un portal para cada cliente.',
        puntos: [
          ['Cotizador en línea', 'el cliente arma su casa sobre su terreno'],
          ['Fábrica a la vista', 'producción con carta Gantt y alertas tempranas'],
          ['Portal del cliente', 'cada cliente sigue su casa sin llamar']
        ],
        enlaces: [{ texto: 'Probar el cotizador', url: 'https://nuhome-crm-nu.vercel.app/cotizador' }],
        equipo: ['lupe', 'celda', 'grilla', 'bucle', 'tamandua', 'faro', 'pepa'],
        media: null
      },
      {
        id: 'fundos', nombre: 'Fundos 360', cliente: 'Fundos Inmobiliaria', rubro: 'Inmobiliaria · venta de parcelas', estado: 'Plataforma a la medida',
        acento: '#C8A165',
        resumen: 'Un ciclo de venta largo —contacto, reserva, escritura, facturación al inversionista, posventa y comisiones— vivía repartido entre planillas, WhatsApp y papel. Fundos 360 lo digitaliza completo, con permisos por rol.',
        puntos: [
          ['Ciclo completo', 'contactos, escrituras y comisiones conectados'],
          ['Por rol', 'lo financiero lo ve sólo quien corresponde'],
          ['Multiproyecto', 'un fundo o varios, en la misma plataforma']
        ],
        enlaces: [],
        equipo: ['lupe', 'celda', 'grilla', 'bucle', 'tamandua', 'faro', 'pepa'],
        media: { h: '../assets/casos/fundos-360-h.mp4', v: '../assets/casos/fundos-360-v.mp4', poster: '../assets/casos/fundos-360-h.jpg' },
        nota: 'Pantallas ilustrativas con datos de ejemplo.'
      },
      {
        id: 'haru', nombre: 'Haru 360', cliente: 'Haru Isidora', rubro: 'Restaurante · cocina japonesa, Arica', estado: 'Sistema a la medida · en implementación',
        acento: '#7FA35B',
        resumen: 'Caja, máquinas de pago, apps de delivery y una planilla a mano: los totales no cuadraban y nadie sabía el costo real de cada plato. Haru 360 junta ventas, cocina, delivery, bodega y caja. Y la carta digital deja pedir desde la mesa con un QR.',
        puntos: [
          ['Todo en uno', 'ventas, cocina, delivery, bodega y caja'],
          ['Costo por plato', 'el margen real por producto y por canal'],
          ['Carta con QR', 'se pide desde la mesa o para retiro']
        ],
        enlaces: [{ texto: 'Ver la carta digital', url: 'https://haru-carta.vercel.app' }],
        equipo: ['lupe', 'celda', 'grilla', 'bucle', 'tamandua', 'faro'],
        media: { h: '../assets/casos/haru-360-h.mp4', v: '../assets/casos/haru-360-v.mp4', poster: '../assets/casos/haru-360-h.jpg' },
        nota: 'Las cifras del video son ilustrativas: salen del generador de datos de prueba.'
      },
      {
        id: 'eleven', nombre: 'Eleven 360', cliente: 'Eleven Club Fitness and BXO', rubro: 'Gimnasio, Arica', estado: 'Propuesta',
        acento: '#F2C14E',
        resumen: 'Sitio y experiencia digital para un gimnasio. La idea: más socios, que se queden y que vuelvan por más. No reemplaza su sistema de acceso con huella: se conecta a él y trabaja antes y después de la huella.',
        puntos: [
          ['Sitio al día', 'planes, horarios y clases desde un solo archivo'],
          ['Rescate de socios', 'aviso a tiempo de quien deja de venir'],
          ['Tienda y ficha', 'lo que el socio compra afuera, adentro']
        ],
        enlaces: [{ texto: 'Ver el sitio', url: 'https://eleven-360.vercel.app' }],
        equipo: ['lupe', 'grilla', 'bucle', 'tamandua'],
        media: null
      },
      {
        id: 'rumbo', nombre: 'Rumbo', cliente: 'Producto propio de BiPlot', rubro: 'App de gestión personal', estado: 'Producto propio · publicado',
        acento: '#7FD8CF',
        resumen: 'Tu vida en un solo lugar. Una app de BiPlot para ordenar lo personal: ritual de mañana y de noche, hábitos, finanzas, metas, lecturas, salud y diario, con rangos e insignias para no soltarlo.',
        puntos: [
          ['Ritual diario', 'apertura y cierre del día, con recordatorio'],
          ['Todo junto', 'hábitos, finanzas y metas en una pantalla'],
          ['Recompensas', 'rangos e insignias para seguir']
        ],
        enlaces: [{ texto: 'Abrir Rumbo', url: 'https://rumbo.biplot.cl' }],
        equipo: ['grilla', 'bucle', 'tamandua', 'faro'],
        media: null
      }
    ],

    /* Casos de referencia del núcleo: negocios ilustrativos, no clientes. Copias servidas desde casos/. */
    casos: [
      { num: '01', nombre: 'Taller Aguilar', rubro: 'Taller mecánico', camino: 'Sistema',
        hallazgo: 'Pedía facturación. Perdía 8 órdenes al mes en aprobaciones por WhatsApp.',
        demo: 'casos/01-taller-aguilar/demo.html', caso: 'casos/01-taller-aguilar/caso.html' },
      { num: '02', nombre: 'Punto Sur', rubro: 'Distribuidora', camino: 'Visibilidad',
        hallazgo: 'Cuatro productos vendidos bajo costo durante ocho meses, en dos planillas que nadie restó.',
        demo: 'casos/02-distribuidora-punto-sur/demo.html', caso: 'casos/02-distribuidora-punto-sur/caso.html' },
      { num: '03', nombre: 'Centro Aurora', rubro: 'Clínica dental', camino: 'Automatización',
        hallazgo: 'Pedía cambiar el software. El dolor estaba alrededor del software, no dentro.',
        demo: 'casos/03-clinica-dental/demo.html', caso: 'casos/03-clinica-dental/caso.html' },
      { num: '04', nombre: 'Servicios Elqui', rubro: 'Mantención en terreno', camino: 'Higiene',
        hallazgo: '7 de 14 pasos existían sólo para pasar un dato de un papel a un Word.',
        demo: 'casos/04-mantencion-terreno/demo.html', caso: 'casos/04-mantencion-terreno/caso.html' }
    ],

    /* Otras piezas que viven en la estantería. */
    estanteria: [
      { texto: 'Recetario BiPlot', detalle: 'Elige tu rubro y tus dolores, y mira qué se arma.', url: 'https://recetario-biplot.vercel.app' },
      { texto: 'Seis décadas, la misma línea', detalle: 'Cómo pensamos la automatización.', url: '../plotline.html' }
    ]
  };
})();

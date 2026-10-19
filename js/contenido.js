/* =========================================================
   CONTENIDO DEL BLOG Y DE LOS VÍDEOS
   ---------------------------------------------------------
   Para publicar algo nuevo, copia un bloque { ... } de la
   lista correspondiente, pégalo al principio y cambia los
   textos. Lo primero de la lista es lo que se ve primero.
   ========================================================= */

/* ---------- BLOG ----------
   En la portada se ven los 3 primeros; en blog.html, todos.

   categoria : etiqueta pequeña sobre el título
   fecha     : opcional, por ejemplo '19 de octubre de 2026'
   titulo    : título del artículo
   resumen   : una o dos frases
   enlace    : página del artículo, por ejemplo 'blog/fascitis-plantar.html'.
               Para crearla, copia blog/_plantilla-articulo.html (dentro del
               archivo están los pasos). Déjalo vacío ('') y aparecerá como
               «Próximamente». */
const BLOG = [
  {
    categoria: 'Salud del pie',
    titulo: 'Fascitis plantar: cuando no basta con mirar dónde duele',
    resumen: 'Qué es, por qué aparece y cómo acompañarla desde la podología y una mirada más amplia.',
    enlace: '',
  },
  {
    categoria: 'Biomecánica y movimiento',
    titulo: 'La pisada también cuenta cómo atravesamos la vida',
    resumen: 'La relación entre los puntos de apoyo, la postura y otras partes del cuerpo.',
    enlace: '',
  },
  {
    categoria: 'PodAlma y la lectura del pie',
    titulo: '¿Y si tus pies pudieran contarte algo más que dónde te duele?',
    resumen: 'Cómo observo el pie, la postura y el cuerpo, y cómo integro esa información en el acompañamiento.',
    enlace: '',
  },
];

/* ---------- VÍDEOS ----------
   En la portada se ven los 2 primeros; en videos.html, todos.

   tipo      : 'archivo'  → vídeo guardado en assets/video
                'youtube'  → vídeo de YouTube (pon solo el código: lo que va después de «v=»)
                'enlace'   → abre otra web, por ejemplo una publicación de Instagram
   titulo     : título del vídeo
   descripcion: una frase
   duracion   : opcional, por ejemplo '1:31'
   archivo    : solo para tipo 'archivo'
   youtube    : solo para tipo 'youtube'
   url        : solo para tipo 'enlace'
   portada    : imagen de portada (para YouTube se usa la suya si lo dejas vacío)
   vertical   : true si el vídeo está grabado en vertical (móvil) */
const VIDEOS = [
  {
    tipo: 'archivo',
    titulo: 'Cómo nace PodAlma',
    descripcion: 'Gemma se presenta y cuenta cómo nace PodAlma y en qué consiste.',
    duracion: '1:31',
    archivo: 'assets/video/gemma-presentacion.mp4',
    portada: 'assets/img/gemma.jpeg',
    vertical: true,
  },
];

# Futbolle

Proyecto Final Individual - Desarrollo y Arquitecturas Web 2026 - UAI

Juego de adivinanza de jugadores de fútbol, inspirado en Wordle, desarrollado con HTML5, CSS3 y JavaScript ES5 puro (sin frameworks ni librerías).

## Cómo jugar

1. Ingresá tu nombre para comenzar la partida.
2. El sistema pide un jugador secreto aleatorio al endpoint de la cátedra.
3. Escribí el nombre de un jugador en el buscador y seleccionalo del autocompletado para registrar un intento.
4. Por cada intento vas a ver una pista visual por atributo (nacionalidad, club, posición, edad, overall y altura):
   - Verde: el atributo coincide con el jugador secreto.
   - Rojo: el atributo no coincide (nacionalidad, club y posición).
   - Flecha hacia arriba o abajo: indica si el valor del jugador secreto es mayor o menor (edad, overall y altura).
5. Tenés 8 intentos para adivinar el nombre correcto. Si te quedás sin intentos, se revela el jugador secreto.

## Estructura del proyecto

```
futbolle/
├── index.html          Página principal del juego
├── contacto.html        Página de contacto
├── css/
│   ├── reset.css         Normalización de estilos cross-browser
│   └── estilos.css       Estilos del proyecto (flexbox, responsive, temas)
├── js/
│   ├── api.js            Llamadas fetch al endpoint de jugadores
│   ├── core.js            Lógica y estado del juego
│   ├── ui.js               Renderizado del DOM, modales, tema e historial
│   ├── eventos.js          Manejadores de eventos
│   ├── init.js             Inicialización de la página del juego
│   └── contacto.js         Validaciones y envío del formulario de contacto
└── README.md
```

## Endpoints utilizados

- `GET /api/players/search?q=&limit=8`: alimenta el autocompletado.
- `GET /api/players/random`: obtiene el jugador secreto al iniciar cada partida.

## Funcionalidades extra implementadas

- Modo claro / oscuro.
- Historial de partidas jugadas guardado en LocalStorage (nombre del jugador, resultado, dificultad, intentos, puntaje, fecha y duración), con opción de ordenar por fecha o por cantidad de intentos.
- Selector de dificultad (Fácil, Medio, Difícil) que cambia el tipo de pista disponible:
  - Fácil: foto del jugador secreto desenfocada, que se va revelando con cada intento fallido.
  - Medio: se van revelando de a poco algunos atributos del jugador secreto (edad, altura, overall) a medida que se agotan los intentos.
  - Difícil: sin pistas adicionales, solo el feedback de colores y flechas del tablero.
- Sistema de puntaje al ganar la partida, calculado según la dificultad, la cantidad de intentos usados y el tiempo transcurrido.
- Foto del jugador elegido en cada fila del tablero de intentos.
- Sonido al acertar un atributo, al no acertar ninguno, y al ganar o perder la partida, con botón para silenciar.

## Deploy

El proyecto está pensado para ser publicado con GitHub Pages, sirviendo directamente `index.html` desde la raíz del repositorio.

## Autor

Proyecto realizado para la materia Desarrollo y Arquitecturas Web (UAI, 2026).

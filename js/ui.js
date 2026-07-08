'use strict';
var CLAVE_HISTORIAL = 'futbolleHistorial';
var ordenHistorialActual = 'fecha';
function actualizarContadorIntentos(cantidad) {
    document.querySelector('.contador-intentos').textContent = String(cantidad);
}
function actualizarTextoTiempo(texto) {
    document.querySelector('.contador-tiempo').textContent = texto;
}
function obtenerClasePista(resultado) {
    if (resultado === 'verde') {
        return 'pista-verde';
    }
    if (resultado === 'rojo') {
        return 'pista-roja';
    }
    return 'pista-neutra';
}
function obtenerFlecha(resultado) {
    if (resultado === 'arriba') {
        return ' \u2191';
    }
    if (resultado === 'abajo') {
        return ' \u2193';
    }
    return '';
}
function limpiarHijos(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}
function crearCeldaTexto(texto, clase) {
    var celda;
    celda = document.createElement('span');
    celda.className = 'celda-tablero ' + clase;
    celda.textContent = texto;
    return celda;
}
function crearCeldaAtributo(texto, resultado) {
    var celda, clasePista;
    clasePista = obtenerClasePista(resultado);
    celda = document.createElement('span');
    celda.className = 'celda-tablero ' + clasePista;
    celda.textContent = texto + obtenerFlecha(resultado);
    return celda;
}
function crearFilaIntento(intento, comparacion) {
    var fila;
    fila = document.createElement('div');
    fila.className = 'fila-intento';
    fila.appendChild(crearCeldaTexto(intento.name, 'celda-nombre'));
    fila.appendChild(crearCeldaAtributo(intento.nationality, comparacion.nacionalidad));
    fila.appendChild(crearCeldaAtributo(intento.club, comparacion.club));
    fila.appendChild(crearCeldaAtributo(intento.position, comparacion.posicion));
    fila.appendChild(crearCeldaAtributo(String(intento.age), comparacion.edad));
    fila.appendChild(crearCeldaAtributo(String(intento.overall), comparacion.overall));
    fila.appendChild(crearCeldaAtributo(intento.heightCm + ' cm', comparacion.altura));
    return fila;
}
function agregarFilaAlTablero(fila) {
    var tablero;
    tablero = document.querySelector('.tablero-intentos');
    tablero.insertBefore(fila, tablero.firstChild);
}
function limpiarTablero() {
    limpiarHijos(document.querySelector('.tablero-intentos'));
}
function limpiarListaAutocompletado() {
    limpiarHijos(document.querySelector('.lista-autocompletado'));
}
function ocultarListaAutocompletado() {
    document.querySelector('.lista-autocompletado').classList.add('oculto');
}
function manejarClickItemAutocompletado(jugador) {
    document.querySelector('.input-busqueda').value = '';
    ocultarListaAutocompletado();
    procesarIntento(jugador);
}
function crearItemAutocompletado(jugador) {
    var item;
    item = document.createElement('li');
    item.className = 'item-autocompletado';
    item.textContent = jugador.name;
    item.addEventListener('click', manejarClickItemAutocompletado.bind(null, jugador));
    return item;
}
function mostrarListaAutocompletado(jugadores) {
    var lista, i;
    lista = document.querySelector('.lista-autocompletado');
    limpiarListaAutocompletado();
    if (jugadores.length === 0) {
        ocultarListaAutocompletado();
        return;
    }
    for (i = 0; i < jugadores.length; i++) {
        lista.appendChild(crearItemAutocompletado(jugadores[i]));
    }
    lista.classList.remove('oculto');
}
function obtenerNombreDificultad(dificultad) {
    if (dificultad === 'facil') {
        return 'Fácil';
    }
    if (dificultad === 'medio') {
        return 'Medio';
    }
    return 'Difícil';
}
function actualizarTextoDificultad(dificultad) {
    document.querySelector('.texto-dificultad').textContent = obtenerNombreDificultad(dificultad);
}
function configurarPanelPistaExtra(dificultad) {
    var panel, foto, progresivas;
    panel = document.querySelector('.panel-pista-extra');
    foto = document.querySelector('.foto-pista');
    progresivas = document.querySelector('.pistas-progresivas');
    if (dificultad === 'dificil') {
        panel.classList.add('oculto');
        return;
    }
    panel.classList.remove('oculto');
    if (dificultad === 'facil') {
        foto.classList.remove('oculto');
        progresivas.classList.add('oculto');
        return;
    }
    foto.classList.add('oculto');
    progresivas.classList.remove('oculto');
}
function quitarNivelesDeDesenfoque(imagen) {
    var i;
    for (i = 0; i <= INTENTOS_MAXIMOS; i++) {
        imagen.classList.remove('nivel-blur-' + i);
    }
}
function actualizarNivelDeDesenfoque(imagen, intentosRestantesActuales) {
    var nivel;
    nivel = intentosRestantesActuales;
    if (nivel < 0) {
        nivel = 0;
    }
    if (nivel > INTENTOS_MAXIMOS) {
        nivel = INTENTOS_MAXIMOS;
    }
    quitarNivelesDeDesenfoque(imagen);
    imagen.classList.add('nivel-blur-' + nivel);
}
function manejarErrorImagenPista() {
    document.querySelector('.foto-pista').classList.add('oculto');
}
function manejarCargaImagenPista() {
    document.querySelector('.foto-pista').classList.remove('oculto');
}
function actualizarFotoPista(intentosRestantesActuales) {
    var imagen;
    imagen = document.querySelector('.foto-pista');
    imagen.onerror = manejarErrorImagenPista;
    imagen.onload = manejarCargaImagenPista;
    imagen.setAttribute('referrerpolicy', 'no-referrer');
    imagen.src = jugadorSecreto.photo;
    actualizarNivelDeDesenfoque(imagen, intentosRestantesActuales);
}
function crearChipPista(texto) {
    var chip;
    chip = document.createElement('span');
    chip.className = 'chip-pista';
    chip.textContent = texto;
    return chip;
}
function actualizarPistasProgresivas(intentosRestantesActuales) {
    var contenedor;
    contenedor = document.querySelector('.pistas-progresivas');
    limpiarHijos(contenedor);
    if (intentosRestantesActuales <= 6) {
        contenedor.appendChild(crearChipPista('Edad: ' + jugadorSecreto.age));
    }
    if (intentosRestantesActuales <= 4) {
        contenedor.appendChild(crearChipPista('Altura: ' + jugadorSecreto.heightCm + ' cm'));
    }
    if (intentosRestantesActuales <= 2) {
        contenedor.appendChild(crearChipPista('Overall: ' + jugadorSecreto.overall));
    }
}
function actualizarPistaExtraSegunIntentos(intentosRestantesActuales) {
    if (dificultadSeleccionada === 'facil') {
        actualizarFotoPista(intentosRestantesActuales);
        return;
    }
    if (dificultadSeleccionada === 'medio') {
        actualizarPistasProgresivas(intentosRestantesActuales);
    }
}
function mostrarPuntaje(puntaje) {
    var fila;
    fila = document.querySelector('.info-puntaje');
    document.querySelector('.texto-puntaje').textContent = String(puntaje);
    fila.classList.remove('oculto');
}
function ocultarPuntaje() {
    document.querySelector('.info-puntaje').classList.add('oculto');
}
function mostrarModal(texto) {
    var modal;
    modal = document.querySelector('.modal-mensaje');
    modal.querySelector('.texto-modal-mensaje').textContent = texto;
    modal.classList.remove('oculto');
}
function ocultarModal() {
    document.querySelector('.modal-mensaje').classList.add('oculto');
}
function ocultarModalInicio() {
    document.querySelector('.modal-inicio').classList.add('oculto');
}
function alternarTema() {
    var cuerpo, boton;
    cuerpo = document.body;
    boton = document.querySelector('.boton-tema');
    if (cuerpo.className.indexOf('tema-oscuro') !== -1) {
        cuerpo.className = 'tema-claro';
        boton.textContent = 'Modo oscuro';
        return;
    }
    cuerpo.className = 'tema-oscuro';
    boton.textContent = 'Modo claro';
}
function obtenerHistorialPartidas() {
    var textoGuardado;
    textoGuardado = window.localStorage.getItem(CLAVE_HISTORIAL);
    if (!textoGuardado) {
        return [];
    }
    return JSON.parse(textoGuardado);
}
function guardarResultadoPartida(resultado, intentosUsados, duracionSegundos, puntaje) {
    var historial, registro;
    historial = obtenerHistorialPartidas();
    registro = {};
    registro.jugadorHumano = nombreJugadorHumano;
    registro.resultado = resultado;
    registro.intentos = intentosUsados;
    registro.fecha = new Date().toISOString();
    registro.duracion = duracionSegundos;
    registro.puntaje = puntaje;
    registro.dificultad = dificultadSeleccionada;
    historial.push(registro);
    window.localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
}
function formatearFechaHistorial(fechaIso) {
    var fecha;
    fecha = new Date(fechaIso);
    return fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
}
function formatearDuracionHistorial(segundos) {
    var minutos, segundosRestantes;
    minutos = Math.floor(segundos / 60);
    segundosRestantes = segundos % 60;
    return formatearNumeroDosDigitos(minutos) + ':' + formatearNumeroDosDigitos(segundosRestantes);
}
function crearItemHistorial(registro) {
    var item, claseResultado, textoResultado;
    claseResultado = registro.resultado === 'ganada' ? 'item-historial-ganada' : 'item-historial-perdida';
    textoResultado = registro.resultado === 'ganada' ? 'Ganada' : 'Perdida';
    item = document.createElement('div');
    item.className = 'item-historial ' + claseResultado;
    item.textContent = registro.jugadorHumano + ' - ' + textoResultado + ' - Dificultad: ' + obtenerNombreDificultad(registro.dificultad) + ' - Intentos: ' + registro.intentos + ' - Puntaje: ' + registro.puntaje + ' - Duración: ' + formatearDuracionHistorial(registro.duracion) + ' - ' + formatearFechaHistorial(registro.fecha);
    return item;
}
function compararRegistrosPorFecha(registroA, registroB) {
    return new Date(registroB.fecha).getTime() - new Date(registroA.fecha).getTime();
}
function compararRegistrosPorIntentos(registroA, registroB) {
    return registroA.intentos - registroB.intentos;
}
function ordenarHistorialPorFecha(historial) {
    return historial.slice().sort(compararRegistrosPorFecha);
}
function ordenarHistorialPorIntentos(historial) {
    return historial.slice().sort(compararRegistrosPorIntentos);
}
function renderizarHistorial() {
    var contenedor, historial, historialOrdenado, i;
    contenedor = document.querySelector('.lista-historial');
    limpiarHijos(contenedor);
    historial = obtenerHistorialPartidas();
    if (ordenHistorialActual === 'intentos') {
        historialOrdenado = ordenarHistorialPorIntentos(historial);
    } else {
        historialOrdenado = ordenarHistorialPorFecha(historial);
    }
    if (historialOrdenado.length === 0) {
        contenedor.textContent = 'Todavía no jugaste ninguna partida.';
        return;
    }
    for (i = 0; i < historialOrdenado.length; i++) {
        contenedor.appendChild(crearItemHistorial(historialOrdenado[i]));
    }
}
function mostrarModalHistorial() {
    renderizarHistorial();
    document.querySelector('.modal-historial').classList.remove('oculto');
}
function ocultarModalHistorial() {
    document.querySelector('.modal-historial').classList.add('oculto');
}

'use strict';
var TIEMPO_ESPERA_BUSQUEDA = 300;
var idTimeoutBusqueda = null;
var textoBusquedaPendiente = '';
function manejarErrorBusqueda() {
    mostrarModal('No se pudo conectar con el servidor de jugadores. Intentá nuevamente.');
}
function ejecutarBusquedaPendiente() {
    buscarJugadoresPorNombre(textoBusquedaPendiente, mostrarListaAutocompletado, manejarErrorBusqueda);
}
function manejarInputBusqueda() {
    var campoBusqueda;
    campoBusqueda = document.querySelector('.input-busqueda');
    textoBusquedaPendiente = campoBusqueda.value.trim();
    if (idTimeoutBusqueda !== null) {
        clearTimeout(idTimeoutBusqueda);
    }
    if (textoBusquedaPendiente.length < 2) {
        ocultarListaAutocompletado();
        return;
    }
    idTimeoutBusqueda = setTimeout(ejecutarBusquedaPendiente, TIEMPO_ESPERA_BUSQUEDA);
}
function obtenerDificultadElegida() {
    var radios, i;
    radios = document.getElementsByName('dificultad');
    for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 'facil';
}
function manejarClickComenzar() {
    var campoNombre, textoError, nombre;
    campoNombre = document.querySelector('.input-nombre');
    textoError = document.querySelector('.error-nombre-jugador');
    nombre = campoNombre.value.trim();
    if (nombre.length < 3) {
        textoError.classList.remove('oculto');
        return;
    }
    textoError.classList.add('oculto');
    nombreJugadorHumano = nombre;
    dificultadSeleccionada = obtenerDificultadElegida();
    actualizarTextoDificultad(dificultadSeleccionada);
    ocultarModalInicio();
    iniciarPartida();
}
function manejarClickReiniciar() {
    reiniciarJuego();
}
function manejarClickCerrarModal() {
    ocultarModal();
}
function manejarClickTema() {
    alternarTema();
}
function manejarClickHistorial() {
    mostrarModalHistorial();
}
function manejarClickCerrarHistorial() {
    ocultarModalHistorial();
}
function manejarClickOrdenarFecha() {
    ordenHistorialActual = 'fecha';
    renderizarHistorial();
}
function manejarClickOrdenarIntentos() {
    ordenHistorialActual = 'intentos';
    renderizarHistorial();
}
function manejarClickFueraDeLista(evento) {
    var contenedor;
    contenedor = document.querySelector('.contenedor-busqueda');
    if (!contenedor.contains(evento.target)) {
        ocultarListaAutocompletado();
    }
}
function inicializarEventos() {
    document.querySelector('.input-busqueda').addEventListener('input', manejarInputBusqueda);
    document.querySelector('.boton-comenzar').addEventListener('click', manejarClickComenzar);
    document.querySelector('.boton-reiniciar').addEventListener('click', manejarClickReiniciar);
    document.querySelector('.boton-cerrar-modal').addEventListener('click', manejarClickCerrarModal);
    document.querySelector('.boton-tema').addEventListener('click', manejarClickTema);
    document.querySelector('.boton-historial').addEventListener('click', manejarClickHistorial);
    document.querySelector('.boton-cerrar-historial').addEventListener('click', manejarClickCerrarHistorial);
    document.querySelector('.boton-ordenar-fecha').addEventListener('click', manejarClickOrdenarFecha);
    document.querySelector('.boton-ordenar-intentos').addEventListener('click', manejarClickOrdenarIntentos);
    document.addEventListener('click', manejarClickFueraDeLista);
}

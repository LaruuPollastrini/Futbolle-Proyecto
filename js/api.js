'use strict';
var URL_BASE_JUGADORES = 'https://futbolle-daw-uai-2026.onrender.com/api/players';
function manejarRespuestaApi(respuesta) {
    if (!respuesta.ok) {
        throw new Error('Error de red al consultar el servidor.');
    }
    return respuesta.json();
}
function obtenerJugadorAleatorio(callbackExito, callbackError) {
    fetch(URL_BASE_JUGADORES + '/random')
        .then(manejarRespuestaApi)
        .then(callbackExito)
        .catch(callbackError);
}
function buscarJugadoresPorNombre(texto, callbackExito, callbackError) {
    var url;
    url = URL_BASE_JUGADORES + '/search?q=' + encodeURIComponent(texto) + '&limit=8';
    fetch(url)
        .then(manejarRespuestaApi)
        .then(callbackExito)
        .catch(callbackError);
}

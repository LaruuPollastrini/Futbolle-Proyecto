'use strict';
var INTENTOS_MAXIMOS = 8;
var jugadorSecreto = null;
var intentosRestantes = INTENTOS_MAXIMOS;
var nombresUsados = [];
var partidaActiva = false;
var temporizadorIniciado = false;
var nombreJugadorHumano = '';
var dificultadSeleccionada = 'facil';
var horaInicioPartida = null;
var idIntervaloTiempo = null;
function formatearNumeroDosDigitos(numero) {
    if (numero < 10) {
        return '0' + numero;
    }
    return String(numero);
}
function actualizarTiempoTranscurrido() {
    var ahora, diferenciaSegundos, minutos, segundos, textoTiempo;
    ahora = new Date();
    diferenciaSegundos = Math.floor((ahora.getTime() - horaInicioPartida.getTime()) / 1000);
    minutos = Math.floor(diferenciaSegundos / 60);
    segundos = diferenciaSegundos % 60;
    textoTiempo = formatearNumeroDosDigitos(minutos) + ':' + formatearNumeroDosDigitos(segundos);
    actualizarTextoTiempo(textoTiempo);
}
function iniciarTemporizador() {
    horaInicioPartida = new Date();
    idIntervaloTiempo = setInterval(actualizarTiempoTranscurrido, 1000);
}
function detenerTemporizador() {
    if (idIntervaloTiempo !== null) {
        clearInterval(idIntervaloTiempo);
        idIntervaloTiempo = null;
    }
}
function obtenerDuracionSegundos() {
    if (horaInicioPartida === null) {
        return 0;
    }
    return Math.floor((new Date().getTime() - horaInicioPartida.getTime()) / 1000);
}
function compararNumero(valorIntento, valorSecreto) {
    if (valorIntento === valorSecreto) {
        return 'verde';
    }
    if (valorSecreto > valorIntento) {
        return 'arriba';
    }
    return 'abajo';
}
function compararJugadores(intento, secreto) {
    var resultado;
    resultado = {};
    resultado.nacionalidad = intento.nationality === secreto.nationality ? 'verde' : 'rojo';
    resultado.club = intento.club === secreto.club ? 'verde' : 'rojo';
    resultado.posicion = intento.position === secreto.position ? 'verde' : 'rojo';
    resultado.edad = compararNumero(intento.age, secreto.age);
    resultado.overall = compararNumero(intento.overall, secreto.overall);
    resultado.altura = compararNumero(intento.heightCm, secreto.heightCm);
    return resultado;
}
function nombreYaUsado(nombre) {
    return nombresUsados.indexOf(nombre) !== -1;
}
function registrarNombreUsado(nombre) {
    nombresUsados.push(nombre);
}
function obtenerPuntosBaseDificultad(dificultad) {
    if (dificultad === 'facil') {
        return 60;
    }
    if (dificultad === 'medio') {
        return 80;
    }
    return 100;
}
function obtenerBonusTiempo(duracionSegundos) {
    if (duracionSegundos < 60) {
        return 20;
    }
    if (duracionSegundos < 120) {
        return 10;
    }
    return 0;
}
function calcularPuntaje(intentosUsados, duracionSegundos) {
    var puntosBase, bonusTiempo, puntaje;
    puntosBase = obtenerPuntosBaseDificultad(dificultadSeleccionada);
    bonusTiempo = obtenerBonusTiempo(duracionSegundos);
    puntaje = puntosBase - (intentosUsados - 1) * 10 + bonusTiempo;
    if (puntaje < 10) {
        puntaje = 10;
    }
    return puntaje;
}
function finalizarPartidaGanada() {
    var duracion, intentosUsados, puntaje;
    partidaActiva = false;
    detenerTemporizador();
    duracion = obtenerDuracionSegundos();
    intentosUsados = INTENTOS_MAXIMOS - intentosRestantes;
    puntaje = calcularPuntaje(intentosUsados, duracion);
    mostrarPuntaje(puntaje);
    guardarResultadoPartida('ganada', intentosUsados, duracion, puntaje);
    reproducirSonidoVictoria();
    mostrarModal('¡Felicitaciones! Adivinaste a ' + jugadorSecreto.name + ' en ' + intentosUsados + ' intentos. Puntaje: ' + puntaje + '.');
}
function finalizarPartidaPerdida() {
    var duracion;
    partidaActiva = false;
    detenerTemporizador();
    duracion = obtenerDuracionSegundos();
    mostrarPuntaje(0);
    guardarResultadoPartida('perdida', INTENTOS_MAXIMOS, duracion, 0);
    reproducirSonidoDerrota();
    mostrarModal('Se acabaron los intentos. El jugador secreto era ' + jugadorSecreto.name + '.');
}
function procesarIntento(jugadorElegido) {
    var comparacion, fila, intentosUsados;
    if (!partidaActiva) {
        return;
    }
    if (nombreYaUsado(jugadorElegido.name)) {
        mostrarModal('Ya intentaste con ese jugador. Elegí otro nombre.');
        return;
    }
    if (!temporizadorIniciado) {
        iniciarTemporizador();
        temporizadorIniciado = true;
    }
    registrarNombreUsado(jugadorElegido.name);
    comparacion = compararJugadores(jugadorElegido, jugadorSecreto);
    if (huboAciertoEnComparacion(comparacion)) {
        reproducirSonidoAcierto();
    }else{
        reproducirSonidoSinAcierto();
    }
    fila = crearFilaIntento(jugadorElegido, comparacion);
    agregarFilaAlTablero(fila);
    intentosRestantes = intentosRestantes - 1;
    actualizarContadorIntentos(intentosRestantes);
    intentosUsados = INTENTOS_MAXIMOS - intentosRestantes;
    actualizarPistaExtraSegunIntentos(intentosRestantes);
    if (jugadorElegido.id === jugadorSecreto.id) {
        finalizarPartidaGanada();
        return;
    }
    if (intentosRestantes === 0) {
        finalizarPartidaPerdida();
    }
}
function manejarJugadorSecretoObtenido(jugador) {
    jugadorSecreto = jugador;
    partidaActiva = true;
    configurarPanelPistaExtra(dificultadSeleccionada);
    actualizarPistaExtraSegunIntentos(INTENTOS_MAXIMOS);
}
function manejarErrorJugadorSecreto() {
    mostrarModal('No se pudo iniciar la partida. Verificá tu conexión e intentá nuevamente.');
}
function iniciarPartida() {
    limpiarTablero();
    intentosRestantes = INTENTOS_MAXIMOS;
    actualizarContadorIntentos(intentosRestantes);
    nombresUsados = [];
    partidaActiva = false;
    temporizadorIniciado = false;
    detenerTemporizador();
    actualizarTextoTiempo('00:00');
    ocultarPuntaje();
    obtenerJugadorAleatorio(manejarJugadorSecretoObtenido, manejarErrorJugadorSecreto);
}
function reiniciarJuego() {
    iniciarPartida();
}

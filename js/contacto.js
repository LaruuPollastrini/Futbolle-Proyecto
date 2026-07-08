'use strict';
var MAIL_DESTINO_CONTACTO = 'Tomas.ariaskarle@uai.edu.ar';
var EXPRESION_ALFANUMERICA = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/;
var EXPRESION_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validarNombreContacto(nombre) {
    return nombre.length >= 3 && EXPRESION_ALFANUMERICA.test(nombre);
}
function validarMailContacto(mail) {
    return EXPRESION_MAIL.test(mail);
}
function validarMensajeContacto(mensaje) {
    return mensaje.length > 5;
}
function mostrarErrorCampo(claseError, mostrar) {
    var elementoError;
    elementoError = document.querySelector('.' + claseError);
    if (mostrar) {
        elementoError.classList.remove('oculto');
        return;
    }
    elementoError.classList.add('oculto');
}
function abrirClienteDeCorreo(nombre, mail, mensaje) {
    var asunto, cuerpo, urlMailto;
    asunto = 'Contacto desde Futbolle - ' + nombre;
    cuerpo = 'Nombre: ' + nombre + '\nEmail: ' + mail + '\n\n' + mensaje;
    urlMailto = 'mailto:' + MAIL_DESTINO_CONTACTO + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    window.location.href = urlMailto;
}
function manejarClickEnviarContacto() {
    var campoNombre, campoMail, campoMensaje, nombre, mail, mensaje, nombreValido, mailValido, mensajeValido;
    campoNombre = document.querySelector('.input-nombre-contacto');
    campoMail = document.querySelector('.input-mail-contacto');
    campoMensaje = document.querySelector('.input-mensaje-contacto');
    nombre = campoNombre.value.trim();
    mail = campoMail.value.trim();
    mensaje = campoMensaje.value.trim();
    nombreValido = validarNombreContacto(nombre);
    mailValido = validarMailContacto(mail);
    mensajeValido = validarMensajeContacto(mensaje);
    mostrarErrorCampo('error-nombre-contacto', !nombreValido);
    mostrarErrorCampo('error-mail-contacto', !mailValido);
    mostrarErrorCampo('error-mensaje-contacto', !mensajeValido);
    if (!nombreValido || !mailValido || !mensajeValido) {
        mostrarModal('Revisá los datos del formulario antes de enviar.');
        return;
    }
    abrirClienteDeCorreo(nombre, mail, mensaje);
}
function manejarClickTemaContacto() {
    alternarTema();
}
function manejarClickCerrarModalContacto() {
    ocultarModal();
}
function inicializarEventosContacto() {
    document.querySelector('.boton-enviar-contacto').addEventListener('click', manejarClickEnviarContacto);
    document.querySelector('.boton-tema').addEventListener('click', manejarClickTemaContacto);
    document.querySelector('.boton-cerrar-modal').addEventListener('click', manejarClickCerrarModalContacto);
}
window.addEventListener('load', inicializarEventosContacto);

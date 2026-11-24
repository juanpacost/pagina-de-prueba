/* Brisa Caleña Rent a Car — funciones de la página */
(function () {
  'use strict';

  // Número de WhatsApp: código de Colombia (57) + celular, solo dígitos
  var WHATSAPP = '573143884016';

  document.documentElement.classList.remove('sin-js');

  document.addEventListener('DOMContentLoaded', function () {
    // Año actual en el pie de página
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // ---------- Menú en celular ----------
    var boton = document.querySelector('.menu-boton');
    var nav = document.getElementById('menu-principal');
    if (boton && nav) {
      var cerrarMenu = function () {
        boton.setAttribute('aria-expanded', 'false');
        boton.setAttribute('aria-label', 'Abrir menú');
        nav.classList.remove('abierto');
      };
      boton.addEventListener('click', function () {
        if (boton.getAttribute('aria-expanded') === 'true') {
          cerrarMenu();
        } else {
          boton.setAttribute('aria-expanded', 'true');
          boton.setAttribute('aria-label', 'Cerrar menú');
          nav.classList.add('abierto');
        }
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) cerrarMenu();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('abierto')) {
          cerrarMenu();
          boton.focus();
        }
      });
    }

    // ---------- Botones "Cotizar este" de cada vehículo ----------
    var mensaje = document.getElementById('mensaje');
    document.querySelectorAll('[data-vehiculo]').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        if (mensaje && !mensaje.value.trim()) {
          mensaje.value = 'Me interesa rentar un vehículo tipo ' + enlace.getAttribute('data-vehiculo') + '. ';
        }
      });
    });

    // ---------- Formulario que abre WhatsApp ----------
    var form = document.getElementById('form-cotizar');
    if (form) {
      var mostrarError = function (campo, texto) {
        var error = document.getElementById(campo.id + '-error');
        if (texto) {
          campo.setAttribute('aria-invalid', 'true');
        } else {
          campo.removeAttribute('aria-invalid');
        }
        if (error) error.textContent = texto || '';
      };

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nombre = document.getElementById('nombre');
        var telefono = document.getElementById('telefono');
        var nombreVal = nombre.value.trim();
        var telVal = telefono.value.trim();
        var telDigitos = telVal.replace(/\D/g, '');
        var msgVal = mensaje ? mensaje.value.trim() : '';

        var errorNombre = nombreVal.length < 2 ? 'Por favor escribe tu nombre.' : '';
        var errorTel = telDigitos.length < 7 ? 'Escribe un teléfono válido (mínimo 7 números).' : '';
        mostrarError(nombre, errorNombre);
        mostrarError(telefono, errorTel);

        if (errorNombre) { nombre.focus(); return; }
        if (errorTel) { telefono.focus(); return; }

        var texto =
          '¡Hola, Brisa Caleña! Quiero cotizar un carro.\n\n' +
          '*Nombre:* ' + nombreVal + '\n' +
          '*Teléfono:* ' + telVal + '\n' +
          '*Mensaje:* ' + (msgVal || 'Sin comentarios adicionales.');

        var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
        var ventana = window.open(url, '_blank');
        if (ventana) {
          ventana.opener = null;
        } else {
          window.location.href = url;
        }
      });

      // Quitar el aviso de error cuando la persona corrige
      form.querySelectorAll('input, textarea').forEach(function (campo) {
        campo.addEventListener('input', function () {
          if (campo.getAttribute('aria-invalid') === 'true') mostrarError(campo, '');
        });
      });
    }

    // ---------- Animación de entrada ----------
    var elementos = document.querySelectorAll('.aparecer');
    var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || sinMovimiento) {
      elementos.forEach(function (el) { el.classList.add('visible'); });
    } else {
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.12 });
      elementos.forEach(function (el) { observador.observe(el); });
    }
  });
})();

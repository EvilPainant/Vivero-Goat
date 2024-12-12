import { agregarPedido } from './firebase.js';

const totalCompra = parseFloat(localStorage.getItem('totalCompra')) || 0;
const tipoDespacho = localStorage.getItem('tipoDespacho') || 'Domicilio';

document.addEventListener('DOMContentLoaded', () => {
    const totalMontoElement = document.getElementById('total-monto');
    if (totalMontoElement) {
        totalMontoElement.textContent = `$${totalCompra.toFixed(2)}`;
    }

    const tipoDespachoElement = document.getElementById('tipo-despacho');
    const direccionGroup = document.getElementById('direccion-group');

    if (tipoDespachoElement) {
        tipoDespachoElement.value = tipoDespacho;
        if (tipoDespacho === 'domicilio') {
            direccionGroup.style.display = 'block';
        } else {
            direccionGroup.style.display = 'none';
        }
    }
});

let tiempoRestante = 600; 
let contador;
const tiempoElemento = document.getElementById('tiempo-restante');

const contarTiempo = () => {
    if (tiempoElemento) {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        tiempoElemento.textContent = `${minutos}:${segundos < 10 ? '0' + segundos : segundos}`;

        if (tiempoRestante > 0) {
            tiempoRestante--;
        } else {
            clearInterval(contador);
            Swal.fire({
                title: 'Tiempo agotado',
                text: 'El tiempo para realizar el pago ha expirado. Por favor, intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = 'indexProductosCarrito.html';
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    contador = setInterval(contarTiempo, 1000);
});

function validarRut(rut) {
    const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return regex.test(rut);
}

function confirmarPago(event) {
    event.preventDefault();

    const rut = document.getElementById('rut').value;
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;

    if (!validarRut(rut)) {
        Swal.fire({
            title: 'Error',
            text: 'El RUT ingresado no es válido. Formato esperado: 12.345.678-9',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    if (!nombre || !correo || (tipoDespacho === 'domicilio' && !direccion)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos requeridos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    clearInterval(contador);

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const pedido = {
        productos: carrito,
        total: totalCompra,
        estado: 'Pendiente',
        fecha: new Date().toISOString(),
        cliente: {
            rut,
            nombre,
            correo,
            tipoDespacho,
            ...(tipoDespacho === 'domicilio' && { direccion })
        }
    };

    agregarPedido(pedido).then(() => {
        Swal.fire({
            title: 'Pago Confirmado',
            text: 'El pedido será confirmado en un plazo de 1 día.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = 'ListadoPlantas.html';
        });
    }).catch((error) => {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al confirmar el pedido. Por favor, inténtelo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}


function volverAlCarrito() {
    window.location.href = 'indexProductosCarrito.html';
}

window.confirmarPago = confirmarPago;
window.volverAlCarrito = volverAlCarrito;

document.getElementById('confirmar-pago').addEventListener('click', confirmarPago);
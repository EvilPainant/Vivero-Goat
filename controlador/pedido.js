import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getDataPedidos, actualizarEstadoPedido, db, actualizarStockProductoPorCodigo } from "../modelo/firebase.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';

const auth = getAuth();

const cargarPedidos = async () => {
    const pedidosLista = document.getElementById('pedidos-lista');
    pedidosLista.innerHTML = '';

    const pedidosSnapshot = await getDataPedidos();
    pedidosSnapshot.forEach(doc => {
        const pedido = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${new Date(pedido.fecha).toLocaleString()}</td>
            <td>${pedido.productos.map(p => p.nombre).join(', ')}</td>
            <td>$${pedido.total.toFixed(2)}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.cliente.rut}</td>
            <td>${pedido.cliente.nombre}</td>
            <td>${pedido.cliente.correo}</td>
            <td>${pedido.cliente.tipoDespacho}</td>
            <td>
                ${pedido.estado === 'Pendiente' ? `
                    <button class="btn btn-success" onclick="aceptarPedido('${doc.id}')">Aceptar</button>
                    <button class="btn btn-danger" onclick="rechazarPedido('${doc.id}')">Rechazar</button>
                ` : ''}
            </td>
        `;
        if (pedido.estado === 'Pendiente') {
            pedidosLista.appendChild(row);
        }
    });
};

async function aceptarPedido(id) {
    try {
        await actualizarEstadoPedido(id, 'Aceptado');
        alert('Pedido Aceptado');

        const pedidoDoc = await getDoc(doc(db, 'Pedidos', id));
        if (!pedidoDoc.exists()) {
            throw new Error('Pedido no encontrado');
        }
        const pedido_data = pedidoDoc.data();

        for (const producto of pedido_data.productos) {
            const codigoProducto = producto.codigo;
            const cantidadComprada = producto.cantidad;

            await actualizarStockProductoPorCodigo(codigoProducto, cantidadComprada);
        }

        localStorage.removeItem('carrito');

        cargarPedidos();
    } catch (error) {
        console.error('Error al aceptar el pedido:', error);
        alert('Hubo un problema al aceptar el pedido. Por favor, inténtelo nuevamente.');
    }
}

function rechazarPedido(id) {
    actualizarEstadoPedido(id, 'Rechazado').then(() => {
        alert('Pedido Rechazado');
        cargarPedidos();
    }).catch(error => {
        console.error('Error al rechazar el pedido:', error);
        alert('Hubo un problema al rechazar el pedido. Por favor, inténtelo nuevamente.');
    });
}
document.addEventListener('DOMContentLoaded', cargarPedidos);
window.aceptarPedido = aceptarPedido;
window.rechazarPedido = rechazarPedido;
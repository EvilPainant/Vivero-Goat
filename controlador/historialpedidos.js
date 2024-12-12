import { getDataPedidos } from "../modelo/firebase.js";

const cargarHistorialPedidos = async () => {
    const historialPedidosLista = document.getElementById('historial-pedidos-lista');
    historialPedidosLista.innerHTML = '';

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
        `;
        if (pedido.estado !== 'Pendiente') {
            historialPedidosLista.appendChild(row);
        }
    });
};

document.addEventListener('DOMContentLoaded', cargarHistorialPedidos);
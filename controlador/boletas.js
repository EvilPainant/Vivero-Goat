import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getDataPedidos, db } from "../modelo/firebase.js";

const cargarBoletas = async () => {
    const boletasLista = document.getElementById('boletas-lista');
    boletasLista.innerHTML = '';

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
            <td><button class="btn btn-primary" onclick="exportarPDF('${doc.id}')">Exportar PDF</button></td>
        `;
        boletasLista.appendChild(row);
    });
};

const exportarPDF = async (id) => {
    const pedidoDoc = await getDoc(doc(db, 'Pedidos', id));
    if (!pedidoDoc.exists()) {
        alert('Pedido no encontrado');
        return;
    }
    const pedido = pedidoDoc.data();

    const { jsPDF } = window.jspdf;
    const docPDF = new jsPDF();

    docPDF.text(`ID Pedido: ${id}`, 10, 10);
    docPDF.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`, 10, 20);
    docPDF.text(`Productos: ${pedido.productos.map(p => p.nombre).join(', ')}`, 10, 30);
    docPDF.text(`Total: $${pedido.total.toFixed(2)}`, 10, 40);
    docPDF.text(`Estado: ${pedido.estado}`, 10, 50);
    docPDF.text(`RUT: ${pedido.cliente.rut}`, 10, 60);
    docPDF.text(`Nombre: ${pedido.cliente.nombre}`, 10, 70);
    docPDF.text(`Email: ${pedido.cliente.correo}`, 10, 80);
    docPDF.text(`Tipo de Despacho: ${pedido.cliente.tipoDespacho}`, 10, 90);

    docPDF.save(`pedido_${id}.pdf`);
};

document.addEventListener('DOMContentLoaded', cargarBoletas);
window.exportarPDF = exportarPDF;
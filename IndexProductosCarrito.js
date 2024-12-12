function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoItems = document.getElementById('carrito-items');
    const carritoPrecioTotal = document.getElementById('carrito-precio-total');
    let total = 0;

    carritoItems.innerHTML = '';

    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>
                <button class="btn-cantidad" onclick='disminuirCantidad("${item.id}")'>-</button>
                ${item.cantidad}
                <button class="btn-cantidad" onclick='aumentarCantidad("${item.id}")'>+</button>
            </td>
            <td>$${item.precio}</td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><button class="btn-eliminar" onclick='eliminarDelCarrito("${item.id}")'>Eliminar</button></td>
        `;
        carritoItems.appendChild(row);
    });

    carritoPrecioTotal.textContent = `$${total.toFixed(2)}`;
}

window.eliminarDelCarrito = function(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carrito = carrito.filter(item => item.id !== id);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarCarrito();
            Swal.fire(
                'Eliminado!',
                'El producto ha sido eliminado del carrito.',
                'success'
            );
        }
    });
}

window.aumentarCantidad = function(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(item => item.id === id);
    if (producto && producto.cantidad < producto.stock) {
        producto.cantidad++;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    } else {
        Swal.fire({
            title: 'Stock insuficiente',
            text: 'No hay suficiente stock para agregar más de este producto.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

window.disminuirCantidad = function(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito.find(item => item.id === id);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    } else {
        eliminarDelCarrito(id);
    }
}

function actualizarTotal() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoPrecioTotal = document.getElementById('carrito-precio-total');
    const tipoDespacho = document.getElementById('envio').value;
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });

    if (tipoDespacho === 'domicilio') {
        total += 5000;
    }

    carritoPrecioTotal.textContent = `$${total.toFixed(2)}`;

    localStorage.setItem('tipoDespacho', tipoDespacho);
}

async function procederAlPago() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    const tipoDespacho = document.getElementById('envio').value;
    if (!tipoDespacho) {
        Swal.fire({
            title: 'Tipo de despacho',
            text: 'Selecciona un tipo de despacho.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let total = 0;
    for (const item of carrito) {
        total += item.precio * item.cantidad;
    }

    if (tipoDespacho === 'domicilio') {
        total += 5000;
    }

    localStorage.setItem('totalCompra', total);

    window.location.href = 'Pagos.html';
}

window.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();

    const tipoDespacho = localStorage.getItem('tipoDespacho');
    if (tipoDespacho) {
        document.getElementById('envio').value = tipoDespacho;
        actualizarTotal();
    }

    document.getElementById('checkoutButton').addEventListener('click', procederAlPago);

    document.getElementById('envio').addEventListener('change', actualizarTotal);
});
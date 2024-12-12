import { getDataPlantas, getDataCategoria, getDataProveedor } from "./firebase.js";

let categoriasMap = new Map();
let proveedoresMap = new Map();

const cargarCategorias = () => {
    getDataCategoria((collection) => {
        collection.forEach((doc) => {
            const categoria = doc.data();
            categoriasMap.set(doc.id, categoria.nombre);
        });
    });
};

const cargarProveedores = () => {
    getDataProveedor((collection) => {
        collection.forEach((doc) => {
            const proveedor = doc.data();
            proveedoresMap.set(doc.id, proveedor.nombre);
        });
    });
};

function agregarAlCarrito(planta) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const plantaExistente = carrito.find(item => item.id === planta.id);
    if (plantaExistente) {
        plantaExistente.cantidad += 1;
    } else {
        planta.cantidad = 1;
        carrito.push(planta);
    }


    localStorage.setItem('carrito', JSON.stringify(carrito));


    Swal.fire({
        title: '¡Planta agregada!',
        text: `La planta ${planta.nombre} ha sido agregada al carrito.`,
        icon: 'success',
        confirmButtonText: 'Ok'
    });
}


window.agregarAlCarrito = agregarAlCarrito;

window.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProveedores();

    getDataPlantas((collection) => {
        let cartas = '';
        collection.forEach((doc) => {
            const item = doc.data();
            item.id = doc.id;

            const nombreCategoria = categoriasMap.get(item.categoria) || item.categoria;
            const nombreProveedor = proveedoresMap.get(item.proveedor) || item.proveedor;

            cartas += `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm" style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <div style="width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="${item.imagen}" alt="${item.nombre}" style="max-width: 100%; max-height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-body" style="padding: 10px;">
                        <h5 class="card-title" style="margin-bottom: 10px; font-size: 18px;">${item.nombre}</h5>
                        <p class="card-text" style="margin: 5px 0;"><strong>Código:</strong> ${item.codigo}</p>
                        <p class="card-text" style="margin: 5px 0;"><strong>Proveedor:</strong> ${nombreProveedor}</p>
                        <p class="card-text" style="margin: 5px 0;"><strong>Categoría:</strong> ${nombreCategoria}</p>
                        <p class="card-text" style="margin: 5px 0;"><strong>Stock:</strong> ${item.stock}</p>
                        <p class="card-text" style="margin: 5px 0;"><strong>Precio:</strong> $${item.precio}</p>
                        <p class="card-text" style="margin: 5px 0;"><strong>Descripción:</strong> ${item.descripcion}</p>
                        <button class="btn btn-primary mt-auto" onclick='agregarAlCarrito(${JSON.stringify(item).replace(/'/g, "\\'")})'>Agregar al carrito</button>
                    </div>
                </div>
            </div>

            `;
        });

        document.getElementById('contenido').innerHTML = cartas;
    });
});
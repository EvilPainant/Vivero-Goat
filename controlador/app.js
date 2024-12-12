import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANERwSZvEoZh5M0m91GwmPw7llkLksiI",
    authDomain: "vivelo-4c604.firebaseapp.com",
    projectId: "vivelo-4c604",
    storageBucket: "vivelo-4c604.firebasestorage.app",
    messagingSenderId: "419261307013",
    appId: "1:419261307013:web:59f5d082c4007e470df1ec",
    measurementId: "G-PE29ZG57HJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let categoriasMap = new Map();
let proveedoresMap = new Map();

const cargarCategorias = async () => {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    querySnapshot.forEach((doc) => {
        const categoria = doc.data();
        categoriasMap.set(doc.id, categoria.nombre);
    });
};

const cargarProveedores = async () => {
    const querySnapshot = await getDocs(collection(db, "proveedores"));
    querySnapshot.forEach((doc) => {
        const proveedor = doc.data();
        proveedoresMap.set(doc.id, proveedor.nombre);
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

window.addEventListener('DOMContentLoaded', async () => {
    await cargarCategorias();
    await cargarProveedores();

    const querySnapshot = await getDocs(collection(db, "plantas"));
    let cartas = '';
    querySnapshot.forEach((doc) => {
        const item = doc.data();

        const nombreCategoria = categoriasMap.get(item.categoria) || item.categoria;
        const nombreProveedor = proveedoresMap.get(item.proveedor) || item.proveedor;

        cartas += `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${item.imagen}" class="card-img-top" alt="${item.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="card-text"><strong>Código:</strong> ${item.codigo}</p>
                    <p class="card-text"><strong>Proveedor:</strong> ${nombreProveedor}</p>
                    <p class="card-text"><strong>Categoría:</strong> ${nombreCategoria}</p>
                    <p class="card-text"><strong>Stock:</strong> ${item.stock}</p>
                    <p class="card-text"><strong>Precio:</strong> $${item.precio}</p>
                    <p class="card-text"><strong>Descripción:</strong> ${item.descripcion}</p>
                    <!-- Botón para agregar al carrito -->
                    <button class="btn btn-success" onclick='agregarAlCarrito(${JSON.stringify(item)})'>Agregar al carrito</button>
                </div>
            </div>
        </div>
        `;
    });

    document.getElementById('contenido').innerHTML = cartas;
});
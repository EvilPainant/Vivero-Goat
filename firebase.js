import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
    addDoc, collection, getFirestore, onSnapshot, doc, updateDoc, getDoc, query, where, getDocs, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANERwSZvEoZh5M0m91GwmPw7llkZLksiI",
    authDomain: "vivelo-4c604.firebaseapp.com",
    projectId: "vivelo-4c604",
    storageBucket: "vivelo-4c604.firebasestorage.app",
    messagingSenderId: "419261307013",
    appId: "1:419261307013:web:59f5d082c4007e470df1ec",
    measurementId: "G-PE29ZG57HJ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const agregarPedido = async (pedido) => {
    try {
        const docRef = await addDoc(collection(db, 'Pedidos'), pedido);
        console.log("Pedido agregado con ID: ", docRef.id);
    } catch (e) {
        console.error("Error agregando pedido: ", e);
    }
};

export const getDataPedidos = async () => {
    const pedidosSnapshot = await getDocs(collection(db, 'Pedidos'));
    return pedidosSnapshot;
};

export const actualizarEstadoPedido = async (id, estado) => {
    try {
        const pedidoRef = doc(db, 'Pedidos', id);
        await updateDoc(pedidoRef, { estado: estado });
        console.log("Estado del pedido actualizado a: ", estado);
    } catch (e) {
        console.error("Error actualizando el estado del pedido: ", e);
    }
};

export const actualizarStockProducto = async (id, cantidadComprada) => {
    try {
        const productoRef = doc(db, 'Plantas', id);
        const productoSnap = await getDoc(productoRef);

        if (productoSnap.exists()) {
            const nuevoStock = productoSnap.data().stock - cantidadComprada;

            if (nuevoStock <= 0) {
                await deleteDoc(productoRef);
                console.log("Producto eliminado por falta de stock");
            } else {
                await updateDoc(productoRef, { stock: nuevoStock });
                console.log("Stock del producto actualizado a: ", nuevoStock);
            }
        } else {
            console.error("No se encontró el producto con ID: ", id);
        }
    } catch (e) {
        console.error("Error actualizando el stock del producto: ", e);
    }
};

export const actualizarStockProductoPorCodigo = async (codigo, cantidadComprada) => {
    try {
        const q = query(collection(db, 'Plantas'), where('codigo', '==', codigo));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const productoDoc = querySnapshot.docs[0];
            const productoRef = productoDoc.ref;
            const nuevoStock = productoDoc.data().stock - cantidadComprada;

            if (nuevoStock <= 0) {
                await deleteDoc(productoRef);
                console.log("Producto eliminado por falta de stock");
            } else {
                await updateDoc(productoRef, { stock: nuevoStock });
                console.log("Stock del producto actualizado a: ", nuevoStock);
            }
        } else {
            console.error("No se encontró el producto con código: ", codigo);
        }
    } catch (e) {
        console.error("Error actualizando el stock del producto: ", e);
    }
};

// Categoría
export const saveCategoria = async (categoria) => {
    const q = query(collection(db, 'Categorias'), where('nombre', '==', categoria.nombre));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        await addDoc(collection(db, 'Categorias'), categoria);
        Swal.fire({
            title: "Éxito",
            text: "Categoría guardada correctamente",
            icon: "success"
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Ya existe una categoría con ese nombre",
            icon: "error"
        });
    }
};

export const getDataCategoria = (callback) => {
    onSnapshot(collection(db, 'Categorias'), callback);
};

export const eliminarCategoria = (id) => {
    deleteDoc(doc(db, 'Categorias', id));
};

export const obtenerCategoria = (id) => getDoc(doc(db, 'Categorias', id));

export const updateCategoria = (id, categoria) => {
    updateDoc(doc(db, 'Categorias', id), categoria);
};

// Proveedores
export const saveProveedor = async (proveedor) => {
    const q = query(collection(db, 'Proveedores'), where('run', '==', proveedor.run));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        await addDoc(collection(db, 'Proveedores'), proveedor);
        Swal.fire({
            title: "Éxito",
            text: "Proveedor guardado correctamente",
            icon: "success"
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Ya existe un proveedor con ese run",
            icon: "error"
        });
    }
};

export const getDataProveedor = (callback) => {
    onSnapshot(collection(db, 'Proveedores'), callback);
};

export const eliminarProveedor = (id) => {
    deleteDoc(doc(db, 'Proveedores', id));
};

export const obtenerProveedor = (id) => getDoc(doc(db, 'Proveedores', id));

export const updateProveedor = (id, proveedor) => {
    updateDoc(doc(db, 'Proveedores', id), proveedor);
};

// Plantas
export const savePlantas = async (plantas) => {
    const q = query(collection(db, 'Plantas'), where('codigo', '==', plantas.codigo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        await addDoc(collection(db, 'Plantas'), plantas);
        Swal.fire({
            title: "Éxito",
            text: "Planta guardada correctamente",
            icon: "success"
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Ya existe una planta con ese codigo",
            icon: "error"
        });
    }
};

export const getDataPlantas = (callback) => {
    onSnapshot(collection(db, 'Plantas'), callback);
};

export const eliminarPlantas = (id) => {
    deleteDoc(doc(db, 'Plantas', id));
};

export const obtenerPlantas = (id) => getDoc(doc(db, 'Plantas', id));

export const updatePlantas = (id, plantas) => {
    updateDoc(doc(db, 'Plantas', id), plantas);
};

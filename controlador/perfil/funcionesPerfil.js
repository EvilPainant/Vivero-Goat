import { auth, db } from './firebasePerfil.js';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';
import { getDataPlantas, getDataCategoria, getDataProveedor } from '../../modelo/firebase.js';

let categoriasMap = new Map();
let proveedoresMap = new Map();
async function mostrarInfoUsuario() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById("emailUsuario").textContent = user.email;

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                document.getElementById("passwordUsuario").textContent = '••••••••';
            }
        } else {
            console.error("No hay usuario autenticado");
        }
    });
}

async function cambiarContraseña() {
    const user = auth.currentUser;
    if (user) {
        const currentPassword = prompt("Ingresa tu contraseña actual:");
        if (!currentPassword) {
            alert("Error: Contraseña actual no puede estar vacía.");
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);

            let nuevaContraseña = prompt("Ingrese su nueva contraseña:");
            if (!nuevaContraseña) {
                alert("Error: Nueva contraseña no puede estar vacía.");
                return;
            }

            let repetirNuevaContraseña = prompt("Confirme su nueva contraseña:");
            if (!repetirNuevaContraseña) {
                alert("Error: Confirmación de nueva contraseña no puede estar vacía.");
                return;
            }

            if (nuevaContraseña === repetirNuevaContraseña) {
                await updatePassword(user, nuevaContraseña);

                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    await updateDoc(userRef, { password: nuevaContraseña });
                } else {
                    console.warn("No se encontró el documento del usuario en Firestore para actualizar.");
                }

                alert("Contraseña actualizada con éxito.");
            } else {
                alert("Error: Las contraseñas no coinciden.");
            }
        } catch (error) {
            console.error("Error al reautenticar:", error);
            alert("Error: Contraseña actual no válida.");
        }
    } else {
        alert("Usuario no autenticado.");
    }
}

function cerrarSesion() {
    auth.signOut().then(() => {
        alert("Sesión cerrada.");
        window.location.href = "/index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
}

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

const mostrarPlantas = () => {
    cargarCategorias(); 
    cargarProveedores();

    getDataPlantas((collection) => {
        let tabla = '';
        collection.forEach((doc) => {
            const item = doc.data();
            const nombreCategoria = categoriasMap.get(item.categoria) || item.categoria;
            const nombreProveedor = proveedoresMap.get(item.proveedor) || item.proveedor;
            tabla += `<tr>
                <td>${item.codigo}</td>
                <td>${item.nombre}</td>
                <td>${nombreCategoria}</td>
                <td>${item.descripcion}</td>
                <td>${item.stock}</td>
                <td>${item.precio}</td>
                <td><img src="${item.imagen}" alt="Imagen" width="50"></td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;
    });
};

export { mostrarInfoUsuario, cambiarContraseña, cerrarSesion, mostrarPlantas };

document.addEventListener('DOMContentLoaded', () => {
    mostrarInfoUsuario();
    mostrarPlantas();
});

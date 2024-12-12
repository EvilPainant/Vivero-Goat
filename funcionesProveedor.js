import { eliminarProveedor, getDataProveedor, obtenerProveedor, saveProveedor, updateProveedor } from "./firebase.js";
  
  let id = 0;
  
  document.getElementById('btnGuardar').addEventListener('click', async () => {
      document.querySelectorAll('.form-control').forEach(item => {
          verificar(item.id);
      });
      if (document.querySelectorAll('.is-invalid').length == 0) {
          const proveedor = {
              'run': document.getElementById('run').value,
              'nombre': document.getElementById('nombre').value.trim(),
              'telefono': document.getElementById('telefono').value,
              'email': document.getElementById('email').value.trim(),
              'direccion': document.getElementById('direccion').value.trim(),
          };
          if (document.getElementById('btnGuardar').value == 'Guardar') {
              await saveProveedor(proveedor);
          } else {
              await updateProveedor(id, proveedor);
              id = 0;
              document.getElementById('btnGuardar').value = 'Guardar';
          }
          limpiar();
      }
  });
  
  window.addEventListener('DOMContentLoaded', () => {
      getDataProveedor((collection) => {
          let tabla = '';
          collection.forEach((doc) => {
              const item = doc.data();
              tabla += `<tr>
                  <td>${item.run}</td>
                  <td>${item.nombre}</td>
                  <td>${item.telefono}</td>
                  <td>${item.email}</td>
                  <td>${item.direccion}</td>
                  <td nowrap>
                      <button class="btn btn-warning" id="${doc.id}">Editar</button>
                      <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
                  </td>
              </tr>`;
          });
          document.getElementById('contenido').innerHTML = tabla;
  
          document.querySelectorAll('.btn-danger').forEach(btn => {
              btn.addEventListener('click', () => {
                  Swal.fire({
                      title: "¿Estás seguro de eliminar el proveedor?",
                      text: "No podrás revertir los cambios",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "Eliminar",
                      cancelButtonText: "Cancelar"
                  }).then((result) => {
                      if (result.isConfirmed) {
                          eliminarProveedor(btn.id);
                          Swal.fire({
                              title: "Eliminado",
                              text: "Su registro ha sido eliminado",
                              icon: "success"
                          });
                          document.getElementById('btnGuardar').value = 'Guardar';
                          limpiar();
                      }
                  });
              });
          });
  
          document.querySelectorAll('.btn-warning').forEach(btn => {
              btn.addEventListener('click', async () => {
                  const doc = await obtenerProveedor(btn.id);
                  const d = doc.data();
                  document.getElementById('run').value = d.run;
                  document.getElementById('nombre').value = d.nombre;
                  document.getElementById('telefono').value = d.telefono;
                  document.getElementById('email').value = d.email;
                  document.getElementById('direccion').value = d.direccion;

                  document.getElementById('btnGuardar').value = 'Modificar';
                  id = btn.id;
              });
          });
      });
  });
  
import { eliminarCategoria, getDataCategoria, obtenerCategoria, saveCategoria, updateCategoria } from "../modelo/firebase.js";
  
  let id = 0;
  
  document.getElementById('btnGuardar').addEventListener('click', async () => {
      document.querySelectorAll('.form-control').forEach(item => {
          verificar(item.id);
      });
      if (document.querySelectorAll('.is-invalid').length == 0) {
          const categoria = {
              'nombre': document.getElementById('nombre').value.trim(),
          };
          if (document.getElementById('btnGuardar').value == 'Guardar') {
              await saveCategoria(categoria);
          } else {
              await updateCategoria(id, categoria);
              id = 0;
              document.getElementById('btnGuardar').value = 'Guardar';
          }
          limpiar();
      }
  });
  
  window.addEventListener('DOMContentLoaded', () => {
      getDataCategoria((collection) => {
          let tabla = '';
          collection.forEach((doc) => {
              const item = doc.data();
              tabla += `<tr>
                  <td>${item.nombre}</td>
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
                      title: "¿Estás seguro de eliminar la categoría?",
                      text: "No podrás revertir los cambios",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "Eliminar",
                      cancelButtonText: "Cancelar"
                  }).then((result) => {
                      if (result.isConfirmed) {
                          eliminarCategoria(btn.id);
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
                  const doc = await obtenerCategoria(btn.id);
                  const d = doc.data();
                  document.getElementById('nombre').value = d.nombre;
                  document.getElementById('btnGuardar').value = 'Modificar';
                  id = btn.id;
              });
          });
      });
  });
  
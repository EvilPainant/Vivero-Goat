import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredentials);

    const modal = bootstrap.Modal.getInstance(signInForm.closest('.modal'));
    modal.hide();

    signInForm.reset();

    showMessage("Bienvenido " + userCredentials.user.email);

    window.location.href = "ListadoPlantas.html";

  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      showMessage("Contraseña incorrecta", "error");
    } else if (error.code === 'auth/user-not-found') {
      showMessage("Usuario no encontrado", "error");
    } else {
      showMessage("Algo malió sal", "error");
    }
  }
});

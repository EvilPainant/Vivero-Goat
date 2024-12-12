import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "../../modelo/firebase.js";
import { loginCheck } from "./loginCheck.js";

import './signupForm.js'
import './signinForm.js'
import './logout.js'


onAuthStateChanged(auth, (user) => {
  loginCheck(user);
});
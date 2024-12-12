const verificar = (id) => {
    const input = document.getElementById(id);
    const div = document.getElementById('e-' + id);
    input.classList.remove('is-invalid');
    if (input.value.trim() === '') {
        input.classList.add('is-invalid');
        div.innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>';
    } else {
        input.classList.add('is-valid');
        div.innerHTML = '';
        if (id === 'imagen') {
            const urlFormato = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
            if (!urlFormato.test(input.value.trim())) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">Debe ingresar una URL válida (png, jpg, jpeg, gif, svg)</span>';
            }
        }
        if (id === 'codigo') {
            const valor = input.value.trim();
            if (!/^\d{9}$/.test(valor)) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">Debe contener exactamente 9 números</span>';
            } else {
                input.classList.add('is-valid');
                div.innerHTML = '';
            }
        }

        if (id === 'fecha') {
            const dia = validarFecha(input.value);
            if (dia <= 0) {
                input.classList.add('is-invalid');
                div.innerHTML =
                    `<span class="badge bg-danger">Las contrataciones son hasta la fecha de hoy</span>`;
            }
        }
        if (id === 'run') {
            if (!validarRun(input.value.trim())) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">El run ingresado no es válido</span>';
            }
        }
        if (id === 'email') {
            if (!validarEmail(input.value.trim())) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">El email ingresado no es válido</span>';
            }
        }
    }
};

const limpiar = () => {
    document.querySelector('form').reset(); 
    document.querySelectorAll('.form-control').forEach(item => {
        item.classList.remove('is-invalid');
        item.classList.remove('is-valid');
        const errorDiv = document.getElementById(`e-${item.id}`);
        if (errorDiv) errorDiv.innerHTML = ''; 
    });

    document.getElementById('btnGuardar').value = 'Guardar'; 
};

function validarCodigo(input) {
    const valor = input.value.trim();
    const div = document.getElementById('e-codigo');

    if (valor.length !== 9) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        div.innerHTML = '<span class="badge bg-danger">Debe contener exactamente 9 dígitos numéricos</span>';
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        div.innerHTML = '';
    }
}

function limitarLongitud(input, maxLength) {
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }

    const div = document.getElementById('e-codigo');
    if (input.value.length !== maxLength) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        div.innerHTML = '<span class="badge bg-danger">Debe contener exactamente 9 dígitos numéricos</span>';
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        div.innerHTML = '';
    }
}

const validarFecha = (fecha) => {
    const hoy = new Date();
    fecha = new Date(fecha);
    const resta = hoy - fecha;
    const dia = resta / (1000 * 60 * 60 * 24);
    return dia.toFixed(0);
};

const validarEmail = (email) => {
    const formato = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (formato.test(email))
        return true;
    return false;
};

const validarRun = (run) => {
    const Fn = {

        validaRut: function (rutCompleto) {
            rutCompleto = rutCompleto.replace("‐", "-");
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
                return false;
            const tmp = rutCompleto.split('-'); 
            const digv = tmp[1]; 
            const rut = tmp[0]; 
            if (digv == 'K') digv = 'k';

            return (Fn.dv(rut) == digv);
        },
        dv: function (T) {
            let M = 0, S = 1;
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11;
            return S ? S - 1 : 'k';
        }
    };
    return Fn.validaRut(run);
};

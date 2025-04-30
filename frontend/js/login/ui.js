// ui.js - Para controlar la visibilidad de las contraseñas
document.addEventListener('DOMContentLoaded', () => {
    // Interactuar con el ojo del formulario de registro
    const password = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');
    
    togglePassword.addEventListener('click', () => {
        const esPassword = password.type === "password";
        password.type = esPassword ? "text" : "password";
        eyeOpen.classList.toggle('hidden');
        eyeClosed.classList.toggle('hidden');
    });

    // Interactuar con el ojo del formulario de login
    const loginPassword = document.getElementById('login-password');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const loginEyeOpen = document.getElementById('loginEyeOpen');
    const loginEyeClosed = document.getElementById('loginEyeClosed');
    
    toggleLoginPassword.addEventListener('click', () => {
        const esPassword = loginPassword.type === "password";
        loginPassword.type = esPassword ? "text" : "password";
        loginEyeOpen.classList.toggle('hidden');
        loginEyeClosed.classList.toggle('hidden');
    });

    // Validaciones para el formulario de registro
    const valores_registro = {
        nombre: "",
        email: "",
        password: ""
    };

    // Seleccionar elementos del formulario de registro
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const btnSubmitRegistro = document.querySelector('#registro-form button[type="submit"]');
    const btnResetRegistro = document.querySelector('#registro-form button[type="reset"]');
    const registroForm = document.getElementById("registro-form");

    // Eventos para los elementos de entrada del registro
    nombreInput.addEventListener('input', validarRegistro);
    emailInput.addEventListener('input', validarRegistro);
    passwordInput.addEventListener('input', validarRegistro);
    nombreInput.addEventListener('blur', validarRegistro);
    emailInput.addEventListener('blur', validarRegistro);
    passwordInput.addEventListener('blur', validarRegistro);

    // Función para validar los campos del registro
    function validarRegistro(e) {
        if (e.target.value.trim() === "") {
            valores_registro[e.target.name] = "";
            const mensajesPersonalizados = {
                nombre: "El nombre es obligatorio",
                email: "El correo es obligatorio",
                password: "La contraseña es obligatoria"
            };
            const elementoPadre = e.target.parentElement;
            const name = e.target.name;
            eliminarAlerta(elementoPadre);
            mostrarAlerta(elementoPadre, mensajesPersonalizados[name]);
            comprobarCampos();
            return;
        }

        if (e.target.name === "email" && !validarEmail(e.target.value)) {
            valores_registro[e.target.name] = "";
            const elementoPadre = e.target.parentElement;
            eliminarAlerta(elementoPadre);
            mostrarAlerta(elementoPadre, "Email Ingresado Inválido");
            comprobarCampos();
            return;
        }

        eliminarAlerta(e.target.parentElement);
        valores_registro[e.target.name] = e.target.value.trim().toLowerCase();
        comprobarCampos();
    }

    // Función para eliminar alertas
    const eliminarAlerta = elementoPadre => {
        const alerta = elementoPadre.querySelector(".mensaje_enviado");
        if (alerta) {
            elementoPadre.removeChild(alerta);
        }
    };

    // Función para mostrar alertas
    const mostrarAlerta = (elementoPadre, mensaje) => {
        const alerta = elementoPadre.querySelector(".mensaje_enviado");
        if (!alerta) {
            const mensajeAlerta = document.createElement("p");
            mensajeAlerta.textContent = mensaje;
            mensajeAlerta.classList.add(
                "bg-amber-600",
                "text-white",
                "font-bold",
                "p-2",
                "text-center",
                "mensaje_enviado"
            );
            elementoPadre.appendChild(mensajeAlerta);
        }
    };

    // Función para validar específicamente el email
    const validarEmail = emailIngresado => {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(emailIngresado);
        return resultado;
    };

    // Comprobar que al finalizar validaciones no haya campos vacíos
    const comprobarCampos = () => {
        if (!Object.values(valores_registro).includes("")) {
            btnSubmitRegistro.classList.remove("opacity-50", "cursor-not-allowed");
            btnSubmitRegistro.disabled = false;
            return;
        }
        btnSubmitRegistro.classList.add("opacity-50", "cursor-not-allowed");
        btnSubmitRegistro.disabled = true;
    };

    // Iniciar el botón como deshabilitado
    btnSubmitRegistro.classList.add("opacity-50", "cursor-not-allowed");
    btnSubmitRegistro.disabled = true;

    // Validaciones para el formulario de login
    const msjEmail = document.getElementById("msjEmail");
    const emailLoginInput = document.getElementById("login-email");
    
    emailLoginInput.addEventListener('input', validarEmailLogin);
    emailLoginInput.addEventListener('blur', validarEmailLogin);

    function validarEmailLogin(e) {
        if (e.target.value.trim() === "") {
            msjEmail.classList.add('hidden');
            return;
        }

        if (!validarEmail(e.target.value)) {
            msjEmail.classList.remove('hidden');
            return;
        }

        msjEmail.classList.add('hidden');
    }

    // Prevenir envío del formulario para pruebas
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario de registro enviado');
        // Aquí iría la lógica para procesar el registro
    });

});
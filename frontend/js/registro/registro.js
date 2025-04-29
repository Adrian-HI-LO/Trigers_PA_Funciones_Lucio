import Swal from 'sweetalert2';

document.querySelector('#registro-form').addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    fetch('http://localhost:3000/registrar_cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Usuario registrado con éxito',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al registrar usuario',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});

document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('cliente_id', data.cliente_id);
            localStorage.setItem('is_admin', data.is_admin.toString()); // Almacenar estado de administrador como cadena
            console.log('is_admin:', data.is_admin); // Agregar mensaje de consola
            window.location.href = 'index.html';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al iniciar sesión',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});

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
            alert('Usuario registrado con éxito');
        } else {
            alert('Error al registrar usuario');
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
            localStorage.setItem('is_admin', data.is_admin); // Almacenar estado de administrador
            window.location.href = 'index.html';
        } else {
            alert('Error al iniciar sesión');
        }
    });
});

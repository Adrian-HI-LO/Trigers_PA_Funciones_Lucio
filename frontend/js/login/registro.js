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
        const alertContainer = document.createElement('div');
        alertContainer.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
        alertContainer.role = 'alert';

        if (data.success) {
            alertContainer.innerHTML = '<strong class="font-bold">¡Éxito!</strong> <span class="block sm:inline">Usuario registrado con éxito.</span>';
            // Limpiar el formulario
            const formulario_registro = document.querySelector( '#registro-form' )
            formulario_registro.reset()
        } else {
            alertContainer.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
            alertContainer.innerHTML = '<strong class="font-bold">Error:</strong> <span class="block sm:inline">Error al registrar usuario.</span>';
        }

        document.body.appendChild(alertContainer);
        setTimeout(() => alertContainer.remove(), 3000);
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
        const alertContainer = document.createElement('div');
        alertContainer.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
        alertContainer.role = 'alert';

        if (data.success) {
            localStorage.setItem('cliente_id', data.cliente_id);
            localStorage.setItem('is_admin', data.is_admin.toString());
            console.log('is_admin:', data.is_admin);
            window.location.href = 'inicio.html';
        } else {
            alertContainer.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
            alertContainer.innerHTML = '<strong class="font-bold">Error:</strong> <span class="block sm:inline">Error al iniciar sesión.</span>';
            document.body.appendChild(alertContainer);
            setTimeout(() => alertContainer.remove(), 3000);
        }
    });



    



});

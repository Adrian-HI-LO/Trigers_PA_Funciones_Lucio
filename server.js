const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Importar bcrypt
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Usar cors

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20ADs34lL./', // Reemplaza 'tu_contraseña_aqui' con la contraseña correcta
    database: 'CarritoDB',
    port: 3307
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.post('/registrar_cliente', async (req, res) => {
    const { nombre, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
    const query = 'CALL registrar_cliente(?, ?, ?)';
    connection.query(query, [nombre, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error al registrar cliente:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT id, password FROM clientes WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.json({ success: false, error: err });
        }
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password); // Comparar contraseñas
            if (match) {
                res.json({ success: true, cliente_id: results[0].id });
            } else {
                res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

app.post('/realizar_compra', (req, res) => {
    const { cliente_id, curso_id, cantidad } = req.body;
    const query = 'CALL realizar_compra(?, ?, ?)';
    connection.query(query, [cliente_id, curso_id, cantidad], (err, results) => {
        if (err) {
            console.error('Error al realizar compra:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true });
    });
});

app.get('/ver_compras', (req, res) => {
    const { cliente_id } = req.query;
    const query = `
        SELECT c.titulo, co.cantidad, co.total
        FROM compras co
        JOIN cursos c ON co.curso_id = c.id
        WHERE co.cliente_id = ?
    `;
    connection.query(query, [cliente_id], (err, results) => {
        if (err) {
            console.error('Error al obtener compras:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true, compras: results });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

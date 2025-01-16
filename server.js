const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar cors
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

app.post('/registrar_cliente', (req, res) => {
    const { nombre, email, password } = req.body;
    const query = 'CALL registrar_cliente(?, ?, ?)';
    connection.query(query, [nombre, email, password], (err, results) => {
        if (err) {
            console.error('Error al registrar cliente:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT id FROM clientes WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.json({ success: false, error: err });
        }
        if (results.length > 0) {
            res.json({ success: true, cliente_id: results[0].id });
        } else {
            res.json({ success: false });
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

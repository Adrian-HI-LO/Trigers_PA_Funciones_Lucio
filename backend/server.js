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
    password: 'danielyeray5', // Reemplaza 'tu_contraseña_aqui' con la contraseña correcta
    database: 'CarritoDB',
    port: 3306
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conectado con MySQL');
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
    const query = 'SELECT id, password, is_admin FROM clientes WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.json({ success: false, error: err });
        }
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].password); // Comparar contraseñas
            if (match) {
                console.log('is_admin:', results[0].is_admin); // Agregar mensaje de consola
                res.json({ success: true, cliente_id: results[0].id, is_admin: results[0].is_admin });
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
        SELECT c.titulo, c.imagen, co.cantidad, co.total
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

app.get('/total_compras', (req, res) => {
    const { cliente_id } = req.query;
    const query = 'SELECT obtener_total_compras(?) AS total_compras';
    connection.query(query, [cliente_id], (err, results) => {
        if (err) {
            console.error('Error al obtener el total de compras:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true, total_compras: results[0].total_compras });
    });
});

app.post('/agregar_curso', (req, res) => {
    const { titulo, autor, precio, descuento, imagen } = req.body;
    const query = 'CALL agregar_curso(?, ?, ?, ?, ?)';
    connection.query(query, [titulo, autor, precio, descuento, imagen], (err, results) => {
        if (err) {
            console.error('Error al agregar curso:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true });
    });
});

app.post('/eliminar_curso', (req, res) => {
    const { curso_id } = req.body;
    const query = 'CALL eliminar_curso(?)';
    connection.query(query, [curso_id], (err, results) => {
        if (err) {
            console.error('Error al eliminar curso:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true });
    });
});

app.get('/cargar_cursos', (req, res) => {
    const query = 'SELECT * FROM cursos';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al cargar cursos:', err);
            return res.json({ success: false, error: err });
        }
        res.json({ success: true, cursos: results });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

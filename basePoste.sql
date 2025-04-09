-- Eliminar y crear la base de datos
DROP DATABASE IF EXISTS CarritoDB;
CREATE DATABASE CarritoDB;
\c CarritoDB;

-- Tabla de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Usuario administrador
INSERT INTO clientes (nombre, email, password, is_admin)
VALUES (
    'Admin',
    'admin@example.com',
    '$2b$10$RO3oQlxibykVUi0PvY0DmuD4HfLqPx24Oo/QuXoG2aWtr9h84f0Ni',
    TRUE
);

-- Tabla de cursos
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    autor VARCHAR(100),
    precio NUMERIC(10,2),
    descuento NUMERIC(10,2),
    imagen VARCHAR(255)
);

-- Tabla de compras
CREATE TABLE compras (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    curso_id INT REFERENCES cursos(id),
    cantidad INT,
    total NUMERIC(10,2)
);

-- Tabla resumen de compras
CREATE TABLE clientes_compras (
    cliente_id INT PRIMARY KEY REFERENCES clientes(id),
    total_compras NUMERIC(10,2)
);

-- Función para registrar clientes
CREATE OR REPLACE FUNCTION registrar_cliente(
    nombre_input VARCHAR,
    email_input VARCHAR,
    password_input VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO clientes (nombre, email, password)
    VALUES (nombre_input, email_input, password_input);
END;
$$ LANGUAGE plpgsql;

-- Función para realizar una compra
CREATE OR REPLACE FUNCTION realizar_compra(
    cliente_id_input INT,
    curso_id_input INT,
    cantidad_input INT
)
RETURNS VOID AS $$
DECLARE
    total NUMERIC(10,2);
BEGIN
    SELECT descuento * cantidad_input INTO total
    FROM cursos
    WHERE id = curso_id_input;

    INSERT INTO compras (cliente_id, curso_id, cantidad, total)
    VALUES (cliente_id_input, curso_id_input, cantidad_input, total);
END;
$$ LANGUAGE plpgsql;

-- Función para agregar cursos
CREATE OR REPLACE FUNCTION agregar_curso(
    titulo_input VARCHAR,
    autor_input VARCHAR,
    precio_input NUMERIC,
    descuento_input NUMERIC,
    imagen_input VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO cursos (titulo, autor, precio, descuento, imagen)
    VALUES (titulo_input, autor_input, precio_input, descuento_input, imagen_input);
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar cursos
CREATE OR REPLACE FUNCTION eliminar_curso(curso_id_input INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM compras WHERE curso_id = curso_id_input;
    DELETE FROM cursos WHERE id = curso_id_input;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener total de compras
CREATE OR REPLACE FUNCTION obtener_total_compras(cliente INT)
RETURNS NUMERIC(10,2) AS $$
DECLARE
    total NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO total
    FROM compras
    WHERE cliente_id = cliente;
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Función del trigger para insertar compras
CREATE OR REPLACE FUNCTION actualizar_total_compras()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_total NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO nuevo_total
    FROM compras
    WHERE cliente_id = NEW.cliente_id;

    INSERT INTO clientes_compras (cliente_id, total_compras)
    VALUES (NEW.cliente_id, nuevo_total)
    ON CONFLICT (cliente_id)
    DO UPDATE SET total_compras = EXCLUDED.total_compras;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger después de insertar en compras
CREATE TRIGGER after_insert_compra
AFTER INSERT ON compras
FOR EACH ROW
EXECUTE FUNCTION actualizar_total_compras();

-- Función del trigger para eliminar compras
CREATE OR REPLACE FUNCTION actualizar_total_compras_delete()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_total NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO nuevo_total
    FROM compras
    WHERE cliente_id = OLD.cliente_id;

    UPDATE clientes_compras
    SET total_compras = nuevo_total
    WHERE cliente_id = OLD.cliente_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger después de eliminar en compras
CREATE TRIGGER after_delete_compra
AFTER DELETE ON compras
FOR EACH ROW
EXECUTE FUNCTION actualizar_total_compras_delete();

-- Insertar cursos
INSERT INTO cursos (id, titulo, autor, precio, descuento, imagen) VALUES
(1, 'HTML5, CSS3, JavaScript para Principiantes', 'Juan Pedro', 200.00, 15.00, 'img/curso1.jpg'),
(2, 'Curso de Comida Vegetariana', 'Juan Pedro', 200.00, 15.00, 'img/curso2.jpg'),
(3, 'Guitarra para Principiantes', 'Juan Pedro', 200.00, 15.00, 'img/curso3.jpg'),
(4, 'Huerto en tu casa', 'Juan Pedro', 200.00, 15.00, 'img/curso4.jpg'),
(5, 'Decoración con productos de tu hogar', 'Juan Pedro', 200.00, 15.00, 'img/curso5.jpg'),
(6, 'Diseño Web para Principiantes', 'Juan Pedro', 200.00, 15.00, 'img/curso1.jpg'),
(7, 'Comida Mexicana para principiantes', 'Juan Pedro', 200.00, 15.00, 'img/curso2.jpg'),
(8, 'Estudio Musical en tu casa', 'Juan Pedro', 200.00, 15.00, 'img/curso3.jpg'),
(9, 'Cosecha tus propias frutas y verduras', 'Juan Pedro', 200.00, 15.00, 'img/curso4.jpg'),
(10, 'Prepara galletas caseras', 'Juan Pedro', 200.00, 15.00, 'img/curso5.jpg'),
(11, 'JavaScript Moderno con ES6', 'Juan Pedro', 200.00, 15.00, 'img/curso1.jpg'),
(12, '100 Recetas de Comida Natural', 'Juan Pedro', 200.00, 15.00, 'img/curso2.jpg');

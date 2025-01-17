DROP DATABASE IF EXISTS CarritoDB;
CREATE DATABASE CarritoDB;
USE CarritoDB;

CREATE TABLE clientes (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          nombre VARCHAR(100),
                          email VARCHAR(100) UNIQUE,
                          password VARCHAR(255), -- Aumentar longitud para almacenar hash
                          is_admin BOOLEAN DEFAULT FALSE -- Campo para identificar al administrador
);

-- Insertar usuario administrador
INSERT INTO clientes (nombre, email, password, is_admin) VALUES ('Admin', 'admin@example.com', '$2b$10$RO3oQlxibykVUi0PvY0DmuD4HfLqPx24Oo/QuXoG2aWtr9h84f0Ni', TRUE);

SELECT * FROM compras;
SELECT * FROM clientes;

CREATE TABLE cursos (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        titulo VARCHAR(100),
                        autor VARCHAR(100),
                        precio DECIMAL(10, 2),
                        descuento DECIMAL(10, 2),
                        imagen VARCHAR(255)
);


CREATE TABLE compras (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         cliente_id INT,
                         curso_id INT,
                         cantidad INT,
                         total DECIMAL(10, 2),
                         FOREIGN KEY (cliente_id) REFERENCES clientes(id),
                         FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

DROP TRIGGER IF EXISTS actualizar_total_compra;

-- Crear procedimiento almacenado para registrar a los Clientes
DELIMITER //
CREATE PROCEDURE registrar_cliente(IN nombre VARCHAR(100), IN email VARCHAR(100), IN password VARCHAR(255))
BEGIN
    INSERT INTO clientes (nombre, email, password) VALUES (nombre, email, password);
END;
//
DELIMITER ;

-- Crear procedimiento almacenado para las compras
DELIMITER //
CREATE PROCEDURE realizar_compra(IN cliente_id INT, IN curso_id INT, IN cantidad INT)
BEGIN
    DECLARE total DECIMAL(10, 2);
    START TRANSACTION;
    SET total = (SELECT descuento * cantidad FROM cursos WHERE id = curso_id);
    INSERT INTO compras (cliente_id, curso_id, cantidad, total) VALUES (cliente_id, curso_id, cantidad, total);
    COMMIT;
END;
//
DELIMITER ;

-- Crear procedimiento almacenado para agregar cursos
DELIMITER //
CREATE PROCEDURE agregar_curso(IN titulo VARCHAR(100), IN autor VARCHAR(100), IN precio DECIMAL(10, 2), IN descuento DECIMAL(10, 2), IN imagen VARCHAR(255))
BEGIN
    INSERT INTO cursos (titulo, autor, precio, descuento, imagen) VALUES (titulo, autor, precio, descuento, imagen);
END;
//
DELIMITER ;

-- Crear procedimiento almacenado para eliminar cursos
DELIMITER //
CREATE PROCEDURE eliminar_curso(IN curso_id INT)
BEGIN
    DELETE FROM compras WHERE curso_id = curso_id;
    DELETE FROM cursos WHERE id = curso_id;
END;
//
DELIMITER ;

-- Estos son los cursos que estan en mi interfaz
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

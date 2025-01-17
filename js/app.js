// Variables
const carrito = document.querySelector ( '#carrito' )
const contenedorCarrito = document.querySelector ( '#lista-carrito tbody' )
const vaciarCarrito = document.querySelector ( '#vaciar-carrito' )
const lista_cursos = document.querySelector ( '#lista-cursos' )
const btn_calcularCosto = document.querySelector ( '#calcular-compra' )
const btn_realizarCompra = document.querySelector('#realizar-compra');
const btn_verCompras = document.querySelector('#ver-compras');
let articulosCarrito = []

// Eventos
const eventsListenrs = () => {
     // Validar cuando se quiera agregar un curso al carrito
     lista_cursos.addEventListener ( 'click', e => {
          if ( e.target.classList.contains ( 'agregar-carrito' ) ) {
               e.preventDefault ()
               const cursoSeleccionado = e.target.parentElement.parentElement
               leerDatosCurso(cursoSeleccionado)
          }
          
     } )

     // Validar cuando se quiera eliminar un curso del carrito
     contenedorCarrito.addEventListener( 'click', e => {
         if ( e.target.classList.contains ( 'borrar-curso' ) ) {
          e.preventDefault ()
          const cursoAeliminar = e.target.parentElement.parentElement
          eliminarCursos ( cursoAeliminar )
         }

     } )

     // Eliminar todo el carrito
     vaciarCarrito.addEventListener ( 'click', e => {
          e.preventDefault ()
          deleteAllcar()
     } )

     // Calcular la compra del carrito
     btn_calcularCosto.addEventListener ( 'click', e => {
          e.preventDefault ()
          calacularCosto()
     })

     // Realizar la compra
     btn_realizarCompra.addEventListener('click', e => {
          e.preventDefault();
          realizarCompra();
     });

     // Ver compras realizadas
     btn_verCompras.addEventListener('click', e => {
          e.preventDefault();
          verCompras();
     });
}
eventsListenrs()

// Funciones principales

// Lee el contenido del html al que le dimos click y extrae el contenido
const leerDatosCurso = cs =>{
     // Objeto con el contendio del curso actual
     const conCurso = {
          imagen : cs.querySelector('img').src,
          titulo : cs.querySelector ( 'h4' ).textContent,
          author : cs.querySelector ( 'p' ).textContent,
          precio : cs.querySelector ( '.precio' ).textContent,
          descuento: cs.querySelector ('span').textContent,
          id_Curso : cs.querySelector ( 'a' ).getAttribute('data-id'),
          cantidad : 1
     }
     // Revisar si un articulo ya existe
     const existe = articulosCarrito.some ( p => {
          return p.id_Curso === conCurso.id_Curso
     } )
     // Agregar elementos al carrito
     if ( !existe ){
          articulosCarrito = [...articulosCarrito, conCurso]
     }else {
          const cursos = articulosCarrito.map ( p => {
               if (p.id_Curso === conCurso.id_Curso) {
                    p.cantidad ++
                    return p
               }else {
                    return p
               }
          } )
          articulosCarrito = [ ...cursos ]
     }
     mostraCarritoHTML()
}

// Muestra el carrito de compras en el HTML
const mostraCarritoHTML = () => {
     // Limpiar acumuladores
     eliminarAcumuladores()
     // Agregar los atriculos al carrito
     articulosCarrito.forEach ( pv => {
          const {imagen, titulo, precio, cantidad, id_Curso} = pv
          const row = document.createElement('tr')
          row.innerHTML = `
          <td>
          <img src = "${imagen}" width = 100>
          </td>
          <td>
          ${titulo}
          </td>
          <td>
          ${precio}
          </td>
          <td>
          ${cantidad}
          </td>
          <td>
          <a href = '#' class = "borrar-curso" data-id = ${id_Curso}> - </a>
          </td>
          `
          contenedorCarrito.appendChild(row)
          // console.table ( articulosCarrito )
     } )
}

// Elimina los cursos del HTML generado
const eliminarAcumuladores = () => {
     // Forma lenta
     // contenedorCarrito.innerHTML = ''
     // Forma coorecta
     while ( contenedorCarrito.firstChild ) {
          contenedorCarrito.removeChild( contenedorCarrito.firstChild )
     }
}

const eliminarCursos = cursoSeleccionado => {
     const indice = articulosCarrito.findIndex ( pv => {
          return pv.id_Curso === cursoSeleccionado.querySelector ( 'a' ).getAttribute('data-id')
     } )
     if ( articulosCarrito [ indice ].cantidad > 1 ) {
          articulosCarrito [ indice ].cantidad --
          cursoSeleccionado.children[3].textContent = articulosCarrito [ indice ].cantidad
     }else {
          articulosCarrito.splice ( indice, 1 )
          cursoSeleccionado.remove()
     }
     if ( !(articulosCarrito.length != 0) ) {
          const total_resultado = document.querySelectorAll ( '#total_resultado' )
          if ( total_resultado ) {
               total_resultado.remove ()
          }
     }
}

const deleteAllcar = () => {
     if ( articulosCarrito.length > 0 ) {
          articulosCarrito.length = 0
          const contenedorDeTR = document.querySelector ( '#lista-carrito' ).lastElementChild
          let cantidadNodosEliminar =  contenedorDeTR.querySelectorAll ( 'tr' ).length
          for ( let i = 0; i < cantidadNodosEliminar; i ++ ){
               const nodosAeliminar = contenedorDeTR.querySelector( 'tr' )
               nodosAeliminar.remove()
          }
     }
     const total_resultado = document.querySelectorAll ( '#total_resultado' )
     if ( total_resultado ) {
          total_resultado.remove (  )
     }
}

// Calcular Costos
const calacularCosto = () => {
     if ( articulosCarrito.length != 0 ) {
          const resultado = document.createElement ( 'div' )
          let elementos = [ ...articulosCarrito ]
          let costos = []
          elementos.forEach ( pv => {
               if ( pv.cantidad > 1 ) {
                    costos.push ( ( parseInt ( pv.descuento.replace('$', '') ) ) * pv.cantidad )
               }else {
                    costos.push ( parseInt ( pv.descuento.replace('$', '') ) )
               }
          } )
          let total = costos.reduce ( ( c, i ) => c + i, 0 )
          resultado.innerHTML = `<p id = "total_resultado">Total: $${total}</p>`
          contenedorCarrito.appendChild ( resultado )
     }
}

const realizarCompra = () => {
     if (articulosCarrito.length === 0) return;
     const cliente_id = localStorage.getItem('cliente_id');
     if (!cliente_id) {
          alert('Por favor, inicie sesión para realizar la compra.');
          return;
     }
     articulosCarrito.forEach(curso => {
          const { id_Curso, cantidad } = curso;
          fetch('http://localhost:3000/realizar_compra', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json'
               },
               body: JSON.stringify({ cliente_id, curso_id: id_Curso, cantidad })
          })
          .then(response => response.json())
          .then(data => {
               console.log('Respuesta del servidor:', data); // Agregar mensaje de consola
               if (data.success) {
                    alert('Compra realizada con éxito');
                    deleteAllcar();
               } else {
                    alert('Error al realizar la compra');
               }
          })
          .catch(error => {
               console.error('Error en la solicitud:', error); // Agregar mensaje de consola
               alert('Error al realizar la compra');
          });
     });
}

const verCompras = () => {
     const cliente_id = localStorage.getItem('cliente_id');
     if (!cliente_id) {
          alert('Por favor, inicie sesión para ver sus compras.');
          return;
     }
     fetch(`http://localhost:3000/ver_compras?cliente_id=${cliente_id}`)
          .then(response => response.json())
          .then(data => {
               if (data.success) {
                    mostrarCompras(data.compras);
               } else {
                    alert('Error al obtener las compras');
               }
          })
          .catch(error => {
               console.error('Error en la solicitud:', error);
               alert('Error al obtener las compras');
          });
};

const mostrarCompras = (compras) => {
     const comprasContainer = document.createElement('div');
     comprasContainer.classList.add('compras-container');
     compras.forEach(compra => {
          const { titulo, cantidad, total } = compra;
          const compraElement = document.createElement('div');
          compraElement.classList.add('compra');
          compraElement.innerHTML = `
               <p>Curso: ${titulo}</p>
               <p>Cantidad: ${cantidad}</p>
               <p>Total: $${total}</p>
          `;
          comprasContainer.appendChild(compraElement);
     });
     document.body.appendChild(comprasContainer);
};

document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('is_admin') === 'true' || localStorage.getItem('is_admin') === '1';
    console.log('isAdmin:', isAdmin); // Agregar mensaje de consola

    const adminOptions = document.querySelector('#admin-options');
    const userOptions = document.querySelector('#user-options');
    console.log('adminOptions:', adminOptions); // Agregar mensaje de consola
    console.log('userOptions:', userOptions); // Agregar mensaje de consola

    if (isAdmin) {
        adminOptions.style.display = 'block';
        userOptions.style.display = 'none';
    } else {
        adminOptions.style.display = 'none';
        userOptions.style.display = 'block';
    }

    // Funciones para agregar y eliminar cursos
    const agregarCurso = (e) => {
        e.preventDefault();
        const titulo = prompt('Ingrese el título del curso:');
        const autor = prompt('Ingrese el autor del curso:');
        const precio = prompt('Ingrese el precio del curso:');
        const descuento = prompt('Ingrese el descuento del curso:');
        const imagen = prompt('Ingrese la URL de la imagen del curso:');

        // Agregar los cursos en la Pagina
        const row = document.querySelector('.row:last-child');
        const cursosEnFila = row.querySelectorAll('.four.columns').length;

        const nuevoCurso = `
            <div class="four columns">
                <div class="card">
                    <img src="${imagen}" class="imagen-curso u-full-width">
                    <div class="info-card">
                        <h4>${titulo}</h4>
                        <p>${autor}</p>
                        <img src="img/estrellas.png">
                        <p class="precio">$${precio} <span class="u-pull-right ">$${descuento}</span></p>
                        <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${Date.now()}">Agregar Al Carrito</a>
                    </div>
                </div>
            </div>
        `;

        // Si la fila actual tiene menos de 3 cursos, agregar el nuevo curso a la fila actual
        if (cursosEnFila < 3) {
            row.insertAdjacentHTML('beforeend', nuevoCurso);
        } else {
            // Si la fila actual ya tiene 3 cursos, crear una nueva fila y agregar el nuevo curso
            const nuevaFila = document.createElement('div');
            nuevaFila.classList.add('row');
            nuevaFila.innerHTML = nuevoCurso;
            document.querySelector('.container').appendChild(nuevaFila);
        }

        //Enviar los cursos al servidor
        fetch('http://localhost:3000/agregar_curso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, autor, precio, descuento, imagen })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Curso agregado con éxito');
                window.location.reload();
            } else {
                alert('Error al agregar curso');
            }
        });
    };

    const eliminarCurso = (e) => {
        e.preventDefault();
        const curso_id = prompt('Ingrese el ID del curso a eliminar:');
        fetch('http://localhost:3000/eliminar_curso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ curso_id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Curso eliminado con éxito');
                window.location.reload();
            } else {
                alert('Error al eliminar curso');
            }
        });
    };

    document.querySelector('#agregar-curso_admin').addEventListener('click', agregarCurso);
    document.querySelector('#eliminar-curso_admin').addEventListener('click', eliminarCurso);
});

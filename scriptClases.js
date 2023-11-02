document.addEventListener('DOMContentLoaded', async function() {
   
    // Agrega un listener al formulario de creación
    const formularioCreacion = document.getElementById('formulario-creacion');
    formularioCreacion.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        // Recupera los datos del formulario
        const nombre = document.getElementById('nombreCreacion').value;
        const descripcion = document.getElementById('DescripcionCreacion').value;
        const fechaCreacion = document.getElementById('fechaCreacion').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const foto = document.getElementById('foto').value;

        var nuevaClase ={
            nombreClase: nombre,
            descripcionClase: descripcion,
            inicioClase: fechaCreacion,
            finClase: fechaFin,
            foto: foto
        }
        // Realiza la solicitud para crear una nueva sesión
        crearClase({nuevaClase});

        // Limpia el formulario
        formularioCreacion.reset();
    });

    // Agrega un listener a la tabla para capturar clics en el botón de editar
    // const tabla = document.querySelector('table tbody');
    // tabla.addEventListener('click', function(event) {
    //     if (event.target.classList.contains('editar-btn')) {
    //         // Obtiene la fila actual
    //         const fila = event.target.closest('tr');
            
    //         // Obtiene los datos de la fila para editar
    //         const nombre = fila.cells[0].innerText;
    //         const fechaCreacion = fila.cells[1].innerText;
    //         const fechaFin = fila.cells[2].innerText;

    //         // Llama a la función para abrir el modal de edición
    //         abrirModalEdicion({ nombre, fechaCreacion, fechaFin});
    //     }
    // });
    const tabla = document.querySelector('table tbody');
    tabla.addEventListener('click', function(event) {
        if (event.target.classList.contains('editar-btn')) {
            // Obtiene la fila actual
            const fila = event.target.closest('tr');

            // Obtiene el ID de la fila
            const id = fila.getAttribute('data-id');

            // Obtén los datos del usuario correspondiente al ID
            const clase = obtenerClasePorId(id);

            // Llama a la función para abrir el modal de edición
            abrirModalEdicion(clase);
    }
});

obtenerYMostrarClases().then(clases => {
    // Ahora puedes usar clases en otras partes de tu código
    // ...

    // Asegúrate de llamar a obtenerClasePorId después de que se hayan cargado las clases
    const clase = obtenerClasePorId(id, clases);
    abrirModalEdicion(clase);
});

// Modifica obtenerClasePorId para aceptar el array de clases como argumento

function obtenerClasePorId(id, clases) {
    return clases.find(clase => clase.id === id);
}

const inputBuscador = document.getElementById('buscador');

            // Agrega un listener al campo de búsqueda
    inputBuscador.addEventListener('input', function() {
            const terminoBusqueda = inputBuscador.value.toLowerCase();
            filtrarClases(terminoBusqueda);
    })

    
mostrarClasesEnTabla(clases);

});
function obtenerClasePorId(id, clases) {
    return clases.find(clase => clase.id === id);
}
let globalCurrentData = null;
function obtenerYMostrarClases() {
    return fetch('http://localhost:8080/gymbuddy/api/entrenamiento/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las Clases');
            }
            return response.json();
        })
        .then(clases => {
            // Llama a la función para mostrar las clases en la tabla
            mostrarClasesEnTabla(clases);
            globalCurrentData = clases;// Devuelve las clases para que estén disponibles externamente
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const ejemploClase = [
    { id: 1, nombre: 'Sesión 1', fechaCreacion: '2023-10-27 16:30:00', fechaFin: '2023-10-27 14:30:00' },
    { id: 2, nombre: 'Sesión 2', fechaCreacion: '2023-10-28 08:30:00', fechaFin: '2023-10-27 10:30:00' },
    { id: 3, nombre: 'Sesión 3', fechaCreacion: '2023-10-29 07:30:00', fechaFin: '2023-10-27 09:30:00' },
    // Agrega más sesiones según sea necesario
];

function mostrarClasesEnTabla(clases) {
    // Obtén la referencia de la tabla
    const tabla = document.getElementById('tablaClases');

    // Limpia la tabla
    tabla.innerHTML = '';

    // Itera sobre las clases y agrega filas a la tabla
    clases.forEach(clase => {
        const fila = `<tr data-id="${clase.id}">
            <td>${clase.nombreClase}</td>
            <td>${clase.inicioClase}</td>
            <td>${clase.finClase}</td>
            <td>
                <button type="button" class="btn btn-primary editar-btn" data-toggle="modal" data-target="#editarModal">
                    Editar
                </button>
                <button type="button" class="btn btn-danger eliminar-btn" onclick="eliminarRegistro(this)">Eliminar</button>
            </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
};

function crearClase(datosClase) {
    fetch('http://localhost:8080/gymbuddy/api/entrenamiento/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosClase),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la sesión');
        }
        // Después de crear la sesión, vuelve a obtener y mostrar las clases actualizadas
        obtenerYMostrarClases();
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function abrirModalEdicion(datosClase) {
    // Obtén los campos del formulario de edición
    const nombreEdicion = document.getElementById('nombreEdicion');
    const fechaCreacionEdicion = document.getElementById('fechaCreacionEdicion');
    const fechaFinEdicion = document.getElementById('fechaFinEdicion');
    const descripcionEdicion = document.getElementById('descripcionEdicion');
    const fotoEdicion = document.getElementById('fotoEdicion');


    // Establece los valores de los campos con los datos de la clase
    nombreEdicion.value = datosClase.nombreClase;
    descripcionEdicion.value = datosClase.descripcionClase;
    fechaCreacionEdicion.value = datosClase.inicioClase;
    fechaFinEdicion.value = datosClase.finClase;
    fotoEdicion.value = datosClase.foto;
   

    // Abre el modal de edición
    $('#editarModal').modal('show');
};

const btnCrearClase = document.querySelector('.crear-clase');
btnCrearClase.addEventListener('click', function() {

     // Limpia los campos del formulario de creación
     document.getElementById('nombreCreacion').value = '';
     document.getElementById('fechaCreacion').value = '';
     document.getElementById('fechaFin').value = '';
 
    // Abre el modal de creación al hacer clic en el botón
    $('#crearModal').modal('show');
});


function guardarCreacion() {
    // Recupera los datos del formulario de creación  
    const nombre = document.getElementById('nombreCreacion').value;
    const descripcion = document.getElementById('DescripcionCreacion').value;
    const fechaCreacion = document.getElementById('fechaCreacion').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const foto = document.getElementById('foto').value;

    if (!nombre || !fechaCreacion || !fechaFin || !descripcion) {
        alert('Todos los campos son obligatorios. Por favor, complete todos los campos.');
        return;
    }
    
    var nuevaClase ={
        nombreClase: nombre,
        descripcionClase: descripcion,
        inicioClase: fechaCreacion,
        finClase: fechaFin,
        foto: foto
    }
    // Realiza la solicitud para crear una nueva clase
    crearClase(nuevaClase);

    // Cierra el modal después de crear la clase
    $('#crearModal').modal('hide');

    // Limpia el formulario
    document.getElementById('formulario-creacion').reset();
};


function filtrarClases(terminoBusqueda) {

    const clasesFiltradas = globalCurrentData.filter(clase => {
        // Filtra las clases según el término de búsqueda en el nombre, fecha, horaInicio y horaFin
        return (
            clase.nombreClase.toLowerCase().includes(terminoBusqueda) ||
            clase.inicioClase.toLowerCase().includes(terminoBusqueda) ||
            clase.finClase.toLowerCase().includes(terminoBusqueda)
        );
    });

    // Muestra las clases filtradas en la tabla
    mostrarClasesEnTabla(clasesFiltradas);
};

document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Obtiene la fila actual
        const fila = this.closest('tr');
        
        const id = fila.clases.id;
        eliminarRegistro(id);
    });
});


async function eliminarRegistro(boton) {
    const fila = boton.parentNode.parentNode;
    const numeroFila = fila.rowIndex;
    console.log(globalCurrentData[numeroFila-1]);

    let id = globalCurrentData[numeroFila-1].id;

    await fetch(`http://localhost:8080/gymbuddy/api/entrenamiento/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la clase');
        }
        obtenerYMostrarClases();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function guardarEdicion() {
    const nombre = document.getElementById('nombreEdicion').value;
    const fechaInicio = document.getElementById('fechaCreacionEdicion').value;
    const fechaFin = document.getElementById('fechaFinEdicion').value;
    const descripcion = document.getElementById('descripcionEdicion').value;
    const foto = document.getElementById('fotoEdicion').value;

    const fila = document.querySelector('.editar-btn:focus').closest('tr');
    const id = fila.dataset.id; // Corregir el nombre del atributo

    var editClase = {
        id: id,
        nombreClase: nombre,
        descripcionClase: descripcion,
        inicioClase: fechaInicio, // Corregir el nombre de la variable
        finClase: fechaFin,
        foto: foto
    }

    // Pasar ambos argumentos a la función actualizarUsuario
    actualizarUsuario(id, editClase);

    $('#editarModal').modal('hide');
}
function actualizarUsuario(id, datosClase) {
    fetch(`http://localhost:8080/gymbuddy/api/entrenamiento/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosClase),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar la clase');
        }
        obtenerYMostrarClases(); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

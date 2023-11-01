document.addEventListener('DOMContentLoaded', function() {
    // Espera a que el DOM esté completamente cargado

    // Realiza la solicitud para obtener la lista de Planes
    obtenerYMostrarPlanes();

    // Agrega un listener al formulario de creación
    const formularioCreacion = document.getElementById('formulario-creacion');
    formularioCreacion.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        // Recupera los datos del formulario
        const name = document.getElementById('nombreCreacion').value;
        const descripcion = document.getElementById('DescripcionCreacion').value;
        const valor = document.getElementById('valorCreacion').value;
        const fecha = document.getElementById('fechaCreacion').value;


        var newplam = {
            name: name,
            description: descripcion,
            value: valor,
            creationDate: fecha
        };
        // Realiza la solicitud para crear una nueva sesión
        crearPlan(newplam);

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
            const plan = obtenerPlanPorId(id);

            // Llama a la función para abrir el modal de edición
            abrirModalEdicion(plan);
    }
});
function obtenerPlanPorId(id) {
    // Busca el usuario en el array de ejemploUsuario por ID
    return planes.find(plan => plan.id == id);
}

    const inputBuscador = document.getElementById('buscador');

            // Agrega un listener al campo de búsqueda
            inputBuscador.addEventListener('input', function() {
                const terminoBusqueda = inputBuscador.value.toLowerCase();
                filtrarPlanes(terminoBusqueda);
            })

    
            mostrarPlanesEnTabla(planes);

});

function obtenerYMostrarPlanes() {
    fetch('https://localhost:8080/gymbuddy/api/planes/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los Planes');
            }
            return response.json();
        })
        .then(planes => {
            // Llama a la función para mostrar las planes en la tabla
            mostrarPlanesEnTabla(planes);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};
const ejemploPlan = [
    { id: 1, name: 'Semanal', descripcion: 'Duracion de una semana', valor: '15000', fecha: '2023-10-27' },
    { id: 2, name: 'Mensual', descripcion: 'Duracion de un mes', valor: '60000', fecha: '2023-10-27' },
    { id: 3, name: 'Trimestral', descripcion: 'Duracion de tres meses', valor: '150000', fecha: '2023-10-27' },
    { id: 4, name: 'Semestral', descripcion: 'Duracion de seis meses', valor: '300000', fecha: '2023-10-27' },
];

function mostrarPlanesEnTabla(planes) {
    // Obtén la referencia de la tabla
    const tabla = document.getElementById('tablaPlanes');

    // Limpia la tabla
    tabla.innerHTML = '';

    // Itera sobre las planes y agrega filas a la tabla
    planes.forEach(plan => {
        const fila = `<tr data-id="${plan.id}">
            <td>${plan.name}</td>
            <td>${plan.description}</td>
            <td>${plan.value}</td>
            <td>${plan.creationDate}</td>
            <td>
                <button type="button" class="btn btn-primary editar-btn" data-toggle="modal" data-target="#editarModal">
                    Editar
                </button>
                <button type="button" class="btn btn-danger eliminar-btn">Eliminar</button>
            </td>
        </tr>`;
        tabla.innerHTML += fila;
    });
};

function crearPlan(datosPlan) {
    fetch('https://localhost:8080/gymbuddy/api/planes/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosPlan),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la sesión');
        }
        // Después de crear la sesión, vuelve a obtener y mostrar las planes actualizadas
        obtenerYMostrarPlanes();
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function abrirModalEdicion(datosPlan) {
    // Obtén los campos del formulario de edición
    const nombreEdicion = document.getElementById('nombreEdicion');
    const DescripcionEdicion = document.getElementById('DescripcionEdicion');
    const valorEdicion = document.getElementById('valorEdicion');
    const fechaEdicion = document.getElementById('fechaEdicion');


    // Establece los valores de los campos con los datos de la Plan
    nombreEdicion.value = datosPlan.nombre;
    DescripcionEdicion.value = datosPlan.descripcion;
    valorEdicion.value = datosPlan.valor;
    fechaEdicion.value = datosPlan.fecha;
   

    // Abre el modal de edición
    $('#editarModal').modal('show');
};

const btnCrearPlan = document.querySelector('.crear-plan');
btnCrearPlan.addEventListener('click', function() {

     // Limpia los campos del formulario de creación
     document.getElementById('nombreCreacion').value = '';
     document.getElementById('DescripcionCreacion').value = '';
     document.getElementById('valorCreacion').value = '';
     document.getElementById('fechaCreacion').value = '';
 
    // Abre el modal de creación al hacer clic en el botón
    $('#crearModal').modal('show');
});


function guardarCreacion() {
    // Recupera los datos del formulario de creación
    const name = document.getElementById('nombreCreacion').value;
    const descripcion = document.getElementById('DescripcionCreacion').value;
    const valor = document.getElementById('valorCreacion').value;
    const fecha = document.getElementById('fechaCreacion').value;


    if (!name || !descripcion || !valor || !fecha) {
        alert('Todos los campos son obligatorios. Por favor, complete todos los campos.');
        return;
    }
    
    var newplam = {
        name: name,
        description: descripcion,
        value: valor,
        creationDate: fecha
    };
    // Realiza la solicitud para crear una nueva Plan
    crearPlan(newplam);

    // Cierra el modal después de crear la Plan
    $('#crearModal').modal('hide');

    // Limpia el formulario
    document.getElementById('formulario-creacion').reset();
};


function filtrarPlanes(terminoBusqueda) {
    const planes = obtenerYMostrarPlanes(); 

    const planesFiltradas = planes.filter(plan => {
        // Filtra las planes según el término de búsqueda en el nombre, fecha, horaInicio y horaFin
        return (
            plan.name.toLowerCase().includes(terminoBusqueda) ||
            plan.descripcion.toLowerCase().includes(terminoBusqueda) ||
            plan.valor.toLowerCase().includes(terminoBusqueda) ||
            plan.fecha.toLowerCase().includes(terminoBusqueda)
        );
    });

    // Muestra las planes filtradas en la tabla
    mostrarPlanesEnTabla(planesFiltradas);
};

document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Obtiene la fila actual
        const fila = this.closest('tr');
        
        const id = fila.planes.id;
        eliminarRegistro(id);
    });
});


function eliminarRegistro(id) {
    fetch(`https://localhost:8080/gymbuddy/api/planes/delete//${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el plan');
        }
        obtenerYMostrarPlanes();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function guardarEdicion() {
    
    const name = document.getElementById('nombreEdicion').value;
    const descripcion = document.getElementById('DescripcionEdicion').value;
    const valor = document.getElementById('valorEdicion').value;
    const fecha = document.getElementById('fechaEdicion').value;
   
    const fila = document.querySelector('.editar-btn:focus').closest('tr');

   
    const id = fila.dataset.usuarioId;
    var editPlan = {
        name: name,
        description: descripcion,
        value: valor,
        creationDate: fecha
    };
    actualizarUsuario( {editPlan});

    $('#editarModal').modal('hide');
}
function actualizarUsuario(datosPlan) {
    fetch(`https://localhost:8080/gymbuddy/api/planes/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosPlan),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el plan');
        }
        obtenerYMostrarPlanes(); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
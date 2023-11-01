document.addEventListener('DOMContentLoaded', function() {
    // Espera a que el DOM esté completamente cargado

    // Realiza la solicitud para obtener la lista de Usuarios
    obtenerYMostrarUsuarios();

    llenarSelectDesdeBackend('https://localhost:8080/gymbuddy/api/persona/documento/all', 'tipoDocCreacion');

    // Llenar opciones para Rol
    llenarSelectDesdeBackend('https://localhost:8080/gymbuddy/api/user/roles/all', 'rolCreacion');

    // Llenar opciones para Plan
    llenarSelectDesdeBackend('https://localhost:8080/gymbuddy/api/planes/all', 'planCreacion');
    // Agrega un listener al formulario de creación
    const formularioCreacion = document.getElementById('formulario-creacion');
    formularioCreacion.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        // Recupera los datos del formulario
        const nombre = document.getElementById('nombreCreacion').value;
        const apellido = document.getElementById('apellidoCreacion').value;
        const direccion = document.getElementById('direccionCreacion').value;
        const barrio = document.getElementById('barrioCreacion').value;
        const fechaNac = document.getElementById('fechaNaciCreacion').value;
        const email = document.getElementById('emailCreacion').value;
        const telefono = document.getElementById('telefonoCreacion').value;
        const tipoDoc = document.getElementById('tipoDocCreacion').value;
        const numDoc = document.getElementById('numeroDocuCreacion').value;
        const rol = document.getElementById('rolCreacion').value;
        const plan = document.getElementById('planCreacion').value;
        const fotoPerfil = document.getElementById('fotoCreacion').value;
        const fechaInicio = document.getElementById('fechaInicioCreacion').value;
        const fechaFin = document.getElementById('fechaFinCreacion').value;

        var newPersona = {
            name:nombre,
            lastName: apellido,
            address:direccion,
            neighborhood: barrio,
            birthDate: fechaNac,
            email: email,
            phoneNumber: telefono ,
            numDocument: numDoc,
            idTipoDocumento: tipoDoc,
            idRol: rol,
            idPlan: plan,
            photo: fotoPerfil,
            fechaDesdePlan: fechaInicio,
            fechaHastaPlan: fechaFin
        }

        // Realiza la solicitud para crear una nueva sesión
        crearUsuario(newPersona);

        // Limpia el formulario
        formularioCreacion.reset();
    });
// Agrega un listener a la tabla para capturar clics en el botón de editar
const tabla = document.querySelector('table tbody');
tabla.addEventListener('click', function(event) {
    if (event.target.classList.contains('editar-btn')) {
        // Obtiene la fila actual
        const fila = event.target.closest('tr');

        // Obtiene el ID de la fila
        const id = fila.getAttribute('data-id');

        // Obtén los datos del usuario correspondiente al ID
        const usuario = obtenerUsuarioPorId(id);

        // Llama a la función para abrir el modal de edición
        abrirModalEdicion(usuario);
    }
});
function obtenerUsuarioPorId(id) {
    // Busca el usuario en el array de usuarios por ID
    return usuarios.find(usuario => usuario.id == id);
}


    const inputBuscador = document.getElementById('buscador');

            // Agrega un listener al campo de búsqueda
            inputBuscador.addEventListener('input', function() {
                const terminoBusqueda = inputBuscador.value.toLowerCase();
                filtrarUsuarios(terminoBusqueda);
            })

    
            mostrarUsuariosEnTabla(usuarios);

});

function llenarSelectDesdeBackend(url, idSelect) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos desde ${url}`);
            }
            return response.json();
        })
        .then(data => {
            // Llenar el select con los datos obtenidos desde el backend
            const select = document.getElementById(idSelect);

            // Limpiar opciones existentes
            select.innerHTML = '<option value=""></option>';

            // Agregar las nuevas opciones
            data.forEach(opcion => {
                const optionElement = document.createElement('option');
                optionElement.value = opcion.id;
                optionElement.textContent = opcion.name; // Ajusta esto según la estructura de tus datos
                select.appendChild(optionElement);
            });
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
}

function obtenerYMostrarUsuarios() {
    fetch('http://localhost:8080/gymbuddy/api/persona/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las Usuarios');
            }
            return response.json();
        })
        .then(usuarios => {
            // Llama a la función para mostrar las usuarios en la tabla
            mostrarUsuariosEnTabla(usuarios);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};
const ejemploUsuario = [
    { id: 1, nombre: 'Kevin', apellido: 'Anaya', direccion: 'calle a b 123', barrio: 'San Alonso', fechaNac: '2001-11-29',email: 'correo@cooreo.com', telefono:'3123234236', tipoDoc:'2', numDoc:'12335436',rol:'2',plan:'1', fechaInicio: '2023-10-27', fechaFin: '2023-11-02' },
    { id: 2, nombre: 'Santiago', apellido: 'Quintero', direccion: 'calle a b 123', barrio: 'Diamante', fechaNac: '2001-11-29',email: 'correo@cooreo.com', telefono:'3123234236', tipoDoc:'3', numDoc:'12335436',rol:'1',plan:'4',fechaInicio: '2023-10-28', fechaFin: '2023-11-17' },
    { id: 3, nombre: 'Brayan',apellido: 'Uribe', direccion: 'calle a b 123', barrio: 'San Francisco', fechaNac: '2001-11-29',email: 'correo@cooreo.com', telefono:'3123234236', tipoDoc:'1', numDoc:'12335436',rol:'2',plan:'3', fechaInicio: '2023-10-29', fechaFin: '2023-11-23' },
];

function mostrarUsuariosEnTabla(usuarios) {
    // Obtén la referencia de la tabla
    const tabla = document.getElementById('tablaUsuarios');

    // Limpia la tabla
    tabla.innerHTML = '';

    // Itera sobre las Usuarios y agrega filas a la tabla
    usuarios.forEach(usuario => {
        const fila = `<tr data-id="${usuario.id}">
            <td>${usuario.name}</td>
            <td>${usuario.lastName}</td>
            <td>${usuario.address}</td>
            <td>${usuario.phoneNumber}</td>
            <td>${usuario.fechaHastaPlan}</td>
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

function crearUsuario(datosUsuario) {
    fetch('http://localhost:8080/gymbuddy/api/persona/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al crear la sesión');
        }
        // Después de crear la sesión, vuelve a obtener y mostrar las Usuarios actualizadas
        obtenerYMostrarUsuarios();
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function abrirModalEdicion(datosUsuario) {
    // Obtén los campos del formulario de edición
    const nombreEdicion = document.getElementById('nombreEdicion');
    const apellidoEdicion = document.getElementById('apellidoEdicion');
    const direccionEdicion = document.getElementById('direccionEdicion');
    const barrioEdicion = document.getElementById('barrioEdicion');
    const fechaNaciEdicion = document.getElementById('fechaNaciEdicion');
    const emailEdicion = document.getElementById('emailEdicion');
    const telefonoEdicion = document.getElementById('telefonoEdicion');
    const tipoDocEdicion = document.getElementById('tipoDocEdicion');
    const numeroDocuEdicion = document.getElementById('numeroDocuEdicion');
    const rolEdicion = document.getElementById('rolEdicion');
    const planEdicion = document.getElementById('planEdicion');
    const fotoEdicion = document.getElementById('fotoEdicion');
    const fechaInicioEdicion = document.getElementById('fechaInicioEdicion');
    const fechaFinEdicion = document.getElementById('fechaFinEdicion');

    // Establece los valores de los campos con los datos de la Usuario
    nombreEdicion.value = datosUsuario.nombre;
    apellidoEdicion.value = datosUsuario.apellido;
    direccionEdicion.value = datosUsuario.direccion;
    barrioEdicion.value = datosUsuario.barrio;
    fechaNaciEdicion.value = datosUsuario.fechaNac;
    emailEdicion.value = datosUsuario.email;
    telefonoEdicion.value = datosUsuario.telefono;
    tipoDocEdicion.value = datosUsuario.tipoDoc; 
    numeroDocuEdicion.value = datosUsuario.numDoc;
    rolEdicion.value = datosUsuario.rol;
    planEdicion.value = datosUsuario.plan;
    fotoEdicion.value = datosUsuario.fotoPerfil;
    fechaInicioEdicion.value = datosUsuario.fechaInicio;
    fechaFinEdicion.value = datosUsuario.fechaFin;

    // Abre el modal de edición
    $('#editarModal').modal('show');
}


// abrir modal creeacion e inicializar los datos vacios 
const btnCrearUsuario = document.querySelector('.crear-usuario');
btnCrearUsuario.addEventListener('click', function() {

     // Limpia los campos del formulario de creación
     document.getElementById('nombreCreacion').value = '';
     document.getElementById('apellidoCreacion').value = '';
     document.getElementById('direccionCreacion').value = '';
     document.getElementById('barrioCreacion').value = '';
     document.getElementById('fechaNaciCreacion').value = '';
     document.getElementById('emailCreacion').value = '';
     document.getElementById('telefonoCreacion').value = '';
     document.getElementById('tipoDocCreacion').value = '';
     document.getElementById('numeroDocuCreacion').value = '';
     document.getElementById('rolCreacion').value = '';
     document.getElementById('planCreacion').value = '';
     document.getElementById('fotoCreacion').value = '';
     document.getElementById('fechaInicioCreacion').value = '';
     document.getElementById('fechaFinCreacion').value = '';
 
    // Abre el modal de creación al hacer clic en el botón
    $('#crearModal').modal('show');
});


function guardarCreacion() {
    // Recupera los datos del formulario de creación

    const nombre = document.getElementById('nombreCreacion').value;
    const apellido = document.getElementById('apellidoCreacion').value;
    const direccion = document.getElementById('direccionCreacion').value;
    const barrio = document.getElementById('barrioCreacion').value;
    const fechaNac = document.getElementById('fechaNaciCreacion').value;
    const email = document.getElementById('emailCreacion').value;
    const telefono = document.getElementById('telefonoCreacion').value;
    const tipoDoc = document.getElementById('tipoDocCreacion').value;
    const numDoc = document.getElementById('numeroDocuCreacion').value;
    const rol = document.getElementById('rolCreacion').value;
    const plan = document.getElementById('planCreacion').value;
    const fotoPerfil = document.getElementById('fotoCreacion').value;
    const fechaInicio = document.getElementById('fechaInicioCreacion').value;
    const fechaFin = document.getElementById('fechaFinCreacion').value;


    if (!nombre || !apellido || !direccion || !barrio || !fechaNac || !email || !telefono || !tipoDoc || !numDoc || !rol || !plan || !fechaInicio || !fechaFin) {
        alert('Todos los campos son obligatorios. Por favor, complete todos los campos.');
        return;
    }
    
    var newPersona = {
        name:nombre,
        lastName: apellido,
        address:direccion,
        neighborhood: barrio,
        birthDate: fechaNac,
        email: email,
        phoneNumber: telefono ,
        numDocument: numDoc,
        idTipoDocumento: tipoDoc,
        idRol: rol,
        idPlan: plan,
        photo: fotoPerfil,
        fechaDesdePlan: fechaInicio,
        fechaHastaPlan: fechaFin
    }


    
    // Realiza la solicitud para crear una nueva Usuario
    crearUsuario(newPersona);

    // Cierra el modal después de crear la Usuario
    $('#crearModal').modal('hide');

    // Limpia el formulario
    document.getElementById('formulario-creacion').reset();
};


function filtrarUsuarios(terminoBusqueda) {
    const usuarios = obtenerYMostrarUsuarios(); 
    const usuariosFiltrados = usuarios.filter(usuario => {
        // Filtra las usuarios según el término de búsqueda en el nombre, fecha, horaInicio y horaFin
        return (
            usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
            usuario.apellido.toLowerCase().includes(terminoBusqueda) ||
            usuario.direccion.toLowerCase().includes(terminoBusqueda) ||
            usuario.telefono.toLowerCase().includes(terminoBusqueda) ||
            usuario.fechaFin.toLowerCase().includes(terminoBusqueda)
        );
    });

    // Muestra las usuarios filtradas en la tabla
    mostrarUsuariosEnTabla(usuariosFiltrados);
};

document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Obtiene la fila actual
        const fila = document.querySelector('.eliminar-btn:focus').closest('tr');
        const id = fila.dataset.usuarioId;
        eliminarRegistro(id);
    });
});


function eliminarRegistro(id) {
    fetch(`http://localhost:8080/gymbuddy/api/persona/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la usuario');
        }
        obtenerYMostrarUsuarios();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function guardarEdicion() {
    
    const nombre = document.getElementById('nombreEdicion').value;
    const apellido = document.getElementById('apellidoEdicion').value;
    const direccion = document.getElementById('direccionEdicion').value;
    const barrio = document.getElementById('barrioEdicion').value;
    const fechaNac = document.getElementById('fechaNaciEdicion').value;
    const email = document.getElementById('emailEdicion').value;
    const telefono = document.getElementById('telefonoEdicion').value;
    const tipoDoc = document.getElementById('tipoDocEdicion').value;
    const numDoc = document.getElementById('numeroDocuEdicion').value;
    const rol = document.getElementById('rolEdicion').value;
    const plan = document.getElementById('planEdicion').value;
    const fotoPerfil = document.getElementById('fotoEdicion').value;
    const fechaInicio = document.getElementById('fechaInicioEdicion').value;
    const fechaFin = document.getElementById('fechaFinEdicion').value;

   
    const fila = document.querySelector('.editar-btn:focus').closest('tr');
   
    const id = fila.dataset.usuarioId;

    var editPersona = {
        id: id,
        name:nombre,
        lastName: apellido,
        address:direccion,
        neighborhood: barrio,
        birthDate: fechaNac,
        email: email,
        phoneNumber: telefono ,
        numDocument: numDoc,
        idTipoDocumento: tipoDoc,
        idRol: rol,
        idPlan: plan,
        photo: fotoPerfil,
        fechaDesdePlan: fechaInicio,
        fechaHastaPlan: fechaFin
    }
    
    actualizarUsuario(editPersona);

    $('#editarModal').modal('hide');
}
function actualizarUsuario(datosUsuario) {
    fetch(`http://localhost:8080/gymbuddy/api/persona/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }
        obtenerYMostrarUsuarios(); // Actualiza la tabla después de la edición
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function login() {
    // Obtén los valores de usuario y contraseña
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Objeto con las credenciales
    var credentials = {
        username: username,
        passwd: password
    };

    // Realiza la solicitud al backend para validar las credenciales
    fetch('http://localhost:8080/gymbuddy/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        // Credenciales válidas, redirige al usuario
        window.location.href = '/indexGym.html';
    })
    .catch(error => {
        // Credenciales inválidas, muestra un mensaje de error
        console.log(error);
        alert('Credenciales inválidas. Inténtalo de nuevo.');
    });
}
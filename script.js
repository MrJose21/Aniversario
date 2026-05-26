function iniciarSesion() {
    // Convierte el usuario a minúsculas para evitar errores si escriben mayúsculas por accidente
    const user = document.getElementById("username").value.toLowerCase();
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    // USUARIO 1 (Debe estar escrito estrictamente en minúsculas aquí en el código)
    const usuario1 = "dayana rojas";
    const clave1 = "FelizAniversar";

    // USUARIO 2 (Debe estar escrito estrictamente en minúsculas aquí en el código)
    const usuario2 = "jose";
    const clave2 = "5678";

    // Validamos si ingresaron alguno de los dos
    if ((user === usuario1 && pass === clave1) || (user === usuario2 && pass === clave2)) {
        
        // 1. Ocultamos el login
        document.getElementById("login-container").style.display = "none";
        
        // 2. Mostramos el contenedor del libro
        document.getElementById("libro-container").style.display = "block";
        
        // 3. Ocultamos el collage de fondo (actualizado al nombre correcto) y ponemos el fondo café
        document.querySelector(".collage-background").style.display = "none";
        document.body.style.backgroundColor = "#3e2723"; /* Un café oscuro elegante */
        
    } else {
        // Si se equivocan, mostramos el mensaje de error
        errorMsg.style.display = "block";
    }
}

// Función para abrir el libro mágico con efecto 3D
function abrirLibro() {
    const libro = document.getElementById("el-libro");
    libro.classList.add("abierto");
}
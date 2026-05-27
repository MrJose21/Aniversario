function iniciarSesion() {
    const user = document.getElementById("username").value.toLowerCase();
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    if ((user === "dayana rojas" && pass === "FelizAniversar") || (user === "jose" && pass === "5678")) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("libro-container").style.display = "block";
        document.querySelector(".collage-background").style.display = "none";
        document.body.style.backgroundColor = "#2b1b17"; 
    } else {
        errorMsg.style.display = "block";
    }
}

let libroAbierto = false;
let zIndexContador = 20; // Inicializado en 20 para sincronizar las 10 hojas dinámicamente

function abrirLibro() {
    if (!libroAbierto) {
        document.getElementById("el-libro").classList.add("abierto");
        document.getElementById("hoja-portada").classList.add("girada");
        libroAbierto = true;
    }
}

function pasarPagina(event, idHoja) {
    event.stopPropagation(); // Previene activar eventos del contenedor principal
    const hoja = document.getElementById(idHoja);
    
    if (!hoja.classList.contains('girada')) {
        hoja.classList.add('girada');
        zIndexContador++;
        hoja.style.zIndex = zIndexContador; // Superpone la hoja volteada sobre las anteriores
    }
}

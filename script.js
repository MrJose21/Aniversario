function iniciarSesion() {
    const user = document.getElementById("username").value.toLowerCase();
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    if ((user === "dayana rojas" && pass === "FelizAniversar") || (user === "jose" && pass === "5678")) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("libro-container").style.display = "block";
        document.querySelector(".collage-background").style.display = "none";
        document.body.style.backgroundColor = "#2b1b17";
        mostrarFlores(); // ← Aparecen las flores al entrar
    } else {
        errorMsg.style.display = "block";
    }
}

/* ===== FLORES DECORATIVAS ===== */
function crearFlor(tipo, x, y, tamaño, colorPetalo, colorCentro) {
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", tamaño);
    svg.setAttribute("height", tamaño);
    svg.classList.add("flor-svg");
    svg.style.left = x + "px";
    svg.style.top  = y + "px";

    if (tipo === "rosa") {
        // Rosa de 5 pétalos redondeados
        const angulos = [0, 72, 144, 216, 288];
        angulos.forEach(angulo => {
            const petalo = document.createElementNS(svgNS, "ellipse");
            const rad = (angulo - 90) * Math.PI / 180;
            const cx = 50 + Math.cos(rad) * 20;
            const cy = 50 + Math.sin(rad) * 20;
            petalo.setAttribute("cx", cx);
            petalo.setAttribute("cy", cy);
            petalo.setAttribute("rx", "14");
            petalo.setAttribute("ry", "10");
            petalo.setAttribute("fill", colorPetalo);
            petalo.setAttribute("opacity", "0.88");
            petalo.setAttribute("transform", `rotate(${angulo}, ${cx}, ${cy})`);
            svg.appendChild(petalo);
        });

    } else if (tipo === "margarita") {
        // Margarita de 8 pétalos alargados
        for (let i = 0; i < 8; i++) {
            const angulo = i * 45;
            const petalo = document.createElementNS(svgNS, "ellipse");
            const rad = (angulo - 90) * Math.PI / 180;
            const cx = 50 + Math.cos(rad) * 22;
            const cy = 50 + Math.sin(rad) * 22;
            petalo.setAttribute("cx", cx);
            petalo.setAttribute("cy", cy);
            petalo.setAttribute("rx", "7");
            petalo.setAttribute("ry", "13");
            petalo.setAttribute("fill", colorPetalo);
            petalo.setAttribute("opacity", "0.82");
            petalo.setAttribute("transform", `rotate(${angulo}, ${cx}, ${cy})`);
            svg.appendChild(petalo);
        }

    } else if (tipo === "flor4") {
        // Flor de 4 pétalos corazón simplificado
        const posiciones = [
            { cx: 50, cy: 30, rx: 10, ry: 16, rot: 0 },
            { cx: 50, cy: 70, rx: 10, ry: 16, rot: 0 },
            { cx: 30, cy: 50, rx: 16, ry: 10, rot: 0 },
            { cx: 70, cy: 50, rx: 16, ry: 10, rot: 0 },
        ];
        posiciones.forEach(p => {
            const petalo = document.createElementNS(svgNS, "ellipse");
            petalo.setAttribute("cx", p.cx);
            petalo.setAttribute("cy", p.cy);
            petalo.setAttribute("rx", p.rx);
            petalo.setAttribute("ry", p.ry);
            petalo.setAttribute("fill", colorPetalo);
            petalo.setAttribute("opacity", "0.85");
            svg.appendChild(petalo);
        });
    }

    // Centro de la flor
    const centro = document.createElementNS(svgNS, "circle");
    centro.setAttribute("cx", "50");
    centro.setAttribute("cy", "50");
    centro.setAttribute("r", tipo === "margarita" ? "9" : "12");
    centro.setAttribute("fill", colorCentro);
    svg.appendChild(centro);

    // Brillo en el centro
    const brillo = document.createElementNS(svgNS, "circle");
    brillo.setAttribute("cx", "45");
    brillo.setAttribute("cy", "45");
    brillo.setAttribute("r", "3");
    brillo.setAttribute("fill", "rgba(255,255,255,0.45)");
    svg.appendChild(brillo);

    return svg;
}

function mostrarFlores() {
    const contenedor = document.getElementById("flores-entorno");
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Definimos la paleta de flores: cálida, romántica, compatible con el marrón del libro
    const flores = [
        // Columna izquierda – fuera del libro
        { tipo:"rosa",     x: W*0.03,  y: H*0.08,  tam: 70,  petalo:"#e8a0b4", centro:"#d4af37" },
        { tipo:"margarita",x: W*0.01,  y: H*0.30,  tam: 58,  petalo:"#f5c6cb", centro:"#f0d060" },
        { tipo:"flor4",    x: W*0.05,  y: H*0.52,  tam: 62,  petalo:"#c8a0d0", centro:"#d4af37" },
        { tipo:"rosa",     x: W*0.02,  y: H*0.72,  tam: 55,  petalo:"#f4a8c0", centro:"#e8b84b" },
        { tipo:"margarita",x: W*0.06,  y: H*0.88,  tam: 48,  petalo:"#f9d0b8", centro:"#d4af37" },
        { tipo:"flor4",    x: W*0.10,  y: H*0.15,  tam: 44,  petalo:"#ddb8d8", centro:"#e8b84b" },

        // Columna derecha – fuera del libro
        { tipo:"rosa",     x: W*0.88,  y: H*0.06,  tam: 68,  petalo:"#e8a0b4", centro:"#d4af37" },
        { tipo:"flor4",    x: W*0.90,  y: H*0.28,  tam: 60,  petalo:"#f9c8d8", centro:"#e0a030" },
        { tipo:"margarita",x: W*0.86,  y: H*0.50,  tam: 56,  petalo:"#c8a0d0", centro:"#f0d060" },
        { tipo:"rosa",     x: W*0.91,  y: H*0.70,  tam: 52,  petalo:"#f4a8c0", centro:"#d4af37" },
        { tipo:"flor4",    x: W*0.85,  y: H*0.88,  tam: 58,  petalo:"#f5c6cb", centro:"#e8b84b" },
        { tipo:"margarita",x: W*0.93,  y: H*0.14,  tam: 42,  petalo:"#f9d0b8", centro:"#d4af37" },
    ];

    flores.forEach(f => {
        const svg = crearFlor(f.tipo, f.x, f.y, f.tam, f.petalo, f.centro);
        contenedor.appendChild(svg);
    });
}
/* ===== FIN FLORES ===== */

let libroAbierto = false;
let zIndexContador = 21; 

function abrirLibro() {
    if (!libroAbierto) {
        document.getElementById("el-libro").classList.add("abierto");
        document.getElementById("hoja-portada").classList.add("girada");
        libroAbierto = true;
    }
}

function pasarPagina(event, idHoja) {
    event.stopPropagation(); 
    const hoja = document.getElementById(idHoja);
    
    if (!hoja.classList.contains('girada')) {
        hoja.classList.add('girada');
        zIndexContador++;
        hoja.style.zIndex = zIndexContador; 
    }
}

function volverPagina(event, idHojaAnterior) {
    event.stopPropagation();
    const hoja = document.getElementById(idHojaAnterior);
    
    if (hoja.classList.contains('girada')) {
        hoja.classList.remove('girada');
        zIndexContador++;
        hoja.style.zIndex = zIndexContador;

        if (idHojaAnterior === 'hoja-portada') {
            document.getElementById("el-libro").classList.remove("abierto");
            libroAbierto = false;
        }
    }
}

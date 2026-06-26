/* ============================================================
   FIREBASE – CONFIGURACIÓN
   ============================================================ */
import { initializeApp }         from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
/* Cloudinary se usa para imágenes — no se necesita Firebase Storage */

const firebaseConfig = {
    apiKey:            "AIzaSyD1lHwVwnz-ZcxS2KJEi_P4fijyYCkzy_g",
    authDomain:        "libro-68190.firebaseapp.com",
    projectId:         "libro-68190",
    storageBucket:     "libro-68190.firebasestorage.app",
    messagingSenderId: "658383929318",
    appId:             "1:658383929318:web:dce3d57026946dae36e027"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
/* Cloudinary config */
const CLOUDINARY_CLOUD = "dzuymoznp";
const CLOUDINARY_PRESET = "libro_de_recuerdos";

/* ============================================================
   AUTENTICACIÓN
   ============================================================ */
function iniciarSesion() {
    const user = document.getElementById("username").value.toLowerCase().trim();
    const pass = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    const esJose   = (user === "jose"        && pass === "567u8");
    const esDayana = (user === "dayana rojas" && pass === "FelizAniversar");

    if (esJose || esDayana) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("libro-container").style.display = "block";
        document.querySelector(".collage-background").style.display = "none";
        document.body.style.backgroundColor = "#2b1b17";
        mostrarFlores();
        cargarPaginasDesdeFirebase();   // ← lee Firestore

        if (esDayana) {
            document.getElementById("btn-admin-flotante").style.display = "flex";
        }
    } else {
        errorMsg.style.display = "block";
    }
}
window.iniciarSesion = iniciarSesion;

/* ============================================================
   LIBRO – NAVEGACIÓN
   ============================================================ */
let libroAbierto   = false;
let zIndexContador = 21;

function abrirLibro() {
    if (!libroAbierto) {
        document.getElementById("el-libro").classList.add("abierto");
        document.getElementById("hoja-portada").classList.add("girada");
        libroAbierto = true;
    }
}
window.abrirLibro = abrirLibro;

function pasarPagina(event, idHoja) {
    event.stopPropagation();
    const hoja = document.getElementById(idHoja);
    if (!hoja.classList.contains("girada")) {
        hoja.classList.add("girada");
        zIndexContador++;
        hoja.style.zIndex = zIndexContador;
    }
}
window.pasarPagina = pasarPagina;

function volverPagina(event, idHojaAnterior) {
    event.stopPropagation();
    const hoja = document.getElementById(idHojaAnterior);
    if (hoja.classList.contains("girada")) {
        hoja.classList.remove("girada");
        zIndexContador++;
        hoja.style.zIndex = zIndexContador;
        if (idHojaAnterior === "hoja-portada") {
            document.getElementById("el-libro").classList.remove("abierto");
            libroAbierto = false;
        }
    }
}
window.volverPagina = volverPagina;

/* ============================================================
   PÁGINAS EXTRA – FIREBASE
   ============================================================ */

/* Lee todas las páginas de Firestore y construye el DOM */
async function cargarPaginasDesdeFirebase() {
    try {
        const q = query(collection(db, "paginas"), orderBy("creadoEn", "asc"));
        const snap = await getDocs(q);
        const paginas = [];
        snap.forEach(d => paginas.push({ firestoreId: d.id, ...d.data() }));
        construirPaginasEnDOM(paginas);
    } catch(e) {
        console.error("Error cargando páginas:", e);
    }
}

/* Construye las hojas extra en el DOM a partir de un array de páginas */
function construirPaginasEnDOM(paginas) {
    document.querySelectorAll(".hoja-extra").forEach(h => h.remove());
    if (paginas.length === 0) {
        actualizarBotonHoja10(false);
        return;
    }

    const libro = document.getElementById("el-libro");
    let zBase = 10;

    paginas.forEach((pag, i) => {
        const idNueva    = "hoja-extra-" + pag.firestoreId;
        const idAnterior = i === 0 ? "hoja10" : "hoja-extra-" + paginas[i-1].firestoreId;
        const idSiguiente = paginas[i+1] ? "hoja-extra-" + paginas[i+1].firestoreId : null;

        const hoja = document.createElement("div");
        hoja.className    = "hoja hoja-extra";
        hoja.id           = idNueva;
        hoja.style.zIndex = zBase - i;

        // 1. AHORA EL DORSO VA PRIMERO
        const dorso = document.createElement("div");
        dorso.className = "dorso-pagina";
        dorso.innerHTML = `
            <div class="papel-foto">
                <div class="esquinera-foto top-left"></div>
                <div class="esquinera-foto top-right"></div>
                <div class="esquinera-foto bottom-left"></div>
                <div class="esquinera-foto bottom-right"></div>
                <img src="${pag.imagenUrl}" alt="Página de Dayana">
            </div>`;

        // 2. AHORA EL FRENTE VA DESPUÉS
        const frente = document.createElement("div");
        frente.className = "frente-pagina";
        frente.innerHTML = `
            <h2 class="titulo-capitulo">${pag.titulo}</h2>
            <p class="texto-libro">${pag.texto}</p>
            <button class="btn-anterior" onclick="volverPagina(event,'${idAnterior}')">Anterior</button>
            ${idSiguiente ? `<button class="btn-siguiente" onclick="pasarPagina(event,'${idNueva}')">Siguiente</button>` : ""}
        `;

        // 3. INVERTIMOS EL ORDEN DE INSERCIÓN
        hoja.appendChild(dorso);  
        hoja.appendChild(frente); 
        libro.appendChild(hoja);
    });

    actualizarBotonHoja10(true, "hoja-extra-" + paginas[0].firestoreId);
}

function actualizarBotonHoja10(hayExtras, idPrimera) {
    const frente10 = document.querySelector("#hoja10 .frente-pagina");
    if (!frente10) return;
    const btnSig = frente10.querySelector(".btn-siguiente");
    if (btnSig) btnSig.remove();
    if (hayExtras) {
        const btn = document.createElement("button");
        btn.className = "btn-siguiente";
        btn.textContent = "Siguiente";
        btn.setAttribute("onclick", `pasarPagina(event,'hoja10')`);
        frente10.appendChild(btn);
    }
}

/* ============================================================
   PANEL ADMIN
   ============================================================ */
function abrirAdmin() {
    renderListaAdmin();
    document.getElementById("modal-admin").style.display = "flex";
}
window.abrirAdmin = abrirAdmin;

function cerrarAdmin() {
    document.getElementById("modal-admin").style.display = "none";
    limpiarFormulario();
}
window.cerrarAdmin = cerrarAdmin;

function limpiarFormulario() {
    document.getElementById("admin-titulo").value = "";
    document.getElementById("admin-texto").value  = "";
    document.getElementById("admin-img-preview").style.display = "none";
    document.getElementById("admin-img-preview").src = "";
    document.getElementById("admin-img-file").value = "";
    document.getElementById("admin-msg").textContent = "";
    window._archivoSeleccionado = null;
}

/* Preview al elegir archivo */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("admin-img-file").addEventListener("change", function() {
        const file = this.files[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
            mostrarMsg("La imagen pesa más de 8 MB. Elige una más pequeña.", "error");
            return;
        }
        window._archivoSeleccionado = file;
        const prev = document.getElementById("admin-img-preview");
        prev.src = URL.createObjectURL(file);
        prev.style.display = "block";
    });
});

/* Guardar página: sube imagen a Cloudinary, guarda URL en Firestore */
async function guardarPagina() {
    const titulo  = document.getElementById("admin-titulo").value.trim();
    const texto   = document.getElementById("admin-texto").value.trim();
    const archivo = window._archivoSeleccionado;

    if (!titulo)  { mostrarMsg("Escribe un título para la página.", "error"); return; }
    if (!texto)   { mostrarMsg("Escribe el texto de la página.",    "error"); return; }
    if (!archivo) { mostrarMsg("Elige una foto desde tu dispositivo.", "error"); return; }

    mostrarMsg("⏳ Subiendo imagen…", "ok");
    document.querySelector(".btn-guardar").disabled = true;

    try {
        // 1. Subir imagen a Cloudinary (sin servidor, upload preset unsigned)
       const formData = new FormData();
        formData.append("file", archivo);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
            { method: "POST", body: formData }
        );
        if (!res.ok) throw new Error("Error subiendo a Cloudinary: " + res.status);
        const data = await res.json();
        const imagenUrl = data.secure_url;

        // 2. Guardar título, texto y URL en Firestore
        await addDoc(collection(db, "paginas"), {
            titulo,
            texto,
            imagenUrl,
            publicId: data.public_id,   // guardamos por si queremos borrar después
            creadoEn: Date.now()
        });

        mostrarMsg("✅ ¡Página guardada y visible para ambos!", "ok");
        limpiarFormulario();
        await cargarPaginasDesdeFirebase();
        await renderListaAdmin();

    } catch(e) {
        console.error(e);
        mostrarMsg("❌ Error al guardar. Revisa la consola.", "error");
    } finally {
        document.querySelector(".btn-guardar").disabled = false;
    }
}
window.guardarPagina = guardarPagina;

/* Eliminar página: borra de Firestore (la imagen en Cloudinary queda, sin costo) */
async function eliminarPagina(firestoreId) {
    if (!confirm("¿Eliminar esta página del libro?")) return;
    try {
        await deleteDoc(doc(db, "paginas", firestoreId));
        await cargarPaginasDesdeFirebase();
        await renderListaAdmin();
    } catch(e) {
        alert("Error al eliminar. Intenta de nuevo.");
        console.error(e);
    }
}
window.eliminarPagina = eliminarPagina;

/* Render lista de páginas en el panel */
async function renderListaAdmin() {
    const lista = document.getElementById("admin-lista");
    lista.innerHTML = "<p style='color:#9e7b5a;font-size:13px;text-align:center;'>Cargando…</p>";
    try {
        const q    = query(collection(db, "paginas"), orderBy("creadoEn", "asc"));
        const snap = await getDocs(q);
        if (snap.empty) {
            lista.innerHTML = "<p style='color:#9e7b5a;font-size:13px;text-align:center;'>Aún no has agregado páginas extra.</p>";
            return;
        }
        lista.innerHTML = "";
        snap.forEach(d => {
            const pag = d.data();
            const item = document.createElement("div");
            item.className = "admin-item";
            item.innerHTML = `
                <img src="${pag.imagenUrl}" alt="">
                <div class="admin-item-info">
                    <strong>${pag.titulo}</strong>
                    <span>${pag.texto.substring(0, 60)}…</span>
                </div>
                <button class="admin-item-del"
                    onclick="eliminarPagina('${d.id}')">✕</button>
            `;
            lista.appendChild(item);
        });
    } catch(e) {
        lista.innerHTML = "<p style='color:#b71c1c;font-size:13px;'>Error cargando lista.</p>";
    }
}

function mostrarMsg(txt, tipo) {
    const el = document.getElementById("admin-msg");
    el.textContent = txt;
    el.style.color = tipo === "ok" ? "#5a8f5a" : "#b71c1c";
}

/* ============================================================
   FLORES
   ============================================================ */
function crearFlor(tipo, x, y, tamaño, colorPetalo, colorCentro) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width",  tamaño);
    svg.setAttribute("height", tamaño);
    svg.classList.add("flor-svg");
    svg.style.left = x + "px";
    svg.style.top  = y + "px";

    if (tipo === "rosa") {
        [0, 72, 144, 216, 288].forEach(angulo => {
            const p = document.createElementNS(svgNS, "ellipse");
            const rad = (angulo - 90) * Math.PI / 180;
            const cx = 50 + Math.cos(rad) * 20, cy = 50 + Math.sin(rad) * 20;
            p.setAttribute("cx", cx); p.setAttribute("cy", cy);
            p.setAttribute("rx", "14"); p.setAttribute("ry", "10");
            p.setAttribute("fill", colorPetalo); p.setAttribute("opacity", "0.88");
            p.setAttribute("transform", `rotate(${angulo},${cx},${cy})`);
            svg.appendChild(p);
        });
    } else if (tipo === "margarita") {
        for (let i = 0; i < 8; i++) {
            const angulo = i * 45;
            const p = document.createElementNS(svgNS, "ellipse");
            const rad = (angulo - 90) * Math.PI / 180;
            const cx = 50 + Math.cos(rad) * 22, cy = 50 + Math.sin(rad) * 22;
            p.setAttribute("cx", cx); p.setAttribute("cy", cy);
            p.setAttribute("rx", "7"); p.setAttribute("ry", "13");
            p.setAttribute("fill", colorPetalo); p.setAttribute("opacity", "0.82");
            p.setAttribute("transform", `rotate(${angulo},${cx},${cy})`);
            svg.appendChild(p);
        }
    } else if (tipo === "flor4") {
        [{ cx:50,cy:30,rx:10,ry:16},{cx:50,cy:70,rx:10,ry:16},
         { cx:30,cy:50,rx:16,ry:10},{cx:70,cy:50,rx:16,ry:10}].forEach(d => {
            const p = document.createElementNS(svgNS, "ellipse");
            p.setAttribute("cx", d.cx); p.setAttribute("cy", d.cy);
            p.setAttribute("rx", d.rx); p.setAttribute("ry", d.ry);
            p.setAttribute("fill", colorPetalo); p.setAttribute("opacity", "0.85");
            svg.appendChild(p);
        });
    }

    const centro = document.createElementNS(svgNS, "circle");
    centro.setAttribute("cx","50"); centro.setAttribute("cy","50");
    centro.setAttribute("r", tipo === "margarita" ? "9" : "12");
    centro.setAttribute("fill", colorCentro);
    svg.appendChild(centro);

    const brillo = document.createElementNS(svgNS, "circle");
    brillo.setAttribute("cx","45"); brillo.setAttribute("cy","45");
    brillo.setAttribute("r","3"); brillo.setAttribute("fill","rgba(255,255,255,0.45)");
    svg.appendChild(brillo);

    return svg;
}

function mostrarFlores() {
    const contenedor = document.getElementById("flores-entorno");
    const W = window.innerWidth, H = window.innerHeight;
    [
        { tipo:"rosa",      x:W*0.03, y:H*0.08, tam:70, petalo:"#e8a0b4", centro:"#d4af37" },
        { tipo:"margarita", x:W*0.01, y:H*0.30, tam:58, petalo:"#f5c6cb", centro:"#f0d060" },
        { tipo:"flor4",     x:W*0.05, y:H*0.52, tam:62, petalo:"#c8a0d0", centro:"#d4af37" },
        { tipo:"rosa",      x:W*0.02, y:H*0.72, tam:55, petalo:"#f4a8c0", centro:"#e8b84b" },
        { tipo:"margarita", x:W*0.06, y:H*0.88, tam:48, petalo:"#f9d0b8", centro:"#d4af37" },
        { tipo:"flor4",     x:W*0.10, y:H*0.15, tam:44, petalo:"#ddb8d8", centro:"#e8b84b" },
        { tipo:"rosa",      x:W*0.88, y:H*0.06, tam:68, petalo:"#e8a0b4", centro:"#d4af37" },
        { tipo:"flor4",     x:W*0.90, y:H*0.28, tam:60, petalo:"#f9c8d8", centro:"#e0a030" },
        { tipo:"margarita", x:W*0.86, y:H*0.50, tam:56, petalo:"#c8a0d0", centro:"#f0d060" },
        { tipo:"rosa",      x:W*0.91, y:H*0.70, tam:52, petalo:"#f4a8c0", centro:"#d4af37" },
        { tipo:"flor4",     x:W*0.85, y:H*0.88, tam:58, petalo:"#f5c6cb", centro:"#e8b84b" },
        { tipo:"margarita", x:W*0.93, y:H*0.14, tam:42, petalo:"#f9d0b8", centro:"#d4af37" },
    ].forEach(f => contenedor.appendChild(crearFlor(f.tipo, f.x, f.y, f.tam, f.petalo, f.centro)));
}

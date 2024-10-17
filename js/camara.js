import { urlImages, posts, mostrarPosts } from "./main.js";

const btnNuevo = document.querySelector("#btnCamara");
const btnCerrar = document.querySelector("#btnCerrar");
const dialog = document.querySelector("dialog");
const imgPreview = document.querySelector("#imgPreview");
const btnPost = document.querySelector("#postImg");
const inputTitulo = document.querySelector("#tituloImg");
const imgCamaraDisable = "./images/camara-disable.png";


const inputCamara = document.createElement("input");
inputCamara.type = "file";
inputCamara.id = "inputCamara";
inputCamara.accept = "image/*";
inputCamara.capture = "environment"; 

inputCamara.addEventListener("change", () => {
    let imagenCapturada = URL.createObjectURL(inputCamara.files[0])
    imgPreview.src = imagenCapturada;
});

function convertirAbase64() {
    const canvas = document.createElement("canvas");
    canvas.width = imgPreview.width
    canvas.height = imgPreview.height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(imgPreview, 0, 0, imgPreview.width, imgPreview.height)
    
    return canvas.toDataURL('image/webp')
}

function crearPost() {
    let nuevoPost = {
        imagen: convertirAbase64(),
        fecha: new Date().toLocaleString(),
        titulo: inputTitulo.value
    }

    const opciones = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPost)
    }

    fetch(urlImages, opciones)
        .then((response) => {
            if(response.status === 201) {
                return response.json()
            } else {
                throw new Error("No se pudo crear el recurso. " + response.status)
            }
        })
        .then((data) => {
            posts.push(data);
            mostrarPosts();
        })
}

const precargarImagen = (url) => {
    const img = new Image();
    img.src = url;
    return img;
};
const imgDisable = precargarImagen(imgCamaraDisable);

//Eventos

btnNuevo.addEventListener("click", () => {
    if(navigator.onLine) {
        inputCamara.click();
        setTimeout(() => dialog.showModal(), 2000);
    } else {
        alert("No estás conectado a internet");
    }    
});

btnCerrar.addEventListener("click", () => dialog.close() );

btnPost.addEventListener("click", () => {
    crearPost();
    btnCerrar.click();
    imgPreview.src="";
})

imgPreview.addEventListener("click", () => inputCamara.click() )

window.addEventListener("offline", () => {
    console.warn("Conexión perdida");
    btnNuevo.src = imgDisable.src;
    btnPost.disabled = true;
    btnPost.classList = "montserrat-p buttonDisable"
})

window.addEventListener("online", () => {
    console.warn("Conexión restaurada");
    btnNuevo.src = "./images/camara.png";
    btnPost.disabled = false;
    btnPost.classList = "montserrat-p"
})
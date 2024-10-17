export const urlImages = "https://670aed6fac6860a6c2cadd97.mockapi.io/api/images";
const main = document.querySelector("main");

export let posts = [];

function convertirFecha(fechaStr) {
    const [fecha, tiempo, ampm] = fechaStr.split(/, | /);
    const [dia, mes, año] = fecha.split("/").map(Number);
    let [hora, minutos, segundos] = tiempo.split(":").map(Number);
    
    if (ampm === "p.m." && hora !== 12) hora += 12;
    if (ampm === "a.m." && hora === 12) hora = 0;
    
    return new Date(año, mes - 1, dia, hora, minutos, segundos);
}

function getPosts() {
    fetch(urlImages)
        .then((response) => {
            if(response.status === 200) {
                return response.json()
            } else {
                throw new Error("No se pueden obtener los datos remotos. " + response.status)
            }
        })
        .then((data) => posts.push(...data))

        .then(() => mostrarPosts());
}

function crearPost(post) {
    return `
            <div class="post">
                <h3 class="montserrat-p tituloPost">${post.titulo}</h3>
                <img class="imagenPost" src=${post.imagen}>
                <p class="montserrat-p fechaPost">${post.fecha}</p>
            </div>
            `      
}

export function mostrarPosts() {
    main.innerHTML = '';
    posts.sort( (a, b) => convertirFecha(b.fecha) - convertirFecha(a.fecha) );
    posts.forEach(el => {
        main.innerHTML += crearPost(el);
    });
}

getPosts()
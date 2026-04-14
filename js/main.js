// =======================
// VARIABLES
// =======================

let equipo = JSON.parse(localStorage.getItem("equipo")) || []


// =======================
// SELECTORES DOM
// =======================

const contenedorAPI = document.getElementById("jugadoresAPI")
const contenedorEquipo = document.getElementById("miEquipo")


// =======================
// FUNCIONES BASE
// =======================

function guardarEquipo(){
    localStorage.setItem("equipo", JSON.stringify(equipo))
}


// =======================
// INICIALIZACIÓN
// =======================

console.log("Proyecto Final iniciado")

// =======================
// OBTENER JUGADORES DESDE API
// =======================

async function obtenerJugadoresAPI(){

    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/users")
        const data = await response.json()

        return data

    }catch(error){
        console.error("Error al obtener jugadores:", error)
    }

}

// =======================
// CREAR CARD JUGADOR (API)
// =======================

function crearCardAPI(jugador){

    const card = document.createElement("div")
    card.classList.add("card-jugador")

    card.innerHTML = `
        <h4>${jugador.name}</h4>
        <p>Email: ${jugador.email}</p>
        <button>Fichar</button>
    `

    const boton = card.querySelector("button")

    boton.addEventListener("click", () => {
        ficharJugador(jugador)
    })

    return card
}

// =======================
// MOSTRAR JUGADORES API
// =======================

function mostrarJugadoresAPI(jugadores){

    contenedorAPI.innerHTML = ""

    jugadores.forEach(jugador => {
        const card = crearCardAPI(jugador)
        contenedorAPI.appendChild(card)
    })

}
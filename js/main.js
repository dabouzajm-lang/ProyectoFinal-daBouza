
// VARIABLES


let equipo = JSON.parse(localStorage.getItem("equipo")) || []
let jugadoresAPI = []
// RECALCULAR GASTO AL CARGAR LA PAGINA
equipo.forEach(jugador => {
    gastoTotal += jugador.precio || 0
})

// SELECTORES DOM


const contenedorAPI = document.getElementById("jugadoresAPI")
const contenedorEquipo = document.getElementById("miEquipo")



// FUNCIONES BASE


function guardarEquipo(){
    localStorage.setItem("equipo", JSON.stringify(equipo))
}



// OBTENER JUGADORES DESDE API


async function obtenerJugadoresAPI(){

    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/users")
        const data = await response.json()

        return data

    }catch(error){
        console.error("Error al obtener jugadores:", error)
    }

}

// CREAR CARD JUGADOR (API)


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

const posiciones = ["Armador", "Opuesto", "Central", "Punta", "Líbero"]

function asignarPosicion(){
    const random = Math.floor(Math.random() * posiciones.length)
    return posiciones[random]
}

let presupuesto = 100000000
let gastoTotal = 0

function generarPrecio(){
    return Math.floor(Math.random() * 500000) + 100000
}



// MOSTRAR JUGADORES API


function mostrarJugadoresAPI(jugadores){

    contenedorAPI.innerHTML = ""

    jugadores.forEach(jugador => {
        const card = crearCardAPI(jugador)
        contenedorAPI.appendChild(card)
    })

}


// INICIALIZACIÓN


async function init(){

    const jugadores = await obtenerJugadoresAPI()
    mostrarJugadoresAPI(jugadores)

}

init()


// FICHAR JUGADOR


function ficharJugador(jugador){

    const existe = equipo.some(j => j.id === jugador.id)

    if(existe){
        Swal.fire({
            title: "Jugador ya fichado",
            text: "Este jugador ya está en tu equipo",
            icon: "warning"
        })
        return
    }

    // límite de jugadores
    if(equipo.length >= 6){
        Swal.fire({
            title: "Equipo completo",
            text: "No podés fichar más de 6 jugadores",
            icon: "error"
        })
        return
    }

    const precio = generarPrecio()

    // validar presupuesto
    if(gastoTotal + precio > presupuesto){
        Swal.fire({
            title: "Sin presupuesto",
            text: "No tenés dinero suficiente",
            icon: "error"
        })
        return
    }

    const jugadorFinal = {
        ...jugador,
        posicion: asignarPosicion(),
        precio: precio
    }

    equipo.push(jugadorFinal)

    gastoTotal += precio

    guardarEquipo()

    mostrarEquipo()

    Swal.fire({
        title: "Jugador fichado",
        text: `${jugador.name} - $${precio}`,
        icon: "success"
    })

}


// MOSTRAR MI EQUIPO


function mostrarEquipo(){

    contenedorEquipo.innerHTML = ""

    equipo.forEach((jugador, index) => {

        const card = document.createElement("div")
        card.classList.add("card-jugador")

        card.innerHTML = `
            <h4>${jugador.name}</h4>
            <p>Posición: ${jugador.posicion}</p>
             <p>Precio: $${jugador.precio}</p>
            <button>Eliminar</button>
            `

        const boton = card.querySelector("button")

        boton.addEventListener("click", () => {
            eliminarJugador(index)
        })

        contenedorEquipo.appendChild(card)

    })

}


// ELIMINAR JUGADOR


function eliminarJugador(index){

    const jugador = equipo[index]

    equipo.splice(index, 1)

    guardarEquipo()

    mostrarEquipo()

    Swal.fire({
        title: "Jugador eliminado",
        text: `${jugador.name} fue eliminado del equipo`,
        icon: "info"
    })

}


async function init(){

    jugadoresAPI = await obtenerJugadoresAPI()

    mostrarJugadoresAPI(jugadoresAPI)
    mostrarEquipo()
    mostrarPresupuesto()

}

//SELECTOR DE PRESUPUESTO

const presupuestoHTML = document.getElementById("presupuesto")

function mostrarPresupuesto(){

    const restante = presupuesto - gastoTotal

    presupuestoHTML.textContent =
    `Presupuesto restante: $${restante}`

}

mostrarEquipo()

mostrarPresupuesto()

//RESETEAR EQUIPO

const btnReset = document.getElementById("btnReset")

function resetearEquipo(){

    Swal.fire({
        title: "¿Seguro?",
        text: "Se eliminarán todos los jugadores",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar"
    }).then((result) => {

        if(result.isConfirmed){

            equipo = []
            gastoTotal = 0

            guardarEquipo()
            mostrarEquipo()

            Swal.fire("Equipo reseteado", "", "success")

        }

    })

}

btnReset.addEventListener("click", resetearEquipo)

//BUSCADOR DE JUGADORES

const buscador = document.getElementById("buscador")

buscador.addEventListener("input", (e) => {

    const texto = e.target.value.toLowerCase()

    const filtrados = jugadoresAPI.filter(j =>
        j.name.toLowerCase().includes(texto)
    )

    mostrarJugadoresAPI(filtrados)

})



const header = document.getElementById("header");

const hero = document.querySelector(".hero");

const fondo = document.querySelector(".hero-fondo");

const menuBtn = document.getElementById("menuBtn");

const menu = document.querySelector(".menu");


/* HEADER AL HACER SCROLL */

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* EFECTO DE MOVIMIENTO DEL FONDO */

hero.addEventListener("mousemove", (e) => {

    const ancho = window.innerWidth;
    const alto = window.innerHeight;

    const x = (e.clientX / ancho - 0.5) * 12;
    const y = (e.clientY / alto - 0.5) * 12;

    fondo.style.transform =
        `scale(1.07) translate(${x}px, ${y}px)`;

});


hero.addEventListener("mouseleave", () => {

    fondo.style.transform =
        "scale(1.05) translate(0, 0)";

});


/* MENÚ CELULAR */

menuBtn.addEventListener("click", () => {

    menu.classList.toggle("activo");

});


document.querySelectorAll(".menu a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("activo");

    });

});
/*IA*/

const iaBoton = document.getElementById("iaBoton");
const iaChat = document.getElementById("iaChat");
const cerrarIA = document.getElementById("cerrarIA");

const enviarIA = document.getElementById("enviarIA");
const preguntaIA = document.getElementById("preguntaIA");

const iaMensajes = document.getElementById("iaMensajes");


iaBoton.addEventListener("click", () => {

    iaChat.classList.toggle("activo");

});


cerrarIA.addEventListener("click", () => {

    iaChat.classList.remove("activo");

});


enviarIA.addEventListener("click", enviarPregunta);


preguntaIA.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        enviarPregunta();
    }

});


function enviarPregunta() {

    const pregunta = preguntaIA.value.trim();

    if (pregunta === "") return;


    agregarMensaje(pregunta, "usuario");


    preguntaIA.value = "";


    setTimeout(() => {

        const respuesta = obtenerRespuesta(pregunta);

        agregarMensaje(respuesta, "ia");

    }, 500);

}


function agregarMensaje(texto, tipo) {

    const mensaje = document.createElement("div");

    mensaje.classList.add("mensaje", tipo);

    mensaje.textContent = texto;


    iaMensajes.appendChild(mensaje);


    iaMensajes.scrollTop =
        iaMensajes.scrollHeight;
}

async function enviarPregunta() {

    const pregunta = preguntaIA.value.trim();

    if (pregunta === "") return;


    agregarMensaje(pregunta, "usuario");

    preguntaIA.value = "";


    const pensando = document.createElement("div");

    pensando.classList.add("mensaje", "ia");

    pensando.textContent = "✦ Pensando...";

    iaMensajes.appendChild(pensando);

    iaMensajes.scrollTop = iaMensajes.scrollHeight;


    try {

        const respuesta = await fetch("asistente.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mensaje: pregunta
            })

        });


        const datos = await respuesta.json();


        pensando.remove();


        if (datos.respuesta) {

            agregarMensaje(
                datos.respuesta,
                "ia"
            );

        } else {

            agregarMensaje(
                "No pude generar una respuesta en este momento.",
                "ia"
            );

            console.error(datos);

        }

    } catch (error) {

        pensando.remove();


        agregarMensaje(
            "No pude conectarme con GlucoVida IA.",
            "ia"
        );

        console.error(error);

    }

}
/* =========================
   DASHBOARD DE GLUCOSA
========================= */

const registrosGlucosa = [
    102,
    118,
    109,
    136,
    121,
    112,
    115
];


const diasGlucosa = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom"
];


const promedio =
    Math.round(
        registrosGlucosa.reduce(
            (a, b) => a + b,
            0
        ) /
        registrosGlucosa.length
    );


const minimo =
    Math.min(
        ...registrosGlucosa
    );


const maximo =
    Math.max(
        ...registrosGlucosa
    );


document.getElementById(
    "promedioGlucosa"
).textContent = promedio;


document.getElementById(
    "minimoGlucosa"
).textContent = minimo;


document.getElementById(
    "maximoGlucosa"
).textContent = maximo;


/* GRAFICA */

const canvasGlucosa =
    document.getElementById(
        "graficaGlucosa"
    );


if (canvasGlucosa) {

    const contexto =
        canvasGlucosa.getContext("2d");


    const gradiente =
        contexto.createLinearGradient(
            0,
            0,
            0,
            250
        );


    gradiente.addColorStop(
        0,
        "rgba(22,217,174,.32)"
    );


    gradiente.addColorStop(
        1,
        "rgba(22,217,174,0)"
    );


    new Chart(
        canvasGlucosa,
        {

            type: "line",

            data: {

                labels: diasGlucosa,

                datasets: [

                    {

                        data:
                            registrosGlucosa,

                        borderColor:
                            "#16d9ae",

                        backgroundColor:
                            gradiente,

                        fill: true,

                        borderWidth: 2,

                        tension: .42,

                        pointRadius: 3,

                        pointHoverRadius: 6,

                        pointBackgroundColor:
                            "#16d9ae"

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio:
                    false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {

                            color:
                                "rgba(255,255,255,.45)"

                        }

                    },


                    y: {

                        beginAtZero: false,

                        grid: {

                            color:
                                "rgba(255,255,255,.05)"

                        },

                        ticks: {

                            color:
                                "rgba(255,255,255,.4)"

                        }

                    }

                }

            }

        }
    );

}
/* =========================
   ANALISIS CON IA
========================= */

const botonAnalizar =
    document.getElementById(
        "analizarIA"
    );


const textoAnalisis =
    document.getElementById(
        "textoAnalisis"
    );


if (botonAnalizar) {

    botonAnalizar.addEventListener(
        "click",
        async () => {

            botonAnalizar.disabled =
                true;


            botonAnalizar.textContent =
                "✦ Analizando...";


            textoAnalisis.textContent =
                "GlucoVida IA está interpretando los registros...";


            try {

                const respuesta =
                    await fetch(
                        "analizar.php",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                registros:
                                    registrosGlucosa

                            })

                        }
                    );


                const datos =
                    await respuesta.json();


                if (datos.respuesta) {

                    textoAnalisis.textContent =
                        datos.respuesta;

                } else {

                    textoAnalisis.textContent =
                        "No fue posible generar el análisis.";

                    console.error(datos);

                }


            } catch (error) {

                textoAnalisis.textContent =
                    "No fue posible conectarse con GlucoVida IA.";

                console.error(error);

            }


            botonAnalizar.disabled =
                false;


            botonAnalizar.textContent =
                "✦ Analizar nuevamente";

        }
    );

}
<?php

header(
    "Content-Type: application/json; charset=UTF-8"
);


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


if (
    !isset($datos["registros"]) ||
    !is_array($datos["registros"])
) {

    echo json_encode([
        "error" =>
            "No se recibieron registros."
    ]);

    exit;

}


$registros =
    $datos["registros"];


$registrosTexto =
    implode(
        ", ",
        $registros
    );


$prompt = <<<TXT

Eres GlucoVida IA.

Analiza únicamente los siguientes registros
ficticios de glucosa:

$registrosTexto mg/dL

Los registros corresponden, en orden,
a lunes, martes, miércoles, jueves,
viernes, sábado y domingo.

Tu tarea es explicar de forma breve
y sencilla qué patrones aparecen
en estos datos.

Puedes mencionar:
- variaciones;
- cuál fue el valor mayor;
- cuál fue el menor;
- si los datos parecen más o menos estables;
- qué día tuvo mayor cambio.

No diagnostiques enfermedades.
No indiques medicamentos.
No indiques dosis de insulina.
No asegures que estos valores son saludables
o peligrosos.

Aclara que se trata de una interpretación
educativa de los registros y no de una
evaluación médica.

Responde en español.

Usa máximo dos párrafos.

TXT;


$payload = [

    "model" => "llama3.2",

    "messages" => [

        [
            "role" => "user",
            "content" => $prompt
        ]

    ],

    "stream" => false

];


$ch = curl_init(
    "http://127.0.0.1:11434/api/chat"
);


curl_setopt_array(
    $ch,
    [

        CURLOPT_POST => true,

        CURLOPT_RETURNTRANSFER =>
            true,

        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json"
        ],

        CURLOPT_POSTFIELDS =>
            json_encode($payload),

        CURLOPT_TIMEOUT => 120

    ]
);


$respuesta =
    curl_exec($ch);


if (curl_errno($ch)) {

    echo json_encode([
        "error" =>
            "No se pudo conectar con Ollama."
    ]);

    curl_close($ch);

    exit;

}


curl_close($ch);


$resultado =
    json_decode(
        $respuesta,
        true
    );


if (
    isset(
        $resultado["message"]["content"]
    )
) {

    echo json_encode([

        "respuesta" =>
            $resultado["message"]["content"]

    ]);

} else {

    echo json_encode([

        "error" =>
            "No se pudo generar el análisis."

    ]);

}
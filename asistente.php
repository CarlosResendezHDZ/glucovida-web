<?php

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["mensaje"]) || trim($data["mensaje"]) === "") {
    echo json_encode([
        "error" => "No se recibió ninguna pregunta."
    ]);
    exit;
}

$mensaje = trim($data["mensaje"]);


$promptSistema = <<<TXT
Eres GlucoVida IA, el asistente educativo de una plataforma
para personas interesadas en comprender la diabetes y la glucosa.

Responde siempre en español.

Tus respuestas deben:
- ser claras y fáciles de entender;
- ser breves salvo que el usuario pida más detalle;
- explicar conceptos relacionados con glucosa, diabetes,
  alimentación, actividad física y hábitos;
- mantener un tono amable y profesional.

No debes:
- diagnosticar enfermedades;
- indicar dosis de medicamentos o insulina;
- sustituir a un médico;
- asegurar que un valor aislado significa que una persona
  tiene determinada enfermedad.

Cuando una pregunta requiera una valoración médica individual,
explica que debe consultarse con un profesional de salud.

También puedes explicar las funciones de GlucoVida.
TXT;


$payload = [
    "model" => "llama3.2",

    "messages" => [
        [
            "role" => "system",
            "content" => $promptSistema
        ],

        [
            "role" => "user",
            "content" => $mensaje
        ]
    ],

    "stream" => false
];


$ch = curl_init("http://127.0.0.1:11434/api/chat");

curl_setopt_array($ch, [

    CURLOPT_POST => true,

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json"
    ],

    CURLOPT_POSTFIELDS => json_encode($payload),

    CURLOPT_TIMEOUT => 120
]);


$respuesta = curl_exec($ch);


if (curl_errno($ch)) {

    echo json_encode([
        "error" => "No se pudo conectar con Ollama."
    ]);

    curl_close($ch);
    exit;
}


curl_close($ch);


$resultado = json_decode($respuesta, true);


if (
    isset($resultado["message"]) &&
    isset($resultado["message"]["content"])
) {

    echo json_encode([
        "respuesta" => $resultado["message"]["content"]
    ]);

} else {

    echo json_encode([
        "error" => "Ollama no devolvió una respuesta válida."
    ]);

}
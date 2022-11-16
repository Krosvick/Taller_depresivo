"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("./utility");
function menuUsuario() {
    console.clear();
    console.log("1) Ver encuestas disponibles");
    console.log("2) Ver encuestas realizadas");
    console.log("3) Salir");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            //verEncuestasDisponibles();
            break;
        case "2":
            //verEncuestasRealizadas();
            break;
        case "3":
            console.log("Gracias por usar el sistema de encuestas");
            break;
        default:
            console.log("Opcion invalida");
            menuUsuario();
            break;
    }
    ;
}
//# sourceMappingURL=usuarios.js.map
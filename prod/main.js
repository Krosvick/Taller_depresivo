"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("./utility");
const logins_1 = require("./logins");
function init() {
    console.clear();
    console.log("Bienvenido al sistema de encuestas");
    console.log("1) Iniciar sesion");
    console.log("3) Salir");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            (0, logins_1.loginPsicologo)();
            break;
        case "3":
            console.log("Gracias por usar el sistema de encuestas");
            break;
        default:
            console.log("Opcion invalida");
            init();
            break;
    }
}
init();
//# sourceMappingURL=main.js.map
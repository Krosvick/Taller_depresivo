"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPsicologo = void 0;
const utility_1 = require("./utility");
const psicologos_1 = require("./psicologos");
async function loginPsicologo() {
    console.log("Ingrese su correo electronico");
    let email;
    while (true) {
        email = (0, utility_1.prompts)("Correo: ");
        if ((0, utility_1.validateEmail)(email)) {
            break;
        }
        else {
            console.log("Correo invalido, intente nuevamente");
        }
    }
    console.log("Ingrese su contraseña");
    let password = (0, utility_1.prompts)("Contraseña: ");
    try {
        const res = await utility_1.client.collection("psychologists").authWithPassword(email, password);
        console.log("Bienvenido" + " " + res.record.names);
        (0, psicologos_1.menuPsicologo)();
    }
    catch (error) {
        console.log("Correo o contraseña invalidos");
        loginPsicologo();
    }
}
exports.loginPsicologo = loginPsicologo;
//# sourceMappingURL=logins.js.map
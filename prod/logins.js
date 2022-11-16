"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPsicologo = void 0;
const utility_1 = require("./utility");
const psicologos_1 = require("./psicologos");
async function loginPsicologo() {
    console.log("Ingrese su correo electronico");
    var email = (0, utility_1.prompts)("Correo: ");
    console.log("Ingrese su contraseña");
    var password = (0, utility_1.prompts)("Contraseña: ");
    const res = await utility_1.client.collection("psychologists").authWithPassword(email, password);
    if (res) {
        console.log("Bienvenido " + res.record.names);
        (0, psicologos_1.menuPsicologo)();
        return;
    }
    else {
        console.log("Correo o contraseña invalidos");
    }
}
exports.loginPsicologo = loginPsicologo;
//# sourceMappingURL=logins.js.map
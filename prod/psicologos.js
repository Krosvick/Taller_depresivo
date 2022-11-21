"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuPsicologo = void 0;
const utility_1 = require("./utility");
//Referencia
/*async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}*/
function menuPsicologo() {
    console.log("1) Administrar tests");
    console.log("2) ver encuestas realizadas");
    console.log("3) Manejar usuarios");
    console.log("4) Salir del programa");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            administrarTests();
            break;
        case "2":
            //verEncuestasRealizadas();
            break;
        case "3":
            manejarUsuarios();
            break;
        case "4":
            console.log("Gracias por usar el sistema de encuestas");
            utility_1.client.authStore.clear();
            break;
        default:
            console.log("Opcion invalida");
            menuPsicologo();
            break;
    }
    ;
}
exports.menuPsicologo = menuPsicologo;
//**seccion de manejo de usuarios
function manejarUsuarios() {
    console.log("1) Ver todos los usuarios");
    console.log("2) Agregar un usuario");
    console.log("3) Eliminar un usuario");
    console.log("4) Salir del menu de usuarios");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            //verTodosLosUsuarios();
            break;
        case "2":
            agregarUsuario();
            break;
        case "3":
            //eliminarUsuario();
            break;
        case "4":
            menuPsicologo();
            break;
        default:
            console.log("Opcion invalida");
            manejarUsuarios();
            break;
    }
    ;
}
async function agregarUsuario() {
    console.clear();
    console.log("Para ingresar un usuario se requiere de los siguientes campos");
    console.log("Nombres, apellido paterno, apellido materno, correo, contraseña, genero");
    console.log("Adicionalmente existen los siguientes campos opcionales");
    console.log("run, digito verificador, fecha de nacimiento, telefono y observaciones");
    console.log("Si no desea ingresar alguno de los campos opcionales, solo presione enter");
    let nombres = (0, utility_1.prompts)("Ingrese los nombres: ");
    let apellidoPaterno = (0, utility_1.prompts)("Ingrese el apellido paterno: ");
    let apellidoMaterno = (0, utility_1.prompts)("Ingrese el apellido materno: ");
    let correo;
    let genero;
    let run;
    while (true) {
        correo = (0, utility_1.prompts)("Ingrese el correo: ");
        if ((0, utility_1.validateEmail)(correo)) {
            break;
        }
        else {
            console.log("Correo invalido");
        }
    }
    let selectables = ["Masculino", "Femenino", "No-binario", "Prefiero no responder"];
    while (true) {
        console.log("Ingrese su genero");
        console.log("1) Masculino");
        console.log("2) Femenino");
        console.log("3) No-binario");
        console.log("4) Prefiero no responder");
        genero = (0, utility_1.prompts)("Ingrese una opcion: ");
        if (genero == "1" || genero == "2" || genero == "3" || genero == "4") {
            genero = selectables[parseInt(genero) - 1];
            break;
        }
        else {
            console.log("Opcion invalida");
        }
    }
    while (true) {
        run = (0, utility_1.prompts)("Ingrese el run: ");
        if ((0, utility_1.validateRun)(run)) {
            break;
        }
        else {
            console.log("Run invalido");
        }
    }
    let fechaNacimiento = (0, utility_1.birthDateGetter)();
    let digitoVerificador = (0, utility_1.calculateDv)(run);
    let telefono = (0, utility_1.prompts)("Ingrese el telefono: ");
    let observaciones = (0, utility_1.prompts)("Ingrese las observaciones: ");
    const userData = {
        "email": correo,
        "names": nombres,
        "lastName": apellidoPaterno,
        "secondLastName": apellidoMaterno,
        "run": Number(run),
        "dv": digitoVerificador,
        "gender": genero,
        "birthday": fechaNacimiento,
        "telephone": telefono,
        "observation": observaciones
    };
    try {
        const record = await utility_1.client.collection('patients').create(userData);
        console.log("Usuario creado exitosamente");
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
    manejarUsuarios();
}
async function verTodosLosUsuarios(i, j) {
    console.clear();
    console.log("Cargando los primeros 5 usuarios");
    const resultList = await utility_1.client.collection('users').getList(i, j);
    let resultMatrix = (0, utility_1.listParser)(resultList, ["id", "names", "email"]);
    console.log((0, utility_1.table)(resultMatrix));
    console.log("1) Ver mas usuarios");
    console.log("2) Salir");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            if (resultList.length < resultList.totalItems) {
                verTodosLosUsuarios(i + 5, j + 5);
            }
            else {
                console.log("No hay mas usuarios");
                manejarUsuarios();
            }
            break;
        case "2":
            manejarUsuarios();
            break;
        default:
            console.log("Opcion invalida");
            verTodosLosUsuarios(i, j);
            break;
    }
    ;
}
function administrarTests() {
    console.log("1) Ver tests");
    console.log("2) Agregar un test");
    console.log("3) Actualizar un test");
    console.log("4) Eliminar un test");
    console.log("5) Salir");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            verTests(1, 5);
            break;
        case "2":
            agregarTest();
            break;
        case "3":
            actualizarTest();
            break;
        case "4":
            //eliminarTest();
            break;
        case "5":
            menuPsicologo();
            break;
        default:
            console.log("Opcion invalida");
            administrarTests();
            break;
    }
    ;
}
async function verTests(i, j) {
    console.clear();
    console.log("Cargando los primeros 5 tests");
    const resultList = await utility_1.client.collection('tests').getList(i, j);
    let resultMatrix = (0, utility_1.listParser)(resultList, ["id", "name", "observation"]);
    console.log((0, utility_1.table)(resultMatrix));
    console.log("1) Ver mas tests");
    console.log("2) Salir");
    var opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            if (resultList.perPage < resultList.totalItems) {
                verTests(i + 5, j + 5);
                break;
            }
            else {
                console.log("No hay mas tests");
                administrarTests();
                break;
            }
        case "2":
            administrarTests();
            break;
        default:
            console.log("Opcion invalida");
            verTests(i, j);
            break;
    }
    ;
}
async function agregarTest() {
    console.clear();
    console.log("Ingrese los siguientes datos");
    console.log("Los campos obligatorios son: Nombre, puntaje de corte, puntaje maximo y rango de edad");
    console.log("Campos opcionales: Observaciones");
    let nombre;
    let puntajeCorte;
    let puntajeMaximo;
    let rangoEdad;
    let observaciones;
    while (true) {
        nombre = (0, utility_1.prompts)("Ingrese el nombre del test: ");
        if (nombre != "") {
            break;
        }
        else {
            console.log("El nombre no puede estar vacio");
        }
    }
    while (puntajeCorte == undefined) {
        puntajeCorte = Number((0, utility_1.prompts)("Ingrese el puntaje de corte: "));
        if (puntajeCorte == undefined) {
            console.log("El puntaje de corte debe ser un numero");
        }
    }
    while (puntajeMaximo == undefined) {
        puntajeMaximo = Number((0, utility_1.prompts)("Ingrese el puntaje maximo: "));
        if (puntajeMaximo == undefined) {
            console.log("El puntaje maximo debe ser un numero");
        }
    }
    while (true) {
        rangoEdad = (0, utility_1.prompts)("Ingrese el rango de edad: ");
        //rangoEdad must follow the format "x-y" where x and y are numbers
        if (rangoEdad != "" && rangoEdad.match(/^[0-9]+-[0-9]+$/)) {
            break;
        }
        else {
            console.log("El rango de edad no puede estar vacio");
        }
    }
    observaciones = (0, utility_1.prompts)("Ingrese las observaciones: ");
    const test = {
        "name": nombre,
        "cut_point": puntajeCorte,
        "max_point": puntajeMaximo,
        "ageRange": rangoEdad,
        "observation": observaciones
    };
    let data;
    try {
        const record = await utility_1.client.collection('tests').create(test);
        data = record.id;
        console.log("Test creado exitosamente");
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
    console.log("1) Agregar otro test");
    console.log("2) Modificar el test actual");
    console.log("3) Agregar preguntas al test actual");
    console.log("4) Salir");
    let opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
    switch (opcion) {
        case "1":
            agregarTest();
            break;
        case "2":
            actualizarTest(data);
            break;
        case "3":
            //agregarPreguntas();
            break;
        case "4":
            administrarTests();
            break;
        default:
            console.log("Opcion invalida");
            agregarTest();
            break;
    }
}
async function actualizarTest(id) {
    if (id == undefined) {
        console.clear();
        //ask fo id or to exit
        console.log("ingrese el id del test que desea modificar");
        console.log("o ingrese enter para salir");
        id = (0, utility_1.prompts)("Ingrese el id: ");
        if (id == "") {
            administrarTests();
            return;
        }
    }
    let check = false;
    const record = await utility_1.client.collection('tests').getOne(id);
    let data = {
        name: record.name,
        cut_point: record.cut_point,
        max_point: record.max_point,
        ageRange: record.ageRange,
        observation: record.observation
    };
    while (check == false) {
        console.log("Ingrese que campos desea modificar");
        console.log("1) Nombre");
        console.log("2) Puntaje de corte");
        console.log("3) Puntaje maximo");
        console.log("4) Rango de edad");
        console.log("5) Observaciones");
        console.log("6) Salir");
        let opcion = (0, utility_1.prompts)("Ingrese una opcion: ");
        switch (opcion) {
            case "1":
                console.log("Ingrese el nuevo nombre");
                while (true) {
                    let nombre = (0, utility_1.prompts)("Ingrese el nombre: ");
                    if (nombre != "") {
                        data.name = nombre;
                        break;
                    }
                    else {
                        console.log("El nombre no puede estar vacio");
                    }
                }
                break;
            case "2":
                console.log("Ingrese el nuevo puntaje de corte");
                while (true) {
                    let puntajeCorte = Number((0, utility_1.prompts)("Ingrese el puntaje de corte: "));
                    if (puntajeCorte != undefined) {
                        data.cut_point = puntajeCorte;
                        break;
                    }
                    else {
                        console.log("El puntaje de corte debe ser un numero");
                    }
                }
                break;
            case "3":
                console.log("Ingrese el nuevo puntaje maximo");
                while (true) {
                    //check also that puntaje maximo is greater than puntaje corte
                    let puntajeMaximo = Number((0, utility_1.prompts)("Ingrese el puntaje maximo: "));
                    if (puntajeMaximo != undefined && puntajeMaximo > data.cut_point) {
                        data.max_point = puntajeMaximo;
                        break;
                    }
                    else {
                        console.log("El puntaje maximo debe ser un numero");
                    }
                }
                break;
            case "4":
                console.log("Ingrese el nuevo rango de edad");
                while (true) {
                    let rangoEdad = (0, utility_1.prompts)("Ingrese el rango de edad: ");
                    if (rangoEdad != "" && rangoEdad.match(/^[0-9]+-[0-9]+$/)) {
                        data.ageRange = rangoEdad;
                        break;
                    }
                    else {
                        console.log("El rango de edad no puede estar vacio");
                    }
                }
                break;
            case "5":
                console.log("Ingrese las nuevas observaciones");
                let observaciones = (0, utility_1.prompts)("Ingrese las observaciones: ");
                data.observation = observaciones;
                break;
            case "6":
                break;
            default:
                console.log("Opcion invalida");
                continue;
        }
        try {
            await utility_1.client.collection('tests').update(id, data);
            console.table(data);
            console.log("Test actualizado exitosamente");
        }
        catch (error) {
            let errorArray = (0, utility_1.errorParser)(error);
            while (errorArray.length > 0) {
                console.log(errorArray.pop());
            }
        }
        console.log("1) Modificar otro campo");
        console.log("2) Salir");
        let opt = (0, utility_1.prompts)("Ingrese una opcion: ");
        switch (opt) {
            case "1":
                continue;
            case "2":
                administrarTests();
                check = true;
                break;
            default:
                console.log("Opcion invalida");
                continue;
        }
    }
}
//# sourceMappingURL=psicologos.js.map
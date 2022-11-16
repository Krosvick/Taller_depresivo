"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listParser = exports.errorParser = exports.birthDateGetter = exports.calculateDv = exports.validateRun = exports.usernameCreator = exports.validateEmail = exports.PocketBase = exports.client = exports.table = exports.prompts = void 0;
const PocketBase = require('pocketbase/cjs');
exports.PocketBase = PocketBase;
const prompts = require('prompt-sync')();
exports.prompts = prompts;
const client = new PocketBase('http://127.0.0.1:8090');
exports.client = client;
const { table } = require('table');
exports.table = table;
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
exports.validateEmail = validateEmail;
function usernameCreator(name, lastname) {
    let username = name.substring(0, 3) + lastname.substring(0, 3) + Math.floor(Math.random() * 1000);
    return username;
}
exports.usernameCreator = usernameCreator;
function validateRun(run) {
    const re = /^\d{7,8}$/;
    return re.test(run);
}
exports.validateRun = validateRun;
function calculateDv(run) {
    //Calcular digito verificador segun rut
    let suma = 0;
    let multiplicador = 2;
    for (let i = run.length - 1; i >= 0; i--) {
        suma += Number(run[i]) * multiplicador;
        multiplicador++;
        if (multiplicador == 8) {
            multiplicador = 2;
        }
    }
    let resto = suma % 11;
    let dv = 11 - resto;
    if (dv == 11) {
        dv = 0;
    }
    return dv;
}
exports.calculateDv = calculateDv;
function dateFormatter(date) {
    let dateArray = date.split("/");
    let day = dateArray[0];
    let month = dateArray[1];
    if (month.length < 2) {
        month = "0" + month;
    }
    let year = dateArray[2];
    let utcDate = year + "-" + month + "-" + day + " 00:00:00";
    return utcDate;
}
function birthDateGetter() {
    let fechaNacimiento;
    let mes;
    let dia;
    let año;
    while (true) {
        while (true) {
            mes = prompts("Ingrese el mes de nacimiento: ");
            mes = Number(mes);
            if (mes >= 1 && mes <= 12) {
                break;
            }
            else {
                console.log("Mes invalido");
            }
        }
        while (true) {
            //verify if the month has 31 days
            if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
                dia = prompts("Ingrese el dia de nacimiento: ");
                dia = Number(dia);
                if (dia >= 1 && dia <= 31) {
                    break;
                }
                else {
                    console.log("Dia invalido");
                }
            }
            //verify if the month has 30 days
            else if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
                dia = prompts("Ingrese el dia de nacimiento: ");
                dia = Number(dia);
                if (dia >= 1 && dia <= 30) {
                    break;
                }
                else {
                    console.log("Dia invalido");
                }
            }
            //verify if the month is february
            else if (mes == 2) {
                dia = prompts("Ingrese el dia de nacimiento: ");
                dia = Number(dia);
                if (dia >= 1 && dia <= 28) {
                    break;
                }
                else {
                    console.log("Dia invalido");
                }
            }
        }
        while (true) {
            año = prompts("Ingrese el año de nacimiento: ");
            año = Number(año);
            if (año >= 1900 && año <= 2020) {
                break;
            }
            else {
                console.log("Año invalido");
            }
        }
        let fechaNacimientoUnform = dia + "/" + mes + "/" + año;
        fechaNacimiento = dateFormatter(fechaNacimientoUnform);
        console.log("Su fecha de nacimiento es: " + fechaNacimientoUnform);
        let confirmacion = prompts("¿Es correcta? (s/n): ");
        if (confirmacion == "s") {
            return fechaNacimiento;
        }
    }
    return fechaNacimiento;
}
exports.birthDateGetter = birthDateGetter;
function errorParser(error) {
    let errorArray = [];
    let errorObject = error.data.data;
    for (let property in errorObject) {
        errorArray.push(property + ": " + errorObject[property].message);
    }
    return errorArray;
}
exports.errorParser = errorParser;
//function that gets a list object and returns an array of the required propertys
//there can be many required propertys such as id, name, etc
//list.items is an array of objects and we may require several properties from each object
//if for example id and name is required it will be returned as a matrix
//such as [[id1, name1], [id2, name2], [id3, name3]]
function listParser(list, requiredPropertys) {
    let listArray = [];
    for (let i = 0; i < list.items.length; i++) {
        let itemArray = [];
        for (let j = 0; j < requiredPropertys.length; j++) {
            itemArray.push(list.items[i][requiredPropertys[j]]);
        }
        listArray.push(itemArray);
    }
    return listArray;
}
exports.listParser = listParser;
//# sourceMappingURL=utility.js.map
import { Record } from "pocketbase";
import {prompts, table, validateEmail, client, birthDateGetter, calculateDv, usernameCreator, validateRun, errorParser, listParser} from "./utility"
//Referencia
/*async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}*/

export function menuPsicologo(){
  console.log("1) Administrar tests"); 
  console.log("2) ver encuestas realizadas");
  console.log("3) Manejar usuarios");
  console.log("4) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
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
      client.authStore.clear();
      break;
    default:
      console.log("Opcion invalida");
      menuPsicologo();
      break;
  };
}

//**seccion de manejo de usuarios
function manejarUsuarios(){
  console.log("1) Ver todos los usuarios");
  console.log("2) Agregar un usuario");
  console.log("3) Eliminar un usuario");
  console.log("4) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
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
  };
}

async function agregarUsuario(){
  console.clear();
  console.log("Para ingresar un usuario se requiere de los siguientes campos");
  console.log("Nombres, apellido paterno, apellido materno, correo, contraseña, genero");
  console.log("Adicionalmente existen los siguientes campos opcionales");
  console.log("run, digito verificador, fecha de nacimiento, telefono y observaciones");
  console.log("Si no desea ingresar alguno de los campos opcionales, solo presione enter");
  let nombres = prompts("Ingrese los nombres: ");
  let apellidoPaterno = prompts("Ingrese el apellido paterno: ");
  let apellidoMaterno = prompts("Ingrese el apellido materno: ");
  let correo;
  let genero;
  let run;
  while(true){
    correo = prompts("Ingrese el correo: ");
    if(validateEmail(correo)){
      break;
    }else{
      console.log("Correo invalido");
    }
  }
  let selectables = ["Masculino", "Femenino", "No-binario", "Prefiero no responder"];
  while(true){
    console.log("Ingrese su genero");
    console.log("1) Masculino");
    console.log("2) Femenino");
    console.log("3) No-binario");
    console.log("4) Prefiero no responder");
    genero = prompts("Ingrese una opcion: ");
    if(genero == "1" || genero == "2" || genero == "3" || genero == "4"){
      genero = selectables[parseInt(genero)-1];
      break;
    }else{
      console.log("Opcion invalida");
    } 
  }
  while(true){
    run = prompts("Ingrese el run: ");
    if(validateRun(run)){
      break;
    }else{
      console.log("Run invalido");
    }
  }
  let fechaNacimiento = birthDateGetter(); 
  let digitoVerificador = calculateDv(run);
  let telefono = prompts("Ingrese el telefono: ");
  let observaciones = prompts("Ingrese las observaciones: ");
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
    "observation" : observaciones
  } 
  try{
    const record = await client.collection('patients').create(userData);
    console.log("Usuario creado exitosamente");
  }catch(error){
    let errorArray = errorParser(error);
    while(errorArray.length > 0){
      console.log(errorArray.pop());
    } 
  }
  manejarUsuarios();
}
async function verTodosLosUsuarios(){
  console.clear();
  console.log("Cargando los primeros 5 usuarios");
  const resultList = await client.collection('users').getList(1,5);
  /*for(let i = 0; i < resultList.length; i++){
    console.log(resultList[i].names + " " + resultList[i].lastName + " " + resultList[i].secondLastName + " "+ 
    resultList[i].username);
  }*/
  console.log("1) Ver mas usuarios");
  console.log("2) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      //verMasUsuarios();
      break;
    case "2":
      manejarUsuarios();
      break;
    default:
      console.log("Opcion invalida");
      verTodosLosUsuarios();
      break;
  };
}

//**Seccion de Tests
function administrarTests(){
  console.log("1) Ver tests");
  console.log("2) Agregar un test");
  console.log("3) Actualizar un test");
  console.log("4) Eliminar un test");
  console.log("5) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      verTests(1,5);
      break;
    case "2":
      //agregarTest();
      break;
    case "3":
      //actualizarTest();
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
  };
}
async function verTests(i: number, j: number){
  console.clear();
  console.log("Cargando los primeros 5 tests");
  const resultList = await client.collection('tests').getList(i,j);
  let resultMatrix = listParser(resultList, ["id", "name", "observation"]); 
  console.log(table(resultMatrix));
  console.log("1) Ver mas tests");
  console.log("2) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      if (resultList.perPage < resultList.totalItems){
      verTests(i+5,j+5);
      break;
      }else{
        console.log("No hay mas tests");
        administrarTests();
        break;
      }
    case "2":
      administrarTests(); 
      break;
    default:
      console.log("Opcion invalida");
      verTests(i,j);
      break;
  };
}
async function agregarTest(){
  console.clear();
  console.log("Ingrese los siguientes datos");
  

}
const PocketBase = require('pocketbase/cjs');
const prompts = require('prompt-sync')();
const client = new PocketBase('http://127.0.0.1:8090');
//Referencia
/*async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}*/



function menuPsicologo(){
  console.clear();
  console.log("1) Ver tests"); 
  console.log("2) ver encuestas realizadas");
  console.log("3) Manejar usuarios");
  console.log("4) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      //verTests();
      break;
    case "2":
      //verEncuestasRealizadas();
      break;
    case "3":
      //manejarUsuarios();
      break;
    case "4":
      console.log("Gracias por usar el sistema de encuestas");
      break;
    default:
      console.log("Opcion invalida");
      menuPsicologo();
      break;
  };
}

function verTests(){
  console.clear();
  console.log("1) Ver todos los tests");
  console.log("2) Agregar un test");
  console.log("3) Eliminar un test");
  console.log("4) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      //verTodosLosTests();
      break;
    case "2":
      //agregarTest();
      break;
    case "3":
      //eliminarTest();
      break;
    case "4":
      menuPsicologo();
      break;
    default:
      console.log("Opcion invalida");
      verTests();
      break;
  };
}
function manejarUsuarios(){
  console.clear();
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
  while(true){
    let correo = prompts("Ingrese el correo: ");
    if(validateEmail(correo)){
      break;
    }else{
      console.log("Correo invalido");
    }
  }
  while(true){
    let contraseña = prompts("Ingrese la contraseña: ");
    if(validatePassword(contraseña)){
      break;
    }
    else{
      console.log("Contraseña invalida");
    }
  }
  let selectables = ["Masculino", "Femenino", "No-binario", "Prefiero no responder"];
  while(true){
    console.log("Ingrese su genero");
    console.log("1) Masculino");
    console.log("2) Femenino");
    console.log("3) No-binario");
    console.log("4) Prefiero no responder");
    let genero = prompts("Ingrese una opcion: ");
    if(genero == "1" || genero == "2" || genero == "3" || genero == "4"){
      genero = selectables[parseInt(genero)-1];
      break;
    }else{
      console.log("Opcion invalida");
    } 
  }
}


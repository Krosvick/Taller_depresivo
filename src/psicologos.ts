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
  console.log("Nombres, apellido paterno, apellido materno, correo, contraseña y rol");
  console.log("Ingrese los datos del usuario");
  let nombre = prompts("Nombre: ");
  let apellidoPaterno = prompts("Apellido paterno: ");
  let apellidoMaterno = prompts("Apellido materno: ");
  let correo;
  while(true){
    correo = prompts("Correo: ");
    if (validateEmail(correo)) {
      break;
    } else {
      console.log("Correo invalido");
    }
  } 
  let contraseña;
  while(true){
    contraseña = prompts("Contraseña: ");
    if (contraseña.length >= 6) {
      break;
    } else {
      console.log("La contraseña debe tener al menos 6 caracteres");
    }
  }
  let rol;
  while(true){
    let rol = prompts("Rol: ");
    if (rol == "Patient" || rol == "Professional") {
      break;
    } else {
      console.log("El rol debe ser Patient o Professional");
    }
  }
  const user = await client.users.create({
    names: nombre,
    last_Name: apellidoPaterno,
    mother_last_name: apellidoMaterno,
    email: correo,
    password: contraseña,
    passwordConfirm: contraseña,
    role: rol
  });
  console.log(user);
}

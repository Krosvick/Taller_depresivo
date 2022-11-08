const PocketBase = require('pocketbase/cjs');
const prompts = require('prompt-sync')();
const client = new PocketBase('http://127.0.0.1:8090');
//Referencia
/*async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}*/

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
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


async function loginUsuario(){
  console.log("Ingrese su correo electronico"); 
  var email = prompts("Correo: ");
  console.log("Ingrese su contraseña");
  var password = prompts("Contraseña: ");
  const userData = await client.users.authViaEmail(email, password);
  console.clear();
  console.log("Bienvenido " + userData.name);
  if (userData.role == "Patient") {
    return true;
  } else {
    return false;
  }
}

async function loginAdmin() {
  console.log("Ingrese su correo electronico");
  var email = prompts("Correo: ");
  console.log("Ingrese su contraseña");
  var password = prompts("Contraseña: ");
  try{
    const adminData = await client.admins.authViaEmail(email, password);
    console.clear();
    console.log("Bienvenido " + adminData.admin.id);
  } catch (error) {
    console.log("Error");
  }
  menuAdmin();
};

function login(){
  console.clear();
  console.log("Bienvenido al sistema de encuestas");
  console.log("1) Iniciar sesion de usuario");
  console.log("2) Iniciar sesion de administrador");
  console.log("3) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      let tipo = loginUsuario();
      break;
    case "2":
      loginAdmin();
      break;
    case "3": 
      console.log("Gracias por usar el sistema de encuestas");
      break;
    default:
      console.log("Opcion invalida");
      login();
      break;
  }

}
function menuUsuario(){
  console.clear();
  console.log("1) Ver encuestas disponibles");
  console.log("2) Ver encuestas realizadas");
  console.log("3) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
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
  };
}
function menuPsicologo(){
  console.clear();
  console.log("1) ") 
}
function menuAdmin(){
  console.log("1) Agregar Usuario"); 
  console.log("2) Eliminar Usuario");
  let opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      agregarUsuario();
      break;
    case "2":
      //eliminarUsuario();
      break;
    default:
      console.log("Opcion invalida");
      menuAdmin();
      break;
  }
}
login();


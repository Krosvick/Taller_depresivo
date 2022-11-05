const PocketBase = require('pocketbase/cjs');
const client = new PocketBase('http://127.0.0.1:8090');

async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}

async function loginUsuario() {
  console.log("Ingrese su correo electronico"); 
  var email = prompt("Correo: ");
  console.log("Ingrese su contraseña");
  var password = prompt("Contraseña: ");
  const userData = await client.users.authViaEmail(email, password);
  console.clear();
  console.log("Bienvenido " + userData.name);
};

async function loginAdmin() {
  console.log("Ingrese su correo electronico");
  var email = prompt("Correo: ");
  console.log("Ingrese su contraseña");
  var password = prompt("Contraseña: ");
  const adminData = await client.admins.authViaEmail(email, password);
  console.clear();
  console.log("Bienvenido " + adminData.name);
};

function login(){
  //clear console
  console.clear();
  console.log("Bienvenido al sistema de encuestas");
  console.log("1) Iniciar sesion de usuario");
  console.log("2) Iniciar sesion de administrador");
  console.log("3) Salir");
  var opcion = prompt("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      loginUsuario();
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


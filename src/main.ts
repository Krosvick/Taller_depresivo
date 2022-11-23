import {prompts} from "./utility";
import {loginPsicologo} from "./logins";
function init(){
  console.clear();
  console.log("Bienvenido al sistema de encuestas");
  console.log("1) Iniciar sesion");
  console.log("2) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      loginPsicologo();
      break;
    case "2": 
      console.log("Gracias por usar el sistema de encuestas");
      break;
    default:
      console.log("Opcion invalida");
      init();
      break;
  }

}
init();
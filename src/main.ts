function init(){
  console.clear();
  console.log("Bienvenido al sistema de encuestas");
  console.log("1) Iniciar sesion de usuario");
  console.log("2) Iniciar sesion de psicologo");
  console.log("3) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      loginUsuario();
      break;
    case "2":
      break;
    case "3": 
      console.log("Gracias por usar el sistema de encuestas");
      break;
    default:
      console.log("Opcion invalida");
      init();
      break;
  }

}
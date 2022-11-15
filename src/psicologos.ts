import {prompts, validatePassword, validateEmail, client, birthDateGetter, calculateDv, usernameCreator, validateRun} from "./utility"
//Referencia
/*async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}*/



export function menuPsicologo(){
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
  let correo;
  let contraseña;
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
  while(true){
    contraseña = prompts("Ingrese la contraseña: ");
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
    const record = await client.collection('users').create(userData);
    console.log("Usuario creado exitosamente");
  }catch(error){
    console.log(error);
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

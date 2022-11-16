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
  console.log("4) Salir del programa");
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
  console.log("4) Salir del menu de usuarios");
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
async function verTodosLosUsuarios(i: number, j: number){
  console.clear();
  console.log("Cargando los primeros 5 usuarios");
  const resultList = await client.collection('users').getList(i,j);
  let resultMatrix = listParser(resultList, ["id", "names", "email"]);
  console.log(table(resultMatrix));
  console.log("1) Ver mas usuarios");
  console.log("2) Salir");
  var opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
    case "1":
      if(resultList.length < resultList.totalItems){
        verTodosLosUsuarios(i+5, j+5);
      }else{
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
  };
}

//**Seccion de Tests
//create test type
type Test = {
  name: string,
  cut_point: number,
  max_point: number,
  observation: string,
  ageRange: string
}

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
      agregarTest();
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
  console.log("Los campos obligatorios son: Nombre, puntaje de corte, puntaje maximo y rango de edad");
  console.log("Campos opcionales: Observaciones");
  let nombre: string;
  let puntajeCorte: number;
  let puntajeMaximo: number;
  let rangoEdad: string;
  let observaciones: string;
  while (true){
    nombre = prompts("Ingrese el nombre del test: ");
    if (nombre != ""){
      break;
    }else{
      console.log("El nombre no puede estar vacio");
    }
  }
  while(puntajeCorte == undefined){
    puntajeCorte = Number(prompts("Ingrese el puntaje de corte: "));
    if (puntajeCorte == undefined){
      console.log("El puntaje de corte debe ser un numero");
    } 
  }
  while(puntajeMaximo == undefined){
    puntajeMaximo = Number(prompts("Ingrese el puntaje maximo: "));
    if (puntajeMaximo == undefined){
      console.log("El puntaje maximo debe ser un numero");
    }
  }
  while (true){
    rangoEdad = prompts("Ingrese el rango de edad: ");
    //rangoEdad must follow the format "x-y" where x and y are numbers
    if (rangoEdad != "" && rangoEdad.match(/^[0-9]+-[0-9]+$/)){
      break;
    }else{
      console.log("El rango de edad no puede estar vacio");
    }
  }
  observaciones = prompts("Ingrese las observaciones: ");
  const test = {
    "name": nombre,
    "cut_point": puntajeCorte,
    "max_point": puntajeMaximo,
    "ageRange": rangoEdad,
    "observation": observaciones
  }
  let data;
  try{
    const record = await client.collection('tests').create(test);
    data = record.id;
    console.log("Test creado exitosamente");
  }catch(error){
    let errorArray = errorParser(error);
    while(errorArray.length > 0){
      console.log(errorArray.pop());
    }
  }
  console.log("1) Agregar otro test");
  console.log("2) Modificar el test actual");
  console.log("3) Agregar preguntas al test actual");
  console.log("4) Salir");
  let opcion = prompts("Ingrese una opcion: ");
  switch(opcion){
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
async function actualizarTest(id?: string){
  if (id == undefined){
    console.clear();
    console.log("Ingrese el id del test a modificar");
    id = prompts("Ingrese el id: ");
  }
  const record = await client.collection('tests').getOne(id);
  let data: Test = {
    name: record.name,
    cut_point: record.cut_point,
    max_point: record.max_point,
    ageRange: record.ageRange,
    observation: record.observation
  }
  while(true){
    console.log("Ingrese que campos desea modificar");
    console.log("1) Nombre");
    console.log("2) Puntaje de corte");
    console.log("3) Puntaje maximo");
    console.log("4) Rango de edad");
    console.log("5) Observaciones");
    console.log("6) Salir");
    let opcion = prompts("Ingrese una opcion: ");
    switch(opcion){
      case "1":
        console.log("Ingrese el nuevo nombre");
        while (true){
          let nombre = prompts("Ingrese el nombre: ");
          if (nombre != ""){
            data.name = nombre;
            break;
          }else{
            console.log("El nombre no puede estar vacio");
          }
        }
      case "2":
        console.log("Ingrese el nuevo puntaje de corte");
        while(true){
          let puntajeCorte = Number(prompts("Ingrese el puntaje de corte: "));
          if (puntajeCorte != undefined){
            data.cut_point = puntajeCorte;
            break;
          }else{
            console.log("El puntaje de corte debe ser un numero");
          }
        }
      case "3":
        console.log("Ingrese el nuevo puntaje maximo");
        while(true){
          //check also that puntaje maximo is greater than puntaje corte
          let puntajeMaximo = Number(prompts("Ingrese el puntaje maximo: "));
          if (puntajeMaximo != undefined && puntajeMaximo > data.cut_point){
            data.max_point = puntajeMaximo;
            break;
          }else{
            console.log("El puntaje maximo debe ser un numero");
          }
        }
      case "4":
        console.log("Ingrese el nuevo rango de edad");
        while (true){
          let rangoEdad = prompts("Ingrese el rango de edad: ");
          if (rangoEdad != "" && rangoEdad.match(/^[0-9]+-[0-9]+$/)){
            data.ageRange = rangoEdad;
            break;
          }else{
            console.log("El rango de edad no puede estar vacio");
          }
        }
      case "5":
        console.log("Ingrese las nuevas observaciones");
        let observaciones = prompts("Ingrese las observaciones: ");
        data.observation = observaciones;
      case "6":
        break;
      default:
        console.log("Opcion invalida");
        break;
    }
  }
}
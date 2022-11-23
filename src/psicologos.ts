import { prompts, inquirer, table, validateEmail, client, birthDateGetter, calculateDv, usernameCreator, validateRun, errorParser, listParser, filterParser } from './utility'
// Referencia
/* async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
} */

export function menuPsicologo () {
  console.log('1) Administrar tests')
  console.log('2) ver encuestas realizadas')
  console.log('3) Manejar usuarios')
  console.log('4) Salir del programa')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      administrarTests()
      break
    case '2':
      // verEncuestasRealizadas();
      break
    case '3':
      manejarPacientes()
      break
    case '4':
      console.log('Gracias por usar el sistema de encuestas')
      client.authStore.clear()
      return;
    default:
      console.log('Opcion invalida')
      menuPsicologo()
      break
  };
}

//* *seccion de manejo de usuarios
function manejarPacientes () {
  console.log('1) Ver los primeros 5 pacientes')
  console.log('2) Agregar un paciente')
  console.log('3) Actualizar un paciente')
  console.log('4) Eliminar un paciente')
  console.log('5) Salir del menu de pacientes')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return fetchPacientes(0,5)
    case '2':
      return agregarUsuario();
    case '3':
      //return actualizarUsuario();
    case '4':
      //return eliminarUsuario();
    case '5':
      return menuPsicologo();
    default:
      console.log('Opcion invalida')
      manejarPacientes()
      break
  };
}

async function agregarUsuario () {
  console.clear()
  console.log('Para ingresar un usuario se requiere de los siguientes campos')
  console.log('Nombres, apellido paterno, apellido materno, correo, contraseña, genero')
  console.log('Adicionalmente existen los siguientes campos opcionales')
  console.log('run, digito verificador, fecha de nacimiento, telefono y observaciones')
  console.log('Si no desea ingresar alguno de los campos opcionales, solo presione enter')
  const nombres = prompts('Ingrese los nombres: ')
  const apellidoPaterno = prompts('Ingrese el apellido paterno: ')
  const apellidoMaterno = prompts('Ingrese el apellido materno: ')
  let correo
  let genero
  let run
  while (true) {
    correo = prompts('Ingrese el correo: ')
    if (validateEmail(correo)) {
      break
    } else {
      console.log('Correo invalido')
    }
  }
  const selectables = ['Masculino', 'Femenino', 'No-binario', 'Prefiero no responder']
  while (true) {
    console.log('Ingrese su genero')
    console.log('1) Masculino')
    console.log('2) Femenino')
    console.log('3) No-binario')
    console.log('4) Prefiero no responder')
    genero = prompts('Ingrese una opcion: ')
    if (genero === '1' || genero === '2' || genero === '3' || genero ==='4') {
      genero = selectables[parseInt(genero) - 1]
      break
    } else {
      console.log('Opcion invalida')
    }
  }
  while (true) {
    run = prompts('Ingrese el run: ')
    if (validateRun(run)) {
      break
    } else {
      console.log('Run invalido')
    }
  }
  const fechaNacimiento = birthDateGetter()
  const digitoVerificador = calculateDv(run)
  const telefono = prompts('Ingrese el telefono: ')
  const observaciones = prompts('Ingrese las observaciones: ')
  const userData = {
    email: correo,
    names: nombres,
    lastName: apellidoPaterno,
    secondLastName: apellidoMaterno,
    run: Number(run),
    dv: digitoVerificador,
    gender: genero,
    birthday: fechaNacimiento,
    telephone: telefono,
    observation: observaciones
  }
  try {
    const record = await client.collection('patients').create(userData)
    console.log('Usuario creado exitosamente')
  } catch (error) {
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
  }
  return manejarPacientes()
}
async function fetchPacientes(i: number,j: number) {
  const resultList = await client.collection('patients').getList(i,j)
  return verTodosLosUsuarios(resultList)
}
async function verTodosLosUsuarios (resultList:any) {
  console.clear()
  console.log('Cargando los primeros 5 usuarios')
  const resultMatrix = listParser(resultList, ['id', 'names', 'email'])
  console.log(table(resultMatrix))
  console.log('1) Ver mas usuarios')
  console.log('2) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      if (resultList.page < resultList.totalPages) {
        resultList.page += 1
         return verTodosLosUsuarios(resultList)
      } else {
        console.log('No hay mas usuarios')
        manejarPacientes()
      }
      break
    case '2':
      return manejarPacientes()
    default:
      console.log('Opcion invalida')
      return verTodosLosUsuarios(resultList)
  };
}

//* *Seccion de Tests
interface Test {
  name: string
  cut_point: number
  max_point: number
  observation: string
  ageRange: string
}
interface question {
  'content': string
  'description': string
  'test_id': string[]
}
interface answer {
  'points': number
  'content': string
  'observation': string
  'question_id': string[]
  'test_id': string[]
}

function administrarTests () {
  console.log('1) Ver tests')
  console.log('2) Agregar un test')
  console.log('3) Actualizar un test')
  console.log('4) Eliminar un test')
  console.log('5) Menu de preguntas')
  console.log('6) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return fetchTests(0,5)
    case '2':
      agregarTest()
      break
    case '3':
      actualizarTest()
      break
    case '4':
      // eliminarTest();
      break
    case '5':
      return administradorPreguntas(); 
    case '6':
      return menuPsicologo();
    default:
      console.log('Opcion invalida')
      administrarTests()
      break
  };
}
async function fetchTests(i: number,j: number) {
  const resultList = await client.collection('tests').getList(i,j)
  return verTests(resultList)
}
async function verTests (resultList) {
  console.clear()
  console.log('Cargando los primeros 5 tests')
  const resultMatrix = listParser(resultList, ['id', 'name', 'observation'])
  console.log(table(resultMatrix))
  console.log('1) Ver mas tests')
  console.log('2) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      if (resultList.page < resultList.totalPages) {
        resultList.page += 1
        return verTests(resultList)
      } else {
        console.log('No hay mas tests')
        return administrarTests();
      }
    case '2':
      administrarTests()
      break
    default:
      console.log('Opcion invalida')
      return verTests(resultList)
  };
}
async function agregarTest () {
  console.clear()
  console.log('Ingrese los siguientes datos')
  console.log('Los campos obligatorios son: Nombre, puntaje de corte, puntaje maximo y rango de edad')
  console.log('Campos opcionales: Observaciones')
  let data :Test = {} as Test
  while (true) {
    data.name = prompts('Ingrese el nombre del test: ')
    if (data.name !== '') {
      break
    } else {
      console.log('El nombre no puede estar vacio')
    }
  }
  while (data.cut_point ===  undefined) {
    data.cut_point = Number(prompts('Ingrese el puntaje de corte: '))
    if (data.cut_point == undefined) {
      console.log('El puntaje de corte debe ser un numero')
    }
  }
  while (data.max_point === undefined) {
    data.max_point = Number(prompts('Ingrese el puntaje maximo: '))
    if (data.max_point === undefined) {
      console.log('El puntaje maximo debe ser un numero')
    }
  }
  while (true) {
    data.ageRange = prompts('Ingrese el rango de edad: ')
    if (data.ageRange !== '' && data.ageRange.match(/^[0-9]+-[0-9]+$/)) {
      break
    } else {
      console.log('El rango de edad no puede estar vacio')
    }
  }
  data.observation = prompts('Ingrese las observaciones: ')
  let testId
  try{
    const record = await client.collection('tests').create(data)
    testId = record.id
    console.log('Test creado exitosamente')
  } catch (error) {
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
    console.log('No se pudo crear el test')
    return administrarTests()
  }
  console.log('1) Agregar otro test')
  console.log('2) Modificar el test actual')
  console.log('3) Agregar preguntas al test actual')
  console.log('4) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return agregarTest();
    case '2':
      actualizarTest(testId)
      break
    case '3':
      // agregarPreguntas();
      break
    case '4':
      administrarTests()
      break
    default:
      console.log('Opcion invalida')
      agregarTest()
      break
  }
}
async function actualizarTest (id?: string) {
  if (id == undefined) {
    console.clear()
    console.log('ingrese el id del test que desea modificar')
    console.log('o ingrese enter para salir')
    id = prompts('Ingrese el id: ')
    if (id == '') {
      return administrarTests() 
    }
  }
  let check = false
  let record;
  try {
    record = await client.collection('tests').getOne(id)
  } catch (error) {
    console.log('No se encontro el test')
    return actualizarTest()
  }
  const data: Test = {
    name: record.name,
    cut_point: record.cut_point,
    max_point: record.max_point,
    ageRange: record.ageRange,
    observation: record.observation
  }
  while (!check) {
    console.log('Ingrese que campos desea modificar')
    console.log('1) Nombre')
    console.log('2) Puntaje de corte')
    console.log('3) Puntaje maximo')
    console.log('4) Rango de edad')
    console.log('5) Observaciones')
    console.log('6) Salir')
    const opcion = prompts('Ingrese una opcion: ')
    switch (opcion) {
      case '1':
        console.log('Ingrese el nuevo nombre')
        while (true) {
          const nombre = prompts('Ingrese el nombre: ')
          if (nombre != '') {
            data.name = nombre
            break
          } else {
            console.log('El nombre no puede estar vacio')
          }
        }
        break
      case '2':
        console.log('Ingrese el nuevo puntaje de corte')
        while (true) {
          const puntajeCorte = Number(prompts('Ingrese el puntaje de corte: '))
          if (puntajeCorte != undefined) {
            data.cut_point = puntajeCorte
            break
          } else {
            console.log('El puntaje de corte debe ser un numero')
          }
        }
        break
      case '3':
        console.log('Ingrese el nuevo puntaje maximo')
        while (true) {
          // check also that puntaje maximo is greater than puntaje corte
          const puntajeMaximo = Number(prompts('Ingrese el puntaje maximo: '))
          if (puntajeMaximo != undefined && puntajeMaximo > data.cut_point) {
            data.max_point = puntajeMaximo
            break
          } else {
            console.log('El puntaje maximo debe ser un numero')
          }
        }
        break
      case '4':
        console.log('Ingrese el nuevo rango de edad')
        while (true) {
          const rangoEdad = prompts('Ingrese el rango de edad: ')
          if (rangoEdad != '' && rangoEdad.match(/^[0-9]+-[0-9]+$/)) {
            data.ageRange = rangoEdad
            break
          } else {
            console.log('El rango de edad no puede estar vacio')
          }
        }
        break
      case '5':
        console.log('Ingrese las nuevas observaciones')
        const observaciones = prompts('Ingrese las observaciones: ')
        data.observation = observaciones
        break
      case '6':
        break
      default:
        console.log('Opcion invalida')
        continue
    }
    try {
      await client.collection('tests').update(id, data)
      console.table(data)
      console.log('Test actualizado exitosamente')
    } catch (error) {
      const errorArray = errorParser(error)
      while (errorArray.length > 0) {
        console.log(errorArray.pop())
      }
    }
    console.log('1) Modificar otro campo')
    console.log('2) Salir')
    const opt = prompts('Ingrese una opcion: ')
    switch (opt) {
      case '1':
        continue
      case '2':
        return administrarTests()
      default:
        console.log('Opcion invalida')
        continue
    }
  }
}
async function administradorPreguntas (id?: string) {
  while(true) {
    if (id == undefined) {
      console.clear()
      console.log('ingrese el id del test al que desea agregar preguntas')
      console.log('o ingrese enter para salir')
      id = prompts('Ingrese el id: ')
      if (id == '') {
        return administrarTests()
      }
    }
    try{
      const test = await client.collection('tests').getOne(id)
      break
    } catch (error) {
      console.log('No se encontro el test')
      continue
    }
  }
  let check = false
  while (!check) {
    console.log('1) Administrar preguntas')
    console.log('2) Salir')
    const opcion = prompts('Ingrese una opcion: ')
    switch (opcion) {
      case '1':
        return menuPreguntas(id)
      case '2':
        administrarTests()
        check = true
        break
      default:
        console.log('Opcion invalida')
        continue
    }
  }
}
async function menuPreguntas (idTest?: string) {
  console.clear()
  console.log('1) Agregar pregunta')
  console.log('2) Modificar pregunta')
  console.log('3) Eliminar pregunta')
  console.log('4) Menu de respuestas')
  console.log('5) Ver preguntas')
  console.log('6) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      // agregarPregunta(id);
      break
    case '2':
      // modificarPregunta(id);
      break
    case '3':
      // eliminarPregunta(id);
      break
    case '4':
      return menuRespuesta(idTest);
    case '5':
      // return verPreguntas(id);
    case '6':
      return administradorPreguntas(idTest)
    default:
      console.log('Opcion invalida')
      menuPreguntas(idTest)
  }
}
async function fetchPreguntas (idTest: string, i: number, j: number) {
  const preguntas = await client.collection('questions').getList(i,j,{
    filter: `test_id = ${idTest}`,})
  return preguntas
}
async function agregarPregunta (id: string) {
  let addQuestion: question;
  console.log('Ingrese los datos de la pregunta')
  while (true) {
    const pregunta = prompts('Ingrese la pregunta: ')
    if (pregunta != '') {
      addQuestion.content = pregunta
      break
    } else {
      console.log('La pregunta no puede estar vacia')
    }
  }
  console.log('Ingrese una descripcion de la pregunta')
  console.log('opcional, ingrese enter para omitir')
  const descripcion = prompts('Ingrese la descripcion: ')
  addQuestion.description = descripcion
  // add id to addQuestion objecc as test_id wich is an array
  addQuestion.test_id[0] = id
  let idPregunta;
  try{
    const res = await client.collection('questions').create(addQuestion);
    idPregunta = res.id;
    console.log('Pregunta agregada exitosamente')
  }catch(error){
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
    console.log('1) Reintentar')
    console.log('2) Salir')
    const opt = prompts('Ingrese una opcion: ')
    switch (opt) {
      case '1':
        return agregarPregunta(id)
      case '2':
        return menuPreguntas()
      default:
        console.log('Opcion invalida') 
        return agregarPregunta(id)
    }
  }
  console.log('1)Agregar respuestas')
  console.log('2)Agregar otra pregunta')
  console.log('3)Salir')
  const opt = prompts('Ingrese una opcion: ')
  switch (opt) {
    case '1':
      return menuRespuesta(idPregunta,id);
    case '2':
      return agregarPregunta(id)
    case '3':
      return menuPreguntas(id)
    default:
      console.log('Opcion invalida')
      return menuPreguntas(id)
  }

}

async function menuRespuesta(idTest: string, idPregunta?:string) {
  while(true){
    if (idPregunta == undefined) {
      console.clear()
      console.log('Ingrese el id de la pregunta a la que desea agregar respuestas')
      console.log('o ingrese enter para salir')
      idPregunta = prompts('Ingrese el id: ')
      if (idPregunta == '') {
        return menuPreguntas(idTest)
      }
    }
    try{
      const res = await client.collection('questions').getOne(idPregunta);
      break
    } catch(error){
      console.log( "El id de la pregunta no existe")
      continue
    }
  }
  //* verificar que no se pasen del puntaje maximo
  console.clear()
  console.log('1) Agregar respuesta')
  console.log('2) Modificar respuesta')
  console.log('3) Eliminar respuesta')
  console.log('4) Ver respuestas')
  console.log('4) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return agregarRespuesta(idPregunta,idTest);
    case '2':
      // return modificarRespuesta(idPregunta,idTest);
    case '3':
      // return eliminarRespuesta(idPregunta,idTest);
    case '4':
      //return verRespuestas(idPregunta,idTest);
    default:
      console.log('Opcion invalida')
      return menuRespuesta(idPregunta,idTest);
  }
}
async function agregarRespuesta(idPregunta: string, idTest:string) {
  //this function will check first if there are answers to the question
  //if there are answers it will ask if you want to add tge answer to the question
  //or if you want to add a completely new answer
  const answerCheck = await client.collection('answers').getFullList(200,{
    filter: `question_id.id = "${idPregunta}"`,
  })
  if(answerCheck.length >0){
    console.log("1)agregar respuesta ya existente")
    console.log("2)agregar nueva respuesta")
    const opt = prompts("Ingrese una opcion: ")
    switch (opt) {
      case '1':
        return agregarRespuestaExistente(idPregunta,idTest, answerCheck);
      case '2':
        return agregarNuevaRespuesta(idPregunta,idTest)
      default:
        console.log("Opcion invalida")
        return agregarRespuesta(idPregunta,idTest)
    }
  }
}
async function agregarRespuestaExistente(idPregunta:string,idTest:string, list:string){
  console.clear()
  let res;
  console.log("las respuestas disponibles son: ")
  let answerDisplay = filterParser(list, ["content","points","id"])
  console.log(table(answerDisplay))
  console.log("Ingrese el id de la respuesta que desea agregar")
  const idRespuesta = prompts("Ingrese el id: ")
  try{
    res = await client.collection('answers').getOne(idRespuesta);
  }catch(error){
    console.log("El id de la respuesta no existe")
    return agregarRespuestaExistente(idPregunta,idTest, list)
  }
  let data: answer = {
    points: res.points,
    content: res.content,
    observation: res.observation,
    question_id: res.question_id,
    test_id: res.test_id,
  }
  for(let i = 0; i < data.question_id.length; i++){
    if(data.question_id[i] == idPregunta){
      console.log("La respuesta ya esta agregada a la pregunta")
      return menuRespuesta(idPregunta,idTest)
    }
  }
  data.question_id.push(idPregunta);
  try{
    await client.collection('answers').update(idRespuesta,data);
    console.log("Respuesta agregada exitosamente")
  }catch(error){
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
    console.log("Ocurrio un error al agregar la respuesta")
    return agregarRespuestaExistente(idPregunta,idTest, list)
    
  }
  return menuRespuesta(idPregunta,idTest)

}
async function agregarNuevaRespuesta(idPregunta:string,idTest:string){
  console.clear()
  let addAnswer: answer;
}
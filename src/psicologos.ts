import { prompts, inquirer, table, validateEmail, client, birthDateGetter, calculateDv, usernameCreator, validateRun, errorParser, listParser, filterParser, calculateAge } from './utility'
// Referencia
/* async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
} */
// client.authStore.baseModel.id
interface patient {
  names: string
  email: string
  lastName: string
  secondLastName: string
  run: number
  dv: number
  gender: string
  birthday: string
  telephone: string
  observation: string
  psychologists_id: string
}

export function menuPsicologo () {
  console.log('1) Administrar tests')
  console.log('2) ver encuestas realizadas')
  console.log('3) Manejar usuarios')
  console.log('4) Salir del programa')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return administrarTests()
    case '2':
      return fetchPolls(0, 5)
    case '3':
      return manejarPacientes()
    case '4':
      console.log('Gracias por usar el sistema de encuestas')
      client.authStore.clear()
      return
    default:
      console.log('Opcion invalida')
      return menuPsicologo()
  };
}
async function fetchPolls (i: number, j: number) {
  const resultList = await client.collection('polls').getList(i, j)
  return verEncuestas(resultList)
}
async function verEncuestas (resultList: any) {
  console.clear()
  const resultMatrix = filterParser(resultList, ['id', 'result', 'test_id', 'patients_id', 'observation'])
  console.log(table(resultMatrix))
  console.log('1) Ver mas encuestas')
  console.log('2) Volver al menu')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      if (resultList.page < resultList.total_pages) {
        resultList.page += 1
        return fetchPolls(resultList.page, resultList.per_page)
      } else {
        console.log('No hay mas encuestas')
        return menuPsicologo()
      }
    case '2':
      return menuPsicologo()
    default:
      console.log('Opcion invalida')
      return verEncuestas(resultList)
  };
}
//* *seccion de manejo de usuarios
function manejarPacientes () {
  console.log('1) Ver los primeros 5 pacientes')
  console.log('2) Agregar un paciente')
  console.log('3) Actualizar un paciente')
  console.log('4) Eliminar un paciente')
  console.log('5) Encuestar a un paciente')
  console.log('6) Salir del menu de pacientes')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return fetchPacientes(0, 5)
    case '2':
      return agregarUsuario()
    case '3':
      return actualizarUsuario()
    case '4':
      return eliminarUsuario()
    case '5':
      return encuestarUsuario()
    case '6':
      return menuPsicologo()
    default:
      console.log('Opcion invalida')
      return manejarPacientes()
  };
}
async function actualizarUsuario () {
  console.clear()
  const check = false
  console.log('Ingrese el id del usuario a actualizar')
  const res = await client.collection('patients').getFullList(200, {
    filter: `psychologists_id = "${client.authStore.baseModel.id}"`
  })
  const resultMatrix = filterParser(res, ['id', 'names', 'email'])
  console.log(table(resultMatrix))
  const id = prompts('Ingrese el id: ')
  const record = await client.collection('patients').getOne(id)
  const patient: patient = {
    names: record.names,
    email: record.email,
    lastName: record.lastName,
    secondLastName: record.secondLastName,
    run: record.run,
    dv: record.dv,
    gender: record.gender,
    birthday: record.birthday,
    telephone: record.telephone,
    observation: record.observation,
    psychologists_id: record.psychologists_id
  }
  outside:
  while (!check) {
    console.clear()
    console.log('1) Nombre')
    console.log('2) Apellido')
    console.log('3) Segundo apellido')
    console.log('4) Rut')
    console.log('5) Genero')
    console.log('6) Fecha de nacimiento')
    console.log('7) Telefono')
    console.log('8) Observacion')
    console.log('9) Salir')
    const opcion = prompts('Ingrese una opcion: ')
    switch (opcion) {
      case '1':
        patient.names = prompts('Ingrese el nombre: ')
        break outside
      case '2':
        patient.lastName = prompts('Ingrese el apellido: ')
        break outside
      case '3':
        patient.secondLastName = prompts('Ingrese el segundo apellido: ')
        break outside
      case '4':
        patient.run = Number(prompts('Ingrese el rut: '))
        patient.dv = calculateDv(patient.run)
        break outside
      case '5':
        const selectables = ['Masculino', 'Femenino', 'No-binario', 'Prefiero no responder']
        while (true) {
          console.log('Ingrese el genero')
          console.log('1) Masculino')
          console.log('2) Femenino')
          console.log('3) No-binario')
          console.log('4) Prefiero no responder')
          const opcion = prompts('Ingrese una opcion: ')
          if (opcion == '1' || opcion == '2' || opcion == '3' || opcion == '4') {
            patient.gender = selectables[Number(opcion) - 1]
            break outside
          } else {
            console.log('Opcion invalida')
          }
        }
        break
      case '6':
        patient.birthday = birthDateGetter()
        break outside
      case '7':
        patient.telephone = prompts('Ingrese el telefono: ')
        break outside
      case '8':
        patient.observation = prompts('Ingrese la observacion: ')
        break outside
      case '9':
        return manejarPacientes()
    }
  }
  try {
    const res = await client.collection('patients').update(id, patient)
    console.table(patient)
    console.log('Usuario actualizado')
  } catch (error) {
    console.log(error)
  }
  return manejarPacientes()
}
async function eliminarUsuario () {
  console.clear()
  console.log('Ingrese el id del usuario a eliminar')
  const res = await client.collection('patients').getFullList(200, {
    filter: `psychologists_id = "${client.authStore.baseModel.id}"`
  })
  const resultMatrix = filterParser(res, ['id', 'names', 'email'])
  console.log(table(resultMatrix))
  const id = prompts('Ingrese el id: ')
  try {
    const res = await client.collection('patients').delete(id)
    console.log('Usuario eliminado')
  } catch (error) {
    console.log(error)
  }
  return manejarPacientes()
}
async function encuestarUsuario () {
  let id
  let fechaNA
  console.clear()
  console.log('Ingrese el id del usuario a encuestar')
  const res = await client.collection('patients').getFullList(200, {
    filter: `psychologists_id = "${client.authStore.baseModel.id}"`
  })
  const resultMatrix = filterParser(res, ['id', 'names', 'email'])
  console.log(table(resultMatrix))
  while (true) {
    id = prompts('Ingrese el id: ')
    try {
      const record = await client.collection('patients').getOne(id)
      fechaNA = record.birthday
      console.log('Usuario:' + record.names)
      break
    } catch (error) {
      console.log('Id invalido')
      return manejarPacientes()
    }
  }
  const age = calculateAge(fechaNA)
  let tests
  try {
    tests = await client.collection('tests').getFullList(200)
  } catch (error) {
    console.log('No hay tests disponibles')
    return manejarPacientes()
  }
  const testMatrix = filterParser(tests, ['id', 'name'])
  console.log(table(testMatrix))
  const testId = prompts('Ingrese el id del test: ')
  let testElegido
  let preguntasTest
  try {
    testElegido = await client.collection('tests').getOne(testId)
    preguntasTest = await client.collection('questions').getFullList(200, {
      filter: `tests_id.id = "${testId}"`
    })
  } catch (error) {
    console.log('Id invalido')
    return manejarPacientes()
  }
  console.log('Test:' + testElegido.name)
  const preguntasTestMatrix = filterParser(preguntasTest, ['id', 'content'])
  const puntajeObtenido = await rondaPreguntas(preguntasTestMatrix)
  console.log('Puntaje obtenido: ' + puntajeObtenido)
  console.log('Puntaje maximo: ' + testElegido.max_point)
  console.log('Puntaje de corte: ' + testElegido.cut_point)
  console.log('Ingrese una observacion o presione enter para continuar')
  const observacion = prompts('Observacion: ')
  console.log('Guardando el registro...')
  const data = {
    patients_id: id,
    tests_id: [testId],
    result: puntajeObtenido,
    observation: observacion
  }

  const record = await client.collection('polls').create(data)
  console.log('Registro guardado')
  return manejarPacientes()
}
async function rondaPreguntas (preguntasTestMatrix: any) {
  let puntajeObtenido = 0
  for (let i = 0; i < preguntasTestMatrix.length; i++) {
    const pregunta = preguntasTestMatrix[i]
    const respuestas = await client.collection('answers').getFullList(200, {
      filter: `question_id.id = "${pregunta[0]}"`
    })
    const respuestasMatrix = filterParser(respuestas, ['id', 'content', 'points'])
    console.log(pregunta[1])
    for (let i = 0; i < respuestasMatrix.length; i++) {
      const respuesta = respuestasMatrix[i]
      console.log(`${i + 1}) ${respuesta[1]}`)
    }
    while (true) {
      const respuestaElegida = prompts('Ingrese el numero de la respuesta: ')
      if (respuestaElegida > respuestasMatrix.length) {
        console.log('Opcion invalida')
        continue
      }
      const respuesta = respuestasMatrix[respuestaElegida - 1]
      puntajeObtenido += respuesta[2]
      break
    }
  }
  return puntajeObtenido
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
    if (genero === '1' || genero === '2' || genero === '3' || genero === '4') {
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
    observation: observaciones,
    psychologists_id: client.authStore.baseModel.id
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
async function fetchPacientes (i: number, j: number) {
  const resultList = await client.collection('patients').getList(i, j)
  return verTodosLosUsuarios(resultList)
}
async function verTodosLosUsuarios (resultList: any) {
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
        return manejarPacientes()
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
  'tests_id': string
}
interface answer {
  'points': number
  'content': string
  'observation': string
  'question_id': string[]
  'test_id': string
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
      return fetchTests(0, 5)
    case '2':
      agregarTest()
      break
    case '3':
      actualizarTest()
      break
    case '4':
      eliminarTest()
      break
    case '5':
      return administradorPreguntas()
    case '6':
      return menuPsicologo()
    default:
      console.log('Opcion invalida')
      return administrarTests()
  };
}
async function eliminarTest () {
  console.clear()
  console.log('Ingrese el id del test que desea eliminar')
  const id = prompts('Ingrese el id: ')
  try {
    await client.collection('tests').delete(id)
    console.log('Test eliminado exitosamente')
  } catch (error) {
    console.log(error)
  }
  return administrarTests()
}
async function fetchTests (i: number, j: number) {
  const resultList = await client.collection('tests').getList(i, j)
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
        return administrarTests()
      }
    case '2':
      return administrarTests()
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
  const data: Test = {} as Test
  while (true) {
    data.name = prompts('Ingrese el nombre del test: ')
    if (data.name !== '') {
      break
    } else {
      console.log('El nombre no puede estar vacio')
    }
  }
  while (data.cut_point === undefined) {
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
  try {
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
      return agregarTest()
    case '2':
      return actualizarTest(testId)
    case '3':
      return administradorPreguntas(testId)
    case '4':
      return administrarTests()
    default:
      console.log('Opcion invalida')
      return agregarTest()
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
  const check = false
  let record
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
  outside:
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
        break outside
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
        break outside
      case '3':
        console.log('Ingrese el nuevo puntaje maximo')
        while (true) {
          const puntajeMaximo = Number(prompts('Ingrese el puntaje maximo: '))
          if (puntajeMaximo != undefined && puntajeMaximo > data.cut_point) {
            data.max_point = puntajeMaximo
            break
          } else {
            console.log('El puntaje maximo debe ser un numero')
          }
        }
        break outside
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
        break outside
      case '5':
        console.log('Ingrese las nuevas observaciones')
        const observaciones = prompts('Ingrese las observaciones: ')
        data.observation = observaciones
        break outside
      case '6':
        return administrarTests()
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
  while (true) {
    if (id == undefined) {
      console.clear()
      console.log('ingrese el id del test al que desea agregar preguntas')
      console.log('o ingrese enter para salir')
      id = prompts('Ingrese el id: ')
      if (id == '') {
        return administrarTests()
      }
    }
    try {
      const test = await client.collection('tests').getOne(id)
      break
    } catch (error) {
      console.log('No se encontro el test')
      id = undefined
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
      return agregarPregunta(idTest)
    case '2':
      return actualizarPregunta(idTest)
    case '3':
      return eliminarPregunta()
    case '4':
      return menuRespuesta(idTest)
    case '5':
      return fetchPreguntas(idTest, 0, 5)
    case '6':
      return administrarTests()
    default:
      console.log('Opcion invalida')
      menuPreguntas(idTest)
  }
}
async function verPreguntas (resultList: any) {
  console.clear()
  console.table('Cargando las primeras 5 preguntas')
  const resultMatrix = listParser(resultList, ['id', 'content', 'description'])
  console.log(table(resultMatrix))
  console.log('1) Ver mas preguntas')
  console.log('2) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      if (resultList.page < resultList.totalPages) {
        resultList.page += 1
        return verPreguntas(resultList)
      } else {
        console.log('No hay mas preguntas')
        return menuPreguntas()
      }
    case '2':
      return menuPreguntas()
    default:
      console.log('Opcion invalida')
      return administrarTests()
  }
}
async function actualizarPregunta (idTest: string) {
  console.clear()
  console.log('Ingrese el id de la pregunta que desea modificar')
  console.log('o ingrese enter para salir')
  const id = prompts('Ingrese el id: ')
  if (id == '') {
    return menuPreguntas(idTest)
  }
  let pregunta
  try {
    pregunta = await client.collection('questions').getOne(id)
    if (pregunta.test_id != idTest) {
      console.log('La pregunta no pertenece al test')
      return actualizarPregunta(idTest)
    }
  } catch (error) {
    console.log('No se encontro la pregunta')
    return actualizarPregunta(idTest)
  }
  const data: question = {
    content: pregunta.content,
    description: pregunta.description,
    tests_id: pregunta.test_id
  }
  outside: while (true) {
    console.log('1) Modificar contenido')
    console.log('2) Modificar descripcion')
    console.log('3) Salir')
    const opcion = prompts('Ingrese una opcion: ')
    switch (opcion) {
      case '1':
        console.log('Ingrese el nuevo contenido')
        while (true) {
          const contenido = prompts('Ingrese el contenido: ')
          if (contenido != '') {
            data.content = contenido
            break
          } else {
            console.log('El contenido no puede estar vacio')
          }
        }
        break outside
      case '2':
        console.log('Ingrese la nueva descripcion')
        const descripcion = prompts('Ingrese la descripcion: ')
        data.description = descripcion
        break outside
      case '3':
        return menuPreguntas(idTest)
      default:
        console.log('Opcion invalida')
        continue
    }
    try {
      await client.collection('questions').update(id, data)
      console.table(data)
      console.log('Pregunta actualizada exitosamente')
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
        return menuPreguntas(idTest)
      default:
        console.log('Opcion invalida')
        continue
    }
  }
}
async function eliminarPregunta () {
  console.clear()
  console.log('Ingrese el id de la pregunta que desea eliminar')
  console.log('o ingrese enter para salir')
  const id = prompts('Ingrese el id: ')
  if (id == '') {
    return menuPreguntas()
  }
  try {
    await client.collection('questions').delete(id)
    console.log('Pregunta eliminada exitosamente')
  } catch (error) {
    console.log('No se encontro la pregunta')
  }
  const opt = prompts('Desea eliminar otra pregunta? (y/n): ')
  if (opt == 'y') {
    return eliminarPregunta()
  } else {
    return menuPreguntas()
  }
}
async function fetchPreguntas (idTest: string, i: number, j: number) {
  const preguntas = await client.collection('questions').getList(i, j, { filter: `test_id = ${idTest}` })
  return verPreguntas(preguntas)
}
async function agregarPregunta (id: string) {
  const idTest = id
  const addQuestion: question = {} as question
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
  addQuestion.tests_id = idTest
  let idPregunta
  try {
    const res = await client.collection('questions').create(addQuestion)
    idPregunta = res.id
    console.log('Pregunta agregada exitosamente')
  } catch (error) {
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
      return menuRespuesta(id, idPregunta)
    case '2':
      return agregarPregunta(id)
    case '3':
      return menuPreguntas(id)
    default:
      console.log('Opcion invalida')
      return menuPreguntas(id)
  }
}

async function menuRespuesta (idTest: string, idPregunta?: string) {
  while (true) {
    if (idPregunta == undefined) {
      console.clear()
      console.log('Ingrese el id de la pregunta a la que desea agregar respuestas')
      console.log('o ingrese enter para salir')
      idPregunta = prompts('Ingrese el id: ')
      if (idPregunta == '') {
        return menuPreguntas(idTest)
      }
    }
    try {
      const res = await client.collection('questions').getOne(idPregunta)
      break
    } catch (error) {
      console.log('El id de la pregunta no existe')
      idPregunta = undefined
      return menuRespuesta(idTest)
    }
  }
  console.clear()
  console.log('1) Agregar respuesta')
  console.log('2) Modificar respuesta')
  console.log('3) Eliminar respuesta')
  console.log('4) Ver respuestas')
  console.log('5) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return agregarRespuesta(idPregunta, idTest)
    case '2':
      return actualizarRespuesta(idPregunta, idTest)
    case '3':
      return eliminarRespuesta(idPregunta, idTest)
    case '4':
      return fetchRespuestas(idPregunta, 0, 5, idTest)
    case '5':
      return menuPreguntas(idTest)
    default:
      console.log('Opcion invalida')
      return menuRespuesta(idTest, idPregunta)
  }
}
async function actualizarRespuesta (idPregunta, idTest) {
  console.clear()
  console.log('Ingrese el id de la respuesta que desea modificar')
  console.log('o ingrese enter para salir')
  const id = prompts('Ingrese el id: ')
  if (id == '') {
    return menuRespuesta(idTest, idPregunta)
  }
  let res
  try {
    res = await client.collection('answers').getOne(id)
  } catch (error) {
    console.log('No se encontro la respuesta')
    return actualizarRespuesta(idPregunta, idTest)
  }
  const data: answer = {
    question_id: res.question_id,
    points: res.points,
    content: res.content,
    observation: res.observation,
    test_id: res.test_id
  }
  console.log('Que campo desea modificar?')
  console.log('1) Contenido')
  console.log('2) Puntos')
  console.log('3) Observacion')
  console.log('4) Salir')
  const opt = prompts('Ingrese una opcion: ')
  switch (opt) {
    case '1':
      console.log('Ingrese el nuevo contenido de la respuesta')
      const content = prompts('Ingrese el contenido: ')
      data.content = content
      break
    case '2':
      console.log('Ingrese los nuevos puntos de la respuesta')
      const points = prompts('Ingrese los puntos: ')
      data.points = points
      break
    case '3':
      console.log('Ingrese la nueva observacion de la respuesta')
      const observation = prompts('Ingrese la observacion: ')
      data.observation = observation
      break
    case '4':
      return menuRespuesta(idTest, idPregunta)
    default:
      console.log('Opcion invalida')
      return actualizarRespuesta(idPregunta, idTest)
  }
  try {
    await client.collection('answers').update(id, data)
    console.log('Respuesta actualizada exitosamente')
  } catch (error) {
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
    console.log('1) Reintentar')
    console.log('2) Salir')
    const opt = prompts('Ingrese una opcion: ')
    switch (opt) {
      case '1':
        return actualizarRespuesta(idPregunta, idTest)
      case '2':
        return menuRespuesta(idPregunta, idTest)
      default:
        console.log('Opcion invalida')
        return actualizarRespuesta(idPregunta, idTest)
    }
  }
  console.log('1) Modificar otra respuesta')
  console.log('2) Salir')
  const opcion = prompts('Ingrese una opcion: ')
  switch (opcion) {
    case '1':
      return actualizarRespuesta(idPregunta, idTest)
    case '2':
      return menuRespuesta(idTest, idPregunta)
    default:
      console.log('Opcion invalida')
      return actualizarRespuesta(idPregunta, idTest)
  }
}
async function fetchRespuestas (idPregunta: string, i: number, j: number, idTest: string) {
  const respuestas = await client.collection('answers').getList(i, j, { filter: `question_id = ${idPregunta}` })
  return verRespuestas(respuestas, idTest, idPregunta)
}
async function verRespuestas (resultList: any, idTest: string, idPregunta: string) {
  console.clear()
  console.log('cargando las primeras 5 respuestas')
  const resultMatrix = listParser(resultList, ['id', 'content', 'points'])
  console.log(table(resultMatrix))
  console.log('1) Ver mas respuestas')
  console.log('2) Salir')
  const opt = prompts('Ingrese una opcion: ')
  switch (opt) {
    case '1':
      if (resultList.page < resultList.total_pages) {
        resultList.page += 1
        return verRespuestas(resultList, idTest, idPregunta)
      } else {
        console.log('No hay mas respuestas')
        return menuRespuesta(idPregunta, idTest)
      }
    case '2':
      return menuRespuesta(idPregunta, idTest)
    default:
      console.log('Opcion invalida')
      return verRespuestas(resultList, idTest, idPregunta)
  }
}
async function eliminarRespuesta (idPregunta: string, idTest: string) {
  console.clear()
  console.log('Ingrese el id de la respuesta que desea eliminar')
  console.log('o ingrese enter para salir')
  const id = prompts('Ingrese el id: ')
  if (id == '') {
    return menuRespuesta(idPregunta, idTest)
  }
  try {
    await client.collection('answers').delete(id)
    console.log('Respuesta eliminada exitosamente')
  } catch (error) {
    console.log('No se encontro la respuesta')
  }
  const opt = prompts('Desea eliminar otra respuesta? (y/n): ')
  if (opt == 'y') {
    return eliminarRespuesta(idPregunta, idTest)
  } else {
    return menuRespuesta(idPregunta, idTest)
  }
}
async function agregarRespuesta (idPregunta: string, idTest: string) {
  const answerCheck = await client.collection('answers').getFullList(200, {
    filter: `test_id.id = "${idTest}"`
  })
  if (answerCheck.length > 0) {
    console.log('1)agregar respuesta ya existente')
    console.log('2)agregar nueva respuesta')
    const opt = prompts('Ingrese una opcion: ')
    switch (opt) {
      case '1':
        return agregarRespuestaExistente(idPregunta, idTest, answerCheck)
      case '2':
        return agregarNuevaRespuesta(idPregunta, idTest)
      default:
        console.log('Opcion invalida')
        return agregarRespuesta(idPregunta, idTest)
    }
  } else {
    return agregarNuevaRespuesta(idPregunta, idTest)
  }
}
async function agregarRespuestaExistente (idPregunta: string, idTest: string, list: string) {
  console.clear()
  let res
  console.log('las respuestas disponibles son: ')
  const answerDisplay = filterParser(list, ['content', 'points', 'id'])
  console.log(table(answerDisplay))
  console.log('Ingrese el id de la respuesta que desea agregar')
  const idRespuesta = prompts('Ingrese el id: ')
  try {
    res = await client.collection('answers').getOne(idRespuesta)
  } catch (error) {
    console.log('El id de la respuesta no existe')
    return agregarRespuestaExistente(idPregunta, idTest, list)
  }
  const data: answer = {
    points: res.points,
    content: res.content,
    observation: res.observation,
    question_id: res.question_id,
    test_id: res.test_id
  }
  for (let i = 0; i < data.question_id.length; i++) {
    if (data.question_id[i] == idPregunta) {
      console.log('La respuesta ya esta agregada a la pregunta')
      return menuRespuesta(idTest)
    }
  }
  data.question_id.push(idPregunta)
  try {
    await client.collection('answers').update(idRespuesta, data)
    console.log('Respuesta agregada exitosamente')
  } catch (error) {
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
    console.log('Ocurrio un error al agregar la respuesta')
    return agregarRespuestaExistente(idPregunta, idTest, list)
  }
  return menuRespuesta(idTest, idPregunta)
}
async function agregarNuevaRespuesta (idPregunta: string, idTest: string) {
  console.clear()
  const addAnswer: answer = {} as answer
  while (true) {
    console.log('Ingrese el contenido de la respuesta')
    const content = prompts('Ingrese el contenido: ')
    if (content == '') {
      console.log('El contenido no puede estar vacio')
      continue
    }
    addAnswer.content = content
    break
  }
  while (true) {
    console.log('Ingrese el puntaje de la respuesta')
    const points = prompts('Ingrese el puntaje: ')
    if (points == '') {
      console.log('El puntaje no puede estar vacio')
      continue
    }
    addAnswer.points = Number(points)
    break
  }
  const observation = prompts('Ingrese una observacion: ')
  addAnswer.observation = observation
  addAnswer.question_id = [idPregunta]
  addAnswer.test_id = idTest
  try {
    await client.collection('answers').create(addAnswer)
    console.log('Respuesta agregada exitosamente')
  } catch (error) {
    const errorArray = errorParser(error)
    while (errorArray.length > 0) {
      console.log(errorArray.pop())
    }
    console.log('Ocurrio un error al agregar la respuesta')
    return agregarNuevaRespuesta(idTest, idPregunta)
  }
  return menuRespuesta(idTest, idPregunta)
}

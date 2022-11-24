const PocketBase = require('pocketbase/cjs')

const prompts = require('prompt-sync')()

const inquirer = require('inquirer')

const client = new PocketBase('http://127.0.0.1:8090')

const { table } = require('table')

function validateEmail (email) {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

function usernameCreator (name, lastname) {
  const username = name.substring(0, 3) + lastname.substring(0, 3) + Math.floor(Math.random() * 1000)
  return username
}
function validateRun (run: string) {
  const re = /^\d{7,8}$/
  return re.test(run)
}
function calculateDv (run): number {
  // Calcular digito verificador segun rut
  let suma = 0
  let multiplicador = 2
  for (let i = run.length - 1; i >= 0; i--) {
    suma += Number(run[i]) * multiplicador
    multiplicador++
    if (multiplicador == 8) {
      multiplicador = 2
    }
  }
  const resto = suma % 11
  let dv = 11 - resto
  if (dv == 11) {
    dv = 0
  }
  return dv
}

function dateFormatter (date: string): string {
  const dateArray = date.split('/')
  const day = dateArray[0]
  let month = dateArray[1]
  if (month.length < 2) {
    month = '0' + month
  }
  const year = dateArray[2]
  const utcDate = year + '-' + month + '-' + day + ' 00:00:00'
  return utcDate
}
//* Funcion para obtener fecha de nacimiento con verificacion de dias y meses
function birthDateGetter (): string {
  let fechaNacimiento: string
  let mes: number
  let dia: number
  let año: number
  while (true) {
    while (true) {
      mes = prompts('Ingrese el mes de nacimiento: ')
      mes = Number(mes)
      if (mes >= 1 && mes <= 12) {
        break
      } else {
        console.log('Mes invalido')
      }
    }
    while (true) {
      if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) {
        dia = prompts('Ingrese el dia de nacimiento: ')
        dia = Number(dia)
        if (dia >= 1 && dia <= 31) {
          break
        } else {
          console.log('Dia invalido')
        }
      } else if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
        dia = prompts('Ingrese el dia de nacimiento: ')
        dia = Number(dia)
        if (dia >= 1 && dia <= 30) {
          break
        } else {
          console.log('Dia invalido')
        }
      } else if (mes == 2) {
        dia = prompts('Ingrese el dia de nacimiento: ')
        dia = Number(dia)
        if (dia >= 1 && dia <= 28) {
          break
        } else {
          console.log('Dia invalido')
        }
      }
    }
    while (true) {
      año = prompts('Ingrese el año de nacimiento: ')
      año = Number(año)
      if (año >= 1900 && año <= 2020) {
        break
      } else {
        console.log('Año invalido')
      }
    }
    const fechaNacimientoUnform: string = dia + '/' + mes + '/' + año
    fechaNacimiento = dateFormatter(fechaNacimientoUnform)
    console.log('Su fecha de nacimiento es: ' + fechaNacimientoUnform)
    const confirmacion = prompts('¿Es correcta? (s/n): ')
    if (confirmacion == 's') {
      return fechaNacimiento
    }
  }
}
//* Funcion para listar errores de manera mas legible
function errorParser (error: any): string[] {
  const errorArray: string[] = []
  const errorObject = error.data.data
  for (const property in errorObject) {
    errorArray.push(property + ': ' + errorObject[property].message)
  }
  return errorArray
}
//* Funcion para listar elementos de una tabla
function listParser (list: any, requiredPropertys: string[]): any[] {
  const listArray: any[] = []
  for (let i = 0; i < list.items.length; i++) {
    const itemArray: any[] = []
    for (let j = 0; j < requiredPropertys.length; j++) {
      itemArray.push(list.items[i][requiredPropertys[j]])
    }
    listArray.push(itemArray)
  }
  return listArray
}
function filterParser(list: any, requiredPropertys: string[]): any[] {
  const listArray: any[] = []
  for (let i = 0; i < list.length; i++) {
    const itemArray: any[] = []
    for (let j = 0; j < requiredPropertys.length; j++) {
      itemArray.push(list[i][requiredPropertys[j]])
    }
    listArray.push(itemArray)
  }
  return listArray
}
function calculateAge(utc: string): number {
  const date = new Date(utc)
  const ageDifMs = Date.now() - date.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
export { prompts, inquirer, table, client, PocketBase, validateEmail, usernameCreator, validateRun, calculateDv, birthDateGetter, errorParser, listParser, filterParser, calculateAge }

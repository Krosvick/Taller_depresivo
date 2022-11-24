import { prompts, client, inquirer, validateEmail, errorParser } from './utility'
import { menuPsicologo } from './psicologos'

export async function loginPsicologo () {
  console.log('Ingrese su correo electronico')
  let email
  while (true) {
    email = prompts('Correo: ')
    if (validateEmail(email)) {
      break
    } else {
      console.log('Correo invalido, intente nuevamente')
    }
  }
  console.log('Ingrese su contraseña')
  const message = await inquirer.prompt({
    type: 'password',
    name: 'password',
    message: 'Contraseña: ',
    mask: '*'
  })
  try {
    const res = await client.collection('psychologists').authWithPassword(email, message.password)
    console.log('Bienvenido' + ' ' + res.record.names)
    return menuPsicologo()
  } catch (error) {
    console.log('Correo o contraseña invalidos')
    return loginPsicologo()
  }
}

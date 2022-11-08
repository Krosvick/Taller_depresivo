function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function validatePassword(password) {
    const re = /^\S{8,}$/;
    return re.test(password);
}
function usernameCreator(name, lastname){
    let username = name.substring(0, 3) + lastname.substring(0, 3) + Math.floor(Math.random() * 1000);
    return username; 
}
function validateRun(run) {
  const re = /^\d{7,8}$/;
  return re.test(run);
}
function calculateDv(run) {
  let sum = 0;
  let i = 0;
  let dv = 0;
  for (i = 0; i < run.length; i++) {
    sum += parseInt(run[i]) * (i + 2);
  }
  dv = 11 - (sum % 11);
  if (dv == 11) {
    dv = 0;
  }
  return dv;
}
function birthDateGetter(): string {
    let fechaNacimiento: string;
    let mes: number;
    let dia: number;
    let año: number;
    while(true){
        while(true){
            mes = prompts("Ingrese el mes de nacimiento: ");
            if(mes >= 1 && mes <= 12){
                break;
            }else{
                console.log("Mes invalido");
            }
        }
        while(true){
            //verify if the month has 31 days
            if(mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12){
                dia = prompts("Ingrese el dia de nacimiento: ");
                if(dia >= 1 && dia <= 31){
                    break;
                }else{
                    console.log("Dia invalido");
                }
            }
            //verify if the month has 30 days
            else if(mes == 4 || mes == 6 || mes == 9 || mes == 11){
                let dia = prompts("Ingrese el dia de nacimiento: ");
                if(dia >= 1 && dia <= 30){
                    break;
                }else{
                    console.log("Dia invalido");
                }
            }
            //verify if the month is february
            else if(mes == 2){
                let dia = prompts("Ingrese el dia de nacimiento: ");
                if(dia >= 1 && dia <= 28){
                    break;
                }else{
                    console.log("Dia invalido");
                }
            }
        }
        while(true){
            año = prompts("Ingrese el año de nacimiento: ");
            if(año >= 1900 && año <= 2020){
                break;
            }else{
                console.log("Año invalido");
            }
        }
        fechaNacimiento = año + "-" + mes + "-" + dia;
        let fechaNacimientoDisplay = dia + "/" + mes + "/" + año; 
        console.log("Su fecha de nacimiento es: " + fechaNacimientoDisplay); 
        let confirmacion = prompts("¿Es correcta? (s/n): ");
        if(confirmacion == "s"){
            break;
        }
    }
    return fechaNacimiento;
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

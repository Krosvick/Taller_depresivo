import {prompts, client, validateEmail, errorParser} from "./utility";
import { menuPsicologo } from "./psicologos";


export async function loginPsicologo(){
  console.log("Ingrese su correo electronico");
  let email;
  while(true){
    email = prompts("Correo: ");
    if(validateEmail(email)){
      break;
    }else{
      console.log("Correo invalido, intente nuevamente");
    }
  }  
  console.log("Ingrese su contraseña");
  let password = prompts("Contraseña: ");
  try{
    const res = await client.collection("psychologists").authWithPassword(email, password);
    console.log("Bienvenido" + " "+ res.record.names);
    menuPsicologo();
  }catch(error){
    console.log("Correo o contraseña invalidos");
    loginPsicologo();
  }
  
}
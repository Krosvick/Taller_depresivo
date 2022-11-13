import {prompts, client} from "./utility";
import { menuPsicologo } from "./psicologos";


export async function loginPsicologo(){
  console.log("Ingrese su correo electronico");
  var email = prompts("Correo: ");
  console.log("Ingrese su contraseña");
  var password = prompts("Contraseña: ");
  const res = await client.collection("psychologists").authWithPassword(email, password);
  console.log(res)
  if(res){
    console.log("Bienvenido");
    menuPsicologo();
  }else{
    console.log("Correo o contraseña invalidos");
  }
  
}
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function validatePassword(password) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
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

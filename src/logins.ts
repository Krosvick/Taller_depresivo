function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
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
async function loginAdmin() {
  console.log("Ingrese su correo electronico");
  var email = prompts("Correo: ");
  console.log("Ingrese su contraseña");
  var password = prompts("Contraseña: ");
  try{
    const adminData = await client.admins.authViaEmail(email, password);
    console.clear();
    console.log("Bienvenido " + adminData.admin.id);
  } catch (error) {
    console.log("Error");
  }
  menuAdmin();
};
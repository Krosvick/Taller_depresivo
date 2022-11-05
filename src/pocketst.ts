const PocketBase = require('pocketbase/cjs');
const client = new PocketBase('http://127.0.0.1:8090');
async function getAllRecords() {
  const adminData = await client.admins.authViaEmail("email@gmail.com", "password");
  const records = await client.records.getOne("preguntas", "hdtljd8anagvn6e" );
  console.log(records.contenido);
}

getAllRecords();


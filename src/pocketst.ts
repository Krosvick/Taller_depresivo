const PocketBase = require('pocketbase/cjs');
const client = new PocketBase('http://127.0.0.1:8090');
async function getAllRecords() {
  const records = await client.records.getFullList("preguntas", 1,50);
  console.log(records);
  let resultData=records.items;
  console.log(resultData);
}

getAllRecords();
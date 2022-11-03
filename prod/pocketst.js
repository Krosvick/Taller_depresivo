import PocketBase from 'pocketbase';
const client = new PocketBase('http://127.0.0.1:8090');
const records = await client.records.getFullList('preguntas', 200 /* batch size */, {
    sort: '-created',
});
console.log(records);
//# sourceMappingURL=pocketst.js.map
import {client, errorParser} from "./utility";
async function createRecord(collection: string, data: any) {
    try {
        const res = await client.collection(collection).create(data);
        return res;
    }
    catch (error) {
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }

}
async function updateRecord(collection: string, id: string, data: any) {
    try {
        const res = await client.collection(collection).update(id, data);
        return res;
    }
    catch (error) {
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }
}
async function deleteRecord(collection: string, id: string) {
    try{
        const res = await client.collection(collection).update(id, {delete_at: new Date()});
        return res;
    } catch(error){
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }
}
async function getRecord(collection: string, id: string) {
    try{
        const res = await client.collection(collection).getOne(id);
        return res;
    } catch(error){
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }
}
async function getAllRecords(collection: string) {
    try{
        const res = await client.collection(collection).getFullList(200);
        return res;
    } catch(error){
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }
}
async function getRecords(collection: string, i: number, j: number) {
    try{
        const res = await client.collection(collection).getList(i,j);
        return res;
    } catch(error){
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }
}
async function getRelations(collection:string, relation:string, filter:string){
    let res;
    let array = [];
    let rel = relation
    try{
        res = await client.collection(collection).getFullList(200);
    } catch(error){
        return array;
    }
    //loop through res.items[i].rel[id's] and save it into an array
    //rel is the name of the relation and it is a string
    //return array
    for(let i = 0; i < res.length; i++){
        for(let j = 0; j < res[i][rel].length; j++){
            if(res[i][rel][j] == filter){
                array.push(res[i]);
            }
        }
    }
    return array;

}
export {createRecord, updateRecord, deleteRecord, getRecord, getAllRecords, getRecords, getRelations};
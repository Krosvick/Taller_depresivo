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
export {createRecord, updateRecord, deleteRecord, getRecord, getAllRecords, getRecords};
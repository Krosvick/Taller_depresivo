import {client, errorParser} from "./utility";
async function createRecord(collection: string, data: any): Promise<string> {
    try {
        const res = await client.collection(collection).create(data);
        return res.id;
    }
    catch (error) {
        let errorArray = errorParser(error);
        while(errorArray.length > 0){
            console.log(errorArray.pop());
         }
    }

}
async function updateRecord(collection: string, id: string, data: any) {
}
async function deleteRecord(collection: string, id: string) {
}
async function getRecord(collection: string, id: string) {
}
async function getRecords(collection: string) {
}
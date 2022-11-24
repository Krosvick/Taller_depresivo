"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelations = exports.getRecords = exports.getAllRecords = exports.getRecord = exports.deleteRecord = exports.updateRecord = exports.createRecord = void 0;
const utility_1 = require("./utility");
async function createRecord(collection, data) {
    try {
        const res = await utility_1.client.collection(collection).create(data);
        return res;
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
}
exports.createRecord = createRecord;
async function updateRecord(collection, id, data) {
    try {
        const res = await utility_1.client.collection(collection).update(id, data);
        return res;
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
}
exports.updateRecord = updateRecord;
async function deleteRecord(collection, id) {
    try {
        const res = await utility_1.client.collection(collection).update(id, { delete_at: new Date() });
        return res;
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
}
exports.deleteRecord = deleteRecord;
async function getRecord(collection, id) {
    try {
        const res = await utility_1.client.collection(collection).getOne(id);
        return res;
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
}
exports.getRecord = getRecord;
async function getAllRecords(collection) {
    try {
        const res = await utility_1.client.collection(collection).getFullList(200);
        return res;
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
}
exports.getAllRecords = getAllRecords;
async function getRecords(collection, i, j) {
    try {
        const res = await utility_1.client.collection(collection).getList(i, j);
        return res;
    }
    catch (error) {
        let errorArray = (0, utility_1.errorParser)(error);
        while (errorArray.length > 0) {
            console.log(errorArray.pop());
        }
    }
}
exports.getRecords = getRecords;
async function getRelations(collection, relation, filter) {
    let res;
    let array = [];
    let rel = relation;
    try {
        res = await utility_1.client.collection(collection).getFullList(200);
    }
    catch (error) {
        return array;
    }
    //loop through res.items[i].rel[id's] and save it into an array
    //rel is the name of the relation and it is a string
    //return array
    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i][rel].length; j++) {
            if (res[i][rel][j] == filter) {
                array.push(res[i]);
            }
        }
    }
    return array;
}
exports.getRelations = getRelations;
//# sourceMappingURL=pbutility.js.map
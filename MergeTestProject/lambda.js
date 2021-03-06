let AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient();

const testData = require("subDir/test-data.json");

exports.handler = function (event, context, callback) {

    console.log("~~~ Body:", event.body);
    let name = JSON.parse(event.body).name;

    if (testData.find(person => person.name === name)) {
        putToDB(name, callback);
    } else {
        callback(null, "Person not added!");
    }
}

const putToDB = (name, callback) =>
    ddb.put({
            TableName: 'MergeTestDB',
            Item: { 'Name': name }
        }).promise()
            .then(putRecordData => {
                let response = {
                    "isBase64Encoded": true,
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Expose-Headers": "*"
                    },
                    "body": JSON.stringify({
                        "Code": "Success",
                        "Message": "Name: " + name + " is successfully persisted in database...",
                        "Data": putRecordData
                    }),
                };

                callback(null, response);
            })
            .catch(err => {
                let response = {
                    "statusCode": err.statusCode,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                        "Code": err.code,
                        "Message": err.message
                    }),
                    "isBase64Encoded": false
                };
                callback(null, response);
            });
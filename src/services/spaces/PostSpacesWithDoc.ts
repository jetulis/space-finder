import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
// npm install @aws-sdk/client-dynamodb

// initialize dynamodb client connection
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createRandomId, parseJSON } from "../shared/Utils";
import { validateAsSpaceEntry } from "../shared/Validator";

// we can use 1) marshall, unmarshall from "@aws-sdk/util-dynamodb" : need to wrap with marshall()/unmarshall()
//            2) DynamoDBDocumentClient from "@aws-sdk/lib-dynamodb" : DynamoDBDocumentClient.from() , not ddbDocClient.send()
export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)
    
    const randomId = createRandomId()
    //const item = JSON.parse(event.body);
    const item = parseJSON(event.body);
    // inserting id into event.body
    item.id = randomId
    validateAsSpaceEntry(item)
    console.log('--- event.body : ', item )
    //{ location: 'Seoul' }
    
    const params = {
        TableName: process.env.TABLE_NAME,
        Item : item
    }
    console.log('params:',params);
    // write params to dynamo db table
    const response = await ddbDocClient.send(new PutItemCommand(params));
    console.log('response:',response);
    
    // return APIGatewayProxyResult from dynamodb response
    return {
        statusCode: 201, // 201 created 
        body: JSON.stringify({id: randomId})  
    };
}

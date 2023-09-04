import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
// npm install @aws-sdk/client-dynamodb

// initialize dynamodb client connection
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb";
import { createRandomId, parseJSON } from "../shared/Utils";
import { validateAsSpaceEntry } from "../shared/Validator";

// we can use 1) marshall, unmarshall from "@aws-sdk/util-dynamodb"
//            2) DynamoDBDocumentClient from "@aws-sdk/lib-dynamodb" 
export async function postSpaces(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{
    const randomId = createRandomId()

    const item = parseJSON(event.body);
    // inserting id into event.body
    item.id = randomId
    validateAsSpaceEntry(item)
    console.log('--- event.body : ', item )
    //{ location: 'Seoul' }
    const params = {
        TableName: process.env.TABLE_NAME,
        // posting marshalled Item object to DynamoDB format ( should use this... )
        Item: marshall(item), 
        // Item: {
        //     id: { S: randomId },
        //     // name: { S: item.name },
        //     location: { S: item.location },  
        //     // description: { S: item.description },
        //     // price: { S: item.price },
        // }
    }
    console.log('params:',params);
    // write params to dynamo db table
    const response = await ddbClient.send(new PutItemCommand(params));
    console.log('response:',response);
    
    // return APIGatewayProxyResult from dynamodb response
    return {
        statusCode: 201, // 201 created 
        body: JSON.stringify({ id : randomId})  
    };
}

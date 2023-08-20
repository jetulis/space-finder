import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
// npm install @aws-sdk/client-dynamodb

// initialize dynamodb client connection
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { v4 } from "uuid";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{
    const randomId = v4()

    const item = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: { S: randomId },
            // name: { S: item.name },
            location: { S: item.location },  
            // description: { S: item.description },
            // price: { S: item.price },
        }
    }

    // write params to dynamo db table
    const response = await ddbClient.send(new PutItemCommand(params));
    console.log(response);
    
    // return APIGatewayProxyResult from dynamodb response
    return {
        statusCode: 201, // 201 created 
        body: JSON.stringify(response)  
    };
}

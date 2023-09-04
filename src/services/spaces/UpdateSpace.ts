import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
// initialize dynamodb client connection
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"

export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{

    if(event.queryStringParameters && ('id' in event.queryStringParameters) && event.body){
        console.log('put|update| event.body:', event.body)
        
        // PUT https://~~~/prod/spaces?id=34555 
        // { "location": "xxx"}
        const parsedBody = JSON.parse(event.body) // event.body is {}
        console.log('parsedBody from event.body:', parsedBody)
        
        const spaceId = event.queryStringParameters['id']
        console.log('spaceId:', spaceId)

        const requestBodyKey = Object.keys(parsedBody)[0]
        console.log('requestBodyKey:', requestBodyKey)

        const requestBodyValue = parsedBody[requestBodyKey]
        console.log('requestBodyValue:', requestBodyValue)
        
        // update params to dynamo db table
        const updatedResult = await ddbClient.send(new UpdateItemCommand(
            {
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': { S: spaceId},
                },
                UpdateExpression: `set #zzzNew = :new`,
                ExpressionAttributeValues: {
                    ':new': { S: requestBodyValue}
                },
                ExpressionAttributeNames: {
                    '#zzzNew': requestBodyKey
                },
                ReturnValues: 'UPDATED_NEW' // print out what is updated
            }
        ));
        
        return {
            statusCode: 204, // 204 updated
            body: JSON.stringify(updatedResult.Attributes)
        }
    }
    return  {
        statusCode: 400,// bad request
        body: JSON.stringify('Please provide right args!')
    }
}

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
// npm install @aws-sdk/client-dynamodb

// initialize dynamodb client connection
import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{

    if(event.queryStringParameters){
        if('id' in event.queryStringParameters){ // url params parsing
            const spaceId = event.queryStringParameters['id']
            const getItemResponse = await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': {  S: spaceId }
                }
            }))
            if (getItemResponse.Item){
                return  {
                    statusCode : 200,
                    body: JSON.stringify(getItemResponse.Item)
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify(`Space not found for ${spaceId} ! `)
                }
            }
        } else{
            return  {
                statusCode: 400,
                body: JSON.stringify('Id required!')
            }
        }
    }
    // const params = {
    //     TableName: process.env.TABLE_NAME
    // }

    // write params to dynamo db table
    const result = await ddbClient.send(new ScanCommand(
        {
            TableName: process.env.TABLE_NAME
        }
    ));
    console.log('response:',result.Items);
    
    // return APIGatewayProxyResult from dynamodb response
    return {
        statusCode: 201, // 201 created 
        body: JSON.stringify(result.Items)  // marshalled object
    };
}

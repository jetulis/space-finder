import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
// npm install @aws-sdk/client-dynamodb

// initialize dynamodb client connection
import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{

    if(event.queryStringParameters){
        if('id' in event.queryStringParameters){ // url params parsing
            const spaceId = event.queryStringParameters['id']

            // get single item case: unmarshall when using GetItemCommand
            const getItemResponse = await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': {  S: spaceId }
                }
            }))
            if (getItemResponse.Item){
                // unmarshall
                const unmarshalledItem = unmarshall(getItemResponse.Item)
                return  {
                    statusCode : 200,
                    body: JSON.stringify(unmarshalledItem)
                    //before returns:     '{"id":{"S":"47642bd9-fcf1-4c80-a7d0-5a863666e9ff"},"location":{"S":"Dublin"}}'
                    //now returns   : body: '{"id":"47642bd9-fcf1-4c80-a7d0-5a863666e9ff","location":"Dublin"}'
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

    // getAll case(returning [] of results), use map with unmarshall
    const unmarshalledItem = result.Items?.map(item => unmarshall(item))
    console.log('response:',unmarshalledItem);
    
    // return APIGatewayProxyResult from dynamodb response
    return {
        statusCode: 201, // 201 created 
        // body: JSON.stringify(result.Items)  // marshalled object
        body: JSON.stringify(unmarshalledItem)  // marshalled object
    };
}

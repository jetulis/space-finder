import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
// initialize dynamodb client connection
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb"

export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient:DynamoDBClient) : Promise<APIGatewayProxyResult>{

    // delete using key
    const spaceId = event.queryStringParameters['id']
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            'id': {S: spaceId}
        }
    }
    try {
        const response = await ddbClient.send(new DeleteItemCommand(params))
        console.log('response:', response)
        return {
            statusCode: 200,
            body: JSON.stringify(`Deleted space with id ${spaceId}`)
        }
    }
    catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }

}

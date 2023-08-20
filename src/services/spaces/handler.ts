import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";


const ddbClient = new DynamoDBClient({}) //region: 'us-east-1'


export async function handler(event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult>{

    let message: string;
    try {
        switch (event.httpMethod) {
            case 'GET':
                message = 'hello from GET'
                break;
            case 'POST':
            // message = 'hello from POST'
                const response = postSpaces(event, ddbClient)
                return response;
            default:
                break;
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(message)
    }
    console.log('event:' , event)
    return response;
}

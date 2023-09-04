import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "./GetSpaces";
import { updateSpaces } from "./UpdateSpace";
import { addCorsHeader } from "../shared/Utils";
import { deleteSpace } from "./DeleteSpace";

const ddbClient = new DynamoDBClient({}) //region: 'us-east-1'

export async function handler(event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult>{
let response: APIGatewayProxyResult;
    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getSpaces(event, ddbClient)
                console.log('getResponse:', getResponse)
                response = getResponse
                break;
            case 'POST':
                //insert
                console.log('----- starting post|insert ---- ')
                const postResponse = await postSpaces(event, ddbClient)
                console.log('postResponse:', postResponse)
                response = postResponse
                break;
            case 'PUT':
                // update
                console.log('----- starting put|update ---- ')
                const putResponse = await updateSpaces(event, ddbClient)
                console.log('putResponse', putResponse)
                response = putResponse
                break;
            case 'DELETE':
                // update
                console.log('----- starting put|update ---- ')
                const deleteResponse = await deleteSpace(event, ddbClient)
                console.log('deleteResponse', putResponse)
                response = deleteResponse
                break;
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

    // const response: APIGatewayProxyResult = {
    //     statusCode: 200,
    //     body: JSON.stringify(message)
    // }
    addCorsHeader(response)
    console.log('response:' , response)
    return response;
}

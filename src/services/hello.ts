import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
// $ npm i -D @types/aws-lambda
// exports.main = async function(event, context) {
//     return {
//         statusCode: 200,
//         body: JSON.stringify(`hello, I will read from ${process.env.TABLE_NAME}`)
//     }
// }

// do this outside of your function handler
const s3Client = new S3Client({});

export async function handler(event: APIGatewayProxyEvent, context: Context) {
    const command = new ListBucketsCommand({});
    const listBucketsResult = (await s3Client.send(command)).Buckets;

    console.log("Success", listBucketsResult);

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify(`hello from lambda, here are your buckets `+ JSON.stringify(listBucketsResult))
    }
    console.log('event:' , event)
    return response;
}

// export { handler }

// npm i uuid @types/uuid
// npm i @aws-sdk/client-s3
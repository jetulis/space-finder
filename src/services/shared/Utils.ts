import { Fn, Stack } from "aws-cdk-lib"
import { randomUUID } from "crypto"

import { JsonError } from "./Validator";
import { APIGatewayProxyResult } from "aws-lambda";

export function createRandomId(){
    return randomUUID();
}

export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (error) {
        throw new JsonError(error.message);
    }
}


export function addCorsHeader(arg: APIGatewayProxyResult) {
    if(!arg.headers) {
        arg.headers = {}
    }
    arg.headers['Access-Control-Allow-Origin'] = '*';
    arg.headers['Access-Control-Allow-Methods'] = '*';
}
import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();
const dataStack_ = new DataStack(app, 'DataStack');

const lambdaStack_ = new LambdaStack(app, 'LambdaStack', {
    spacesTable: dataStack_.spacesTable
});
// to refer to 
new ApiStack(app, 'ApiStack', {
    spacesLambdaIntegration: lambdaStack_.spacesLambdaIntegration
});
import { Stack , StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime , Code} from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// import { Function as LambdaFunction, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path'

interface LambdaStackProps extends StackProps {
    // define props here, use this in the constructor
    spacesTable: ITable
}

export class LambdaStack extends Stack {

    public readonly spacesLambdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const spacesLambda = new NodejsFunction(this, 'SpacesLambda' , { // solve issues.. uses esbuild
        //const helloLambda = new LambdaFunction(this, 'HelloLambda' , {
            runtime:  Runtime.NODEJS_18_X, 
            // handler: 'hello.main', // file.function
            handler: 'handler',
            entry: join(__dirname,'..','..', 'services' ,'spaces', 'handler.ts') ,
            environment : {
                TABLE_NAME: props.spacesTable.tableName
            }
        })

        // git spacesLambda to access dynamo db table by addtoRolepolicy
        spacesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.spacesTable.tableArn],
            actions: ['dynamodb:*']
            }
            ))

        // NOTE: give lambda to access s3 buckets
        // helloLambda.addToRolePolicy(new PolicyStatement({
        //     effect: Effect.ALLOW,
        //     actions: ['s3:ListBucket', 's3:ListAllMyBuckets'],
        //     resources: ['*']
        // }),
        // )
 
        // to export the lambda integration, needs member var,and setting it
        this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda)
    }
}
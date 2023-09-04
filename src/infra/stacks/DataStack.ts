import { Stack , StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';

export class DataStack extends Stack {

    public readonly spacesTable: ITable

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const suffix = getSuffixFromStack(this)
        // DDB defined here , need to export this so LambdaStack can refer to this later
        this.spacesTable = new Table(this, 'SpacesTable', {
            partitionKey: { 
                name: 'id', 
                type: AttributeType.STRING 
            },
            // tableName: 'SpacesTable', make it dynamic
            tableName: `SpacesTable-${suffix}`,
        })
 
    }
}
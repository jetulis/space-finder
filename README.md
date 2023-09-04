Init CDK Proj
- create a folder : space-finder
- npm init -y
- install dependencies : npm i -D aws-cdk aws-cdk-lib constructs
- add .gitignore
- npm i -D typescript ts-node # typescript, ts-node
- npm i -D @types/node # types for Node

- create Launcher .ts file :./infra/Launcher.ts
- create empty stack : ./infra/stacks/DataStack.ts, LambdaStack.ts
- create cdk .json file

- need to specify compiler option : tsconfig.json 


- lambda code itself is located under ./services folder
- then stacks/LambdaStack.ts
- then Launcher to include


- marshall / unmarshall : @aws-sdk/util-dynamodb or 
- DynamoDBDocumentClient from @aws-sdk/lib-dynamodb
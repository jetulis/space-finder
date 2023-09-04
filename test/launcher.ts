import { handler } from "../src/services/spaces/handler" ;

//////////// another way to test --> /////////////
process.env.AWS_REGION = "us-east-1" ;
process.env.TABLE_NAME = "SpacesTable-1212736b36d9" ;
// in the terminal,  ts-node test/launcher.ts : 
//////////// <-- another way to test /////////////

// feed body to selected(imported) handler 
// handler({
//     httpMethod: "GET"
// } as any,{} as any)

// focus on launcher.ts test file, then click on Debug local (on to -> button , not dropdown)

// .vscode/launch.json has the params for region and table for testing ( "TABLE_NAME": "SpacesTable-12a3e78b46eb" )
// npx ts-node test/launcher.ts 
handler({
    httpMethod: "POST",
    queryStringParameters: {
        id: "06e60c9e-8949-416b-89d1-756527b5ab10"
    },
    body: JSON.stringify({
        location: "Paris",
    })

} as any, {} as any).then(result => {
    console.log(result)
})
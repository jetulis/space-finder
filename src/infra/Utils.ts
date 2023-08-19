import { Fn, Stack } from "aws-cdk-lib"

export function getSuffixFromStack( statck:Stack){
    const shortStackId = Fn.select(2, Fn.split('/', statck.stackId))
    const suffix = Fn.select(4, Fn.split('-', shortStackId))

    return suffix
}
import { deepMerge, deepCopy, deepCompare } from "./utils";

const a = {
    a: 1,
    b: 2
}

const b = {
    b: 2
}


console.log(deepCompare(a, b))

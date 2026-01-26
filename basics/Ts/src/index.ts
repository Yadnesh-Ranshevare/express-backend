interface user {name:string}

interface user {
    age:number,
    name:string
}
const a:user = {
    name:"Yadnesh",
    age:21
}
interface admin extends user {
    role:string
}

const b:admin = {
    name:"Yadnesh",
    role:"admin",
    age:21
}

// type user = {
//     name:string
// }

// type admin = user & {
//     role:string
// }


// const user1 = {
//     name: "Alice",
// };

// const user2 = {
//     name: "Alice",
// };

// console.log(JSON.stringify(user1) === JSON.stringify(user2)); // true
// console.log(user1 == user2); // false

// user1.age = 25;
// console.log(user1); // { name: 'Alice', age: 25 }
// console.log(user2); // { name: 'Alice' }

// // shallow copy
// const user = {
//     name: "Bob",
//     address: {
//         city: "New York",
//         zip: 10001,
//     },
// }

// const shallowCopy = {...user}
// const anotherShallowCopy = Object.assign({}, user);

// shallowCopy.name = "Charlie";
// shallowCopy.address.city = "Los Angeles";

// console.log(user);
// console.log(shallowCopy); 



// // deep copy
// const user = {
//   name: "Yadnesh",
//   address: { city: "Pune", pin: 411001 },
//   hobbies: ["coding", "sketching"]
// };

// const deepCopy = structuredClone(user);

// // modify the copy
// deepCopy.address.city = "Mumbai";
// deepCopy.hobbies.push("anime");

// console.log(user);
// console.log(deepCopy);

// object .assign()
const user2 = {
    name: "Yadnesh",
    age: 22,
};
const address = {
    nation:"india",
    city:{
        name:"pune",
        pin:411001,
    }
};
Object.assign(user2, address);

user2.city.name = "los angeles";
user2.nation = "USA";
console.log(user2);
console.log(address);

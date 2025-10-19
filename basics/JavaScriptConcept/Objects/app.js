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

// shallow copy
const user = {
    name: "Bob",
    address: {
        city: "New York",
        zip: 10001,
    },
}

const shallowCopy = {...user}
const anotherShallowCopy = Object.assign({}, user);

shallowCopy.name = "Charlie";
shallowCopy.address.city = "Los Angeles";

console.log(user);
console.log(shallowCopy); 
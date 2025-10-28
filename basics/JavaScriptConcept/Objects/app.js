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

// const user = {
//     speak: function() {
//         console.log("Hello!");
//     }
// }

// const admin = {...user}

// admin.speak = function() {
//     console.log("Hi there!");
// }
// admin.speak(); // Hello!
// user.speak(); // Hi there!

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

// // object .assign()
// const user2 = {
//     name: "Yadnesh",
//     age: 22,
// };
// const address = {
//     nation:"india",
//     city:{
//         name:"pune",
//         pin:411001,
//     }
// };
// Object.assign(user2, address);

// user2.city.name = "los angeles";
// user2.nation = "USA";
// console.log(user2);
// console.log(address);

// const person = {
//     greet() {
//         console.log("Hello!");
//     },
// };
// const student = Object.create(person);

// // overriding greet method of person object
// person.greet = function () {
//     console.log("Hi there!");
// };

// student.greet(); // "Hi there!" → inherited from person

// const person = {
//     greet() {
//         console.log("Hi there!");
//     },
// };
// const student = Object.create(person);
// // const student = person

// student.name = "Yadnesh";

// console.log(person);
// console.log(student);
// student.greet();

// // person.greet(); // "Hello!"
// // student.greet(); // "Hi there!"



// //  reference breaking
// const person = {
//     name: "Yadnesh",
//     address:{
//         city:"pune",
//     }
// };

// const student = { ...person }; // shallow copy

// student.address = { city:"mumbai"}; // breaking reference for nested object

// console.log(person);
// console.log(student);


const person1 = {
    name: "person1",
    greet1() {
        console.log("Hello!");
    },
};

const person2 = {
    name: "person2",
    greet2() {
        console.log("Hi there!");
    },
};

const student = Object.create(person1);
Object.setPrototypeOf(student, person2);

console.log(student.greet1); // undefined
student.greet2(); // "Hello!"
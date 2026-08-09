// (async function () {
//     const response = await fetch("./add.wasm");
//     const bytes = await response.arrayBuffer();

//     const { instance } = await WebAssembly.instantiate(bytes);

//     const result = instance.exports.add(10, 20);

//     console.log(result);
// })();

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const wasmPath = fileURLToPath(
    new URL("./add.wasm", import.meta.url)
);

const bytes = await readFile(wasmPath);

const { instance } = await WebAssembly.instantiate(bytes);

console.log(instance.exports.add(10, 20));

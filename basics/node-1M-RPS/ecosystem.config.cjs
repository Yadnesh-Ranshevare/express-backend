module.exports = {
    apps: [
        {
            name: "index",
            script: "./src/index.js",
            instances: "max",
            exec_mode: "cluster",
        },
    ],
};

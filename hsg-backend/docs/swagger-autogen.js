import swaggerAutogen from "swagger-autogen"

const doc = {
    info: {
        version: "1.0.0",
        title: "High Street Gym",
        description: "JSON REST API"
    },
    host: "localhost:8082",
    basePath: "",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
}

const outputFile = "./docs/swagger-output.json"
const endpointFiles = ["./server.js"]

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFiles, doc)
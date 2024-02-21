import { MongoClient } from "mongodb"

// TODO: Add connection String from Atlas
const connectionString = process.env.MONGODB
const client = new MongoClient(connectionString)

export const db = client.db("classes")

import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import ENV from '../config.js'

const connect = async () => {

  const mongod = await MongoMemoryServer.create()
  const getUri = mongod.getUri()

  mongoose.set('strictQuery',true)
  // for memory server
  // const db = await mongoose.connect(getUri)
  const db = await mongoose.connect(ENV.ATLAS_URL)

  console.log("Database Connectes")

  return db
}

export default connect
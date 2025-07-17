// const { PrismaClient } = require('./generated/prisma')
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

export default prisma
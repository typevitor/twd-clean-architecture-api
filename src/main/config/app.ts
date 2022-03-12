import express from 'express'
import setUpMiddleware from '@/main/config/middleware'
import setupRoutes from './routes'

const app = express()
setUpMiddleware(app)
setupRoutes(app)

export default app
